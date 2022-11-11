import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import useTranslation from 'next-translate/useTranslation';
import { generateXLSX } from '../../utils/xlsx';

interface Props {
	data: {
		filename: string;
		rows: any[];
		headers: string[];
	};
}

/**
 * Toolbar component offering a XLSX file export for a table data.
 */
export default function ExportToolbar({ data }: Props) {
	const { t } = useTranslation('results');

	/**
	 * Handle click on the export button.
	 */
	const handleExport = () => {
		generateXLSX(data.filename, data.rows, data.headers);
	};

	return (
		<Toolbar variant="dense" sx={{ justifyContent: 'flex-end' }}>
			<Button endIcon={<FileDownloadOutlinedIcon />} onClick={handleExport}>
				{t('xlsx.export')}
			</Button>
		</Toolbar>
	);
}
