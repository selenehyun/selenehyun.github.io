<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useElementBounding, useIntersectionObserver } from '@vueuse/core'
import SectionTitle from './SectionTitle.vue'
import { useFlowerGarden, type Flower } from '../composables/useFlowerGarden'

const { flowers, totalCount, isLoading, plantFlower } = useFlowerGarden()

// Canvas refs
const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const bounds = useElementBounding(containerRef)

// Canvas 크기 설정
const CANVAS_HEIGHT = 280

// 새로 심은 꽃 애니메이션 트래킹
const newFlowerIds = ref<Set<string>>(new Set())
const animationProgress = ref<Map<string, number>>(new Map())

// 초기 애니메이션 상태
const hasPlayedInitialAnimation = ref(false)
const initialAnimationFlowerIds = ref<Set<string>>(new Set())
const initialAnimationProgress = ref<Map<string, number>>(new Map())

// ===== 구름 관련 =====
interface Cloud {
  id: string
  x: number // 정규화 좌표 (0~1), 화면 밖도 허용 (-0.2 ~ 1.2)
  y: number // 정규화 좌표 (0~1)
  size: number // 크기 배율 (기본 1, 클릭할 때마다 증가)
  targetY: number // 목표 Y 좌표 (상단: 0.05~0.15)
  speed: number // 이동 속도 (랜덤)
  direction: 1 | -1 // 이동 방향 (1: 오른쪽, -1: 왼쪽)
  phase: 'rising' | 'floating' // 현재 상태
  createdAt: number // 생성 시간 (정렬용)
  clickCount: number // 클릭 횟수 (최대 5번까지 커짐)
}

const MAX_ACTIVE_CLOUDS = 3
const clouds = ref<Cloud[]>([])
const activeCloudIds = ref<Set<string>>(new Set())
let cloudAnimationId: number | null = null

// 배경 그리기
const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // 하늘 그라데이션
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.55)
  skyGradient.addColorStop(0, '#e8f4f8')
  skyGradient.addColorStop(1, '#d4e8d4')
  ctx.fillStyle = skyGradient
  ctx.fillRect(0, 0, width, height * 0.55)

  // 잔디/들판 그라데이션
  const grassGradient = ctx.createLinearGradient(0, height * 0.45, 0, height)
  grassGradient.addColorStop(0, '#90c695')
  grassGradient.addColorStop(0.5, '#7ab87f')
  grassGradient.addColorStop(1, '#5fa865')
  ctx.fillStyle = grassGradient
  ctx.fillRect(0, height * 0.45, width, height * 0.55)

  // 언덕 곡선 (부드러운 경계)
  ctx.beginPath()
  ctx.moveTo(0, height * 0.52)
  ctx.quadraticCurveTo(width * 0.25, height * 0.45, width * 0.5, height * 0.48)
  ctx.quadraticCurveTo(width * 0.75, height * 0.52, width, height * 0.47)
  ctx.lineTo(width, height)
  ctx.lineTo(0, height)
  ctx.closePath()
  ctx.fillStyle = '#7ab87f'
  ctx.fill()
}

