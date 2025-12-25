import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // 关键配置：使用相对路径，支持本地文件系统部署
    base: './',
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