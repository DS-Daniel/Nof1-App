import AuthenticatedPage from '../components/layout/AuthenticatedPage';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Nof1Test } from '../entities/nof1Test';
import { findNof1Data, findNof1TestById } from '../utils/apiCalls';
import { useUserContext } from '../context/UserContext';
import Button from '@mui/material/Button';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { TestData } from '../entities/nof1Data';
import { styled } from '@mui/material/styles';
import AdministrationTable from '../components/results/AdministrationTable';
import dayjs from 'dayjs';
import Paper from '@mui/material/Paper';
import { TestStatus } from '../utils/constants';
import PatientDataTable from '../components/results/PatientDataTable';
import { formatPatientDataToTable } from '../utils/nof1-lib/lib';
import SelectedPosologies from '../components/results/SelectedPosologies';
import {
	RandomizationStrategy,
	RandomStrategy,
} from '../utils/nof1-lib/randomizationStrategy';
import { CustomLineChart } from '../components/results/LineChart';
import { VariableType } from '../entities/variable';
import { randomHexColor } from '../utils/charts';

const BoxedTxt = styled(Typography)<TypographyProps>(({ theme }) => ({
	border: '1px solid black',
	padding: theme.spacing(1),
	textAlign: 'center',
}));

/**
 * Results page.
 */
export default function Results() {
	const { t } = useTranslation('results');
	const router = useRouter();
	const { userContext } = useUserContext();
	const [test, setTest] = useState<Nof1Test | null>(null);
	const [testData, setTestData] = useState<TestData | null>(null);
	const [substancesColors, setSubstancesColors] = useState<string[]>([]);

	// fetch N-of-1 test and patient's health variables data.
	useEffect(() => {
		async function init(id: string) {
			const test: Nof1Test = await findNof1TestById(
				userContext.access_token,
				id,
			);
			const { response } = await findNof1Data(userContext.access_token, id);
			setTest(test);
			setSubstancesColors(test.substances.map(() => randomHexColor()));
			if (response) setTestData(response.data);
		}

		const { id } = router.query;
		if (id && userContext.access_token) {
			init(id as string);
		}
	}, [router.query, userContext]);

	// const handleXML = () => {
	// 	alert('Feature not yet available');
	// };

	/**
	 * Retrieve the administration schema of the N-of-1 test.
	 * @param test N-of-1 test.
	 * @returns The administration schema.
	 */
	const getAdministrationSchema = (test: Nof1Test) => {
		if (test.status === TestStatus.Interrupted) {
			const days =
				dayjs(test.endingDate).diff(dayjs(test.beginningDate), 'day') + 1;
			return test.administrationSchema!.slice(0, days);
		}
		return test.administrationSchema!;
	};

	/**
	 * Helper to render the appropriate text.
	 * @param randomization Randomization strategy.
	 * @returns The strategy text description.
	 */
	const renderStrategy = (randomization: RandomizationStrategy) => {
		switch (randomization.strategy) {
			case RandomStrategy.Permutations:
				return t('createTest:parameters.RS-permutation');
			case RandomStrategy.MaxRep:
				return `${t('createTest:parameters.RS-random-max-rep')}. ${t(
					'createTest:parameters.RS-random-max-rep-N',
				)} : ${randomization.maxRep}.`;
			case RandomStrategy.Random:
				return t('createTest:parameters.RS-random');
		}
	};

	return (
		<AuthenticatedPage>
			<Stack direction="row" justifyContent="center" spacing={4}>
				<Button
					variant="contained"
					onClick={() => {
						router.push({
							pathname: '/import-data',
							query: { id: router.query.id },
						});
					}}
				>
					{t('btn.dataImport')}
				</Button>
				{/* <Button variant="contained" onClick={handleXML}>
					{t('btn.xml')}
				</Button> */}
			</Stack>

			<Paper sx={{ p: 3, mt: 4 }}>
				<Stack spacing={3}>
					<Typography variant="h4" textAlign="center">
						{t('title')}
					</Typography>
					<Typography variant="h6">
						{t('test-id')} {router.query.id}
					</Typography>
					{test ? (
						<>
							<div>
								<Typography>
									{t('start-date')}{' '}
									{dayjs(test.beginningDate).toDate().toLocaleDateString()}
								</Typography>
								<Typography>
									{t('end-date')}{' '}
									{dayjs(test.endingDate).toDate().toLocaleDateString()}
								</Typography>
								{test.status === TestStatus.Interrupted && (
									<Typography fontStyle="italic">{t('interrupted')}</Typography>
								)}
							</div>

							<Typography variant="h5">{t('random-sub-seq-title')}</Typography>
							<Stack direction="row">
								{test.substancesSequence!.map((abbrev, idx) => (
									<div key={idx}>
										<BoxedTxt>
											{t('common:period')} {idx + 1}
										</BoxedTxt>
										<BoxedTxt>{abbrev}</BoxedTxt>
									</div>
								))}
							</Stack>
							<div>
								<Typography>
									{t('period-duration')} {test.periodLen} {t('common:days')}.
								</Typography>
								<Typography>
									{t('randomStrategy')} {renderStrategy(test.randomization)}.
								</Typography>
							</div>

							<Typography variant="h5">{t('selected-posologies')}</Typography>
							<SelectedPosologies posologies={test.selectedPosologies!} />

							<Typography variant="h5">{t('admin-schema-title')}</Typography>
							<Paper>
								<AdministrationTable
									administrationSchema={getAdministrationSchema(test)}
									startDate={test.beginningDate!}
								/>
							</Paper>

							<Typography variant="h5">{t('patient-data-title')}</Typography>
							{testData ? (
								<Paper>
									<PatientDataTable
										data={formatPatientDataToTable(testData)}
										variables={test.monitoredVariables}
									/>
								</Paper>
							) : (
								<Typography>{t('no-data')}</Typography>
							)}

							<Typography variant="h5">{t('graph-title')}</Typography>
							{testData ? (
								test.monitoredVariables
									.filter(
										(v) =>
											v.type === VariableType.Numeric ||
											v.type === VariableType.VAS,
									)
									.map((v) => (
										<CustomLineChart
											key={v.name}
											testData={testData}
											variable={v}
											periodLen={test.periodLen}
											substances={test.substances}
											substancesSeq={test.substancesSequence!}
											substancesColors={substancesColors}
										/>
									))
							) : (
								<Typography>{t('no-data')}</Typography>
							)}
						</>
					) : (
						<Skeleton
							variant="rectangular"
							animation="wave"
							width={'100%'}
							height={'80vh'}
						/>
					)}
				</Stack>
			</Paper>
		</AuthenticatedPage>
	);
}