// 꽃 그리기 (5개 꽃잎 + 중앙 원)
const drawFlower = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number = 1,
  animScale: number = 1
) => {
  const baseSize = 12 * size
  const petalCount = 5
  const petalRadius = baseSize * 0.8
  const centerRadius = baseSize * 0.35

  ctx.save()
  ctx.translate(x, y)
  ctx.scale(animScale, animScale)

  // 꽃잎 (핑크색)
  ctx.fillStyle = '#FFB6C1'
  ctx.strokeStyle = '#FF91A4'
  ctx.lineWidth = 1

  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2 - Math.PI / 2
    const petalX = Math.cos(angle) * petalRadius * 0.6
    const petalY = Math.sin(angle) * petalRadius * 0.6

    ctx.beginPath()
    ctx.ellipse(petalX, petalY, petalRadius * 0.5, petalRadius * 0.35, angle, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }

  // 중앙 원 (노란색)
  ctx.fillStyle = '#FFE066'
  ctx.strokeStyle = '#FFCC00'
  ctx.beginPath()
  ctx.arc(0, 0, centerRadius, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // 중앙 점들
  ctx.fillStyle = '#FFAA00'
  for (let i = 0; i < 3; i++) {
    const dotAngle = (i / 3) * Math.PI * 2
    const dotX = Math.cos(dotAngle) * centerRadius * 0.4
    const dotY = Math.sin(dotAngle) * centerRadius * 0.4
    ctx.beginPath()
    ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

// 구름 그리기 (클릭 횟수에 따라 모양 변화)
const drawCloud = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  clickCount: number
) => {
  ctx.save()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)'
  ctx.shadowBlur = 8 + clickCount * 2
  ctx.shadowOffsetY = 2

  const baseSize = 20 * size

  ctx.beginPath()

  // 클릭 횟수에 따라 다른 모양
  switch (clickCount) {
    case 0:
      // 기본: 작고 단순한 구름 (3개 원)
      ctx.arc(x, y, baseSize * 0.5, 0, Math.PI * 2)
      ctx.arc(x - baseSize * 0.35, y + baseSize * 0.05, baseSize * 0.35, 0, Math.PI * 2)
      ctx.arc(x + baseSize * 0.35, y + baseSize * 0.05, baseSize * 0.35, 0, Math.PI * 2)
      break

    case 1:
      // 1회: 위로 솟은 구름
      ctx.arc(x, y - baseSize * 0.1, baseSize * 0.55, 0, Math.PI * 2)
      ctx.arc(x - baseSize * 0.4, y + baseSize * 0.1, baseSize * 0.4, 0, Math.PI * 2)
      ctx.arc(x + baseSize * 0.4, y + baseSize * 0.1, baseSize * 0.4, 0, Math.PI * 2)
      ctx.arc(x, y - baseSize * 0.35, baseSize * 0.3, 0, Math.PI * 2)
      break

    case 2:
      // 2회: 좌우로 넓어진 구름
      ctx.arc(x, y, baseSize * 0.5, 0, Math.PI * 2)
      ctx.arc(x - baseSize * 0.5, y + baseSize * 0.05, baseSize * 0.4, 0, Math.PI * 2)
      ctx.arc(x + baseSize * 0.5, y + baseSize * 0.05, baseSize * 0.4, 0, Math.PI * 2)
      ctx.arc(x - baseSize * 0.25, y - baseSize * 0.2, baseSize * 0.35, 0, Math.PI * 2)
      ctx.arc(x + baseSize * 0.25, y - baseSize * 0.15, baseSize * 0.35, 0, Math.PI * 2)
      break

    case 3:
      // 3회: 뭉게뭉게 구름
      ctx.arc(x, y, baseSize * 0.55, 0, Math.PI * 2)
      ctx.arc(x - baseSize * 0.55, y + baseSize * 0.1, baseSize * 0.45, 0, Math.PI * 2)
      ctx.arc(x + baseSize * 0.55, y + baseSize * 0.1, baseSize * 0.45, 0, Math.PI * 2)
      ctx.arc(x - baseSize * 0.3, y - baseSize * 0.25, baseSize * 0.4, 0, Math.PI * 2)
      ctx.arc(x + baseSize * 0.3, y - baseSize * 0.2, baseSize * 0.4, 0, Math.PI * 2)
      ctx.arc(x, y - baseSize * 0.35, baseSize * 0.35, 0, Math.PI * 2)
      break

    case 4:
      // 4회: 크고 풍성한 구름
      ctx.arc(x, y, baseSize * 0.6, 0, Math.PI * 2)
      ctx.arc(x - baseSize * 0.6, y + baseSize * 0.1, baseSize * 0.45, 0, Math.PI * 2)
      ctx.arc(x + baseSize * 0.6, y + baseSize * 0.1, baseSize * 0.5, 0, Math.PI * 2)
      ctx.arc(x - baseSize * 0.35, y - baseSize * 0.3, baseSize * 0.4, 0, Math.PI * 2)
      ctx.arc(x + baseSize * 0.35, y - baseSize * 0.25, baseSize * 0.45, 0, Math.PI * 2)
      ctx.arc(x, y - baseSize * 0.4, baseSize * 0.35, 0, Math.PI * 2)
      ctx.arc(x - baseSize * 0.7, y + baseSize * 0.25, baseSize * 0.3, 0, Math.PI * 2)
      break

    default:
      // 5회 (최대): 가장 크고 화려한 구름
      ctx.arc(x, y, baseSize * 0.65, 0, Math.PI * 2)
      ctx.arc(x - baseSize * 0.65, y + baseSize * 0.1, baseSize * 0.5, 0, Math.PI * 2)
      ctx.arc(x + baseSize * 0.65, y + baseSize * 0.1, baseSize * 0.5, 0, Math.PI * 2)
      ctx.arc(x - baseSize * 0.4, y - baseSize * 0.35, baseSize * 0.45, 0, Math.PI * 2)
      ctx.arc(x + baseSize * 0.4, y - baseSize * 0.3, baseSize * 0.45, 0, Math.PI * 2)
      ctx.arc(x, y - baseSize * 0.45, baseSize * 0.4, 0, Math.PI * 2)
      ctx.arc(x - baseSize * 0.75, y + baseSize * 0.25, baseSize * 0.35, 0, Math.PI * 2)
      ctx.arc(x + baseSize * 0.75, y + baseSize * 0.25, baseSize * 0.35, 0, Math.PI * 2)
      break
  }

  ctx.fill()
  ctx.restore()
}

// 구름 히트 테스트
const findCloudAtPosition = (normalizedX: number, normalizedY: number): Cloud | null => {
  // 최근 생성된 구름부터 검사 (위에 그려진 것이 우선)
  for (let i = clouds.value.length - 1; i >= 0; i--) {
    const cloud = clouds.value[i]
    const distance = Math.hypot(cloud.x - normalizedX, cloud.y - normalizedY)
    const hitRadius = 0.08 * cloud.size // 구름 크기에 비례한 히트 영역

    if (distance < hitRadius) {
      return cloud
    }
  }
  return null
}

// 활성 큐 정리 (최대 3개 유지)
const pruneActiveQueue = () => {
  if (activeCloudIds.value.size <= MAX_ACTIVE_CLOUDS) return

  // 생성 시간 기준 정렬, 오래된 것부터 비활성화
  const sortedClouds = [...clouds.value]
    .filter((c) => activeCloudIds.value.has(c.id))
    .sort((a, b) => a.createdAt - b.createdAt)

  while (activeCloudIds.value.size > MAX_ACTIVE_CLOUDS) {
    const oldest = sortedClouds.shift()
    if (oldest) {
      activeCloudIds.value.delete(oldest.id)
    }
  }
}

// 구름 생성
const createCloud = (x: number, y: number) => {
  const newCloud: Cloud = {
    id: `cloud-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    x,
    y,
    size: 1,
    targetY: 0.08 + Math.random() * 0.12, // 0.08~0.20
    speed: 0.0004 + Math.random() * 0.0003, // 랜덤 속도
    direction: Math.random() > 0.5 ? 1 : -1,
    phase: 'rising',
    createdAt: Date.now(),
    clickCount: 0
  }

  clouds.value.push(newCloud)

  // 활성 큐에 추가
  activeCloudIds.value.add(newCloud.id)
  pruneActiveQueue()
}

// 구름 애니메이션 루프
const animateClouds = () => {
  for (let i = clouds.value.length - 1; i >= 0; i--) {
    const cloud = clouds.value[i]

    if (cloud.phase === 'rising') {
      // 위로 부상
      cloud.y -= 0.003
      if (cloud.y <= cloud.targetY) {
        cloud.y = cloud.targetY
        cloud.phase = 'floating'
      }
    } else {
      // 옆으로 이동
      cloud.x += cloud.speed * cloud.direction

      // 화면 밖으로 나가면
      if (cloud.x > 1.2 || cloud.x < -0.2) {
        // 활성 큐에 있는 구름만 반대편에서 재등장
        if (activeCloudIds.value.has(cloud.id)) {
          cloud.x = cloud.direction > 0 ? -0.2 : 1.2
        } else {
          // 활성 큐에 없으면 삭제
          clouds.value.splice(i, 1)
        }
      }
    }
  }

  render()
  cloudAnimationId = requestAnimationFrame(animateClouds)
}

// 전체 캔버스 렌더링
const render = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const width = canvas.width / dpr
  const height = canvas.height / dpr

  ctx.save()
  ctx.scale(dpr, dpr)

  // 배경
  drawBackground(ctx, width, height)

  // 구름들 (배경과 꽃 사이에 렌더링)
  for (const cloud of clouds.value) {
    const pixelX = cloud.x * width
    const pixelY = cloud.y * height
    drawCloud(ctx, pixelX, pixelY, cloud.size, cloud.clickCount)
  }

  // 꽃들 (오래된 것부터 = 배열 역순)
  const sortedFlowers = [...flowers.value].reverse()

  for (const flower of sortedFlowers) {
    // 초기 애니메이션 중이면서 아직 표시할 차례가 안 된 꽃은 건너뛰기
    if (!hasPlayedInitialAnimation.value && !initialAnimationFlowerIds.value.has(flower.id)) {
      continue
    }

    const pixelX = flower.x * width
    const pixelY = flower.y * height

    // 새로 심은 꽃 애니메이션
    const isNew = newFlowerIds.value.has(flower.id)
    // 초기 애니메이션
    const isInitialAnim = initialAnimationFlowerIds.value.has(flower.id)

    let scale = 1
    if (isNew) {
      scale = animationProgress.value.get(flower.id) ?? 1
    } else if (isInitialAnim && !hasPlayedInitialAnimation.value) {
      scale = initialAnimationProgress.value.get(flower.id) ?? 1
    }

    drawFlower(ctx, pixelX, pixelY, flower.size || 1, scale)
  }

  ctx.restore()
}

// 캔버스 인터랙션 핸들러 (꽃 + 구름)
const handleCanvasInteraction = async (event: MouseEvent | TouchEvent) => {
  const canvas = canvasRef.value
  if (!canvas) return

  event.preventDefault()

  let clientX: number, clientY: number

  if ('touches' in event) {
    const touch = event.touches[0] || event.changedTouches[0]
    if (!touch) return
    clientX = touch.clientX
    clientY = touch.clientY
  } else {
    clientX = event.clientX
    clientY = event.clientY
  }

  const rect = canvas.getBoundingClientRect()
  const normalizedX = (clientX - rect.left) / rect.width
  const normalizedY = (clientY - rect.top) / rect.height

  // 하늘 영역 (y < 0.4) - 구름 처리
  if (normalizedY < 0.4) {
    const clickedCloud = findCloudAtPosition(normalizedX, normalizedY)
    if (clickedCloud) {
      // 기존 구름 클릭 → 최대 5번까지만 크기 증가
      if (clickedCloud.clickCount < 5) {
        clickedCloud.size += 0.3
        clickedCloud.clickCount++
      }
    } else {
      // 빈 하늘 클릭 → 새 구름 생성
      createCloud(normalizedX, normalizedY)
    }
    return
  }

  // 잔디 영역 (y >= 0.4) - 꽃 심기
  await plantFlower(normalizedX, normalizedY)
}

// Canvas 크기 업데이트
const updateCanvasSize = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const dpr = window.devicePixelRatio || 1
  const width = bounds.width.value || 300

  canvas.width = width * dpr
  canvas.height = CANVAS_HEIGHT * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${CANVAS_HEIGHT}px`

  render()
}

// 새 꽃 애니메이션
const animateNewFlower = (flowerId: string) => {
  const startTime = Date.now()
  const duration = 400

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic

    animationProgress.value.set(flowerId, eased)
    render()

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      newFlowerIds.value.delete(flowerId)
      animationProgress.value.delete(flowerId)
    }
  }

  requestAnimationFrame(animate)
}

