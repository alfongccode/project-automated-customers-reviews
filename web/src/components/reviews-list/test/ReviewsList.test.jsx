import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewsList from '../src/ReviewsList';

describe('ReviewsList', () => {
  it('should render component', () => {
    const { container } = render(<ReviewsList />);
    expect(
      container.querySelector('.reviews-list-container')
    ).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<ReviewsList />);
    expect(container).toMatchSnapshot();
  });
});
