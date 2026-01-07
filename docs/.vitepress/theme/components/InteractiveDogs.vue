<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMouse, useElementBounding } from '@vueuse/core'

// 커서/터치 추적 (client 타입 = 뷰포트 기준 좌표)
const { x: mouseX, y: mouseY } = useMouse({
  type: 'client',
  touch: true,
  resetOnTouchEnds: false  // 터치 끝나도 위치 유지
})
const containerRef = ref<HTMLElement | null>(null)
const bounds = useElementBounding(containerRef)

// 모바일 터치 활성 상태
const isTouchActive = ref(false)
const lastTouchTime = ref(0)

// 상태
type DogState = 'normal' | 'interested' | 'excited'
const isKissing = ref(false)
const hearts = ref<{ id: number; x: number; y: number }[]>([])
let heartId = 0

// 컴포넌트 중심점 계산
const centerX = computed(() => bounds.x.value + bounds.width.value / 2)
const centerY = computed(() => bounds.y.value + bounds.height.value / 2)

// 커서와의 거리 계산
const distance = computed(() => {
  const dx = mouseX.value - centerX.value
  const dy = mouseY.value - centerY.value
  return Math.sqrt(dx * dx + dy * dy)
})

// 상태 결정 (모바일에서 터치 직후엔 더 민감하게)
const state = computed<DogState>(() => {
  const now = Date.now()
  const recentlyTouched = now - lastTouchTime.value < 3000  // 3초 이내 터치

  // 모바일 터치 시 거리 기준 완화
  const excitedThreshold = recentlyTouched ? 200 : 150
  const interestedThreshold = recentlyTouched ? 400 : 300

  if (distance.value < excitedThreshold) return 'excited'
  if (distance.value < interestedThreshold) return 'interested'
  return 'normal'
})

// 눈동자 오프셋 계산 (커서 방향으로 이동)
const eyeOffset = computed(() => {
  const dx = mouseX.value - centerX.value
  const dy = mouseY.value - centerY.value
  const maxOffset = 2
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist === 0) return { x: 0, y: 0 }
  return {
    x: Math.min(maxOffset, Math.max(-maxOffset, (dx / dist) * maxOffset)),
    y: Math.min(maxOffset, Math.max(-maxOffset, (dy / dist) * maxOffset))
  }
})

// 머리 기울기 (살짝만)
const headTilt = computed(() => {
  const dx = mouseX.value - centerX.value
  const maxTilt = 5
  const tilt = (dx / 500) * maxTilt
  return Math.min(maxTilt, Math.max(-maxTilt, tilt))
})

// 하트 생성
const spawnHeart = () => {
  if (state.value === 'normal') return
  const id = heartId++
  const offsetX = Math.random() * 60 - 30
  hearts.value.push({ id, x: offsetX, y: 0 })
  setTimeout(() => {
    hearts.value = hearts.value.filter(h => h.id !== id)
  }, 1000)
}

// 터치 이벤트 핸들러
const handleTouchStart = () => {
  isTouchActive.value = true
  lastTouchTime.value = Date.now()
}

const handleTouchEnd = () => {
  isTouchActive.value = false
}

// 주기적으로 하트 생성
let heartInterval: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  // 터치 이벤트 리스너 등록
  document.addEventListener('touchstart', handleTouchStart, { passive: true })
  document.addEventListener('touchend', handleTouchEnd, { passive: true })
  document.addEventListener('touchmove', handleTouchStart, { passive: true })

  heartInterval = setInterval(() => {
    if (state.value === 'excited') {
      spawnHeart()
      spawnHeart()
    } else if (state.value === 'interested') {
      spawnHeart()
    }
  }, 800)
})

onUnmounted(() => {
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('touchmove', handleTouchStart)
  if (heartInterval) clearInterval(heartInterval)
})

// 클릭 시 뽀뽀
const handleClick = () => {
  if (isKissing.value) return
  isKissing.value = true
  // 하트 폭발
  for (let i = 0; i < 5; i++) {
    setTimeout(() => spawnHeart(), i * 100)
  }
  setTimeout(() => {
    isKissing.value = false
  }, 1200)
}
</script>

