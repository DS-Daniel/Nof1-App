import useTranslation from 'next-translate/useTranslation';
import { Dispatch, SetStateAction } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { RandomStrategy } from '../../../utils/nof1-lib/randomizationStrategy';
import Substances from './Substances';
import RandomizationStrategy from './RandomizationStrategy';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Substance } from '../../../entities/substance';
import { SubstancePosologies } from '../../../entities/posology';
import Posologies from './Posologies';
import { maxValue } from '../../../utils/constants';

export interface SubstancesProps {
	substances: Substance[];
	setSubstances: Dispatch<SetStateAction<Substance[]>>;
	editable: boolean;
}

export interface RandomStrategyProps {
	strategy: RandomStrategy;
	setStrategy: Dispatch<SetStateAction<RandomStrategy>>;
	maxRep: number;
	setMaxRep: Dispatch<SetStateAction<number>>;
}

export interface PosologiesProps {
	substances: Substance[];
	setSubstances: Dispatch<SetStateAction<Substance[]>>;
	periodLen: number;
	allPosologies: SubstancePosologies[];
	setAllPosologies: Dispatch<SetStateAction<SubstancePosologies[]>>;
}

interface TestParametersProps
	extends Omit<SubstancesProps, 'editable'>,
		RandomStrategyProps,
		Omit<PosologiesProps, 'substances' | 'setSubstances'> {
	nbPeriods: number;
	setNbPeriods: Dispatch<SetStateAction<number>>;
	setPeriodLen: Dispatch<SetStateAction<number>>;
}

/**
 * Test parameters section component. Renders inputs for the parameters of the test.
 */
export default function TestParameters({
	substances,
	setSubstances,
	strategy,
	setStrategy,
	maxRep,
	setMaxRep,
	nbPeriods,
	setNbPeriods,
	periodLen,
	setPeriodLen,
	allPosologies,
	setAllPosologies,
}: TestParametersProps) {
	const { t } = useTranslation('createTest');
	const nbPeriodsError = nbPeriods > maxValue;
	const periodLenError = periodLen > maxValue;

	return (
		<Paper sx={{ p: 3, width: '100%' }}>
			<Grid container rowSpacing={2}>
				<Grid item xs={12}>
					<Typography variant="h5" fontWeight="bold">
						{t('parameters.title')}
					</Typography>
				</Grid>

				<Grid item xs={12} sm={6}>
					<Typography variant="h6" fontWeight="bold">
						{t('parameters.subtitle-duration')}
					</Typography>
					<Stack direction="row" alignItems="center" spacing={3} my={2}>
						<Typography variant="body1">
							{t('parameters.periods-nb')}
						</Typography>
						<TextField
							size="small"
							sx={{ width: 110 }}
							type="number"
							InputProps={{ inputProps: { min: 1 } }}
							name="nbPeriods"
							value={nbPeriods}
							onChange={(e) => setNbPeriods(Number(e.target.value))}
							error={nbPeriodsError}
							helperText={
								nbPeriodsError && t('parameters.max-value', { max: maxValue })
							}
						/>
					</Stack>
					<Stack direction="row" alignItems="center" spacing={3} my={2}>
						<Typography variant="body1">
							{t('parameters.period-duration')}
						</Typography>
						<TextField
							disabled={allPosologies.length !== 0}
							size="small"
							sx={{ width: 110 }}
							type="number"
							InputProps={{ inputProps: { min: 1 } }}
							name="periodLen"
							value={periodLen}
							onChange={(e) => setPeriodLen(Number(e.target.value))}
							error={periodLenError}
							helperText={
								periodLenError && t('parameters.max-value', { max: maxValue })
							}
						/>
					</Stack>
				</Grid>

				<Grid item xs={12} sm={6}>
					<RandomizationStrategy
						strategy={strategy}
						setStrategy={setStrategy}
						maxRep={maxRep}
						setMaxRep={setMaxRep}
					/>
				</Grid>

				<Grid item xs={12}>
					<Substances
						substances={substances}
						setSubstances={setSubstances}
						editable={allPosologies.length === 0}
					/>
				</Grid>

				<Grid item xs={12}>
					<Typography variant="h6" fontWeight="bold">
						{t('parameters.subtitle-posology')}
					</Typography>
					<Typography sx={{ whiteSpace: 'pre-line' }}>
						{t('parameters.posology-desc')}
					</Typography>
				</Grid>

				<Grid item xs={12}>
					<Posologies
						substances={substances}
						setSubstances={setSubstances}
						periodLen={periodLen}
						allPosologies={allPosologies}
						setAllPosologies={setAllPosologies}
					/>
				</Grid>
			</Grid>
		</Paper>
	);
}
