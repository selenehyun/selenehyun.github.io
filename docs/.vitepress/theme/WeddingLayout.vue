<script setup lang="ts">
import { useRoute } from 'vitepress'
import CoverSection from './components/CoverSection.vue'
import GreetingSection from './components/GreetingSection.vue'
import GallerySection from './components/GallerySection.vue'
import InfoSection from './components/InfoSection.vue'
import RSVPButtonSection from './components/RSVPButtonSection.vue'
import LocationSection from './components/LocationSection.vue'
import ContactSection from './components/ContactSection.vue'
import AccountSection from './components/AccountSection.vue'
import GuestbookSection from './components/GuestbookSection.vue'
import ShareSection from './components/ShareSection.vue'
import FooterSection from './components/FooterSection.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import GuestbookPage from './components/GuestbookPage.vue'
import RSVPPage from './components/RSVPPage.vue'
import PhotoEventPage from './components/PhotoEventPage.vue'
import PhotoEventSection from './components/PhotoEventSection.vue'
import FontSizeControl from './components/FontSizeControl.vue'
import AttendanceSheet from './components/AttendanceSheet.vue'

const route = useRoute()
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

    <div class="wedding-container">
      <CoverSection />
      <GreetingSection />
      <GallerySection />
      <InfoSection />
      <RSVPButtonSection />
      <PhotoEventSection />
      <LocationSection />
      <ContactSection />
      <AccountSection />
      <GuestbookSection />
      <ShareSection />
      <FooterSection />
    </div>

    <!-- 참석 여부 안내 Bottom Sheet -->
    <AttendanceSheet />
  </div>
</template>
