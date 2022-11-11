import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useUserContext } from '../context/UserContext';
import useTranslation from 'next-translate/useTranslation';
import {
	defaultPatient,
	defaultPharmacy,
	defaultPhysician,
	Patient,
	Pharmacy,
	Physician,
} from '../entities/people';
import { Nof1Test, TestStatus } from '../entities/nof1Test';
import { Variable } from '../entities/variable';
import { SubstancePosologies } from '../entities/posology';
import { Substance } from '../entities/substance';
import { defaultClinicalInfo, IClinicalInfo } from '../entities/clinicalInfo';
import { maxValue } from '../utils/constants';
import { RandomStrategy } from '../utils/nof1-lib/randomizationStrategy';
import {
	createNof1Test,
	findNof1TestById,
	updateNof1Test,
	updatePhysician,
} from '../utils/apiCalls';
import TestParameters from '../components/testCreation/parameters';
import Variables from '../components/testCreation/variables';
import ClinicalInfo from '../components/testCreation/clinicalInfo';
import AuthenticatedPage from '../components/layout/AuthenticatedPage';
import Participants from '../components/testCreation/participants';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import isEqual from 'lodash.isequal';

const emptySubstance = {
	name: '',
	abbreviation: '',
	unit: '',
};

/**
 * N-of-1 test creation page.
 */
