import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-engineering-guides',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const decodedUrl = decodeURIComponent(req.url || '');
          if (decodedUrl.startsWith('/Engineering guides/')) {
            const relativeFilePath = decodedUrl.replace('/Engineering guides/', '');
            const absolutePath = path.resolve(__dirname, 'Engineering guides', relativeFilePath);
            if (fs.existsSync(absolutePath)) {
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition', 'inline');
              fs.createReadStream(absolutePath).pipe(res);
              return;
            }
          }
          next();
        });
      }
    }
  ],
  base: process.env.NODE_ENV === 'production' ? '/EngineeringGuides/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
