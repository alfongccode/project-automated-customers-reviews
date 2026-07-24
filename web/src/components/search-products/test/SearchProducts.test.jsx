import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchProducts from '../src/SearchProducts';

describe('SearchProducts', () => {
  it('should render component', () => {
    const { container } = render(<SearchProducts />);
    expect(
      container.querySelector('.search-products-container')
    ).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<SearchProducts />);
    expect(container).toMatchSnapshot();
  });
});
