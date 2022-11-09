import { useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import useTranslation from 'next-translate/useTranslation';
import { Nof1Test } from '../../../entities/nof1Test';
import { TestData } from '../../../entities/nof1Data';
import { useReactToPrint } from 'react-to-print';
import ReportToPrint from './ReportToPrint';

interface MedicalReportModalProps {
	open: boolean;
	handleClose: () => void;
	item: Nof1Test;
	testData: TestData;
}

/**
 * Health logbook modal component.
 */
export default function MedicalReportModal({
	open,
	handleClose,
	item,
	testData,
}: MedicalReportModalProps) {
	const { t } = useTranslation('common');
	const componentRef = useRef(null);

	/**
	 * Triggers the opening of the browser's print console.
	 */
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	return (
		<Dialog
			fullScreen
			open={open}
			onClose={handleClose}
			// fullWidth
			// maxWidth={'md'}
		>
			<AppBar sx={{ position: 'relative' }}>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						onClick={handleClose}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>
					<Typography variant="h6" component="div" ml={1} sx={{ flexGrow: 1 }}>
						{t('button.close')}
					</Typography>
					<Stack direction="row" alignItems="center" spacing={2} paddingY={0}>
						<Button variant="contained" color="invert" onClick={handlePrint}>
							{t('print.btn')}
						</Button>
						<Typography variant="body2" fontStyle="italic" sx={{ width: 400 }}>
							{t('print.warning')}
						</Typography>
					</Stack>
				</Toolbar>
			</AppBar>
			<DialogContent sx={{ bgcolor: 'background.default' }}>
				<Paper
					sx={{
						width: '210mm',
						minHeight: '297mm',
						paddingX: '15mm',
						paddingY: '18mm',
						marginX: 'auto',
					}}
				>
					<ReportToPrint ref={componentRef} test={item} testData={testData} />
				</Paper>
			</DialogContent>
		</Dialog>
	);
}
