import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePluginNode } from 'vite-plugin-node';
import path from 'path';
import { fileURLToPath } from 'url';
import {UserConfig} from 'vite';

export default defineConfig(({ command }) => {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const config: UserConfig = {
        resolve: {
            extensions: ['.ts', '.js', '.json'],
            alias: {
                '@': path.resolve(dirname, 'src'),
            },
        },
        build: {
            ssr: true,
            target: 'esnext',
            outDir: 'dist',
            rollupOptions: {
                input: 'src/server.ts',
                output: {
                    format: 'es',
                    entryFileNames: 'server.js',
                },
            },
        },
        test: {
            globals: true,
            environment: 'node',
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        },
        plugins: [
            tsconfigPaths(),
        ],
        server: {
            port: 5010,
        },
    };

    if (command === 'serve') {
        config.plugins!.push(
            VitePluginNode({
                adapter: 'express',
                appPath: './src/server.ts',
                exportName: 'viteNodeApp',
            })
        );
    }

    return config;
});