<template>
  <div
    ref="containerRef"
    class="fixed bottom-4 right-4 z-40 cursor-pointer select-none"
    :class="{ 'scale-75 bottom-2 right-2': true }"
    @click="handleClick"
  >
    <div class="relative flex items-end gap-1">
      <!-- 아리 (왼쪽, 큰 아이) -->
      <svg
        width="70"
        height="90"
        viewBox="0 0 70 90"
        style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1)); overflow: visible"
        class="transition-transform duration-200"
        :class="{
          'animate-bounce-subtle': state === 'excited',
          '-translate-x-2': isKissing
        }"
        :style="{ transform: `rotate(${headTilt}deg)` }"
      >
        <!-- 꼬리 -->
        <g
          class="origin-bottom"
          :class="[
            state === 'excited' ? 'animate-wag-fast' :
            state === 'interested' ? 'animate-wag' : 'animate-wag-slow'
          ]"
        >
          <ellipse cx="15" cy="55" rx="6" ry="12" fill="#D4A574" transform="rotate(-30 15 55)" />
        </g>

        <!-- 뒷다리 (얇고 긴) -->
        <rect x="22" y="66" width="5" height="22" rx="2.5" fill="#FFFEF5" stroke="#E8E0D5" stroke-width="0.5" />
        <rect x="43" y="66" width="5" height="22" rx="2.5" fill="#FFFEF5" stroke="#E8E0D5" stroke-width="0.5" />

        <!-- 몸통 (길고 얇은 체형) -->
        <ellipse cx="35" cy="52" rx="16" ry="22" fill="#FFFEF5" stroke="#E8E0D5" stroke-width="1" />
        <!-- 등 무늬 - 앞에서 봐서 살짝만 보임 (어깨 위쪽) -->
        <ellipse cx="35" cy="38" rx="10" ry="3" fill="#D4A574" />

        <!-- 앞다리 (긴 다리, 얇음) -->
        <rect x="26" y="64" width="5" height="24" rx="2.5" fill="#FFFEF5" stroke="#E8E0D5" stroke-width="0.5" />
        <rect x="39" y="64" width="5" height="24" rx="2.5" fill="#FFFEF5" stroke="#E8E0D5" stroke-width="0.5" />

        <!-- 머리 -->
        <ellipse cx="35" cy="30" rx="18" ry="16" fill="#FFFEF5" stroke="#E8E0D5" stroke-width="1" />

        <!-- 귀 (왼쪽) -->
        <g>
          <path d="M15 25 L10 8 L25 20 Z" fill="#FFFEF5" stroke="#E8E0D5" stroke-width="1" />
          <path d="M16 22 L13 12 L23 20 Z" fill="#FFB6C1" />
        </g>
        <!-- 귀 (오른쪽) -->
        <g :class="{ 'animate-ear-perk': state === 'excited' }">
          <path d="M55 25 L60 8 L45 20 Z" fill="#FFFEF5" stroke="#E8E0D5" stroke-width="1" />
          <path d="M54 22 L57 12 L47 20 Z" fill="#FFB6C1" />
        </g>

        <!-- 눈 -->
        <g v-if="!isKissing">
          <!-- 왼쪽 눈 -->
          <ellipse cx="27" cy="28" rx="4" ry="4.5" fill="#2D1810" />
          <circle
            :cx="27 + eyeOffset.x"
            :cy="28 + eyeOffset.y"
            r="1.5"
            fill="white"
          />
          <!-- 오른쪽 눈 -->
          <ellipse cx="43" cy="28" rx="4" ry="4.5" fill="#2D1810" />
          <circle
            :cx="43 + eyeOffset.x"
            :cy="28 + eyeOffset.y"
            r="1.5"
            fill="white"
          />
        </g>
        <!-- 웃는 눈 ^^ (클릭 시) -->
        <g v-else>
          <path d="M24 28 Q27 25 30 28" stroke="#2D1810" stroke-width="2" fill="none" />
          <path d="M40 28 Q43 25 46 28" stroke="#2D1810" stroke-width="2" fill="none" />
        </g>

        <!-- 코 -->
        <ellipse cx="35" cy="36" rx="3" ry="2" fill="#2D1810" />

        <!-- 입 (클릭할 때 벌린 입 + 혀) -->
        <g v-if="isKissing">
          <!-- 입 안 (검은색) -->
          <ellipse cx="35" cy="42" rx="7" ry="5" fill="#2D1810" />
          <!-- 혀 -->
          <ellipse cx="35" cy="46" rx="4" ry="6" fill="#FF8B9A" />
          <line x1="35" y1="44" x2="35" y2="50" stroke="#E87585" stroke-width="1" />
          <!-- 입 테두리 (위) -->
          <path
            d="M28 40 Q35 36 42 40"
            stroke="#2D1810"
            stroke-width="1.5"
            fill="none"
          />
        </g>
        <path
          v-else
          d="M30 40 Q35 44 40 40"
          stroke="#2D1810"
          stroke-width="1.5"
          fill="none"
        />

        <!-- 볼터치 -->
        <ellipse cx="20" cy="34" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.5" />
        <ellipse cx="50" cy="34" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.5" />
      </svg>

      <!-- 쫑 (오른쪽, 작은 아이) -->
      <svg
        width="55"
        height="70"
        viewBox="0 0 55 70"
        style="overflow: visible"
        class="transition-transform duration-200"
        :class="{
          'animate-bounce-subtle': state === 'excited',
          'translate-x-2': isKissing
        }"
        :style="{ transform: `rotate(${-headTilt}deg)` }"
      >
        <!-- 꼬리 -->
        <g
          class="origin-bottom"
          :class="[
            state === 'excited' ? 'animate-wag-fast' :
            state === 'interested' ? 'animate-wag' : 'animate-wag-slow'
          ]"
        >
          <ellipse cx="45" cy="40" rx="5" ry="10" fill="#8B6914" transform="rotate(30 45 40)" />
        </g>

        <!-- 뒷다리 -->
        <rect x="12" y="52" width="7" height="14" rx="3.5" fill="#8B6914" />
        <rect x="30" y="52" width="7" height="14" rx="3.5" fill="#8B6914" />

        <!-- 몸통 -->
        <ellipse cx="27" cy="44" rx="17" ry="14" fill="#8B6914" />
        <!-- 가슴 흰색 -->
        <ellipse cx="27" cy="50" rx="10" ry="8" fill="#FFFEF5" />

        <!-- 앞다리 -->
        <rect x="16" y="50" width="6" height="16" rx="3" fill="#8B6914" />
        <rect x="32" y="50" width="6" height="16" rx="3" fill="#8B6914" />

        <!-- 머리 -->
        <ellipse cx="27" cy="24" rx="14" ry="13" fill="#8B6914" />
        <!-- 턱 흰색 -->
        <ellipse cx="27" cy="30" rx="8" ry="5" fill="#FFFEF5" />

        <!-- 귀 (왼쪽) -->
        <path d="M12 20 L6 5 L20 16 Z" fill="#8B6914" />
        <!-- 귀 (오른쪽) -->
        <g :class="{ 'animate-ear-perk': state === 'excited' }">
          <path d="M42 20 L48 5 L34 16 Z" fill="#8B6914" />
        </g>

        <!-- 눈 -->
        <g v-if="!isKissing">
          <!-- 왼쪽 눈 -->
          <ellipse cx="20" cy="22" rx="3.5" ry="4" fill="#2D1810" />
          <circle
            :cx="20 + eyeOffset.x"
            :cy="22 + eyeOffset.y"
            r="1.2"
            fill="white"
          />
          <!-- 오른쪽 눈 -->
          <ellipse cx="34" cy="22" rx="3.5" ry="4" fill="#2D1810" />
          <circle
            :cx="34 + eyeOffset.x"
            :cy="22 + eyeOffset.y"
            r="1.2"
            fill="white"
          />
        </g>
        <!-- 웃는 눈 ^^ (클릭 시) -->
        <g v-else>
          <path d="M17 22 Q20 19 23 22" stroke="#2D1810" stroke-width="1.5" fill="none" />
          <path d="M31 22 Q34 19 37 22" stroke="#2D1810" stroke-width="1.5" fill="none" />
        </g>

        <!-- 코 -->
        <ellipse cx="27" cy="28" rx="2.5" ry="1.8" fill="#2D1810" />

        <!-- 입 (클릭할 때 벌린 입 + 혀) -->
        <g v-if="isKissing">
          <!-- 입 안 (검은색) -->
          <ellipse cx="27" cy="33" rx="5" ry="4" fill="#2D1810" />
          <!-- 혀 -->
          <ellipse cx="27" cy="36" rx="3" ry="5" fill="#FF8B9A" />
          <line x1="27" y1="34" x2="27" y2="40" stroke="#E87585" stroke-width="0.8" />
          <!-- 입 테두리 (위) -->
          <path
            d="M22 31 Q27 28 32 31"
            stroke="#2D1810"
            stroke-width="1.5"
            fill="none"
          />
        </g>
        <path
          v-else
          d="M23 32 Q27 35 31 32"
          stroke="#2D1810"
          stroke-width="1.5"
          fill="none"
        />

        <!-- 볼터치 -->
        <ellipse cx="13" cy="26" rx="3" ry="2" fill="#FFB6C1" opacity="0.5" />
        <ellipse cx="41" cy="26" rx="3" ry="2" fill="#FFB6C1" opacity="0.5" />
      </svg>

      <!-- 뽀뽀 하트 (클릭 시) -->
      <div
        v-if="isKissing"
        class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-2xl animate-kiss-heart"
      >
        💕
      </div>

      <!-- 플로팅 하트들 -->
      <div
        v-for="heart in hearts"
        :key="heart.id"
        class="absolute bottom-full left-1/2 text-lg pointer-events-none animate-float-up"
        :style="{ transform: `translateX(${heart.x}px)` }"
      >
        ❤️
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 꼬리 흔들기 - 느림 */
@keyframes wag-slow {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}

