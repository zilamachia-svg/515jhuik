/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_DISABLE_SWAGGER?: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_SOME_KEY?: string;
  // Mode and PROD are commonly accessed in code — declare them
  readonly MODE?: string;
  readonly PROD?: boolean;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
