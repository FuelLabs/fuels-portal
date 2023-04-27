/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FUEL_PROVIDER_URL: string;
  readonly VITE_ALCHEMY_ID: string;
  readonly VITE_WALLETCONNECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add script module importing (ECMAScript)
declare module '*?script&module' {
  const src: string;
  export default src;
}

// Add script  importing (CommonJS)
declare module '*?script' {
  const src: string;
  export default src;
}
