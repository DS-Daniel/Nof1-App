import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { Nof1Test } from '../../../entities/nof1Test';
import MenuContainer from '../../common/MenuContainer';
import RecapModal from '../recapModal';
import DeleteDialog from './DeleteDialog';

interface ReadyMenuProps {
	item: Nof1Test;
}

/**
 * Options menu for a test with the status ready.
 */
export default function ReadyMenu({ item }: ReadyMenuProps) {
	const { t } = useTranslation('nof1List');
	const [openRecapModal, setOpenRecapModal] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const menuItems = [
		{
			name: t('menu.parameters'),
			callback: () => {
				setOpenRecapModal(true);
			},
		},
		{
			name: t('menu.delete-test'),
			color: 'red',
			callback: () => {
				setOpenDeleteDialog(true);
			},
		},
	];

	return (
		<div>
			<MenuContainer name={t('optionsMenu')} items={menuItems} btnSize={180} />
			<RecapModal
				open={openRecapModal}
				setOpen={setOpenRecapModal}
				item={item}
			/>
			<DeleteDialog
				open={openDeleteDialog}
				handleClose={() => setOpenDeleteDialog(false)}
				testId={item.uid!}
			/>
		</div>
	);
}
