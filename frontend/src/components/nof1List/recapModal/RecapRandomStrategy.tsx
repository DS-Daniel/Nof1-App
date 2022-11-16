import useTranslation from 'next-translate/useTranslation';
import Typography from '@mui/material/Typography';
import {
	RandomizationStrategy,
	RandomStrategy,
} from '../../../utils/nof1-lib/randomizationStrategy';

interface RecapRandomStrategyProps {
	strategy: RandomizationStrategy;
}

/**
 * Component rendering the chosen randomization strategy.
 */
export default function RecapRandomStrategy({
	strategy,
}: RecapRandomStrategyProps) {
	const { t } = useTranslation('createTest');

	/**
	 * @returns The appropriate randomization strategy text.
	 */
	const renderStrategy = () => {
		switch (strategy.strategy) {
			case RandomStrategy.Permutations:
				return t('parameters.RS-permutation');
			case RandomStrategy.MaxRep:
				return `${t('parameters.RS-random-max-rep')}. ${t(
					'parameters.RS-random-max-rep-N',
				)} : ${strategy.maxRep}.`;
		}
	};

	return (
		<>
			<Typography variant="h5" mb={1}>
				{t('parameters.subtitle-randomStrategy')}
			</Typography>
			<Typography>{renderStrategy()}</Typography>
		</>
	);
}
