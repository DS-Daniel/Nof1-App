import AuthenticatedPage from '../components/layout/AuthenticatedPage';
import { useRouter } from 'next/router';
import Nof1Table from '../components/nof1List/Nof1Table';
import { UserContextType, useUserContext } from '../context/UserContext';
import { HeadCell } from '../components/common/table/EnhancedTableHead';
import Button from '@mui/material/Button';
import useTranslation from 'next-translate/useTranslation';
import Stack from '@mui/material/Stack';
import { createContext, useCallback, useEffect, useState } from 'react';
import { Nof1Test } from '../entities/nof1Test';
import {
	deleteNof1Test,
	listOfTests,
	updatePhysician,
} from '../utils/apiCalls';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Link from 'next/link';

export const RemoveTestCB = createContext<
	(
		testId: string,
		userContext: UserContextType,
		setUserContext: (userCtx: UserContextType) => void,
	) => void
>(() => {});

export interface Nof1TableInterface {
	id: string;
	creationDate: Date;
	status: string;
}

/**
 * Page listing all user's N-of-1 tests.
 */
export default function Nof1() {
	const { t } = useTranslation('nof1List');
	const router = useRouter();
	const { userContext } = useUserContext();
	const [data, setData] = useState<Nof1Test[]>([]);
	const [openDialogBtn, setOpenDialogBtn] = useState(false);

	// fetch N-of-1 tests.
	useEffect(() => {
		async function fetchTests(ids: string[]) {
			const { response } = await listOfTests(userContext.access_token, { ids });
			setData(response);
		}
		const testsIds = userContext.user?.tests;
		// fetch only on page switch and page refresh (this fetch takes times)
		if (testsIds && testsIds.length > 0 && data.length === 0) {
			fetchTests(testsIds);
		}
	}, [data, userContext]);

	/**
	 * Removes a test from the user tests array.
	 * @param testId Id of the test.
	 */
	const removeUserTest = useCallback(
		(
			testId: string,
			userContext: UserContextType,
			setUserContext: (userCtx: UserContextType) => void,
		) => {
			const user = { ...userContext.user! };
			const idx = user.tests!.findIndex((id) => id === testId);
			user.tests!.splice(idx, 1);
			// update of corresponding data
			updatePhysician(userContext.access_token, user._id!, {
				tests: user.tests,
			});
			deleteNof1Test(userContext.access_token, testId);
			setUserContext({
				access_token: userContext.access_token,
				user,
			});
			setData((prevData) => {
				return prevData.filter((t) => t.uid !== testId);
			});
		},
		[],
	);

	// headers of the table.
	const headCells: readonly HeadCell<Nof1TableInterface>[] = [
		{
			id: 'id',
			align: 'left',
			disablePadding: false,
			label: t('header.id'),
		},
		{
			id: 'creationDate',
			align: 'left',
			disablePadding: false,
			label: t('header.date'),
		},
		{
			id: 'status',
			align: 'right',
			disablePadding: false,
			label: t('header.state'),
		},
	];

	/**
	 * Generates and returns the table rows.
	 */
	const generateRows = (): Nof1TableInterface[] => {
		return data.map((test) => ({
			id: test.uid!,
			creationDate: new Date(test.meta_info!.creationDate),
			status: test.status,
		}));
	};

	/**
	 * Handles the click on the create new test button.
	 */
	const handleCreateBtn = () => {
		router.push('/create-test');
	};

	return (
		<AuthenticatedPage>
			<Stack justifyContent="center" alignItems="center">
				<Stack direction="row" spacing={4}>
					<Button variant="contained" onClick={handleCreateBtn}>
						{t('btn.create')}
					</Button>
					<Button variant="contained" onClick={() => setOpenDialogBtn(true)}>
						{t('btn.create-fromID')}
					</Button>
					<Dialog open={openDialogBtn} onClose={() => setOpenDialogBtn(false)}>
						<DialogTitle textAlign="center">
							{t('create-fromID-dialog-title')}
						</DialogTitle>
						<DialogContent>
							<Stack alignItems="center" spacing={2}>
								{userContext.user?.tests?.map((testId) => (
									<Link
										key={testId}
										href={{
											pathname: '/create-test',
											query: { id: testId, edit: false },
										}}
									>
										{testId}
									</Link>
								))}
							</Stack>
						</DialogContent>
					</Dialog>
				</Stack>
				<RemoveTestCB.Provider value={removeUserTest}>
					<Nof1Table
						rows={generateRows()}
						headCells={headCells}
						data={data}
						loading={userContext.user?.tests?.length !== 0 && data.length === 0}
					/>
				</RemoveTestCB.Provider>
			</Stack>
		</AuthenticatedPage>
	);
}