// 초기 애니메이션 (개별 꽃)
const animateInitialFlower = (flowerId: string): Promise<void> => {
  return new Promise((resolve) => {
    const startTime = Date.now()
    const duration = 300

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic

      initialAnimationProgress.value.set(flowerId, eased)
      render()

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(animate)
  })
}

// 초기 애니메이션 시작 (5초 동안 랜덤하게 꽃 표시)
const playInitialAnimation = () => {
  if (hasPlayedInitialAnimation.value || flowers.value.length === 0) {
    hasPlayedInitialAnimation.value = true
    render()
    return
  }

  const TOTAL_DURATION = 5000 // 5초
  const FLOWER_ANIM_DURATION = 300 // 개별 꽃 애니메이션 시간
  const allFlowers = [...flowers.value]

  // 각 꽃에 랜덤한 시작 시간 할당 (0 ~ 5초 사이)
  const flowerTimings = allFlowers.map((flower) => ({
    flower,
    startTime: Math.random() * TOTAL_DURATION
  }))

  // 각 꽃을 랜덤 시간에 애니메이션 시작
  for (const { flower, startTime } of flowerTimings) {
    setTimeout(() => {
      initialAnimationFlowerIds.value.add(flower.id)
      initialAnimationProgress.value.set(flower.id, 0)
      animateInitialFlower(flower.id)
    }, startTime)
  }

  // 모든 애니메이션 완료 후 정리 (5초 + 마지막 꽃 애니메이션 시간)
  setTimeout(() => {
    hasPlayedInitialAnimation.value = true
    initialAnimationFlowerIds.value.clear()
    initialAnimationProgress.value.clear()
    render()
  }, TOTAL_DURATION + FLOWER_ANIM_DURATION)
}

