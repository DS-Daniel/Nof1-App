import useTranslation from 'next-translate/useTranslation';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { RandomStrategy } from '../../../utils/nof1-lib/randomizationStrategy';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { RandomStrategyProps } from '.';
import { maxRepOptions } from '../../../utils/constants';
import { useState, useEffect } from 'react';

/**
 * Randomization strategy component. Renders the radio group for all strategies.
 */
export default function RandomizationStrategy({
	strategy,
	setStrategy,
	maxRep,
	setMaxRep,
}: RandomStrategyProps) {
	const { t } = useTranslation('createTest');
	const [disabledInput, setDisabledInput] = useState(true);

	// disable maxRep input if strategy not selected.
	useEffect(() => {
		setDisabledInput(strategy != RandomStrategy.MaxRep);
	}, [strategy]);

	/**
	 * Render the appropriate strategy label component.
	 * @param strategy Strategy.
	 * @returns The appropriate strategy label component.
	 */
	const strategyLabels = (strategy: RandomStrategy) => {
		switch (strategy) {
			case RandomStrategy.Permutations:
				return (
					<Stack direction="row" alignItems="center" pt={'9px'}>
						{t('parameters.RS-permutation')}
						<Tooltip
							title={
								<Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
									{t('parameters.RS-permutation-helper')}
								</Typography>
							}
							placement="right"
							arrow
						>
							<InfoOutlinedIcon color="primary" />
						</Tooltip>
					</Stack>
				);
			case RandomStrategy.MaxRep:
				return (
					<>
						<Typography variant="body1" pt={'9px'}>
							{t('parameters.RS-random-max-rep')}
						</Typography>
						<Stack direction="row" alignItems="center" spacing={2}>
							<Typography component="span" variant="body1">
								{t('parameters.RS-random-max-rep-N')}
							</Typography>
							<Select
								id="maxRep-select"
								size="small"
								disabled={disabledInput}
								value={maxRep}
								onChange={(e) => setMaxRep(Number(e.target.value))}
							>
								{maxRepOptions.map((rep) => {
									return (
										<MenuItem key={rep} value={rep}>
											{rep}
										</MenuItem>
									);
								})}
							</Select>
						</Stack>
					</>
				);
			case RandomStrategy.Random:
				return (
					<Typography variant="body1" pt={'9px'}>
						{t('parameters.RS-random')}
					</Typography>
				);
		}
	};

	return (
		<>
			<Typography variant="h6" fontWeight="bold">
				{t('parameters.subtitle-randomStrategy')}
			</Typography>
			<Typography>{t('parameters.randomStrategy-desc')}</Typography>
			<FormControl>
				<RadioGroup
					name="strategy-group"
					value={strategy}
					onChange={(e) => setStrategy(e.target.value as RandomStrategy)}
				>
					{Object.values(RandomStrategy).map((strategy) => {
						return (
							<FormControlLabel
								key={strategy}
								value={strategy}
								control={<Radio />}
								label={strategyLabels(strategy)}
								sx={{ alignItems: 'flex-start' }}
							/>
						);
					})}
				</RadioGroup>
			</FormControl>
		</>
	);
}
