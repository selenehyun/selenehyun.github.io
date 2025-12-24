<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MapPin, Car, Train } from 'lucide-vue-next'
import SectionTitle from './SectionTitle.vue'

declare global {
  interface Window {
    kakao: any
  }
}

const venueName = '로프트가든344'
const address = '서울 양천구 오목로 344'

// 로프트가든344 좌표 (서울 양천구 오목로 344)
const venueLatitude = 37.5237531022074
const venueLongitude = 126.875143110053

const mapContainer = ref<HTMLElement | null>(null)
const mapLoaded = ref(false)
const mapError = ref(false)

const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY || ''

// 카카오맵 SDK 로드
const loadKakaoMapSDK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!KAKAO_JS_KEY) {
      console.warn('Kakao JS Key is not set. Please add VITE_KAKAO_JS_KEY to your .env file.')
      resolve(false)
      return
    }

    // 이미 로드되어 있는 경우
    if (window.kakao?.maps) {
      resolve(true)
      return
    }

    // 이미 kakao 객체가 있지만 maps가 없는 경우 (공유 SDK만 로드된 경우)
    if (window.kakao && !window.kakao.maps) {
      // maps SDK 추가 로드
      const script = document.createElement('script')
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`
      script.onload = () => {
        if (window.kakao?.maps?.load) {
          window.kakao.maps.load(() => {
            resolve(true)
          })
        } else {
          resolve(false)
        }
      }
      script.onerror = (e) => {
        console.error('Failed to load Kakao Maps SDK:', e)
        resolve(false)
      }
      document.head.appendChild(script)
      return
    }

    // SDK 스크립트 동적 로드
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`
    script.onload = () => {
      if (window.kakao?.maps?.load) {
        window.kakao.maps.load(() => {
          resolve(true)
        })
      } else {
        resolve(false)
      }
    }
    script.onerror = () => {
      resolve(false)
    }
    document.head.appendChild(script)
  })
}

// 지도 초기화
const initMap = async () => {
  const isReady = await loadKakaoMapSDK()

  if (!isReady || !mapContainer.value) {
    mapError.value = true
    return
  }

  try {
    const { kakao } = window

    // 지도 생성
    const options = {
      center: new kakao.maps.LatLng(venueLatitude, venueLongitude),
      level: 3 // 확대 레벨
    }

    const map = new kakao.maps.Map(mapContainer.value, options)

    // 마커 생성
    const markerPosition = new kakao.maps.LatLng(venueLatitude, venueLongitude)
    const marker = new kakao.maps.Marker({
      position: markerPosition
    })
    marker.setMap(map)

    // 커스텀 오버레이 생성 (인포윈도우 대체)
    const overlayContent = `
      <div style="
        position: relative;
        bottom: 45px;
        background: #fff;
        padding: 8px 14px;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        font-family: 'Noto Serif KR', serif;
        font-size: 13px;
        font-weight: 500;
        color: #5c5c5c;
        white-space: nowrap;
        border: 1px solid #e8e0db;
      ">
        <span style="color: #c9a89a; margin-right: 4px;">♥</span>${venueName}
      </div>
    `
    const customOverlay = new kakao.maps.CustomOverlay({
      position: markerPosition,
      content: overlayContent,
      yAnchor: 1
    })
    customOverlay.setMap(map)

    mapLoaded.value = true
  } catch (e) {
    console.error('Map initialization error:', e)
    mapError.value = true
  }
}

onMounted(() => {
  initMap()
})

// 모바일 기기 감지
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

const isIOS = () => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

// 딥링크 시도 후 웹으로 폴백하는 함수
const tryDeepLink = (appUrl: string, webUrl: string) => {
  let isAppOpened = false
  const startTime = Date.now()

  // 페이지 가시성 변경 감지 (앱이 열리면 페이지가 숨겨짐)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      isAppOpened = true
    }
  }

  // 포커스 잃음 감지
  const handleBlur = () => {
    isAppOpened = true
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('blur', handleBlur)

  // iOS는 location.href 사용, Android는 더 안정적인 방식 시도
  if (isIOS()) {
    // iOS: 바로 웹으로 이동 (딥링크 에러 방지)
    // iOS에서는 Universal Links나 앱스토어 연동이 더 안정적
    window.location.href = webUrl
  } else {
    // Android: 딥링크 시도
    window.location.href = appUrl

    // 일정 시간 후 앱이 열리지 않았으면 웹으로 이동
    setTimeout(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)

      // 앱이 열리지 않았고, 페이지가 여전히 보이면 웹으로 이동
      if (!isAppOpened && !document.hidden) {
        // 시간이 많이 지났으면 사용자가 다이얼로그를 닫은 것일 수 있음
        const elapsedTime = Date.now() - startTime
        if (elapsedTime < 2000) {
          window.location.href = webUrl
        }
      }
    }, 1000)
  }
}

