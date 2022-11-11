import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
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
	const router = useRouter();

	const menuItems = [
		{
			name: t('menu.dataImport'),
			callback: () => {
				router.push({
					pathname: '/import-data',
					query: { id: item.uid },
				});
			},
		},
	];

	return (
		<MenuContainer name={t('optionsMenu')} items={menuItems} test={item} />
	);
}
