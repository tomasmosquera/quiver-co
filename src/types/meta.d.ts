export {};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: Window["fbq"];
    __metaPixelReady?: boolean;
    __metaPixelQueue?: Array<() => void>;
  }
}