// flowers 변경 시 새 꽃 감지 및 렌더링
watch(
  flowers,
  (newFlowers, oldFlowers) => {
    // 초기 애니메이션이 아직 안 끝났으면 무시 (초기 애니메이션이 처리함)
    if (!hasPlayedInitialAnimation.value) {
      return
    }

    // 새로 추가된 꽃 감지
    const oldIds = new Set(oldFlowers?.map((f) => f.id) || [])
    const addedFlowers = newFlowers.filter((f) => !oldIds.has(f.id))

    // 새 꽃 애니메이션 시작
    for (const flower of addedFlowers) {
      newFlowerIds.value.add(flower.id)
      animationProgress.value.set(flower.id, 0)
      animateNewFlower(flower.id)
    }

    // 새 꽃이 없으면 일반 렌더링
    if (addedFlowers.length === 0) {
      render()
    }
  },
  { deep: true }
)

// Canvas가 화면에 보일 때 초기 애니메이션 시작
const isCanvasVisible = ref(false)
useIntersectionObserver(
  containerRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting && !isCanvasVisible.value) {
      isCanvasVisible.value = true
      // 데이터 로딩 완료 후 애니메이션 시작
      if (!isLoading.value && flowers.value.length > 0) {
        playInitialAnimation()
      }
    }
  },
  { threshold: 0.3 }
)

