<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import CoverSection from './components/CoverSection.vue'
import GreetingSection from './components/GreetingSection.vue'
import GallerySection from './components/GallerySection.vue'
import InfoSection from './components/InfoSection.vue'
import CeremonySection from './components/CeremonySection.vue'
import RSVPButtonSection from './components/RSVPButtonSection.vue'
import LocationSection from './components/LocationSection.vue'
import ContactSection from './components/ContactSection.vue'
import AccountSection from './components/AccountSection.vue'
import GuestbookSection from './components/GuestbookSection.vue'
import ShareSection from './components/ShareSection.vue'
import FooterSection from './components/FooterSection.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import InteractiveDogs from './components/InteractiveDogs.vue'
import GuestbookPage from './components/GuestbookPage.vue'
import RSVPPage from './components/RSVPPage.vue'
import PhotoEventPage from './components/PhotoEventPage.vue'
import PhotoEventSection from './components/PhotoEventSection.vue'
import FlowerGarden from './components/FlowerGarden.vue'
import FontSizeControl from './components/FontSizeControl.vue'
import AttendanceSheet from './components/AttendanceSheet.vue'
import PhotoUploadSheet from './components/PhotoUploadSheet.vue'
import PhotoFAB from './components/PhotoFAB.vue'
import ViewerCount from './components/ViewerCount.vue'
import { useWeddingTime } from './composables/useWeddingTime'

const route = useRoute()

const handleVisibilityChange = () => {
  if (!document.hidden) {
    // 인앱 브라우저에서 hidden 상태로 로드된 경우
    // IntersectionObserver 재평가를 위한 스크롤 넛지
    requestAnimationFrame(() => {
      window.scrollBy(0, 1)
      requestAnimationFrame(() => {
        window.scrollBy(0, -1)
      })
    })
  }
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
const { isAfterWedding } = useWeddingTime()

const isGuestbookPage = () => route.path === '/guestbook' || route.path === '/guestbook.html'
const isRSVPPage = () => route.path === '/rsvp' || route.path === '/rsvp.html'
const isPhotoEventPage = () => route.path === '/photo-event' || route.path === '/photo-event.html'
</script>

<template>
  <!-- 글자 크기 조절 버튼 -->
  <FontSizeControl />

  <!-- RSVP 전용 페이지 -->
  <RSVPPage v-if="isRSVPPage()" />

  <!-- 방명록 전용 페이지 -->
  <GuestbookPage v-else-if="isGuestbookPage()" />

  <!-- 사진 이벤트 페이지 -->
  <PhotoEventPage v-else-if="isPhotoEventPage()" />

  <!-- 메인 청첩장 페이지 -->
  <div v-else class="wedding-wrapper">
    <!-- Scroll Progress Indicator -->
    <ScrollProgress />

    <!-- Viewer Count -->
    <ViewerCount />

    <!-- Interactive Dogs (아리 & 쫑) -->
    <InteractiveDogs />

    <div class="wedding-container">
      <CoverSection />
      <GreetingSection />
      <GallerySection />
      <InfoSection />
      <CeremonySection />
      <RSVPButtonSection />
      <PhotoEventSection />
      <LocationSection />
      <ContactSection />
      <AccountSection />
      <FlowerGarden />
      <GuestbookSection />
      <ShareSection />
      <FooterSection />
    </div>

    <!-- 결혼식 전: 참석 여부 안내 Bottom Sheet -->
    <AttendanceSheet v-if="!isAfterWedding" />

    <!-- 결혼식 후: 사진 업로드 안내 Sheet + FAB -->
    <template v-else>
      <PhotoUploadSheet />
      <PhotoFAB />
    </template>
  </div>
</template>
