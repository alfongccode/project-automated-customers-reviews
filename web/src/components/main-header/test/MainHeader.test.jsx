import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MainHeader from '../src/MainHeader';

describe('MainHeader', () => {
  it('should render component', () => {
    const { container } = render(<MainHeader />);
    expect(
      container.querySelector('.main-header-container')
    ).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<MainHeader />);
    expect(container).toMatchSnapshot();
  });
});
