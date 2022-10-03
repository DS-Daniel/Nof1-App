import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useUserContext } from '../../../context/UserContext';
import { deleteNof1Test, updatePhysician } from '../../../utils/apiCalls';
import { OptionsProps } from '../Nof1TableItem';

/**
 * Component rendering the options for a test with the status draft.
 */
export default function DraftOptions({ item }: OptionsProps) {
	const { t } = useTranslation('nof1List');
	const router = useRouter();
	const { userContext, setUserContext } = useUserContext();

	/**
	 * Handle click on the button to continue editing the test.
	 */
	const handleDraft = () => {
		router.push({
			pathname: '/create-test',
			query: { id: item.uid, edit: true },
		});
	};

	/**
	 * Remove the test from the user test array.
	 * @param testId Id of the test.
	 */
	const removeUserTest = (testId: string) => {
		const user = { ...userContext.user! };
		const idx = user.tests!.findIndex((id) => id === testId);
		user.tests!.splice(idx, 1);
		updatePhysician(userContext.access_token, user._id!, { tests: user.tests });
		setUserContext({
			access_token: userContext.access_token,
			user,
		});
	};

	/**
	 * Handle click on the delete button.
	 */
	const handleDelete = () => {
		deleteNof1Test(userContext.access_token, item.uid!);
		removeUserTest(item.uid!);
	};

	return (
		<Stack direction="row" spacing={3}>
			<Button variant="contained" color="error" onClick={handleDelete}>
				{t('btn.delete')}
			</Button>
			<Button variant="contained" onClick={handleDraft}>
				{t('btnStatus.draft')}
			</Button>
		</Stack>
	);
}
