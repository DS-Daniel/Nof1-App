import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Dispatch, SetStateAction, useState } from 'react';
import TextField from '@mui/material/TextField';
import useTranslation from 'next-translate/useTranslation';
import dayjs from 'dayjs';

interface CustomDatePickerProps {
	value: dayjs.Dayjs | null;
	setValue: Dispatch<SetStateAction<dayjs.Dayjs | null>>;
}

/**
 * Custom DatePicker component, with dayjs wrapping.
 */
export default function CustomDatePicker({
	value,
	setValue,
}: CustomDatePickerProps) {
	const { t, lang } = useTranslation('nof1List');

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DesktopDatePicker
				label={t('startingDate')}
				inputFormat={lang === 'fr' ? 'DD.MM.YYYY' : 'MM.DD.YYYY'}
				value={value}
				minDate={dayjs()}
				onChange={(newValue) => {
					setValue(newValue);
				}}
				renderInput={(params) => <TextField size="small" {...params} />}
			/>
		</LocalizationProvider>
	);
}
