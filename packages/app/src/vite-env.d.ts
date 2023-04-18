/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FUEL_PROVIDER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
