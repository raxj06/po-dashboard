/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WEBHOOK_URL: string;
    readonly VITE_GRN_WEBHOOK_URL: string;
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Image file type declarations
declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.jpeg' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    const src: string;
    export default src;
}
