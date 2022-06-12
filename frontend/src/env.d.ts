/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV: string,
  readonly VITE_USER_EMAIL: string
  readonly VITE_ROOT_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
