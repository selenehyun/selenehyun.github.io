<script setup lang="ts">
import { MapPin, Car, Train } from 'lucide-vue-next'
import SectionTitle from './SectionTitle.vue'

const venueName = '로프트가든344'
const address = '서울 양천구 오목로 344'

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
    <SectionTitle title="Location" subtitle="오시는 길" />

    <!-- Location Info -->
    <div class="mb-6">
      <p class="text-lg font-medium text-wedding-text mb-2">{{ venueName }}</p>
      <div class="flex items-center justify-center gap-2 text-sm text-wedding-text-light">
        <MapPin class="w-4 h-4 text-wedding-primary/70" />
        <span>{{ address }}</span>
      </div>
    </div>

    <!-- Map Placeholder -->
    <div class="w-full h-[180px] bg-white rounded-lg mb-5 flex items-center justify-center shadow-sm">
      <span class="text-wedding-text-light/40 text-xs">지도 영역</span>
    </div>

    <!-- Map Buttons -->
    <div class="flex gap-2 justify-center flex-wrap mb-8">
      <button
        @click="openMap('naver')"
        class="px-4 py-2.5 border border-wedding-border bg-white text-xs rounded-full hover:bg-wedding-primary hover:text-white hover:border-wedding-primary transition-all duration-200"
      >
        네이버지도
      </button>
      <button
        @click="openMap('kakao')"
        class="px-4 py-2.5 border border-wedding-border bg-white text-xs rounded-full hover:bg-wedding-primary hover:text-white hover:border-wedding-primary transition-all duration-200"
      >
        카카오맵
      </button>
      <button
        @click="openMap('tmap')"
        class="px-4 py-2.5 border border-wedding-border bg-white text-xs rounded-full hover:bg-wedding-primary hover:text-white hover:border-wedding-primary transition-all duration-200"
      >
        티맵
      </button>
    </div>

    <!-- Transportation Info -->
    <div class="bg-white rounded-lg p-5 text-left text-sm">
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
            건물 내 주차장 이용 가능
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
