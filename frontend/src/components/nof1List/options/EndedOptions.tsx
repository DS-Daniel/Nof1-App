import EndedTestMenu from '../dropDownMenus/EndedTestMenu';
import useTranslation from 'next-translate/useTranslation';
import OptionBtn from './OptionBtn';
import { OptionsProps } from '../Nof1TableItem';
import { useRouter } from 'next/router';

/**
 * Component rendering the options for a test with the status ended.
 */
export default function EndedOptions({ item }: OptionsProps) {
	const { t } = useTranslation('nof1List');
	const router = useRouter();

	return (
		<>
			<OptionBtn
				variant="contained"
				onClick={() => {
					router.push({
						pathname: '/results',
						query: { id: item.uid },
					});
				}}
			>
				{t('btnStatus.ended')}
			</OptionBtn>
			<EndedTestMenu item={item} />
		</>
	);
}
