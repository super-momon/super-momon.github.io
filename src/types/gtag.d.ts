declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    FontAwesome?: {
      dom: {
        i2svg: () => void;
      };
    };
  }
}

export {};
