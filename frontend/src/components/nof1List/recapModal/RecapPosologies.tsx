import Stack from '@mui/material/Stack';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { SubstancePosologies } from '../../../entities/posology';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Helper method to render a TableCell component.
 * @param value Cell content.
 * @returns The TableCell component.
 */
const renderTableCell = (value: number) => {
	return (
		<TableCell align="center">
			<Typography variant="body2">{value}</Typography>
		</TableCell>
	);
};

interface RecapPosologiesProps {
	allPosologies: SubstancePosologies[];
}

/**
 * Component rendering all substances posologies.
 */
export default function RecapPosologies({
	allPosologies,
}: RecapPosologiesProps) {
	const { t } = useTranslation('createTest');

	const headers = [
		t('common:posology-table.day'),
		t('common:posology-table.morning'),
		t('common:posology-table.fraction'),
		t('common:posology-table.noon'),
		t('common:posology-table.fraction'),
		t('common:posology-table.evening'),
		t('common:posology-table.fraction'),
		t('common:posology-table.night'),
		t('common:posology-table.fraction'),
	];

	return (
		<Accordion TransitionProps={{ unmountOnExit: true }}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography variant="h5">
					{t('parameters.subtitle-posology')}
				</Typography>
			</AccordionSummary>
			<AccordionDetails sx={{ pt: 0 }}>
				{allPosologies.map(({ substance, posologies }, index) => (
					<Stack key={`substance-posology-${index}`} spacing={1} pt={2}>
						<Typography variant="h6">
							{t('parameters.substance-x', { substance })}
						</Typography>
						{posologies.map(({ posology, repeatLast }, idx) => (
							<Box key={`substance-posology-data-${idx}`}>
								<Typography>
									{t('parameters.posology-x', { x: idx + 1 })}
								</Typography>
								<TableContainer>
									<Table sx={{ minWidth: 600 }} size="small">
										<TableHead>
											<TableRow>
												{headers.map((header, index) => (
													<TableCell key={`var-header-${index}`} align="center">
														<Typography variant="body1" fontWeight="bold">
															{header}
														</Typography>
													</TableCell>
												))}
											</TableRow>
										</TableHead>
										<TableBody>
											{posology.map((row, index) => (
												// iterate over object properties does not guarantee right ordering
												<TableRow key={index}>
													{renderTableCell(row.day)}
													{renderTableCell(row.morning)}
													{renderTableCell(row.morningFraction)}
													{renderTableCell(row.noon)}
													{renderTableCell(row.noonFraction)}
													{renderTableCell(row.evening)}
													{renderTableCell(row.eveningFraction)}
													{renderTableCell(row.night)}
													{renderTableCell(row.nightFraction)}
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
								<Stack direction="row" alignItems="center" spacing={2}>
									<Radio checked={repeatLast} />
									<Typography>
										{t('parameters.posology-repeat-switch')}
									</Typography>
								</Stack>
							</Box>
						))}
					</Stack>
				))}
			</AccordionDetails>
		</Accordion>
	);
}
