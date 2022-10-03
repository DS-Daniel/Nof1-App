import useTranslation from 'next-translate/useTranslation';
import OptionBtn from './OptionBtn';
import Stack from '@mui/material/Stack';
import { OptionsProps } from '../Nof1TableItem';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { TestStatus } from '../../../utils/constants';
import { updateNof1Test } from '../../../utils/apiCalls';
import { Nof1Test } from '../../../entities/nof1Test';
import dayjs from 'dayjs';
import { useUserContext } from '../../../context/UserContext';
import OngoingMenu from '../menus/OngoingMenu';

interface OngoingOptionsProps extends OptionsProps {
	setItem: Dispatch<SetStateAction<Nof1Test>>;
}

/**
 * Component rendering the options for a test with the status ongoing.
 */
export default function OngoingOptions({ item, setItem }: OngoingOptionsProps) {
	const { t } = useTranslation('nof1List');
	const { userContext } = useUserContext();

	// check on rendering if the date deadline is exceeded.
	useEffect(() => {
		if (dayjs() >= dayjs(item.endingDate!)) {
			const test = { ...item };
			test.status = TestStatus.Ended;
			updateNof1Test(userContext.access_token, item.uid!, {
				status: TestStatus.Ended,
			});
			setItem(test);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Handle click on the stop button.
	 */
	const handleStop = () => {
		const test = { ...item };
		test.endingDate = new Date();
		test.status = TestStatus.Interrupted;
		updateNof1Test(userContext.access_token, item.uid!, {
			endingDate: test.endingDate,
			status: test.status,
		});
		setItem(test);
	};

	return (
		<>
			<Stack
				direction="row"
				justifyContent="flex-end"
				alignItems="center"
				spacing={2}
			>
				<OptionBtn variant="contained" color="error" onClick={handleStop}>
					{t('btn.stop')}
				</OptionBtn>
				<OptionBtn variant="contained" disabled>
					{t('btnStatus.ongoing')}
				</OptionBtn>
			</Stack>
			<OngoingMenu item={item} />
		</>
	);
}
