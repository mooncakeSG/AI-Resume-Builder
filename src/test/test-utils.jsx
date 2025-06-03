import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock toast provider
const MockToastProvider = ({ children }) => {
  return <div data-testid="toast-provider">{children}</div>;
};

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <MockToastProvider>
        {children}
      </MockToastProvider>
    </BrowserRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render }; 