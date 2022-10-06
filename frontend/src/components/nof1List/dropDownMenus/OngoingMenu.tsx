import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { Nof1Test } from '../../../entities/nof1Test';
import MenuContainer from '../../common/MenuContainer';
import RecapModal from '../recapModal';
import HealthLogbookModal from '../healthLogbookModal';
import { useEmailInfos } from '../../../utils/customHooks';
import { sendEmail } from '../../../utils/apiCalls';
import { useUserContext } from '../../../context/UserContext';
import { substancesRecap } from '../../../utils/nof1-lib/lib';
import SuccessSnackbar from '../../common/SuccessSnackbar';
import FailSnackbar from '../../common/FailSnackbar';

interface OngoingMenuProps {
	item: Nof1Test;
}

/**
 * Options menu for a test with the status ongoing.
 */
export default function OngoingMenu({ item }: OngoingMenuProps) {
	const { t } = useTranslation('nof1List');
	const { userContext } = useUserContext();
	const [openRecapModal, setOpenRecapModal] = useState(false);
	const [openLogbookModal, setOpenLogbookModal] = useState(false);
	const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
	const [openEmailFailSnackbar, setOpenEmailFailSnackbar] = useState(false);
	const {
		schemaHeaders,
		patientInfos,
		physicianInfos,
		nof1PhysicianInfos,
		msg,
	} = useEmailInfos(item.patient, item.physician, item.nof1Physician);

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
			name: t('menu.sendEmail'),
			callback: async () => {
				const response = await sendEmail(
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
					item.pharmaEmail,
				);
				if (response.success) {
					setOpenSuccessSnackbar(true);
				} else {
					setOpenEmailFailSnackbar(true);
				}
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
			<SuccessSnackbar
				open={openSuccessSnackbar}
				setOpen={setOpenSuccessSnackbar}
				msg={t('email-sent')}
			/>
			<FailSnackbar
				open={openEmailFailSnackbar}
				setOpen={setOpenEmailFailSnackbar}
				msg={t('alert-email')}
			/>
		</div>
	);
}
