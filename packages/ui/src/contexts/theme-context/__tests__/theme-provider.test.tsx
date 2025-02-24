import { siteTheme } from '@chirpy-dev/utils/src/colors/site-theme';
import { cleanup, render, screen } from '@testing-library/react';

import { WidgetThemeProvider, useWidgetTheme, SiteThemeProvider } from '..';

describe('ThemeProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
    return cleanup();
  });

  it('should render the default theme', async () => {
    render(
      <WidgetThemeProvider>
        <MockChild />
      </WidgetThemeProvider>,
    );
    expect(setTheme).toHaveBeenCalledWith(siteTheme);
  });

  it('should render the default site theme', async () => {
    render(
      <SiteThemeProvider>
        <MockSiteChild />
      </SiteThemeProvider>,
    );
    expect(screen.getByLabelText(siteLabel)).toBeInTheDocument();
  });
});

const setTheme = jest.fn();

function MockChild() {
  const { siteTheme: defaultTheme } = useWidgetTheme();
  setTheme(defaultTheme);
  return <div>children</div>;
}
const siteLabel = 'site-theme-child';
function MockSiteChild() {
  return <div aria-label={siteLabel}>site them child</div>;
}
