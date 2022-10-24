import AuthenticatedPage from '../components/layout/AuthenticatedPage';
import Button from '@mui/material/Button';
import useTranslation from 'next-translate/useTranslation';
import { Nof1Test } from '../entities/nof1Test';
import Participants from '../components/testCreation/participants';
import Stack from '@mui/material/Stack';
import { useEffect, useRef, useState } from 'react';
import {
	defaultPatient,
	defaultPhysician,
	Patient,
	Physician,
} from '../entities/people';
import { useUserContext } from '../context/UserContext';
import { TestStatus } from '../utils/constants';
import TestParameters from '../components/testCreation/parameters';
import { RandomStrategy } from '../utils/nof1-lib/randomizationStrategy';
import Variables from '../components/testCreation/variables';
import { Variable } from '../entities/variable';
import { SubstancePosologies } from '../entities/posology';
import { Substance } from '../entities/substance';
import {
	createNof1Test,
	findNof1TestById,
	updateNof1Test,
	updatePhysician,
} from '../utils/apiCalls';
import { useRouter } from 'next/router';
import Skeleton from '@mui/material/Skeleton';

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

	// Test data.
	const patient = useRef<Patient>(defaultPatient()); // Ref to avoid useless re-render.
	const physician = useRef<Physician>(defaultPhysician());
	const pharmaEmail = useRef('');
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

	// fill parameters in case of test edit or "new from template"
	useEffect(() => {
		async function fetchData(id: string, edit: string) {
			const test: Nof1Test = await findNof1TestById(
				userContext.access_token,
				id,
			);
			pharmaEmail.current = test.pharmaEmail;
			physician.current = test.physician;
			patient.current = test.patient;
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
	 * Update a user tests array with the newly created.
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
	 * Generate a N-of-1 test from the component data.
	 * @returns A N-of-1 test object, without the status field.
	 */
	const generateNof1TestData = () => {
		const tmp: Omit<Nof1Test, 'status'> = {
			patient: patient.current,
			physician: physician.current,
			nof1Physician: userContext.user!,
			pharmaEmail: pharmaEmail.current,
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
	 * Create or update a N-of-1 test according to the query parameters.
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

	/**
	 * Handle the click on the create new test button.
	 */
	const handleCreation = () => {
		const testData: Nof1Test = {
			status: TestStatus.Preparation,
			...generateNof1TestData(),
		};
		createOrUpdateNof1(testData);
	};

	/**
	 * Handle the click on the create draft button.
	 */
	const handleDraft = () => {
		const testData: Nof1Test = {
			status: TestStatus.Draft,
			...generateNof1TestData(),
		};
		createOrUpdateNof1(testData);
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
					direction="row"
					justifyContent="center"
					alignItems="center"
					spacing={6}
					paddingY={2}
					position="sticky"
					top={0}
					bgcolor="background.default"
					zIndex={2}
				>
					<Button variant="contained" onClick={handleDraft}>
						{t('draftBtn')}
					</Button>
					<Button variant="contained" onClick={handleCreation}>
						{t('createBtn')}
					</Button>
				</Stack>

				<Participants
					pharmaEmail={pharmaEmail}
					patient={patient}
					physician={physician}
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
