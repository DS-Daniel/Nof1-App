import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import useTranslation from 'next-translate/useTranslation';
import { HealthLogbook } from '../../healthLogbook';
import { Nof1Test } from '../../../entities/nof1Test';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Typography from '@mui/material/Typography';

interface HealthLogbookModalProps {
	open: boolean;
	handleClose: () => void;
	item: Nof1Test;
}

/**
 * Health logbook modal component.
 */
export default function HealthLogbookModal({
	open,
	handleClose,
	item,
}: HealthLogbookModalProps) {
	const { t } = useTranslation('common');
	const componentRef = useRef(null);

	/**
	 * Triggers the opening of the browser's print console.
	 */
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	return (
		<Dialog open={open} onClose={handleClose} fullWidth maxWidth={'md'}>
			<DialogContent>
				<Button onClick={handlePrint}>{t('print.btn')}</Button>
				<Typography variant="body2" fontStyle="italic">
					{t('print.warning')}
				</Typography>
				<HealthLogbook ref={componentRef} test={item} />
			</DialogContent>
		</Dialog>
	);
}
