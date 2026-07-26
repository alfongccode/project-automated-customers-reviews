import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoadingSpinner from '../src/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render component', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.pfl-overlay')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container).toMatchSnapshot();
  });
});
