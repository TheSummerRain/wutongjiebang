import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量，第三个参数 '' 表示加载所有变量，不仅仅是 VITE_ 开头的
  // Fix: cast process to any to avoid TS error "Property 'cwd' does not exist on type 'Process'"
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    base: './', 
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
    // 关键修复：定义 process.env.API_KEY，防止浏览器报 "process is not defined" 错误
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})