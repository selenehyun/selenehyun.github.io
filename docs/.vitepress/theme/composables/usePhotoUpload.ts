import { ref, computed } from 'vue'
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage'
import {
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
  doc
} from 'firebase/firestore'
import { db, storage } from '../lib/firebase'

export interface PhotoSubmission {
  id?: string
  name: string
  phone: string
  photoUrls: string[]
  photoCount: number
  createdAt: Date
  updatedAt?: Date
}

export interface UploadProgress {
  fileIndex: number
  fileName: string
  progress: number // 0-100
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

export function usePhotoUpload() {
  // 폼 데이터 (개인정보는 선택사항)
  const name = ref('')
  const phone = ref('')
  const selectedFiles = ref<File[]>([])
  const previews = ref<string[]>([])

  // 업로드 상태
  const uploadProgress = ref<UploadProgress[]>([])
  const isUploading = ref(false)
  const isComplete = ref(false)
  const error = ref<string | null>(null)

  // 전체 진행률 계산
  const totalProgress = computed(() => {
    if (uploadProgress.value.length === 0) return 0
    const sum = uploadProgress.value.reduce((acc, p) => acc + p.progress, 0)
    return Math.round(sum / uploadProgress.value.length)
  })

  // 제출 가능 여부 (사진만 필수, 개인정보는 선택)
  const canSubmit = computed(() =>
    selectedFiles.value.length > 0 && !isUploading.value
  )

  // 파일 선택 및 미리보기 생성
  const handleFileSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files)

    // 이미지 파일만 필터링
    const validFiles = fileArray.filter(f => f.type.startsWith('image/'))

    // 기존 선택에 추가
    selectedFiles.value = [...selectedFiles.value, ...validFiles]

    // 미리보기 생성
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        previews.value.push(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    })
  }

  // 선택된 파일 제거
  const removeFile = (index: number) => {
    selectedFiles.value.splice(index, 1)
    previews.value.splice(index, 1)
  }

  // 단일 파일 업로드 (진행률 추적)
  const uploadFile = async (file: File, index: number): Promise<string> => {
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')

    // 개인정보가 있으면 폴더명에 포함, 없으면 anonymous 폴더에 통합
    const phoneDigits = phone.value.replace(/\D/g, '')
    const folderName = name.value && phoneDigits
      ? `${name.value.trim()}_${phoneDigits}`
      : 'anonymous'

    const path = `photo-event/${folderName}/${timestamp}_${sanitizedFileName}`

    const fileRef = storageRef(storage, path)
    const uploadTask = uploadBytesResumable(fileRef, file)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          uploadProgress.value[index].progress = progress
          uploadProgress.value[index].status = 'uploading'
        },
        (err) => {
          uploadProgress.value[index].status = 'error'
          uploadProgress.value[index].error = err.message
          reject(err)
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref)
          uploadProgress.value[index].status = 'completed'
          uploadProgress.value[index].progress = 100
          resolve(url)
        }
      )
    })
  }

  // 전화번호 유효성 검사 (000-0000-0000 형식)
  const isValidPhone = (phoneNumber: string): boolean => {
    const digits = phoneNumber.replace(/\D/g, '')
    return digits.length >= 10 && digits.length <= 11
  }

  // 기존 제출 확인 (이름 + 전화번호로)
  const checkExisting = async (): Promise<PhotoSubmission | null> => {
    // 개인정보가 없으면 기존 제출 확인 불가
    if (!name.value.trim() || !isValidPhone(phone.value)) {
      return null
    }

    try {
      const q = query(
        collection(db, 'photo-submissions'),
        where('name', '==', name.value.trim()),
        where('phone', '==', phone.value.replace(/\D/g, ''))
      )
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        const docData = snapshot.docs[0]
        const data = docData.data()
        return {
          id: docData.id,
          name: data.name,
          phone: data.phone,
          photoUrls: data.photoUrls || [],
          photoCount: data.photoCount || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate()
        }
      }
      return null
    } catch (err) {
      console.error('Failed to check existing submission:', err)
      return null
    }
  }

  // 사진 제출
  const submitPhotos = async (): Promise<boolean> => {
    if (!canSubmit.value) return false

    isUploading.value = true
    error.value = null

    // 진행률 추적 초기화
    uploadProgress.value = selectedFiles.value.map((file, i) => ({
      fileIndex: i,
      fileName: file.name,
      progress: 0,
      status: 'pending' as const
    }))

    try {
      // 모든 파일 업로드
      const urls: string[] = []
      for (let i = 0; i < selectedFiles.value.length; i++) {
        const url = await uploadFile(selectedFiles.value[i], i)
        urls.push(url)
      }

      // 개인정보가 있을 때만 Firestore에 메타데이터 저장
      if (name.value.trim() && isValidPhone(phone.value)) {
        const existing = await checkExisting()

        const submissionData = {
          name: name.value.trim(),
          phone: phone.value.replace(/\D/g, ''),
          photoUrls: existing ? [...existing.photoUrls, ...urls] : urls,
          photoCount: existing ? existing.photoCount + urls.length : urls.length,
          updatedAt: Timestamp.now()
        }

        if (existing && existing.id) {
          // 기존 제출 업데이트 (사진 추가)
          const docRef = doc(db, 'photo-submissions', existing.id)
          await updateDoc(docRef, submissionData)
        } else {
          // 새 제출 생성
          await addDoc(collection(db, 'photo-submissions'), {
            ...submissionData,
            createdAt: Timestamp.now()
          })
        }
      } else {
        // 개인정보 없이 제출 - 익명 제출로 기록
        await addDoc(collection(db, 'photo-submissions'), {
          name: '',
          phone: '',
          photoUrls: urls,
          photoCount: urls.length,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        })
      }

      isComplete.value = true
      return true
    } catch (err) {
      console.error('Upload failed:', err)
      error.value = '업로드 중 오류가 발생했습니다. 다시 시도해주세요.'
      return false
    } finally {
      isUploading.value = false
    }
  }

  // 폼 초기화
  const reset = () => {
    name.value = ''
    phone.value = ''
    selectedFiles.value = []
    previews.value = []
    uploadProgress.value = []
    isComplete.value = false
    error.value = null
  }

  return {
    // 폼 데이터
    name,
    phone,
    selectedFiles,
    previews,
    // 상태
    uploadProgress,
    totalProgress,
    isUploading,
    isComplete,
    error,
    canSubmit,
    // 메서드
    handleFileSelect,
    removeFile,
    submitPhotos,
    reset
  }
}
