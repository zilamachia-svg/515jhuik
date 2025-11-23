import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isProduction = mode === 'production';

    return {
        // 1. Plugins (Quan trọng: Đảm bảo chạy React)
        plugins: [react()],
    
    // 2. [FIX LỖI MODULE DYNAMIC IMPORT] 
    // Thiết lập đường dẫn gốc để trình duyệt tải các module chia nhỏ
    base: '/', 
    
    // 3. Cấu hình Development Server
        server: {
            port: 5173, // Vite default dev port; changed to 5173 for consistency
            host: true, // Cho phép truy cập qua địa chỉ IP của máy (optional)

      // 4. [FIX LỖI 401/CORS] Cấu hình Proxy API
      // Khi Frontend ở 3000 gọi /api/v1/..., nó sẽ chuyển request này sang http://localhost:8000
      proxy: {
        '/api': {
          target: 'http://localhost:8000', // <-- Đảm bảo Backend Laravel chạy ở port này
          changeOrigin: true, // Thay đổi Origin Header để tránh lỗi CORS
          secure: false, // (Optional) Nếu API chạy qua http thường
          // rewrite: (path) => path.replace(/^\/api/, '/api'), // Giữ nguyên đường dẫn /api
        },
      },
    },
        publicDir: 'public',
        build: {
            outDir: 'dist',
            emptyOutDir: true,
            sourcemap: !isProduction,
            minify: 'esbuild',
            cssMinify: isProduction,
            chunkSizeWarningLimit: 1000,
            rollupOptions: {
                output: {
                    entryFileNames: 'assets/[name]-[hash].js',
                    chunkFileNames: 'assets/[name]-[hash].js',
                    assetFileNames: 'assets/[name]-[hash].[ext]',
                    manualChunks: (id) => {
                        if (id.includes('node_modules')) {
                            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                                return 'vendor-react';
                            }
                            if (id.includes('react-router-dom')) {
                                return 'vendor-router';
                            }
                            // Swagger grouping removed — package may be absent in dev
                            if (id.includes('framer-motion')) return 'vendor-animation';
                            if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
                            if (id.includes('@radix-ui')) return 'vendor-radix';
                            if (id.includes('zod') || id.includes('validator')) return 'vendor-validation';
                            if (id.includes('axios') || id.includes('sonner') || id.includes('lucide')) return 'vendor-utils';
                            return 'vendor';
                        }
                    },
                },
            },
        },
        // --- KHẮC PHỤC LỖI RUNTIME SWAGGER TẠI ĐÂY ---
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
            
            // Dòng này cực quan trọng để Swagger UI không bị crash màn hình trắng
            global: 'window', 
        },
        // ----------------------------------------------

        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
            dedupe: ['react', 'react-dom'],
        },
        optimizeDeps: {
            include: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                'react-router-dom',
                'framer-motion',
                '@radix-ui/react-slot',
                // Thêm dòng này để Vite xử lý trước
                
            ],
        },
    };
});