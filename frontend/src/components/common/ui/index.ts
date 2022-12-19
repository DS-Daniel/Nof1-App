import { styled } from '@mui/material/styles';
import Paper, { PaperProps } from '@mui/material/Paper';
import Divider, { DividerProps } from '@mui/material/Divider';
import Typography, { TypographyProps } from '@mui/material/Typography';

// Custom Paper component
export const SectionCard = styled(Paper)<PaperProps>(({ theme }) => ({
	padding: theme.spacing(3),
	width: '100%',
}));
// Custom Paper component
export const FormCard = styled(Paper)<PaperProps>(({ theme }) => ({
	padding: theme.spacing(2),
}));

// custom Divider component, aligning with the middle.
export const MiddleDivider = styled(Divider, {
	shouldForwardProp: (prop) =>
		prop !== 'mx' && prop !== 'my' && prop !== 'mt' && prop !== 'mb',
})<
	DividerProps & {
		mx?: number | string;
		my?: number;
		mt?: number;
		mb?: number;
	}
>(({ mx = '10%', my = 1, mt, mb, theme }) => ({
	marginBottom:
		(mb !== undefined /* allows 0 */ && theme.spacing(mb)) || theme.spacing(my),
	marginTop:
		(mt !== undefined /* allows 0 */ && theme.spacing(mt)) || theme.spacing(my),
	marginLeft: mx,
	marginRight: mx,
}));

// Typography component managing line breaks.
export const TypographyWLineBreak = styled(Typography)<TypographyProps>(() => ({
	whiteSpace: 'pre-line',
}));
