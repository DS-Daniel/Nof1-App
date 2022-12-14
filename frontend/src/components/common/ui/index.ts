import Divider, { DividerProps } from '@mui/material/Divider';
import { styled } from '@mui/material/styles';

interface MiddleDividerProps extends DividerProps {
	mx?: number | string;
	my?: number;
	mt?: number;
	mb?: number;
}
// custom TableHead component
export const MiddleDivider = styled(Divider, {
	shouldForwardProp: (prop) =>
		prop !== 'mx' && prop !== 'my' && prop !== 'mt' && prop !== 'mb',
})<MiddleDividerProps>(({ mx = '10%', my = 1, mt, mb, theme }) => ({
	marginBottom:
		(mb !== undefined /* allows 0 */ && theme.spacing(mb)) || theme.spacing(my),
	marginTop:
		(mt !== undefined /* allows 0 */ && theme.spacing(mt)) || theme.spacing(my),
	marginLeft: mx,
	marginRight: mx,
}));
