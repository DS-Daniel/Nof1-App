import AuthenticatedPage from '../components/layout/AuthenticatedPage';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Nof1Test } from '../entities/nof1Test';
import {
	createNof1Data,
	findNof1Data,
	findNof1TestById,
	updateNof1Data,
} from '../utils/apiCalls';
import { useUserContext } from '../context/UserContext';
import { Variable, VariableType } from '../entities/variable';
import LogbookCard from '../components/dataImport/LogbookCard';
import Binary from '../components/dataImport/Binary';
import Numeric from '../components/dataImport/Numeric';
import Text from '../components/dataImport/Text';
import Qualitative from '../components/dataImport/Qualitative';
import Button from '@mui/material/Button';
import FailSnackbar from '../components/common/FailSnackbar';
import SuccessSnackbar from '../components/common/SuccessSnackbar';
import { TestData } from '../entities/nof1Data';
import { TestStatus } from '../utils/constants';

/**
 * Generate and return the default data for the N-of-1 test.
 * @param test N-of-1 test.
 * @returns The default test data array.
 */
const defaultData = (test: Nof1Test): TestData => {
	let totalDuration = test.nbPeriods * test.periodLen;
	if (test.status === TestStatus.Interrupted) {
		totalDuration =
			dayjs(test.endingDate).diff(dayjs(test.beginningDate), 'day') + 1;
	}
	const data: TestData = [];
	for (let i = 0; i < totalDuration; i++) {
		data.push({
			day: i + 1,
			date: dayjs(test.beginningDate).add(i, 'day').toDate(),
			substance: test.administrationSchema![i].substance,
			data: test.monitoredVariables.map((variable) => ({
				variableName: variable.name,
				value: '',
			})),
		});
	}
	return data;
};

/**
 * Patient's health variables data import page.
 */
export default function ImportData() {
	const { t } = useTranslation('importData');
	const router = useRouter();
	const { userContext } = useUserContext();
	const [test, setTest] = useState<Nof1Test | null>(null);
	const testData = useRef<TestData | null>(null);
	const [fileError, setFileError] = useState(false);
	const [fileSuccess, setFileSuccess] = useState(false);
	const [success, setSuccess] = useState(false);
	const [dbError, setDbError] = useState(false);

	// fetch test information and initialize default health data.
	useEffect(() => {
		async function initData(id: string) {
			const test: Nof1Test = await findNof1TestById(
				userContext.access_token,
				id,
			);
			setTest(test);
			testData.current = defaultData(test);
		}
		const { id } = router.query;
		if (id && userContext.access_token) {
			initData(id as string);
		}
	}, [router.query, userContext]);

	/**
	 * Curry fonction to update the health data.
	 * @param dayIdx index of the day.
	 * @param varIdx index of the variable.
	 * @returns A function to update the health data.
	 */
	const updateTestData = (dayIdx: number, varIdx: number) => {
		return (value: string) => {
			testData.current![dayIdx].data[varIdx].value = value;
		};
	};

	/**
	 * Helper to render the right Variable component.
	 * @param variable Variable.
	 * @param varIndex Variable index.
	 * @param defaultValue Default value.
	 * @param updateTestData Method to update the data.
	 * @returns The appropriate component.
	 */
	const renderVariable = (
		variable: Variable,
		varIndex: number,
		defaultValue: string,
		updateTestData: (value: string) => void,
	) => {
		switch (variable.type) {
			case VariableType.Text:
				return (
					<Text
						key={varIndex}
						variable={variable}
						defaultValue={defaultValue}
						onChange={updateTestData}
					/>
				);
			case VariableType.Binary:
				return (
					<Binary
						key={varIndex}
						variable={variable}
						defaultValue={defaultValue}
						onChange={updateTestData}
					/>
				);
			case VariableType.VAS:
			case VariableType.Numeric:
				return (
					<Numeric
						key={varIndex}
						variable={variable}
						defaultValue={defaultValue}
						onChange={updateTestData}
					/>
				);
			case VariableType.Qualitative:
				return (
					<Qualitative
						key={varIndex}
						variable={variable}
						defaultValue={defaultValue}
						onChange={updateTestData}
					/>
				);
		}
	};

	/**
	 * API call to create or update the patient's health data of the database.
	 * @returns A boolean value indicating whether there was an error.
	 */
	const createOrUpdateData = async () => {
		const testId = router.query.id as string;
		let error = false;
		const { response } = await findNof1Data(userContext.access_token, testId);
		if (response) {
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
	 * Handle the click on the import button.
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
	 * Handle the click on the save button.
	 * It triggers an API call to post the data.
	 */
	const handleSave = async () => {
		const error = await createOrUpdateData();
		error ? setDbError(true) : setSuccess(true);
	};

	return (
		<AuthenticatedPage>
			<Stack
				spacing={2}
				sx={{
					position: 'fixed',
					top: (theme) => theme.spacing(10),
					right: (theme) => theme.spacing(2),
					width: 180,
				}}
			>
				<Button variant="contained" onClick={handleSave}>
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
			<Stack alignItems="center" spacing={3}>
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
				{test && testData.current ? (
					testData.current.map((dayData, dayIdx) => {
						return (
							<LogbookCard
								key={dayIdx}
								startDate={test.beginningDate!}
								idx={dayIdx}
								periodLen={test.periodLen}
							>
								{test.monitoredVariables.map((v, varIdx) => {
									const defaultValue = dayData.data[varIdx].value;
									return renderVariable(
										v,
										varIdx,
										defaultValue,
										updateTestData(dayIdx, varIdx),
									);
								})}
							</LogbookCard>
						);
					})
				) : (
					<Skeleton
						variant="rectangular"
						animation="wave"
						width={'65%'}
						height={'80vh'}
					/>
				)}
			</Stack>
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
		</AuthenticatedPage>
	);
}
