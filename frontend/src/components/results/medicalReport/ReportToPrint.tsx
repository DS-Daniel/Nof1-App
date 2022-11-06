import useTranslation from 'next-translate/useTranslation';
import { forwardRef } from 'react';
import { Nof1Test } from '../../../entities/nof1Test';
import { TestData } from '../../../entities/nof1Data';
import { VariableType } from '../../../entities/variable';
import ExtendedLineChart from '../lineChart';
import styles from './ReportToPrint.module.css';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/fr';
import { randomHexColor } from '../../../utils/charts';
import CustomLineChart from '../lineChart/LineChart';

dayjs.extend(LocalizedFormat);

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

		return (
			<div ref={ref} className={styles.printContainer}>
				<header className={styles.clearfix}>
					<div>
						{test.physician.lastname}
						<br />
						{test.physician.firstname}
						<br />
						{test.physician.address.street}
						<br />
						{test.physician.address.zip} {test.physician.address.city}
					</div>
					<div className={styles.rightAlign}>
						{test.patient.lastname}
						<br />
						{test.patient.firstname}
						<br />
						{test.patient.address.street}
						<br />
						{test.patient.address.zip} {test.patient.address.city}
					</div>
				</header>
				<main>
					<p className={styles.subtitle}>
						{t('report.subject', {
							patient: `${test.patient.lastname} ${test.patient.firstname}`,
						})}
					</p>
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
							{test.substancesSequence!.map((abbrev, idx) => (
								<div key={idx} className={styles.flexItem}>
									<div className={`${styles.boxedText} ${styles.subtitle}`}>
										{t('common:period')} {idx + 7}
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
						<p>{t('report.method-description')}</p>
					</section>

					<section>
						<p className={styles.subtitle}>{t('report.results')}</p>
						<p>TAB</p>
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
											width={680}
											height={250}
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
				<footer>Footer</footer>
			</div>
		);
	},
);

ReportToPrint.displayName = 'ReportToPrint';

export default ReportToPrint;
