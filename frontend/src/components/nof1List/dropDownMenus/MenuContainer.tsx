import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Typography from '@mui/material/Typography';
import CustomTooltip from '../../common/CustomTooltip';
import useTranslation from 'next-translate/useTranslation';
import RecapModal from '../recapModal';
import DeleteDialog from './DeleteDialog';
import { Nof1Test } from '../../../entities/nof1Test';
import { generateXlsxSchemaExample } from '../../../utils/nof1-lib/lib';
import { usePharmaEmailInfos } from '../../../utils/customHooks';

interface IMenuItem {
	name: string;
	color?: string;
	tooltipText?: string;
	callback: () => void;
}

interface MenuContainerProps {
	name: string;
	items: IMenuItem[];
	test: Nof1Test;
	btnSize?: number;
}

const btnId = 'option-button';
const menuId = 'option-menu';

/**
 * Common Menu container component.
 */
export default function MenuContainer({
	name,
	items,
	test,
	btnSize = 220,
}: MenuContainerProps) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const { t } = useTranslation('nof1List');
	const [openRecapModal, setOpenRecapModal] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const {
		schemaHeaders,
		patientInfos,
		physicianInfos,
		nof1PhysicianInfos,
	} = usePharmaEmailInfos(test.patient, test.physician, test.nof1Physician);

	const menuItems = [
		{
			name: t('menu.parameters'),
			callback: () => {
				setOpenRecapModal(true);
			},
		},
		...items,
		{
			name: t('menu.xlsx-exemple'),
			tooltipText: t('menu.xlsx-exemple-info'),
			callback: () => {
				generateXlsxSchemaExample(
					test,
					{
						patientInfos,
						physicianInfos,
						nof1PhysicianInfos,
						schemaHeaders,
					},
					{
						qty: t('common:sub-recap.qty'),
						totalDose: t('common:sub-recap.total-dose'),
						unitDose: t('common:sub-recap.unit-dose'),
					},
					[`* ${t('common:posology-table.fraction-desc')}`],
				);
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

	/**
	 * Handle click on the menu item.
	 * @param event HTML event.
	 */
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	/**
	 * Handle menu closure.
	 */
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Button
				id={btnId}
				variant="outlined"
				aria-controls={open ? menuId : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
				endIcon={<KeyboardArrowDownIcon />}
				sx={{ width: btnSize }}
			>
				{name}
			</Button>
			<Menu
				id={menuId}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': btnId,
				}}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				{menuItems.map((i, idx) => {
					return (
						<MenuItem
							key={idx}
							onClick={() => {
								i.callback();
								handleClose();
							}}
						>
							{i.tooltipText ? (
								<CustomTooltip infoText={i.tooltipText}>
									<Typography color={i.color || 'black'}>{i.name}</Typography>
								</CustomTooltip>
							) : (
								<Typography color={i.color || 'black'}>{i.name}</Typography>
							)}
						</MenuItem>
					);
				})}
			</Menu>
			<RecapModal
				open={openRecapModal}
				setOpen={setOpenRecapModal}
				item={test}
			/>
			<DeleteDialog
				open={openDeleteDialog}
				handleClose={() => setOpenDeleteDialog(false)}
				testId={test.uid!}
			/>
		</>
	);
}
