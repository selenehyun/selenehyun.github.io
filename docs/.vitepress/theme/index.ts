import DefaultTheme from 'vitepress/theme'
import { MotionPlugin } from '@vueuse/motion'
import './style.css'
import WeddingLayout from './WeddingLayout.vue'
import type { App } from 'vue'

export default {
  extends: DefaultTheme,
  Layout: WeddingLayout,
  enhanceApp({ app }: { app: App }) {
    app.use(MotionPlugin)
  }
}
