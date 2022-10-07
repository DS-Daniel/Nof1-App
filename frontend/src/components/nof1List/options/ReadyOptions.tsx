import ReadyMenu from '../dropDownMenus/ReadyMenu';
import useTranslation from 'next-translate/useTranslation';
import OptionBtn from './OptionBtn';
import Stack from '@mui/material/Stack';
import DatePicker from '../../common/DatePicker';
import { OptionsProps } from '../Nof1TableItem';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import dayjs from 'dayjs';
import { TestStatus, tokenExpMargin } from '../../../utils/constants';
import {
	sendEmail,
	sendPatientEmail,
	updateNof1Test,
} from '../../../utils/apiCalls';
import { Nof1Test } from '../../../entities/nof1Test';
import FailSnackbar from '../../common/FailSnackbar';
import { useUserContext } from '../../../context/UserContext';
import {
	generateAdministrationSchema,
	generateSequence,
	selectRandomPosology,
	substancesRecap,
} from '../../../utils/nof1-lib/lib';
import { useEmailInfos, usePatientEmailMsg } from '../../../utils/customHooks';
import EmailConfirmDialog from '../EmailConfirmDialog';
import CircularProgress from '@mui/material/CircularProgress';

interface ReadyOptionsProps extends OptionsProps {
	setItem: Dispatch<SetStateAction<Nof1Test>>;
}

/**
 * Component rendering the options for a test with the status ready.
 */
export default function ReadyOptions({ item, setItem }: ReadyOptionsProps) {
	const { t } = useTranslation('nof1List');
	const router = useRouter();
	const { userContext } = useUserContext();
	const [beginningDate, setBeginningDate] = useState<dayjs.Dayjs | null>(null);
	const [sendingEmail, setSendingEmail] = useState(false);
	const [openFailSnackbar, setOpenFailSnackbar] = useState(false);
	const [openEmailDialog, setOpenEmailDialog] = useState(false);
	const [openEmailFailSnackbar, setOpenEmailFailSnackbar] = useState(false);
	const {
		schemaHeaders,
		patientInfos,
		physicianInfos,
		nof1PhysicianInfos,
		msg,
	} = useEmailInfos(item.patient, item.physician, item.nof1Physician);
	const patientEmailMsg = usePatientEmailMsg(
		process.env.NEXT_PUBLIC_APP_URL +
			'patient-data?id=' +
			item.uid! +
			'&token=TOKEN',
		item.nof1Physician.lastname + ' ' + item.nof1Physician.firstname,
		item.nof1Physician.email,
		item.nof1Physician.phone,
	);

	/**
	 * Handle click on the start button, triggering the email confirmation dialog.
	 */
	const handleReady = () => {
		if (beginningDate) {
			setOpenEmailDialog(true);
			setSendingEmail((prevState) => !prevState);
		} else {
			setOpenFailSnackbar(true);
		}
	};

	/**
	 * Trigger the generation of the randomized parameters of the test,
	 * sending the email to the pharmacy and updating the test information.
	 * @param email Pharmacy email address.
	 */
	const updateTestAndSendEmail = async (email: string) => {
		const test = { ...item };
		test.beginningDate = beginningDate!.toDate();
		test.endingDate = beginningDate!
			.add(test.periodLen * test.nbPeriods - 1, 'day')
			.toDate();
		test.selectedPosologies = selectRandomPosology(test.posologies);
		test.substancesSequence = generateSequence(
			test.substances,
			test.randomization,
			test.nbPeriods,
		);
		test.administrationSchema = generateAdministrationSchema(
			test.substances,
			test.substancesSequence,
			test.selectedPosologies,
			test.beginningDate!,
			test.periodLen,
			test.nbPeriods,
		);
		test.status = TestStatus.Ongoing;
		test.meta_info!.emailSendingDate = new Date();
		test.pharmaEmail = email;

		const response = await sendEmail(
			userContext.access_token,
			{
				patientInfos,
				physicianInfos,
				nof1PhysicianInfos,
				schemaHeaders,
				schema: test.administrationSchema,
				substancesRecap: substancesRecap(
					test.substances,
					test.administrationSchema,
					t('common:sub-recap.qty'),
					t('common:sub-recap.dose'),
				),
			},
			msg,
			email,
		);

		const tokenExp =
			dayjs(test.endingDate).diff(beginningDate, 'day') + 1 + tokenExpMargin;
		const res = await sendPatientEmail(
			userContext.access_token,
			patientEmailMsg,
			test.patient.email,
			`${tokenExp} days`,
		);
		console.log('patient email success:', res.success);
		// TODO manage patient email failure ?

		if (response.success && res.success) {
			updateNof1Test(userContext.access_token, test.uid!, test);
			setItem(test); // update display
		} else {
			setOpenEmailFailSnackbar(true);
			setSendingEmail((prevState) => !prevState);
		}
	};

	/**
	 * Handle click on the edit button.
	 */
	const handleEdit = () => {
		router.push({
			pathname: '/create-test',
			query: { id: item.uid, edit: true },
		});
	};

	return (
		<>
			<Stack
				direction="row"
				justifyContent="flex-end"
				alignItems="center"
				spacing={2}
			>
				<DatePicker value={beginningDate} setValue={setBeginningDate} />
				{sendingEmail ? (
					<OptionBtn variant="contained" disabled>
						<CircularProgress size="2em" />
					</OptionBtn>
				) : (
					<OptionBtn variant="contained" onClick={handleReady}>
						{t('btnStatus.ready')}
					</OptionBtn>
				)}
			</Stack>
			<Stack
				direction="row"
				justifyContent="flex-end"
				alignItems="center"
				spacing={2}
			>
				<OptionBtn variant="outlined" onClick={handleEdit}>
					{t('btn.edit')}
				</OptionBtn>
				<ReadyMenu item={item} />
			</Stack>
			<FailSnackbar
				open={openFailSnackbar}
				setOpen={setOpenFailSnackbar}
				msg={t('alert-date')}
			/>
			<FailSnackbar
				open={openEmailFailSnackbar}
				setOpen={setOpenEmailFailSnackbar}
				msg={t('alert-email')}
			/>
			<EmailConfirmDialog
				open={openEmailDialog}
				handleClose={() => setOpenEmailDialog(false)}
				handleDialogSubmit={(email) => updateTestAndSendEmail(email)}
				pharmaEmail={item.pharmaEmail}
			/>
		</>
	);
}
