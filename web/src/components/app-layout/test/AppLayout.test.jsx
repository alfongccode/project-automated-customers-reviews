import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppLayout from '../src/AppLayout';

describe('AppLayout', () => {
  it('should render component', () => {
    const { container } = render(<AppLayout />);
    expect(
      container.querySelector('.app-layout-container')
    ).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<AppLayout />);
    expect(container).toMatchSnapshot();
  });
});
