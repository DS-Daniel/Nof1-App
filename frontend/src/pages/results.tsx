import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUserContext } from '../context/UserContext';
import useTranslation from 'next-translate/useTranslation';
import { Nof1Test, TestStatus } from '../entities/nof1Test';
import { TestData } from '../entities/nof1Data';
import { VariableType } from '../entities/variable';
import { findNof1Data, findNof1TestById } from '../utils/apiCalls';
import { formatPatientDataToTable } from '../utils/nof1-lib/lib';
import { randomHexColor } from '../utils/charts';
import {
	RandomizationStrategy,
	RandomStrategy,
} from '../utils/nof1-lib/randomizationStrategy';
import ExtendedLineChart from '../components/results/lineChart';
import RecapModal from '../components/nof1List/recapModal';
import AuthenticatedPage from '../components/layout/AuthenticatedPage';
import AdministrationTable from '../components/results/AdministrationTable';
import PatientDataTable from '../components/results/PatientDataTable';
import SelectedPosologies from '../components/results/SelectedPosologies';
import MedicalReportModal from '../components/results/medicalReport';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';

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
	const [openRecapModal, setOpenRecapModal] = useState(false);
	const [openReportModal, setOpenReportModal] = useState(false);

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
				<Button variant="contained" onClick={() => setOpenRecapModal(true)}>
					{t('btn.recap-modal')}
				</Button>
				<Button variant="contained" onClick={() => setOpenReportModal(true)}>
					{t('btn.report')}
				</Button>
				{/* <Button variant="contained" onClick={handleXML}>
					{t('btn.xml')}
				</Button> */}
			</Stack>

			<Paper sx={{ p: 3, mt: 4 }}>
				<Stack spacing={3}>
					<Typography variant="h4" textAlign="center">
						{t('title.main')}
					</Typography>
					<Typography variant="h6">
						{t('title.testID', { testID: router.query.id })}
					</Typography>
					{test ? (
						<>
							<div>
								<Typography>
									{t('common:startingDate')}{' '}
									{dayjs(test.beginningDate).toDate().toLocaleDateString()}
								</Typography>
								<Typography>
									{t('common:endingDate')}{' '}
									{dayjs(test.endingDate).toDate().toLocaleDateString()}
								</Typography>
								{test.status === TestStatus.Interrupted && (
									<Typography fontStyle="italic">{t('interrupted')}</Typography>
								)}
							</div>

							<Typography variant="h5">{t('title.random-sub-seq')}</Typography>
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

							<SelectedPosologies posologies={test.selectedPosologies!} />

							<Typography variant="h5">{t('title.admin-schema')}</Typography>
							<Paper>
								<AdministrationTable
									administrationSchema={getAdministrationSchema(test)}
									startDate={test.beginningDate!}
								/>
							</Paper>

							<Typography variant="h5">{t('title.patient-data')}</Typography>
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

							<Typography variant="h5">{t('title.graph')}</Typography>
							{testData ? (
								test.monitoredVariables
									.filter(
										(v) =>
											v.type === VariableType.Numeric ||
											v.type === VariableType.VAS,
									)
									.map((v) => (
										<ExtendedLineChart
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
			{test && (
				<>
					<RecapModal
						open={openRecapModal}
						setOpen={setOpenRecapModal}
						item={test}
					/>
					{testData && (
						<MedicalReportModal
							open={openReportModal}
							handleClose={() => setOpenReportModal(false)}
							item={test}
							testData={testData}
						/>
					)}
				</>
			)}
		</AuthenticatedPage>
	);
}
