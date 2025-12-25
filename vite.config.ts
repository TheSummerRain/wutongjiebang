import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // 修改为 './'，这样打包后的文件可以通过相对路径访问，不依赖根域名
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