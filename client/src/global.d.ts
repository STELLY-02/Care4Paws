// global.d.ts
export {};

declare global {
  interface Window {
    call?: any; // Adjust the type as needed, or use a more specific type than `any`
  }
}