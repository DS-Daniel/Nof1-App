import { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { useUserContext } from '../../../context/UserContext';
import { Nof1Test, TestStatus } from '../../../entities/nof1Test';
import { sendPharmaEmail, updateNof1Test } from '../../../utils/apiCalls';
import {
	generateAdministrationSchema,
	generateSequence,
	selectRandomPosology,
	substancesRecap,
} from '../../../utils/nof1-lib/lib';
import { usePharmaEmailInfos } from '../../../utils/customHooks';
import OptionBtn from './OptionBtn';
import { OptionsProps } from '../Nof1TableItem';
import EmailConfirmDialog from '../EmailConfirmDialog';
import PreparationMenu from '../dropDownMenus/PreparationMenu';
import FailSnackbar from '../../common/FailSnackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface PreparationOptionsProps extends OptionsProps {
	setItem: Dispatch<SetStateAction<Nof1Test>>;
}

/**
 * Component rendering the options for a test with the status ready.
 */
export default function PreparationOptions({
	item,
	setItem,
}: PreparationOptionsProps) {
	const { t } = useTranslation('nof1List');
	const router = useRouter();
	const { userContext } = useUserContext();
	const [sendingEmail, setSendingEmail] = useState(false);
	const [openEmailDialog, setOpenEmailDialog] = useState(false);
	const [openEmailFailSB, setOpenEmailFailSB] = useState(false);
	const {
		schemaHeaders,
		patientInfos,
		physicianInfos,
		nof1PhysicianInfos,
		msg,
	} = usePharmaEmailInfos(item.patient, item.physician, item.nof1Physician);

	/**
	 * Triggers the generation of the randomized parameters of the test.
	 * @param email Confirmed pharmacy email address.
	 * @returns The updated test.
	 */
	const updateTest = (email: string) => {
		const test = { ...item };
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
			test.periodLen,
			test.nbPeriods,
		);
		test.pharmacy.email = email;
		return test;
	};

	/**
	 * Sends an email to the pharmacy and updates the test's information.
	 * @param test N-of-1 test information.
	 */
	const sendEmail = async (test: Nof1Test) => {
		const response = await sendPharmaEmail(
			userContext.access_token,
			{
				patientInfos,
				physicianInfos,
				nof1PhysicianInfos,
				schemaHeaders,
				schema: test.administrationSchema!,
				substancesRecap: substancesRecap(
					test.substances,
					test.administrationSchema!,
					t('common:sub-recap.qty'),
					t('common:sub-recap.dose'),
				),
			},
			msg,
			test.pharmacy.email,
			t('mail:pharma.subject'),
		);

		if (response.success) {
			test.meta_info!.emailSendingDate = new Date();
			test.status = TestStatus.Ready;
			updateNof1Test(userContext.access_token, test.uid!, test);
			setItem(test); // update display
		} else {
			setOpenEmailFailSB(true);
		}
		setSendingEmail((prevState) => !prevState);
	};

	/**
	 * Handles click on the edit button.
	 */
	const handleEdit = () => {
		router.push({
			pathname: '/create-test',
			query: { id: item.uid, edit: true },
		});
	};

	/**
	 * Handles the submission of the email confirmation dialog.
   * Updates the test information and sends the email to the pharmacy.
	 * @email Confirmed email.
	 */
	const handleEmailDialogSubmit = (email: string) => {
		setSendingEmail((prevState) => !prevState);
		const test = updateTest(email);
		sendEmail(test);
	};

	return (
		<>
			{sendingEmail ? (
				<OptionBtn variant="contained" disabled>
					<CircularProgress size="2em" />
				</OptionBtn>
			) : (
				<Button
					variant="contained"
					sx={{ width: 250 }}
					onClick={() => setOpenEmailDialog(true)}
				>
					{t('btnStatus.preparation')}
				</Button>
			)}
			<Stack
				direction="row"
				justifyContent="flex-end"
				alignItems="center"
				spacing={2}
			>
				<OptionBtn variant="outlined" onClick={handleEdit}>
					{t('btn.edit')}
				</OptionBtn>
				<PreparationMenu
					item={item}
					xlsxData={{
						patientInfos,
						physicianInfos,
						nof1PhysicianInfos,
						schemaHeaders,
					}}
				/>
			</Stack>
			<EmailConfirmDialog
				open={openEmailDialog}
				handleClose={() => setOpenEmailDialog(false)}
				handleDialogSubmit={(email) => handleEmailDialogSubmit(email)}
				email={item.pharmacy.email}
			/>
			<FailSnackbar
				open={openEmailFailSB}
				setOpen={setOpenEmailFailSB}
				msg={t('alert.email')}
			/>
		</>
	);
}
