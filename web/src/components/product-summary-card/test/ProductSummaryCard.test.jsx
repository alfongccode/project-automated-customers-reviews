import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductSummaryCard from '../src/ProductSummaryCard';

describe('ProductSummaryCard', () => {
  it('should render component', () => {
    const { container } = render(<ProductSummaryCard />);
    expect(
      container.querySelector('.product-summary-card-container')
    ).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<ProductSummaryCard />);
    expect(container).toMatchSnapshot();
  });
});
