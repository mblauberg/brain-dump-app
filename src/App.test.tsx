import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

test('renders Brain Organiser app without crashing', () => {
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});
