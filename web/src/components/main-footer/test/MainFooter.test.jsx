import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MainFooter from '../src/MainFooter';

describe('MainFooter', () => {
  it('should render component', () => {
    const { container } = render(<MainFooter />);
    expect(
      container.querySelector('.main-footer-container')
    ).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<MainFooter />);
    expect(container).toMatchSnapshot();
  });
});
