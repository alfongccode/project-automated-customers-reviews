import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KarmaBar from '../src/KarmaBar';

describe('KarmaBar', () => {
  it('should render component', () => {
    const { container } = render(<KarmaBar />);
    expect(container.querySelector('.karma-bar-container')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<KarmaBar />);
    expect(container).toMatchSnapshot();
  });
});
