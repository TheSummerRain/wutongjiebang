import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 关键配置：使用相对路径，这样打包后的 index.html 可以直接在任何文件夹打开
  // 注意：某些路由功能在纯本地 file:// 协议下可能会受限，但对于展示型 Demo 通常没问题
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  }
})