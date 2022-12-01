import useTranslation from 'next-translate/useTranslation';
import { AnalyseType } from '../../../utils/statistics';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface SelectAnalysisTypeProps {
	value: AnalyseType;
	onChange: (event: SelectChangeEvent<AnalyseType>) => void;
}

/**
 * Custom Select component to select the statistical analysis to perform.
 */
function SelectAnalysisType({ value, onChange }: SelectAnalysisTypeProps) {
	const { t } = useTranslation('common');
	/**
	 * Selects a traduction according to the type of analysis.
	 * @param type Analysis type
	 * @returns The traduction string.
	 */
	const selectTrad = (type: AnalyseType) => {
		switch (type) {
			case AnalyseType.NaiveANOVA:
				return t('statistics.NaiveANOVA');
			case AnalyseType.CycleANOVA:
				return t('statistics.CycleANOVA');
			case AnalyseType.ANCOVAautoregr:
				return t('statistics.ANCOVAautoregr');
		}
	};

	return (
		<Select id="statistic-type" size="small" value={value} onChange={onChange}>
			{Object.values(AnalyseType).map((t) => (
				<MenuItem key={t} value={t}>
					{selectTrad(t)}
				</MenuItem>
			))}
		</Select>
	);
}

export default SelectAnalysisType;
