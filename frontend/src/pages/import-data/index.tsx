import AuthenticatedPage from '../../components/layout/AuthenticatedPage';
import { useUserContext } from '../../context/UserContext';
import useTranslation from 'next-translate/useTranslation';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Nof1Test } from '../../entities/nof1Test';
import { TestData } from '../../entities/nof1Data';
import {
	createNof1Data,
	findNof1Data,
	findNof1TestById,
	updateNof1Data,
} from '../../utils/apiCalls';
import FailSnackbar from '../../components/common/FailSnackbar';
import SuccessSnackbar from '../../components/common/SuccessSnackbar';
import { defaultData } from '../../utils/nof1-lib/lib';
import Logbook from '../../components/dataImport/Logbook';

const dataFormId = 'data-form';

/**
 * Patient's health variables data import page.
 */
export default function ImportData() {
	const { t } = useTranslation('importData');
	const router = useRouter();
	const { userContext } = useUserContext();
	const [test, setTest] = useState<Nof1Test | undefined>(undefined);
	const testData = useRef<TestData | undefined>(undefined);
	const dataFound = useRef<boolean>(false);
	const [fileError, setFileError] = useState(false);
	const [fileSuccess, setFileSuccess] = useState(false);
	const [success, setSuccess] = useState(false);
	const [dbError, setDbError] = useState(false);
	const [validityError, setValidityError] = useState(false);

	// fetch test information and initialize default health data.
	useEffect(() => {
		async function initData(id: string) {
			const test: Nof1Test = await findNof1TestById(
				userContext.access_token,
				id,
			);
			const { response } = await findNof1Data(userContext.access_token, id);
			console.log('find data res', response);
			dataFound.current = response !== null;
			testData.current = response ? response.data : defaultData(test);
			setTest(test);
			// setTest() needs to be done after setting testData,
			// because a re-render is needed to display testData
		}
		const { id } = router.query;
		if (id && userContext.access_token) {
			initData(id as string);
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
			const { statusCode } = await updateNof1Data(
				userContext.access_token,
				testId,
				{ data: testData.current! },
			);
			if (statusCode !== 200) error = true;
		} else {
			const { statusCode } = await createNof1Data(userContext.access_token, {
				testId: router.query.id as string,
				data: testData.current!,
			});
			if (statusCode !== 201) error = true;
		}
		return error;
	};

	/**
	 * Handles the click on the import button.
	 * It triggers a file upload which will be parsed and
	 * data will be sent to the API if file is correct.
	 * @param e Html event, containing the file.
	 */
	const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
		const uploadedFile = e.target.files?.[0];
		const fileReader = new FileReader();
		fileReader.onloadend = async () => {
			try {
				testData.current = JSON.parse(fileReader.result as string);
				const error = await createOrUpdateData();
				error ? setDbError(true) : setFileSuccess(true);
			} catch (_) {
				setFileError(true);
			}
		};
		if (uploadedFile) fileReader.readAsText(uploadedFile);
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
			error ? setDbError(true) : setSuccess(true);
		} else {
			setValidityError(true);
		}
	};

	return (
		<AuthenticatedPage>
			<Stack alignItems="center">
				<label htmlFor="upload-btn">
					<input
						id="upload-btn"
						hidden
						accept=".json"
						type="file"
						onChange={handleImport}
					/>
					<Button variant="contained" component="span">
						{t('import-btn')}
					</Button>
				</label>
			</Stack>
			<Stack
				direction="row"
				spacing={2}
				justifyContent="center"
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
				<Button
					variant="outlined"
					onClick={() => {
						router.push({
							pathname: '/results',
							query: { id: router.query.id },
						});
					}}
				>
					{t('go-to-result-btn')}
				</Button>
			</Stack>
			<form id={dataFormId}>
				<Logbook test={test} testData={testData} />
			</form>
			<SuccessSnackbar
				open={fileSuccess}
				setOpen={setFileSuccess}
				msg={t('import-alert-success')}
			/>
			<FailSnackbar
				open={fileError}
				setOpen={setFileError}
				msg={t('import-alert-fail')}
			/>
			<SuccessSnackbar
				open={success}
				setOpen={setSuccess}
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
		</AuthenticatedPage>
	);
}
