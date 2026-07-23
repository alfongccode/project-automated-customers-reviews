import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewsSummaryCard from '../src/ReviewsSummaryCard';

describe('ReviewsSummaryCard', () => {
  it('should render component', () => {
    const { container } = render(<ReviewsSummaryCard />);
    expect(
      container.querySelector('.reviews-summary-card-container')
    ).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<ReviewsSummaryCard />);
    expect(container).toMatchSnapshot();
  });
});
