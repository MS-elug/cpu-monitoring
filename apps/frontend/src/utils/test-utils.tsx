import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IPreloadedState, storeBuilder } from '../store';

function render(ui: React.ReactElement, { ...renderOptions } = {}, preloadedState: IPreloadedState) {
  const store = storeBuilder(preloadedState);
  function Wrapper({ children }: { children: React.ReactElement }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper as React.ComponentType, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
