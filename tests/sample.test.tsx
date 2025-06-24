import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import HomePage from '../src/pages/index';

test('renders header', () => {
  const { getByText } = render(<HomePage />);
  expect(getByText('Open Game Data')).toBeInTheDocument();
});
