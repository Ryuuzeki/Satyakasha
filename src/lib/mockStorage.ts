// Eksekusi sisi-klien untuk mengelabui browser agresif (seperti saat via 192.168.x.x)
if (typeof window !== 'undefined') {
  try {
    const _ = window.localStorage;
  } catch (err) {
    console.warn("localStorage diblokir. Menyuntikkan MockStorage...");
    try {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
          length: 0,
          key: () => null,
        },
        writable: true,
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      console.warn("Gagal menyuntikkan MockStorage.");
    }
  }
}
