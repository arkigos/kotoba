import { render, screen } from '@testing-library/react';
import App from './App';

// The default test created by Create React App looked for a "learn react" link,
// but our application renders a loading state while data is fetched. Update the
// test to reflect the current behaviour of the App component.
test('renders initial loading state', () => {
  render(<App />);
  const loadingElement = screen.getByText(/Loading.../i);
  expect(loadingElement).toBeInTheDocument();
});
