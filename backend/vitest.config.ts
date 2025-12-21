import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
    test: {
        include: ['game-service/src/tests/**/*.test.ts'],
        env: {},
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'game-service/src'),
        },
    },
})