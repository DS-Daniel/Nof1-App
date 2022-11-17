import { useState } from 'react';
import { useUserContext } from '../../../context/UserContext';
import useTranslation from 'next-translate/useTranslation';
import MenuContainer from './MenuContainer';
import EmailConfirmDialog from '../EmailConfirmDialog';
import { Nof1Test } from '../../../entities/nof1Test';
import { usePharmaEmailInfos } from '../../../utils/customHooks';
import { sendPharmaEmailWrapper } from '../../../utils/nof1-lib/lib';
import { updateNof1Test } from '../../../utils/apiCalls';
import SuccessSnackbar from '../../common/SuccessSnackbar';
import FailSnackbar from '../../common/FailSnackbar';

interface ReadyMenuProps {
	item: Nof1Test;
}

/**
 * Options menu for a test with the status ready.
 */
export default function ReadyMenu({ item }: ReadyMenuProps) {
	const { t } = useTranslation('nof1List');
	const { userContext } = useUserContext();
	const [openPharmaEmailDialog, setOpenPharmaEmailDialog] = useState(false);
	const [openEmailSuccessSB, setOpenEmailSuccessSB] = useState(false);
	const [openEmailFailSB, setOpenEmailFailSB] = useState(false);
	const {
		schemaHeaders,
		patientInfos,
		physicianInfos,
		nof1PhysicianInfos,
		msg,
		recapTxt,
		comments,
		emailSubject,
	} = usePharmaEmailInfos(item.patient, item.physician, item.nof1Physician);

	const menuItems = [
		{
			name: t('menu.send-email-pharma'),
			callback: async () => {
				setOpenPharmaEmailDialog(true);
			},
		},
	];

	/**
	 * Sends the email, containing the N-of-1 test preparation information,
	 * to the specified pharmacy's email. Update the email if necessary.
	 * @param email Patient email.
	 */
	const sendPharmaEmailCB = async (email: string) => {
		// update email if different
		if (email !== item.pharmacy.email) {
			updateNof1Test(userContext.access_token, item.uid!, {
				pharmacy: { ...item.pharmacy, email: email },
			});
		}

		const response = await sendPharmaEmailWrapper(
			item,
			userContext.access_token,
			patientInfos,
			physicianInfos,
			nof1PhysicianInfos,
			schemaHeaders,
			comments,
			recapTxt,
			[t('common:xlsx.decreasing-dosage-info')],
			msg,
			emailSubject,
		);

		if (response.success) {
			setOpenEmailSuccessSB(true);
		} else {
			setOpenEmailFailSB(true);
		}
	};

	return (
		<>
			<MenuContainer name={t('optionsMenu')} items={menuItems} test={item} />
			<EmailConfirmDialog
				open={openPharmaEmailDialog}
				handleClose={() => setOpenPharmaEmailDialog(false)}
				handleDialogSubmit={(email) => sendPharmaEmailCB(email)}
				email={item.pharmacy.email}
			/>
			<SuccessSnackbar
				open={openEmailSuccessSB}
				setOpen={setOpenEmailSuccessSB}
				msg={t('email.sent')}
			/>
			<FailSnackbar
				open={openEmailFailSB}
				setOpen={setOpenEmailFailSB}
				msg={t('alert.email')}
			/>
		</>
	);
}
