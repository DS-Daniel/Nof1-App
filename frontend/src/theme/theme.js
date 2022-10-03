import { createTheme } from '@mui/material/styles';

/**
 * Application theme configuration.
 */
const theme = createTheme({
	palette: {
		primary: {
			main: '#F49039',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#399DF4',
			contrastText: '#ffffff',
		},
		background: {
			default: '#F5F5F5',
		},
	},
});

export default theme;