// 로딩 완료 시 초기 애니메이션 시작 (이미 보이는 상태면)
watch(
  [isLoading, () => flowers.value.length],
  ([loading, flowerCount]) => {
    if (!loading && flowerCount > 0 && isCanvasVisible.value && !hasPlayedInitialAnimation.value) {
      playInitialAnimation()
    }
  }
)

// 초기화
onMounted(() => {
  updateCanvasSize()
  window.addEventListener('resize', updateCanvasSize)
  // 구름 애니메이션 시작
  animateClouds()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasSize)
  // 구름 애니메이션 정지
  if (cloudAnimationId !== null) {
    cancelAnimationFrame(cloudAnimationId)
    cloudAnimationId = null
  }
})

// bounds 변경 감지
watch(
  () => bounds.width.value,
  () => {
    updateCanvasSize()
  }
)
</script>

<template>
  <section id="garden" class="py-12 px-6 bg-wedding-bg">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
    >
      <SectionTitle title="Garden" subtitle="축하의 꽃을 심어주세요" />
    </div>

    <div
      ref="containerRef"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 200, duration: 500 } }"
      class="max-w-md mx-auto"
    >
      <!-- Canvas 영역 -->
      <div class="relative rounded-2xl overflow-hidden shadow-lg border border-wedding-border">
        <canvas
          ref="canvasRef"
          class="block w-full cursor-pointer touch-none"
          @click="handleCanvasInteraction"
          @touchstart.prevent="handleCanvasInteraction"
        />

        <!-- 로딩 오버레이 -->
        <div
          v-if="isLoading"
          class="absolute inset-0 bg-white/80 flex items-center justify-center"
        >
          <div
            class="animate-spin w-6 h-6 border-2 border-wedding-primary border-t-transparent rounded-full"
          />
        </div>

        <!-- 안내 텍스트 (초기 상태) -->
        <div
          v-if="!isLoading && flowers.length === 0"
          class="absolute bottom-4 left-0 right-0 text-center"
        >
          <p class="text-xs text-white/90 bg-black/30 inline-block px-3 py-1 rounded-full">
            터치해서 첫 번째 꽃을 심어주세요!
          </p>
        </div>
      </div>

      <!-- 총 개수 표시 -->
      <div class="text-center mt-4">
        <p class="text-sm text-wedding-text-light">
          축하하는 마음을 표현해 주신 횟수:
          <span class="text-wedding-primary font-medium">{{ totalCount.toLocaleString() }}회</span>
        </p>
      </div>

      <!-- 안내 문구 -->
      <p class="text-xs text-wedding-text-light text-center mt-2 opacity-70">
        초록 잔디 위를 터치하면 꽃이 심어져요
      </p>
    </div>
  </section>
</template>
