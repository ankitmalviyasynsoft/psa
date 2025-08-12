import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { ThemeOptions } from '@mui/material/styles'
import { Outfit } from '@next/font/google'

const outfit = Outfit({ subsets: ['latin'] })

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#999999',
    },
    background: {
      default: '#ffffff',
      paper: '#fafaff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },

  typography: {
    fontFamily: outfit.style.fontFamily,
    // Headings with larger font sizes
    h1: {
      fontSize: '3rem',
      lineHeight: 1.2,
      fontWeight: 600,
      '@media (max-width:600px)': {
        fontSize: '2rem',
        lineHeight: 1.3,
      },
    },
    h2: {
      fontSize: '2.5rem',
      lineHeight: 1.3,
      fontWeight: 600,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
        lineHeight: 1.4,
      },
    },
    h3: {
      fontSize: '2rem',
      lineHeight: 1.3,
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
    },
    h4: {
      fontSize: '1.75rem',
      lineHeight: 1.4,
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1.375rem',
        lineHeight: 1.5,
      },
    },
    h5: {
      fontSize: '1.5rem',
      lineHeight: 1.5,
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
        lineHeight: 1.6,
      },
    },
    h6: {
      fontSize: '1.25rem',
      lineHeight: 1.5,
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
    },

    // Body text
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 400,
      '@media (max-width:600px)': {
        fontSize: '0.75rem',
        lineHeight: 1.4,
      },
    },

    // Subtitle
    subtitle1: {
      fontSize: '1.125rem',
      lineHeight: 1.5,
      fontWeight: 400,
      '@media (max-width:600px)': {
        fontSize: '1rem',
        lineHeight: 1.4,
      },
    },
    subtitle2: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 400,
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
        lineHeight: 1.4,
      },
    },

    // Caption
    caption: {
      fontSize: '0.875rem',
      lineHeight: 1.35,
      fontWeight: 400,
      '@media (max-width:600px)': {
        fontSize: '0.75rem',
        lineHeight: 1.3,
      },
    },

    // Button text
    button: {
      fontSize: '1rem',
      lineHeight: 1.75,
      fontWeight: 500,
      textTransform: 'uppercase',
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
    },
  },

  components: {
    MuiButton: {
      defaultProps: {
        size: 'large',
      },
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          borderRadius: 8,
          height: 48,
        },
      },
      variants: [
        {
          props: { variant: 'gradient' },
          style: {
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            border: 0,
            borderRadius: 8,
            color: 'white',
            height: 48,
            padding: '0 30px',
          },
        },
      ],
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            height: 48,
            input: {
              display: 'flex',
              alignItems: 'center',
              padding: '0px 14px',
              flexWrap: 'wrap',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 48,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          width: 'auto',
          height: '100%',
          minHeight: 48,
        },
      },
    },
  },
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    gradient: true
  }
}

let theme = createTheme(themeOptions)
theme = responsiveFontSizes(theme)

export default theme
