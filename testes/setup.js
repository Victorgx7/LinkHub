import '@testing-library/jest-dom';

const armazenamentoMemoria = {};

const mockLocalStorage = {
  getItem: (chave) => armazenamentoMemoria[chave] || null,
  setItem: (chave, valor) => {
    armazenamentoMemoria[chave] = String(valor);
  },
  removeItem: (chave) => {
    delete armazenamentoMemoria[chave];
  },
  clear: () => {
    for (const chave in armazenamentoMemoria) {
      delete armazenamentoMemoria[chave];
    }
  },
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});
