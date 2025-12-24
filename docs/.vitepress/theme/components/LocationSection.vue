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
const venueLatitude = 37.5168
const venueLongitude = 126.8754

const mapContainer = ref<HTMLElement | null>(null)
const mapLoaded = ref(false)
const mapError = ref(false)

const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY || ''

// 카카오맵 SDK 로드
const loadKakaoMapSDK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!KAKAO_JS_KEY) {
      console.warn('Kakao JS Key is not set')
      resolve(false)
      return
    }

    // 이미 로드되어 있는 경우
    if (window.kakao?.maps) {
      resolve(true)
      return
    }

    // SDK 스크립트 동적 로드
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve(true)
      })
    }
    script.onerror = () => {
      console.error('Failed to load Kakao Maps SDK')
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

    // 인포윈도우 생성
    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px 10px;font-size:12px;white-space:nowrap;">${venueName}</div>`
    })
    infowindow.open(map, marker)

    // 지도 컨트롤 추가
    const zoomControl = new kakao.maps.ZoomControl()
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

    mapLoaded.value = true
  } catch (e) {
    console.error('Map initialization error:', e)
    mapError.value = true
  }
}

onMounted(() => {
  initMap()
})

const openMap = (type: string) => {
  if (type === 'naver') {
    window.open(`https://map.naver.com/v5/search/${encodeURIComponent(venueName)}`)
  } else if (type === 'kakao') {
    window.open(`https://map.kakao.com/?q=${encodeURIComponent(venueName)}`)
  } else if (type === 'tmap') {
    window.open(`https://apis.openapi.sk.com/tmap/app/routes?appKey=&name=${encodeURIComponent(venueName)}`)
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
      <div class="flex items-center justify-center gap-2 text-sm text-wedding-text-light">
        <MapPin class="w-4 h-4 text-wedding-primary/70" />
        <span>{{ address }}</span>
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
          <p class="text-wedding-text-light text-[13px] leading-relaxed">
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
          <p class="text-wedding-text-light text-[13px] leading-relaxed">
            건물 옆 전용 주차장 300대<br>
            만차시 도보 5분 거리 공영주차장<br>
            3시간 무료 주차 지원
          </p>
          <p class="text-wedding-text-light/70 text-[12px] leading-relaxed mt-2">
            큰 사거리에 위치한 건물이기 때문에 주차가 혼잡할 수 있어 여유 있게 오시는 것을 추천드립니다.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
