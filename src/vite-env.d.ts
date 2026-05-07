/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION?: string;
  readonly VITE_GIT_COMMIT?: string;
  readonly VITE_GITHUB_OWNER?: string;
  readonly VITE_GITHUB_REPO?: string;
  readonly VITE_REPOSITORY_URL?: string;
  readonly VITE_PAYPAL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
