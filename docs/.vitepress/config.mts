import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  title: "승현 ♥ 서영 결혼합니다",
  description: "2026년 4월 19일 일요일 오전 11시 로프트가든344",
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' }],
    ['meta', { name: 'robots', content: 'noindex, nofollow' }],
    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '승현 ♥ 서영 결혼식에 초대합니다' }],
    ['meta', { property: 'og:description', content: '2026년 4월 19일 일요일 오전 11시 | 로프트가든344' }],
    ['meta', { property: 'og:url', content: 'https://wedding.pet' }],
    ['meta', { property: 'og:image', content: 'https://wedding.pet/images/share-thumbnail.jpg' }],
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: '승현 ♥ 서영 결혼식에 초대합니다' }],
    ['meta', { name: 'twitter:description', content: '2026년 4월 19일 일요일 오전 11시 | 로프트가든344' }],
    ['meta', { name: 'twitter:image', content: 'https://wedding.pet/images/share-thumbnail.jpg' }],
    // Fonts
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600&family=Cormorant+Garamond:wght@300;400;500&display=swap', rel: 'stylesheet' }]
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/docs/.vitepress'
      }
    }
  },
  themeConfig: {}
})
