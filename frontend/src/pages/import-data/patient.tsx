import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Page from '../../components/layout/Page';
import FailSnackbar from '../../components/common/FailSnackbar';
import SuccessSnackbar from '../../components/common/SuccessSnackbar';
import Logbook from '../../components/dataImport/Logbook';
import { Nof1Test } from '../../entities/nof1Test';
import { TestData } from '../../entities/nof1Data';
import {
	createNof1Data,
	getPatientData,
	patientDataUpdate,
} from '../../utils/apiCalls';
import { defaultData } from '../../utils/nof1-lib/lib';

const dataFormId = 'patient-data-form';

/**
 * Patient's health variables data import page.
 */
export default function PatientData() {
	const { t } = useTranslation('importData');
	const router = useRouter();
	const { userContext } = useUserContext();
	const [test, setTest] = useState<Nof1Test | undefined>(undefined);
	const testData = useRef<TestData | undefined>(undefined); // Ref to avoid useless re-render.
	const dataFound = useRef<boolean>(false);
	const [successSB, setSuccessSB] = useState(false);
	const [dbError, setDbError] = useState(false);
	const [validityError, setValidityError] = useState(false);
	const [deadlineExceeded, setDeadlineExceeded] = useState(false);
	const [apiToken, setApiToken] = useState('');

	// fetch test information and initialize default health data.
	useEffect(() => {
		async function initData(id: string, token: string) {
			const { success, response } = await getPatientData(token, id);
			if (success) {
				setApiToken(token);
				const test: Nof1Test = response.test;
				setTest(test);
				// check if previous data already exist.
				const data: TestData = response.data;
				dataFound.current = data !== undefined;
				console.log('data found?', dataFound.current);
				testData.current = dataFound.current ? data : defaultData(test);
			} else {
				// TODO display new page or replace content ?
				// router.push('/404');
				setDeadlineExceeded(true);
			}
		}
		const { id, token } = router.query;
		if (id && token) {
			initData(id as string, token as string);
		}
	}, [router.query, userContext]);

	/**
	 * API call to create or update the patient's health data of the database.
	 * @returns A boolean value indicating whether there was an error.
	 */
	const createOrUpdateData = async () => {
		const testId = router.query.id as string;
		let error = false;
		if (dataFound.current) {
			const { success } = await patientDataUpdate(apiToken, testId, {
				testId,
				data: testData.current!,
				testEndDate: test!.endingDate!,
			});
			if (!success) error = true;
		} else {
			// TODO own create API request ? and test period validity ?
			const { statusCode } = await createNof1Data(apiToken, {
				testId,
				data: testData.current!,
			});
			if (statusCode !== 201) error = true;
		}
		return error;
	};

	/**
	 * Handles the click on the save button. Checks form validity
	 * before triggering an API call to post the data.
	 */
	const handleSave = async () => {
		const dataForm = document.getElementById(dataFormId) as HTMLFormElement;
		const formValid = dataForm?.reportValidity();
		if (formValid) {
			const error = await createOrUpdateData();
			error ? setDbError(true) : setSuccessSB(true);
		} else {
			setValidityError(true);
		}
	};

	if (deadlineExceeded) {
		return (
			<Page>
				<Typography variant="h5" align="center">
					{t('deadline-error')}
				</Typography>
			</Page>
		);
	}

	return (
		<Page>
			<Typography variant="h5" align="center" sx={{ whiteSpace: 'pre-line' }}>
				{t('patient.welcome')}
			</Typography>
			<form id={dataFormId}>
				<Stack
					alignItems="center"
					paddingY={2}
					position="sticky"
					top={0}
					bgcolor="background.default"
					zIndex={2}
				>
					<Button
						variant="contained"
						onClick={handleSave}
						disabled={testData.current === undefined}
					>
						{t('save-btn')}
					</Button>
				</Stack>
				<Logbook test={test} testData={testData} patientView />
			</form>
			<SuccessSnackbar
				open={successSB}
				setOpen={setSuccessSB}
				msg={t('common:formErrors.successMsg')}
			/>
			<FailSnackbar
				open={dbError}
				setOpen={setDbError}
				msg={t('common:formErrors.unexpectedErrorMsg')}
			/>
			<FailSnackbar
				open={validityError}
				setOpen={setValidityError}
				msg={t('common:formErrors.errorMsg')}
			/>
		</Page>
	);
}