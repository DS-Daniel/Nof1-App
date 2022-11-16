import useTranslation from 'next-translate/useTranslation';
import MenuContainer from './MenuContainer';
import { Nof1Test } from '../../../entities/nof1Test';

interface EndedTestMenuProps {
	item: Nof1Test;
}

/**
 * Options menu for a test with the status ended.
 */
export default function EndedTestMenu({ item }: EndedTestMenuProps) {
	const { t } = useTranslation('nof1List');

	return <MenuContainer name={t('optionsMenu')} items={[]} test={item} />;
}