.animate-wag-slow {
  animation: wag-slow 1s ease-in-out infinite;
  transform-origin: bottom center;
}

/* 꼬리 흔들기 - 보통 */
@keyframes wag {
  0%, 100% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
}

.animate-wag {
  animation: wag 0.5s ease-in-out infinite;
  transform-origin: bottom center;
}

/* 꼬리 흔들기 - 빠름 */
@keyframes wag-fast {
  0%, 100% { transform: rotate(-20deg); }
  50% { transform: rotate(20deg); }
}

.animate-wag-fast {
  animation: wag-fast 0.2s ease-in-out infinite;
  transform-origin: bottom center;
}

/* 귀 쫑긋 */
@keyframes ear-perk {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.animate-ear-perk {
  animation: ear-perk 0.3s ease-in-out infinite;
}

/* 몸 들썩 */
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 0.4s ease-in-out infinite;
}

/* 하트 떠오르기 */
@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateX(var(--tx, 0)) translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(var(--tx, 0)) translateY(-50px) scale(1.3);
  }
}

.animate-float-up {
  animation: float-up 1s ease-out forwards;
}

/* 뽀뽀 하트 */
@keyframes kiss-heart {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(0) scale(0.5);
  }
  30% {
    opacity: 1;
    transform: translateX(-50%) translateY(-10px) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-30px) scale(1);
  }
}

.animate-kiss-heart {
  animation: kiss-heart 1.2s ease-out forwards;
}

/* 모바일 대응 */
@media (max-width: 640px) {
  .fixed {
    transform: scale(0.8);
    transform-origin: bottom right;
  }
}
</style>
