export const baseTsupConfig = {
  entry: ['./src/index.ts'],
  outDir: './dist',
  format: 'esm' as any,
  sourcemap: true,
  clean: true,
  bundle: true,
  dts: true
}

export const baseVitestConfig = {
  test: {
    environment: 'happy-dom',
    globals: true,
    testTimeout: 30000
  }
}
