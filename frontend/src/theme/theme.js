import { createTheme } from '@mui/material/styles';

/**
 * Application theme configuration.
 */
const theme = createTheme({
	palette: {
		primary: {
			main: '#F49039',
			// light: '#F8BC88',
			light: '#F7B174',
			// light: '#F6A660',
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
