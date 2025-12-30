<script setup lang="ts">
import { Calendar } from 'lucide-vue-next'
import Button from './ui/Button.vue'

const goToRSVP = () => {
  window.location.href = '/rsvp'
}
</script>

<template>
  <section class="wedding-section py-12">
    <div class="flex justify-center">
      <Button
        variant="outline"
        size="default"
        class="gap-2"
        @click="goToRSVP"
      >
        <Calendar class="w-4 h-4" />
        참석 여부 알리기
      </Button>
    </div>
  </section>
</template>
