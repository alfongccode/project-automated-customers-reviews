import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewForm from '../src/ReviewForm';

describe('ReviewForm', () => {
  it('should render component', () => {
    const { container } = render(<ReviewForm />);
    expect(container.querySelector('.review-form-container')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<ReviewForm />);
    expect(container).toMatchSnapshot();
  });
});