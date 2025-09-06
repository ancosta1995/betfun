import { createMuiTheme, alpha } from '@material-ui/core/styles';

export const createCustomTheme = (mode) => {
  const isLight = mode === 'light';

  const primaryColor = {
    light: '#7C4DFF',
    main: '#651FFF',
    dark: '#4A148C',
  };

  const secondaryColor = {
    light: '#00E5FF',
    main: '#00B8D4',
    dark: '#0091A7',
  };

  const greyColor = {
    0: isLight ? '#FFFFFF' : '#000000',
    100: isLight ? '#F9FAFB' : '#0A0A0A',
    200: isLight ? '#F3F4F6' : '#111111',
    300: isLight ? '#E5E7EB' : '#171717',
    400: isLight ? '#D1D5DB' : '#1F1F1F',
    500: isLight ? '#9CA3AF' : '#262626',
    600: isLight ? '#6B7280' : '#2E2E2E',
    700: isLight ? '#4B5563' : '#333333',
    800: isLight ? '#1F2937' : '#404040',
    900: isLight ? '#111827' : '#525252',
  };

  const successColor = {
    light: '#00E676',
    main: '#00C853',
    dark: '#00B248',
  };

  const errorColor = {
    light: '#FF5252',
    main: '#FF1744',
    dark: '#D50000',
  };

  const warningColor = {
    light: '#FFD740',
    main: '#FFC400',
    dark: '#FFAB00',
  };

  const infoColor = {
    light: '#40C4FF',
    main: '#00B0FF',
    dark: '#0091EA',
  };

  return createMuiTheme({
    palette: {
      type: mode,
      primary: primaryColor,
      secondary: secondaryColor,
      success: successColor,
      error: errorColor,
      warning: warningColor,
      info: infoColor,
      grey: greyColor,
      background: {
        default: isLight ? greyColor[100] : greyColor[0],
        paper: isLight ? '#FFFFFF' : greyColor[100],
      },
      text: {
        primary: isLight ? greyColor[900] : greyColor[100],
        secondary: isLight ? greyColor[600] : greyColor[500],
      },
      divider: isLight ? greyColor[200] : greyColor[300],
      action: {
        active: isLight ? greyColor[600] : greyColor[500],
        hover: alpha(greyColor[500], 0.08),
        selected: alpha(greyColor[500], 0.16),
        disabled: alpha(greyColor[500], 0.8),
        disabledBackground: alpha(greyColor[500], 0.24),
        focus: alpha(greyColor[500], 0.24),
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      `0px 2px 4px ${alpha(greyColor[900], 0.08)}`,
      `0px 4px 8px ${alpha(greyColor[900], 0.08)}`,
      `0px 6px 12px ${alpha(greyColor[900], 0.08)}`,
      `0px 8px 16px ${alpha(greyColor[900], 0.08)}`,
      `0px 12px 24px ${alpha(greyColor[900], 0.08)}`,
      `0px 16px 32px ${alpha(greyColor[900], 0.08)}`,
      `0px 20px 40px ${alpha(greyColor[900], 0.08)}`,
      `0px 24px 48px ${alpha(greyColor[900], 0.08)}`,
      `0px 28px 56px ${alpha(greyColor[900], 0.08)}`,
      `0px 32px 64px ${alpha(greyColor[900], 0.08)}`,
      `0px 36px 72px ${alpha(greyColor[900], 0.08)}`,
      `0px 40px 80px ${alpha(greyColor[900], 0.08)}`,
      `0px 44px 88px ${alpha(greyColor[900], 0.08)}`,
      `0px 48px 96px ${alpha(greyColor[900], 0.08)}`,
    ],
  });
};

export default createCustomTheme;
