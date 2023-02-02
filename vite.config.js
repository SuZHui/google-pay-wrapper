/** @type {import('vite').UserConfig} */
export default {
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'GooglePay',
      formats: ['es'],
      fileName: 'output.js',
    },
  },
};
