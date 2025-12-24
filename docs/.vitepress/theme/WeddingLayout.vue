<script setup lang="ts">
import { useRoute } from 'vitepress'
import CoverSection from './components/CoverSection.vue'
import GreetingSection from './components/GreetingSection.vue'
import GallerySection from './components/GallerySection.vue'
import InfoSection from './components/InfoSection.vue'
import LocationSection from './components/LocationSection.vue'
import ContactSection from './components/ContactSection.vue'
import AccountSection from './components/AccountSection.vue'
import GuestbookSection from './components/GuestbookSection.vue'
import ShareSection from './components/ShareSection.vue'
import FooterSection from './components/FooterSection.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import GuestbookPage from './components/GuestbookPage.vue'

const route = useRoute()
const isGuestbookPage = () => route.path === '/guestbook' || route.path === '/guestbook.html'
</script>

<template>
  <!-- 방명록 전용 페이지 -->
  <GuestbookPage v-if="isGuestbookPage()" />

  <!-- 메인 청첩장 페이지 -->
  <div v-else class="wedding-wrapper">
    <!-- Scroll Progress Indicator -->
    <ScrollProgress />

    <div class="wedding-container">
      <CoverSection />
      <GreetingSection />
      <GallerySection />
      <InfoSection />
      <LocationSection />
      <ContactSection />
      <AccountSection />
      <GuestbookSection />
      <ShareSection />
      <FooterSection />
    </div>
  </div>
</template>
