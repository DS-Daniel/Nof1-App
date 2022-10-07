import Page from '../components/layout/Page';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Nof1Test } from '../entities/nof1Test';
import {
	createNof1Data,
	getPatientData,
	patientDataUpdate,
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
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
export default function PatientData() {
	const { t } = useTranslation('importData');
	const router = useRouter();
	const { userContext } = useUserContext();
	const [test, setTest] = useState<Nof1Test | undefined>(undefined);
	const testData = useRef<TestData | undefined>(undefined);
	const dataFound = useRef<boolean>(false);
	const [successSB, setSuccessSB] = useState(false);
	const [dbError, setDbError] = useState(false);
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
				// TODO display something
				// router.push('/404');
			}
		}
		const { id, token } = router.query;
		if (id && token) {
			initData(id as string, token as string);
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
	 * Handle the click on the save button.
	 * It triggers an API call to post the data.
	 */
	const handleSave = async () => {
		const error = await createOrUpdateData();
		error ? setDbError(true) : setSuccessSB(true);
	};

	return (
		<Page>
			<Typography variant="h5" align="center" sx={{ whiteSpace: 'pre-line' }}>
				{t('patient.welcome')}
			</Typography>
			<Box
				sx={{
					position: 'fixed',
					top: (theme) => theme.spacing(10),
					right: (theme) => theme.spacing(2),
					width: 180,
				}}
			>
				<Button
					variant="contained"
					onClick={handleSave}
					disabled={testData.current === undefined}
				>
					{t('save-btn')}
				</Button>
			</Box>
			<Stack alignItems="center" spacing={3}>
				{test && testData.current ? (
					testData.current.map((dayData, dayIdx) => (
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
					))
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
				open={successSB}
				setOpen={setSuccessSB}
				msg={t('common:formErrors.successMsg')}
			/>
			<FailSnackbar
				open={dbError}
				setOpen={setDbError}
				msg={t('common:formErrors.unexpectedErrorMsg')}
			/>
		</Page>
	);
}
