import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { Nof1Test } from '../../../entities/nof1Test';
import MenuContainer from '../../common/MenuContainer';
import RecapModal from '../recapModal';
import HealthLogbookModal from '../healthLogbookModal';
import { useEmailInfos, usePatientEmailMsg } from '../../../utils/customHooks';
import {
	sendPatientEmail,
	sendPharmaEmail,
	updateNof1Test,
} from '../../../utils/apiCalls';
import { useUserContext } from '../../../context/UserContext';
import { substancesRecap } from '../../../utils/nof1-lib/lib';
import SuccessSnackbar from '../../common/SuccessSnackbar';
import FailSnackbar from '../../common/FailSnackbar';
import EmailConfirmDialog from '../EmailConfirmDialog';
import { tokenExpMargin } from '../../../utils/constants';
import dayjs from 'dayjs';

interface OngoingMenuProps {
	item: Nof1Test;
}

/**
 * Options menu for a test with the status ongoing.
 */
export default function OngoingMenu({ item }: OngoingMenuProps) {
	const { t, lang } = useTranslation('nof1List');
	const { userContext } = useUserContext();
	const [openRecapModal, setOpenRecapModal] = useState(false);
	const [openLogbookModal, setOpenLogbookModal] = useState(false);
	const [openPharmaEmailDialog, setOpenPharmaEmailDialog] = useState(false);
	const [openPatientEmailDialog, setOpenPatientEmailDialog] = useState(false);
	const [openEmailSuccessSB, setOpenEmailSuccessSB] = useState(false);
	const [openEmailFailSB, setOpenEmailFailSB] = useState(false);
	const {
		schemaHeaders,
		patientInfos,
		physicianInfos,
		nof1PhysicianInfos,
		msg,
	} = useEmailInfos(item.patient, item.physician, item.nof1Physician);
	const patientEmailMsg = usePatientEmailMsg(
		`${
			process.env.NEXT_PUBLIC_APP_URL
		}${lang}/import-data/patient?id=${item.uid!}&token=TOKEN`,
		item.nof1Physician,
		dayjs(item.beginningDate).toDate().toLocaleDateString(),
		dayjs(item.endingDate)
			.add(tokenExpMargin, 'day')
			.toDate()
			.toLocaleDateString(),
	);

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
		);
		if (response.success) {
			setOpenEmailSuccessSB(true);
		} else {
			setOpenEmailFailSB(true);
		}
	};

	/**
	 * Sends the email, containing the link to the data import page,
	 * to the specified patient's email. Update the email if necessary.
	 * @param email Patient email.
	 */
	const sendPatientEmailCB = async (email: string) => {
		// update email if different
		if (email !== item.patient.email) {
			updateNof1Test(userContext.access_token, item.uid!, {
				patient: { ...item.patient, email },
			});
		}

		// re-calculate the right expiration starting date, if an email is sent afterward.
		const startExp = dayjs().isAfter(dayjs(item.beginningDate))
			? dayjs()
			: dayjs(item.beginningDate);
		const tokenExp =
			dayjs(item.endingDate).diff(startExp, 'day') + 1 + tokenExpMargin;
		const notBefore = dayjs(item.beginningDate).diff(dayjs(), 'day') + 1;
		const response = await sendPatientEmail(
			userContext.access_token,
			patientEmailMsg,
			email,
			`${tokenExp} days`,
			`${notBefore} days`,
		);
		console.log('begin:', dayjs(item.beginningDate).toDate().toLocaleDateString());
		console.log('now:', dayjs().toDate().toLocaleDateString());
		console.log('notBefore:', notBefore);
		console.log('exp:', tokenExp);

		if (response.success) {
			setOpenEmailSuccessSB(true);
		} else {
			setOpenEmailFailSB(true);
		}
	};

	const menuItems = [
		{
			name: t('menu.parameters'),
			callback: () => {
				setOpenRecapModal(true);
			},
		},
		{
			name: t('menu.varBooklet'),
			callback: () => {
				setOpenLogbookModal(true);
			},
		},
		{
			name: t('menu.sendEmailPharma'),
			callback: async () => {
				setOpenPharmaEmailDialog(true);
			},
		},
		{
			name: t('menu.sendEmailPatient'),
			callback: async () => {
				setOpenPatientEmailDialog(true);
			},
		},
	];

	return (
		<div>
			<MenuContainer name={t('optionsMenu')} items={menuItems} btnSize={180} />
			<RecapModal
				open={openRecapModal}
				setOpen={setOpenRecapModal}
				item={item}
			/>
			<HealthLogbookModal
				open={openLogbookModal}
				handleClose={() => setOpenLogbookModal(false)}
				item={item}
			/>
			<EmailConfirmDialog
				open={openPharmaEmailDialog}
				handleClose={() => setOpenPharmaEmailDialog(false)}
				handleDialogSubmit={(email) => sendPharmaEmailCB(email)}
				email={item.pharmaEmail}
			/>
			<EmailConfirmDialog
				open={openPatientEmailDialog}
				handleClose={() => setOpenPatientEmailDialog(false)}
				handleDialogSubmit={(email) => sendPatientEmailCB(email)}
				email={item.patient.email}
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
