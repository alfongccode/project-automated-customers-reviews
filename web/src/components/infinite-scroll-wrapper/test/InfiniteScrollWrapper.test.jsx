import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InfiniteScrollWrapper from '../src/InfiniteScrollWrapper';

describe('InfiniteScrollWrapper', () => {
  it('should render component', () => {
    const { container } = render(<InfiniteScrollWrapper />);
    expect(
      container.querySelector('.infinite-scroll-wrapper-container')
    ).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<InfiniteScrollWrapper />);
    expect(container).toMatchSnapshot();
  });
});
