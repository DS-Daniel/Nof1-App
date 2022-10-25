import useTranslation from 'next-translate/useTranslation';
import OptionBtn from './OptionBtn';
import Stack from '@mui/material/Stack';
import { OptionsProps } from '../Nof1TableItem';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { TestStatus } from '../../../utils/constants';
import { sendPharmaEmail, updateNof1Test } from '../../../utils/apiCalls';
import { Nof1Test } from '../../../entities/nof1Test';
import FailSnackbar from '../../common/FailSnackbar';
import { useUserContext } from '../../../context/UserContext';
import {
	generateAdministrationSchema,
	generateSequence,
	selectRandomPosology,
	substancesRecap,
} from '../../../utils/nof1-lib/lib';
import { usePharmaEmailInfos } from '../../../utils/customHooks';
import EmailConfirmDialog from '../EmailConfirmDialog';
import CircularProgress from '@mui/material/CircularProgress';
import PreparationMenu from '../dropDownMenus/PreparationMenu';
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
			// test.beginningDate!,
			test.periodLen,
			test.nbPeriods,
		);
		test.pharmaEmail = email;
		return test;
	};

	/**
	 * Sends the email to the pharmacy and updates the test information.
	 * @param email Confirmed pharmacy email address.
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
			test.pharmaEmail,
			t('mail:pharma.subject'),
		);

		if (response.success) {
			test.meta_info!.emailSendingDate = new Date();
			test.status = TestStatus.Ready;
			updateNof1Test(userContext.access_token, test.uid!, test);
			setItem(test); // update display
		} else {
			setOpenEmailFailSB(true);
			setSendingEmail((prevState) => !prevState);
		}
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
	 * Handles click on the start button, triggering the email confirmation dialog.
	 */
	const handlePreparation = () => {
		setOpenEmailDialog(true);
		setSendingEmail((prevState) => !prevState);
	};

	/**
	 * Handles the click of the confirm action of the email validation dialog.
	 */
	const handleDialogSubmit = (email: string) => {
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
					onClick={handlePreparation}
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
				handleDialogSubmit={(email) => handleDialogSubmit(email)}
				email={item.pharmaEmail}
			/>
			<FailSnackbar
				open={openEmailFailSB}
				setOpen={setOpenEmailFailSB}
				msg={t('alert-email')}
			/>
		</>
	);
}
