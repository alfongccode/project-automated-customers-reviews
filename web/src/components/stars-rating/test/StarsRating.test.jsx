import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StarsRating from '../src/StarsRating';

describe('StarsRating', () => {
  it('should render component', () => {
    const { container } = render(<StarsRating />);
    expect(
      container.querySelector('.stars-rating-container')
    ).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<StarsRating />);
    expect(container).toMatchSnapshot();
  });
});
