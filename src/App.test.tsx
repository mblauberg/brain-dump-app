import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ADHD Brain Organiser app', () => {
  render(<App />);
  const headerElements = screen.getAllByText(/ADHD Brain Organiser/i);
  expect(headerElements[0]).toBeInTheDocument();
});
