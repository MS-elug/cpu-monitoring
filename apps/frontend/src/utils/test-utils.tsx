import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Store } from '@reduxjs/toolkit';

function render(ui: React.ReactElement, store: Store, { ...renderOptions } = {}) {
  function Wrapper({ children }: { children: React.ReactElement }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper as React.ComponentType, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
