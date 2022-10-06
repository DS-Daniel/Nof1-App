import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Nof1Test } from '../../../entities/nof1Test';
import MenuContainer from '../../common/MenuContainer';
import RecapModal from '../recapModal';

interface EndedTestMenuProps {
	item: Nof1Test;
}

/**
 * Options menu for a test with the status ended.
 */
export default function EndedTestMenu({ item }: EndedTestMenuProps) {
	const { t } = useTranslation('nof1List');
	const router = useRouter();
	const [openRecapModal, setOpenRecapModal] = useState(false);

	const menuItems = [
		{
			name: t('menu.parameters'),
			callback: () => {
				setOpenRecapModal(true);
			},
		},
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
		<>
			<MenuContainer name={t('optionsMenu')} items={menuItems} btnSize={180} />
			<RecapModal
				open={openRecapModal}
				setOpen={setOpenRecapModal}
				item={item}
			/>
		</>
	);
}
