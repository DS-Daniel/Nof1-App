import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { Nof1Test } from '../../../entities/nof1Test';
import { administrationSchemaXlsx } from '../../../utils/xlsx';
import MenuContainer from '../../common/MenuContainer';
import RecapModal from '../recapModal';
import DeleteDialog from './DeleteDialog';
import {
	generateAdministrationSchema,
	generateSequence,
	selectRandomPosology,
	substancesRecap,
} from '../../../utils/nof1-lib/lib';

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
	const [openRecapModal, setOpenRecapModal] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const selectedPosologies = selectRandomPosology(item.posologies);
	const substancesSequence = generateSequence(
		item.substances,
		item.randomization,
		item.nbPeriods,
	);
	const administrationSchema = generateAdministrationSchema(
		item.substances,
		substancesSequence,
		selectedPosologies,
		item.periodLen,
		item.nbPeriods,
	);
	const recap = substancesRecap(
		item.substances,
		administrationSchema,
		t('common:sub-recap.qty'),
		t('common:sub-recap.dose'),
	);

	const menuItems = [
		{
			name: t('menu.parameters'),
			callback: () => {
				setOpenRecapModal(true);
			},
		},
		{
			name: t('menu.xlsx-exemple'),
			tooltipText: t('menu.xlsx-exemple-info'),
			callback: () => {
				administrationSchemaXlsx({
					...xlsxData,
					schema: administrationSchema,
					substancesRecap: recap,
				});
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
