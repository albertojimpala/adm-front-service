// APIs del navegador que antd usa y jsdom no implementa
window.matchMedia =
  window.matchMedia ||
  (query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));

window.ResizeObserver =
  window.ResizeObserver ||
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

window.scrollTo = () => {};

// jsdom no implementa URLs de blobs (recibos PDF y logos)
URL.createObjectURL = URL.createObjectURL || (() => 'blob:test');
URL.revokeObjectURL = URL.revokeObjectURL || (() => {});
