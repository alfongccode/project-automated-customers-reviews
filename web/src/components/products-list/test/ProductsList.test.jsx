import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductsList from '../src/ProductsList';

describe('ProductsList', () => {
  it('should render component', () => {
    const { container } = render(<ProductsList />);
    expect(
      container.querySelector('.products-list-container')
    ).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<ProductsList />);
    expect(container).toMatchSnapshot();
  });
});