export default function CreateTest() {
	const { t } = useTranslation('createTest');
	const { userContext, setUserContext } = useUserContext();
	const router = useRouter();

	// Test data. Using Ref to avoid countless re-renders.
	const patient = useRef<Patient>(defaultPatient());
	const physician = useRef<Physician>(defaultPhysician());
	const pharmacy = useRef<Pharmacy>(defaultPharmacy());
	const [substances, setSubstances] = useState<Substance[]>([
		{ ...emptySubstance },
		{ ...emptySubstance },
	]);
	const [nbPeriods, setNbPeriods] = useState(6);
	const [periodLen, setPeriodLen] = useState(7);
	const [strategy, setStrategy] = useState(RandomStrategy.Permutations);
	const [maxRep, setMaxRep] = useState(1);
	const [variables, setVariables] = useState<Variable[]>([]);
	const [allPosologies, setAllPosologies] = useState<SubstancePosologies[]>([]);
	const [loading, setLoading] = useState(true);
	const [clinicalInfo, setClinicalInfo] =
		useState<IClinicalInfo>(defaultClinicalInfo);
	const [incompleteForm, setIncompleteForm] = useState(false);
	const [draftError, setDraftError] = useState(false);

	// fills parameters in case of test edit or "new from template"
	useEffect(() => {
		async function fetchData(id: string, edit: string) {
			const test: Nof1Test = await findNof1TestById(
				userContext.access_token,
				id,
			);
			pharmacy.current = test.pharmacy;
			physician.current = test.physician;
			patient.current = test.patient;
			setClinicalInfo(test.clinicalInfo);
			setSubstances(test.substances);
			setNbPeriods(test.nbPeriods);
			setPeriodLen(test.periodLen);
			setStrategy(test.randomization.strategy);
			if (test.randomization.strategy === RandomStrategy.MaxRep) {
				setMaxRep(test.randomization.maxRep!);
			}
			setVariables(test.monitoredVariables);
			if (edit === 'true') {
				setAllPosologies(test.posologies);
			}
			setLoading(false);
		}

		if (router.isReady && userContext.access_token) {
			const { id, edit } = router.query;
			if (id) {
				fetchData(id as string, edit as string);
			} else {
				setLoading(false);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady, userContext]);

	// to fix scroll going to the middle of page when editing or creating from template
	useEffect(() => {
		const timer = setTimeout(
			() =>
				window.scrollTo({
					top: 0,
					left: 0,
					behavior: 'smooth',
				}),
			2,
		);
		return () => clearTimeout(timer);
	}, [loading]);

	/**
	 * Updates a user tests array with the newly created one.
	 * @param testId Id of the newly created test.
	 */
	const updateUserTests = (testId: string) => {
		const user = { ...userContext.user! };
		if (user.tests === undefined || user.tests.length === 0) {
			user.tests = [testId];
		} else {
			user.tests = [...user.tests, testId];
		}
		updatePhysician(userContext.access_token, user._id!, { tests: user.tests });
		setUserContext({
			access_token: userContext.access_token,
			user,
		});
	};

	/**
	 * Generates a N-of-1 test from the component data.
	 * @returns A N-of-1 test object, without the status field.
	 */
	const generateNof1TestData = () => {
		const tmp: Omit<Nof1Test, 'status'> = {
			patient: patient.current,
			physician: physician.current,
			nof1Physician: userContext.user!,
			pharmacy: pharmacy.current,
			clinicalInfo,
			nbPeriods,
			periodLen,
			randomization: { strategy },
			substances,
			posologies: allPosologies,
			monitoredVariables: variables,
		};
		if (strategy === RandomStrategy.MaxRep) {
			tmp.randomization.maxRep = maxRep;
		}
		return tmp;
	};

	/**
	 * Creates or updates a N-of-1 test according to the query parameters.
	 * @param testData N-of-1 test.
	 */
	const createOrUpdateNof1 = async (testData: Nof1Test) => {
		const { id, edit } = router.query;
		if (edit && edit === 'true') {
			updateNof1Test(userContext.access_token, id! as string, testData);
		} else {
			testData.meta_info = { creationDate: new Date() };
			const { statusCode, response } = await createNof1Test(
				userContext.access_token,
				testData,
			);
			if (statusCode !== 400) {
				updateUserTests(response.id);
			}
		}
		router.push('/nof1');
	};

	const substancesNotFilledIn = useMemo(
		() =>
			substances.length < 2 ||
			substances.some(
				(e) =>
					e.name === emptySubstance.name ||
					e.abbreviation === emptySubstance.abbreviation ||
					e.unit === emptySubstance.unit,
			),
		[substances],
	);

	const participantsNotFilledIn = () =>
		isEqual(patient.current, defaultPatient()) ||
		isEqual(pharmacy.current, defaultPharmacy()) ||
		isEqual(physician.current, defaultPhysician());
	// mutable values doesn't trigger a re-render, thus as
	// a function call and without useMemo.

	/**
	 * Handles the button's click to create a new test.
	 */
	const handleCreation = () => {
		if (
			allPosologies.length === 0 ||
			nbPeriods > maxValue ||
			periodLen > maxValue ||
			variables.length === 0 ||
			substancesNotFilledIn ||
			participantsNotFilledIn()
		) {
			setIncompleteForm(true);
		} else {
			const testData: Nof1Test = {
				status: TestStatus.Preparation,
				...generateNof1TestData(),
			};
			createOrUpdateNof1(testData);
		}
	};

	/**
	 * Handles the button's click to create a new draft test.
	 */
	const handleDraft = () => {
		if (participantsNotFilledIn()) {
			setDraftError(true);
		} else {
			const testData: Nof1Test = {
				status: TestStatus.Draft,
				...generateNof1TestData(),
			};
			createOrUpdateNof1(testData);
		}
	};

	if (loading) {
		return (
			<AuthenticatedPage>
				<Skeleton
					variant="rectangular"
					animation="wave"
					width={'100%'}
					height={'80vh'}
				/>
			</AuthenticatedPage>
		);
	}

	return (
		<AuthenticatedPage>
			<Stack spacing={3}>
				<Stack
					alignItems="center"
					position="sticky"
					top={0}
					bgcolor="background.default"
					zIndex={2}
				>
					<Stack
						direction={{ xs: 'column', sm: 'row' }}
						justifyContent="center"
						spacing={{ xs: 1, sm: 6 }}
						paddingY={1}
					>
						<Button variant="contained" onClick={handleDraft}>
							{t('draftBtn')}
						</Button>
						<Button variant="contained" onClick={handleCreation}>
							{t('createBtn')}
						</Button>
					</Stack>
					{incompleteForm && (
						<Alert
							severity="error"
							onClose={() => setIncompleteForm((prevState) => !prevState)}
						>
							{t('create-error')}
						</Alert>
					)}
					{draftError && (
						<Alert
							severity="error"
							onClose={() => setDraftError((prevState) => !prevState)}
						>
							{t('draft-error')}
						</Alert>
					)}
				</Stack>

				<Participants
					pharmacy={pharmacy}
					patient={patient}
					physician={physician}
				/>

				<ClinicalInfo
					clinicalInfo={clinicalInfo}
					setClinicalInfo={setClinicalInfo}
					patient={patient}
				/>

				<TestParameters
					substances={substances}
					setSubstances={setSubstances}
					strategy={strategy}
					setStrategy={setStrategy}
					maxRep={maxRep}
					setMaxRep={setMaxRep}
					nbPeriods={nbPeriods}
					setNbPeriods={setNbPeriods}
					periodLen={periodLen}
					setPeriodLen={setPeriodLen}
					allPosologies={allPosologies}
					setAllPosologies={setAllPosologies}
				/>

				<Variables variables={variables} setVariables={setVariables} />
			</Stack>
		</AuthenticatedPage>
	);
}
