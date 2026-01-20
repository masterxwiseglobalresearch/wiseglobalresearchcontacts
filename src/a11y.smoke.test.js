import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';

import App from './App';

expect.extend(toHaveNoViolations);

// Increase timeout for Suspense/lazy loads
jest.setTimeout(15000);

// JSDOM polyfills / mocks
beforeAll(() => {
  // scrollTo not implemented in jsdom
  window.scrollTo = window.scrollTo || (() => {});
});

// Mock heavy or timing-based components to keep the smoke test fast and stable
jest.mock('./components/ChatWidget', () => () => null);
jest.mock('./components/FloatingPayButton', () => () => null);
jest.mock('./components/WhatsAppButton', () => () => null);
jest.mock('aos', () => ({ init: () => {} }));

test('home route has no obvious a11y violations', async () => {
  const { container } = render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
