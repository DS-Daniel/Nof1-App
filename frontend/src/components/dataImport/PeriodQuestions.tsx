import { MutableRefObject, useEffect, useRef, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { TestData } from '../../entities/nof1Data';
import { Substance } from '../../entities/substance';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextareaWithCustomValidation from '../common/TextareaWithCustomValidation';

interface PeriodQuestionsProps {
	dayIdx: number;
	testData: MutableRefObject<TestData | undefined>;
	substances: Substance[];
}

export default function PeriodQuestions({
	dayIdx,
	testData,
	substances,
}: PeriodQuestionsProps) {
	const { t } = useTranslation('importData');
	const [supposition, setSupposition] = useState(
		testData.current![dayIdx].supposition || t('idk'),
	);
	const [prefValue, setPrefValue] = useState(
		testData.current![dayIdx].preference?.value || '',
	);

	return (
		<>
			<Grid item xs={12} sm={8}>
				<Typography>{t('supposition')}</Typography>
			</Grid>
			<Grid item xs={12} sm={4}>
				<Select
					size="small"
					fullWidth
					id="supposition"
					value={supposition}
					onChange={(e) => {
						setSupposition(e.target.value);
						testData.current![dayIdx].supposition = e.target.value;
					}}
				>
					<MenuItem value={t('idk')}>{t('idk')}</MenuItem>
					{substances.map((sub) => (
						<MenuItem key={sub.abbreviation} value={sub.name}>
							{sub.name}
						</MenuItem>
					))}
				</Select>
			</Grid>
			<Grid item xs={12} sm={9}>
				<Typography>{t('preference')}</Typography>
			</Grid>
			<Grid item xs={12} sm={3}>
				<Select
					size="small"
					fullWidth
					id="preference"
					displayEmpty
					value={prefValue}
					onChange={(e) => {
						setPrefValue(e.target.value);
						let pref = testData.current![dayIdx].preference;
						testData.current![dayIdx].preference = {
							...pref,
							value: e.target.value,
						};
						console.log(testData.current![dayIdx]);
					}}
				>
					<MenuItem value={t('common:yes')}>{t('common:yes')}</MenuItem>
					<MenuItem value={t('common:no')}>{t('common:no')}</MenuItem>
				</Select>
			</Grid>
			<Grid item xs={12} sm={9}>
				<TextareaWithCustomValidation
					label={t('preference-remark')}
					defaultValue={testData.current![dayIdx].preference?.remark || ''}
					onChange={(val) => {
						let pref = testData.current![dayIdx].preference;
						testData.current![dayIdx].preference = {
							...pref,
							remark: val,
						};
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={3}>
				<FormControl>
					<RadioGroup
						row
						value={prefValue}
						onChange={(e) => {
							setPrefValue(e.target.value);
							let pref = testData.current![dayIdx].preference;
							testData.current![dayIdx].preference = {
								...pref,
								value: e.target.value,
							};
						}}
					>
						<FormControlLabel
							value={t('common:yes')}
							control={<Radio />}
							label={t('common:yes')}
							labelPlacement="bottom"
						/>
						<FormControlLabel
							value={t('common:no')}
							control={<Radio />}
							label={t('common:no')}
							labelPlacement="bottom"
						/>
					</RadioGroup>
				</FormControl>
			</Grid>
		</>
	);
}
