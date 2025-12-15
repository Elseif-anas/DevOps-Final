import { render, screen } from '@testing-library/react';
import App from './App';

test('renders student management system', () => {
  render(<App />);
  const element = screen.getByText(/Student Management/i);
  expect(element).toBeInTheDocument();
});
