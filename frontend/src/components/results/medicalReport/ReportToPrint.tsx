import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, forwardRef, useState } from 'react';
import { Nof1Test } from '../../../entities/nof1Test';
import { TestData } from '../../../entities/nof1Data';
import { VariableType } from '../../../entities/variable';
import styles from './ReportToPrint.module.css';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/fr';
import { randomHexColor } from '../../../utils/charts';
import CustomLineChart from '../lineChart/LineChart';
import Image from 'next/image';
import Button from '@mui/material/Button';

dayjs.extend(LocalizedFormat);

/**
 * Helper method to render a TableCell component.
 * @param idx Index for the key property of list element.
 * @param value Cell value.
 * @returns The TableCell component.
 */
const renderTableCell = (idx: number, value: string) => {
	return <td key={idx}>{value}</td>;
};

/**
 * Generate the rows of the table.
 * @param test N-of-1 test.
 * @returns An array of table row.
 */
const generateRows = (test: Nof1Test) => {
	const rows = test.monitoredVariables
		.filter(
			(variable) =>
				variable.type === VariableType.Numeric ||
				variable.type === VariableType.VAS,
		)
		.map((variable, idx) => [
			<td key={`${variable.name}${idx++}`}>{variable.name}</td>,
			[
				...test.substances.flatMap(() => [
					<td key={`${variable.name}${idx++}`}>{Math.random().toFixed(2)}</td>,
					<td key={`${variable.name}${idx++}`}>{Math.random().toFixed(2)}</td>,
				]),
			],
			<td key={`${variable.name}${idx++}`}>{Math.random().toFixed(2)}</td>,
		]);
	// .map((variable, idx) => [
	// 	renderTableCell(idx++, variable.name),
	// 	[
	// 		...test.substances.flatMap(() => [
	// 			renderTableCell(idx++, Math.random().toFixed(2)),
	// 			renderTableCell(idx++, Math.random().toFixed(2)),
	// 		]),
	// 	],
	// 	renderTableCell(idx++, Math.random().toFixed(2)),
	// ]);
	return rows;
};

interface ReportToPrintProps {
	test: Nof1Test;
	testData: TestData;
}

/**
 * Component that render the medical report to be printed.
 */
const ReportToPrint = forwardRef<HTMLDivElement, ReportToPrintProps>(
	({ test, testData }, ref) => {
		const { t, lang } = useTranslation('results');
		const substancesNames = test.substances.map((sub) => sub.name);
		const headers = [
			'Critère de jugement',
			...test.substances.flatMap((sub) => [
				`Moyenne ${sub.name}`,
				'Intervalle',
			]),
			'Difference',
		];
		const rows = generateRows(test);
		const [file, setFile] = useState<string | undefined>();

		const imgUpload = (e: ChangeEvent<HTMLInputElement>) => {
			console.log(e.target.files);
			if (e.target.files) setFile(URL.createObjectURL(e.target.files[0]));
		};

		return (
			<div ref={ref} className={styles.printContainer}>
				{/* <div>
					{file && (
						<div className={styles.image}> */}
							{/* <Image src={file} alt="institution_logo" /> */}
							{/* <picture>
								<source srcSet={file} type="image/webp" />
								<img
									src={file}
									alt="institution_logo"
									className={styles.image}
								/>
							</picture>
						</div>
					)}
					<input
						accept="image/png, image/jpeg"
						type="file"
						onChange={imgUpload}
						className={styles.hidden}
					/>
				</div> */}
				<header className={styles.clearfix}>
					<div>
						{test.nof1Physician.institution}
						<br />
						{test.nof1Physician.lastname} {test.nof1Physician.firstname}
						<br />
						{test.nof1Physician.address.street}
						<br />
						{test.nof1Physician.address.zip} {test.nof1Physician.address.city}
					</div>
					<div className={styles.rightAlign}>
						{test.nof1Physician.institution}
						<br />
						{test.physician.lastname} {test.physician.firstname}
						<br />
						{test.physician.address.street}
						<br />
						{test.physician.address.zip} {test.physician.address.city}
					</div>
				</header>
				<main>
					<p className={styles.subtitle}>
						{t('report.subject', {
							patient: `${test.patient.lastname} ${test.patient.firstname}`,
						})}
					</p>
					<section>
						<p>{t('report.dear')}</p>
						<p className={styles.justifyText}>
							{t('report.intro', {
								startDate: dayjs(test.beginningDate).locale(lang).format('LL'),
								endDate: dayjs(test.endingDate).locale(lang).format('LL'),
								substances: `[${substancesNames.join(', ')}]`,
								nbPeriods: test.nbPeriods,
								periodLen: test.periodLen,
							})}
						</p>
					</section>

					<section>
						<p className={styles.subtitle}>{t('report.sequence')}</p>
						<p>
							{t('period-duration')} {test.periodLen} {t('common:days')}.
						</p>
						<div className={styles.flexH}>
							{test.substancesSequence!.map((abbrev, idx) => (
								<div key={idx} className={styles.flexItem}>
									<div className={`${styles.boxedText} ${styles.subtitle}`}>
										{t('common:period')} {idx + 1}
									</div>
									<div className={styles.boxedText}>
										{
											test.substances.find((s) => s.abbreviation === abbrev)
												?.name
										}
									</div>
								</div>
							))}
						</div>
					</section>

					<section>
						<p className={styles.subtitle}>{t('report.method')}</p>
						<p className={styles.justifyText}>
							{t('report.method-description')}
						</p>
					</section>

					<section className={styles.avoidBreak}>
						<p className={styles.subtitle}>{t('report.results')}</p>
						<table className={styles.resultTable}>
							<thead>
								<tr>
									{headers.map((header, index) => (
										<th key={`var-header-${index}`}>{header}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{rows.map((row, index) => (
									<tr key={index}>{row}</tr>
								))}
							</tbody>
						</table>
					</section>

					<section>
						<p className={styles.subtitle}>{t('report.conclusion')}</p>
						<textarea className={styles.txtInput} />
					</section>

					<section>
						<p className={styles.subtitle}>{t('report.results-details')}</p>
						<p>{t('graph-title')} :</p>
						{testData ? (
							test.monitoredVariables
								.filter(
									(v) =>
										v.type === VariableType.Numeric ||
										v.type === VariableType.VAS,
								)
								.map((v) => (
									<div key={v.name} className={styles.avoidBreak}>
										<div className={styles.title}>{v.name}</div>
										<CustomLineChart
											height={190}
											testData={testData}
											variable={v}
											periodLen={test.periodLen}
											substancesNames={substancesNames}
											substancesColors={test.substances.map(() =>
												randomHexColor(),
											)}
										/>
									</div>
								))
						) : (
							<p>{t('no-data')}</p>
						)}
					</section>
				</main>
				<footer>Footer?</footer>
			</div>
		);
	},
);

ReportToPrint.displayName = 'ReportToPrint';

export default ReportToPrint;
