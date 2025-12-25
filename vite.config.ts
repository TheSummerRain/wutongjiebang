import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // 移除 base: './'，使用默认的 '/'，这对 Vercel 部署更友好
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
    // 定义环境变量替换
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})