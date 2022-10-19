import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useUserContext } from '../../../context/UserContext';
import { deleteNof1Test } from '../../../utils/apiCalls';
import { OptionsProps } from '../Nof1TableItem';

interface Props extends OptionsProps {
	removeItem: (testId: string) => void;
}

/**
 * Component rendering the options for a test with the status draft.
 */
export default function DraftOptions({ item, removeItem }: Props) {
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
	 * Handle click on the delete button.
	 */
	const handleDelete = () => {
		deleteNof1Test(userContext.access_token, item.uid!);
		removeItem(item.uid!);
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
