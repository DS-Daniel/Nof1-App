import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { Nof1Test } from '../../../entities/nof1Test';
import MenuContainer from '../../common/MenuContainer';
import RecapModal from '../recapModal';
import DeleteDialog from './DeleteDialog';
import { usePharmaEmailInfos } from '../../../utils/customHooks';
import EmailConfirmDialog from '../EmailConfirmDialog';
import { sendPharmaEmail, updateNof1Test } from '../../../utils/apiCalls';
import { substancesRecap } from '../../../utils/nof1-lib/lib';
import { useUserContext } from '../../../context/UserContext';
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
	const [openRecapModal, setOpenRecapModal] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openPharmaEmailDialog, setOpenPharmaEmailDialog] = useState(false);
	const [openEmailSuccessSB, setOpenEmailSuccessSB] = useState(false);
	const [openEmailFailSB, setOpenEmailFailSB] = useState(false);

	const {
		schemaHeaders,
		patientInfos,
		physicianInfos,
		nof1PhysicianInfos,
		msg,
	} = usePharmaEmailInfos(item.patient, item.physician, item.nof1Physician);

	const menuItems = [
		{
			name: t('menu.parameters'),
			callback: () => {
				setOpenRecapModal(true);
			},
		},
		{
			name: t('menu.send-email-pharma'),
			callback: async () => {
				setOpenPharmaEmailDialog(true);
			},
		},
		{
			name: t('menu.delete-test'),
			color: 'red',
			callback: () => {
				setOpenDeleteDialog(true);
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
		if (email !== item.pharmaEmail) {
			updateNof1Test(userContext.access_token, item.uid!, {
				pharmaEmail: email,
			});
		}
		const response = await sendPharmaEmail(
			userContext.access_token,
			{
				patientInfos,
				physicianInfos,
				nof1PhysicianInfos,
				schemaHeaders,
				schema: item.administrationSchema!,
				substancesRecap: substancesRecap(
					item.substances,
					item.administrationSchema!,
					t('common:sub-recap.qty'),
					t('common:sub-recap.dose'),
				),
			},
			msg,
			email,
			t('mail:pharma.subject'),
		);
		if (response.success) {
			setOpenEmailSuccessSB(true);
		} else {
			setOpenEmailFailSB(true);
		}
	};

	return (
		<div>
			<MenuContainer name={t('optionsMenu')} items={menuItems} btnSize={180} />
			<RecapModal
				open={openRecapModal}
				setOpen={setOpenRecapModal}
				item={item}
			/>
			<EmailConfirmDialog
				open={openPharmaEmailDialog}
				handleClose={() => setOpenPharmaEmailDialog(false)}
				handleDialogSubmit={(email) => sendPharmaEmailCB(email)}
				email={item.pharmaEmail}
			/>
			<DeleteDialog
				open={openDeleteDialog}
				handleClose={() => setOpenDeleteDialog(false)}
				testId={item.uid!}
			/>
			<SuccessSnackbar
				open={openEmailSuccessSB}
				setOpen={setOpenEmailSuccessSB}
				msg={t('email-sent')}
			/>
			<FailSnackbar
				open={openEmailFailSB}
				setOpen={setOpenEmailFailSB}
				msg={t('alert-email')}
			/>
		</div>
	);
}
