import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import MenuContainer from './MenuContainer';
import HealthLogbookModal from '../healthLogbookModal';
import { Nof1Test } from '../../../entities/nof1Test';
import { generateXlsxSchemaExample } from '../../../utils/nof1-lib/lib';

interface PreparationMenuProps {
	item: Nof1Test;
	xlsxData: {
		patientInfos: string[][];
		physicianInfos: string[][];
		nof1PhysicianInfos: string[][];
		schemaHeaders: string[];
	};
}

/**
 * Options menu for a test with the status Preparation.
 */
export default function PreparationMenu({
	item,
	xlsxData,
}: PreparationMenuProps) {
	const { t } = useTranslation('nof1List');
	const [openLogbookModal, setOpenLogbookModal] = useState(false);

	const menuItems = [
		{
			name: t('menu.xlsx-exemple'),
			tooltipText: t('menu.xlsx-exemple-info'),
			callback: () => {
				generateXlsxSchemaExample(item, xlsxData, {
					qty: t('common:sub-recap.qty'),
					dose: t('common:sub-recap.dose'),
				});
			},
		},
		{
			name: t('menu.varBooklet-preview'),
			tooltipText: t('menu.varBooklet-preview-info'),
			callback: () => {
				setOpenLogbookModal(true);
			},
		},
	];

	return (
		<>
			<MenuContainer name={t('optionsMenu')} items={menuItems} test={item} />
			<HealthLogbookModal
				open={openLogbookModal}
				handleClose={() => setOpenLogbookModal(false)}
				item={item}
			/>
		</>
	);
}
