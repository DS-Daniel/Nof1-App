import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { emailRegex } from '../../utils/constants';

interface Props {
	open: boolean;
	handleClose: () => void;
	handleDialogSubmit: (email: string) => void;
	pharmaEmail: string;
}

/**
 * Dialog component asking the user to confirm the email of the pharmacy.
 */
export default function EmailConfirmDialog({
	open,
	handleClose,
	handleDialogSubmit,
	pharmaEmail,
}: Props) {
	const { t } = useTranslation('nof1List');
	const [value, setValue] = useState(pharmaEmail);
	const [error, setError] = useState(false);

	/**
	 * Handle the submit action of the dialog button. It triggers the parent action.
	 */
	const handleSend = () => {
		const validInput = emailRegex.test(value);
		if (validInput) {
			handleDialogSubmit(value);
			handleClose();
		} else {
			setError(true);
		}
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle variant="body1">{t('email-confirm')}</DialogTitle>
			<DialogContent>
				<Box mt={1}>
					<TextField
						fullWidth
						autoFocus
						id="pharmaEmail"
						label={t('common:form.email')}
						value={value}
						onChange={(e) => setValue(e.target.value)}
						error={error}
						helperText={error && t('common:formErrors.emailInvalid')}
					></TextField>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>{t('common:button.cancel')}</Button>
				<Button onClick={handleSend}>{t('menu.sendEmail')}</Button>
			</DialogActions>
		</Dialog>
	);
}