const openMap = (type: string) => {
  const encodedName = encodeURIComponent(venueName)

  if (type === 'naver') {
    const webUrl = `https://map.naver.com/v5/search/${encodedName}`
    if (isMobile() && !isIOS()) {
      const appUrl = `nmap://place?lat=${venueLatitude}&lng=${venueLongitude}&name=${encodedName}&appname=wedding.pet`
      tryDeepLink(appUrl, webUrl)
    } else {
      // iOS 또는 데스크톱: 바로 웹으로
      if (isMobile()) {
        window.location.href = webUrl
      } else {
        window.open(webUrl, '_blank')
      }
    }
  } else if (type === 'kakao') {
    const webUrl = `https://map.kakao.com/?q=${encodedName}`
    if (isMobile() && !isIOS()) {
      const appUrl = `kakaomap://look?p=${venueLatitude},${venueLongitude}`
      tryDeepLink(appUrl, webUrl)
    } else {
      if (isMobile()) {
        window.location.href = webUrl
      } else {
        window.open(webUrl, '_blank')
      }
    }
  } else if (type === 'tmap') {
    if (isMobile()) {
      // 티맵은 웹 버전이 제한적이므로 앱스토어로 안내
      const isAndroid = /Android/i.test(navigator.userAgent)
      if (isAndroid) {
        const appUrl = `tmap://route?goalname=${encodedName}&goalx=${venueLongitude}&goaly=${venueLatitude}`
        const storeUrl = 'https://play.google.com/store/apps/details?id=com.skt.tmap.ku'
        tryDeepLink(appUrl, storeUrl)
      } else {
        // iOS: 앱스토어로 직접 연결
        window.location.href = 'https://apps.apple.com/kr/app/tmap/id431589174'
      }
    } else {
      window.open(`https://tmap.life/search?name=${encodedName}`, '_blank')
    }
  }
}
</script>

<template>
  <section class="py-16 px-6 text-center bg-wedding-bg">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
    >
      <SectionTitle title="Location" subtitle="오시는 길" />
    </div>

    <!-- Location Info -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 100, duration: 600 } }"
      class="mb-6"
    >
      <p class="text-lg font-medium text-wedding-text mb-2">{{ venueName }}</p>
      <div class="flex items-center justify-center gap-2 text-sm text-wedding-text-light mb-3">
        <MapPin class="w-4 h-4 text-wedding-primary/70" />
        <span>{{ address }}</span>
      </div>
      <div class="text-[0.8125rem] text-wedding-text-light space-y-1">
        <p>예식장 10층 · 연회장 9층</p>
        <p class="text-wedding-primary/80">식사는 식 전 10시 30분부터 가능합니다</p>
        <p class="text-wedding-text-light/70">🍷 주류는 넉넉히 준비했으니 편하게 즐겨주세요</p>
      </div>
    </div>

    <!-- Kakao Map -->
    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.95 }"
      :visibleOnce="{ opacity: 1, scale: 1, transition: { delay: 200, duration: 600 } }"
      class="w-full h-[220px] bg-white rounded-lg mb-5 overflow-hidden shadow-sm relative"
    >
      <div
        ref="mapContainer"
        class="w-full h-full"
      />
      <!-- 로딩/에러 상태 -->
      <div
        v-if="!mapLoaded && !mapError"
        class="absolute inset-0 flex items-center justify-center bg-wedding-bg"
      >
        <span class="text-wedding-text-light/60 text-xs">지도를 불러오는 중...</span>
      </div>
      <div
        v-if="mapError"
        class="absolute inset-0 flex items-center justify-center bg-wedding-bg"
      >
        <span class="text-wedding-text-light/60 text-xs">지도를 불러올 수 없습니다</span>
      </div>
    </div>

    <!-- Map Buttons -->
    <div class="flex gap-2 justify-center flex-wrap mb-8">
      <button
        v-motion
        :initial="{ opacity: 0, y: 10 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 300, duration: 400 } }"
        @click="openMap('naver')"
        class="px-4 py-2.5 border border-wedding-border bg-white text-xs rounded-full hover:bg-wedding-primary hover:text-white hover:border-wedding-primary transition-all duration-200"
      >
        네이버지도
      </button>
      <button
        v-motion
        :initial="{ opacity: 0, y: 10 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 400, duration: 400 } }"
        @click="openMap('kakao')"
        class="px-4 py-2.5 border border-wedding-border bg-white text-xs rounded-full hover:bg-wedding-primary hover:text-white hover:border-wedding-primary transition-all duration-200"
      >
        카카오맵
      </button>
      <button
        v-motion
        :initial="{ opacity: 0, y: 10 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 500, duration: 400 } }"
        @click="openMap('tmap')"
        class="px-4 py-2.5 border border-wedding-border bg-white text-xs rounded-full hover:bg-wedding-primary hover:text-white hover:border-wedding-primary transition-all duration-200"
      >
        티맵
      </button>
    </div>

    <!-- Transportation Info -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 400, duration: 600 } }"
      class="bg-white rounded-lg p-5 text-left text-sm"
    >
      <div class="flex items-start gap-4 mb-4">
        <div class="w-8 h-8 rounded-full bg-wedding-primary/10 flex items-center justify-center flex-shrink-0">
          <Train class="w-4 h-4 text-wedding-primary" />
        </div>
        <div>
          <p class="font-medium text-wedding-text mb-1">지하철</p>
          <p class="text-wedding-text-light text-[0.8125rem] leading-relaxed">
            5호선 오목교역 7번 출구<br>
            도보 약 3분
          </p>
        </div>
      </div>

      <div class="flex items-start gap-4">
        <div class="w-8 h-8 rounded-full bg-wedding-primary/10 flex items-center justify-center flex-shrink-0">
          <Car class="w-4 h-4 text-wedding-primary" />
        </div>
        <div>
          <p class="font-medium text-wedding-text mb-1">주차</p>
          <p class="text-wedding-text-light text-[0.8125rem] leading-relaxed">
            건물 옆 전용 주차장 300대<br>
            만차시 도보 5분 거리 공영주차장<br>
            3시간 무료 주차 지원
          </p>
          <p class="text-wedding-text-light/70 text-[0.75rem] leading-relaxed mt-2">
            큰 사거리에 위치한 건물이기 때문에 주차가 혼잡할 수 있어 여유 있게 오시는 것을 추천드립니다.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
