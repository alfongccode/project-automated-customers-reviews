import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewProductCard from '../src/ReviewProductCard';

describe('ReviewProductCard', () => {
  it('should render component', () => {
    const { container } = render(<ReviewProductCard />);
    expect(
      container.querySelector('.review-product-card-container')
    ).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<ReviewProductCard />);
    expect(container).toMatchSnapshot();
  });
});
