<script setup lang="ts">
import CoverSection from './components/CoverSection.vue'
import GreetingSection from './components/GreetingSection.vue'
import GallerySection from './components/GallerySection.vue'
import InfoSection from './components/InfoSection.vue'
import LocationSection from './components/LocationSection.vue'
import ContactSection from './components/ContactSection.vue'
import AccountSection from './components/AccountSection.vue'
import FooterSection from './components/FooterSection.vue'
import ScrollProgress from './components/ScrollProgress.vue'
</script>

<template>
  <div class="wedding-wrapper">
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
      <FooterSection />
    </div>
  </div>
</template>
