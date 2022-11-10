import useTranslation from 'next-translate/useTranslation';
import { forwardRef } from 'react';
import { Nof1Test } from '../../entities/nof1Test';
import { Variable, VariableType } from '../../entities/variable';
import styles from '../../../styles/Nof1.module.css';
import Binary from './Binary';
import Text from './Text';
import Numeric from './Numeric';
import Qualitative from './Qualitative';
import VAS from './VAS';
import dayjs from 'dayjs';

interface HealthLogbookProps {
	test: Nof1Test;
}

/**
 * Component that render the patient health logbook to be printed.
 */
export const HealthLogbook = forwardRef<HTMLDivElement, HealthLogbookProps>(
	({ test }, ref) => {
		const { t } = useTranslation('importData');

		/**
		 * Render the correct Variable according to its type.
		 * @param variable Variable.
		 * @returns The correct variable component.
		 */
		const renderVariable = (variable: Variable) => {
			switch (variable.type) {
				case VariableType.Text:
					return <Text variable={variable} />;
				case VariableType.Binary:
					return <Binary variable={variable} />;
				case VariableType.VAS:
					return <VAS variable={variable} />;
				case VariableType.Numeric:
					return <Numeric variable={variable} />;
				case VariableType.Qualitative:
					return <Qualitative variable={variable} />;
			}
		};

		return (
			<div ref={ref} className={styles.printContainer}>
				<div>
					<div>
						{test.patient.lastname} {test.patient.firstname}
						<br />
						{test.patient.address.street}
						<br />
						{test.patient.address.zip} {test.patient.address.city}
					</div>
					<h3 className={styles.title}>{t('logbookTitle')}</h3>
					<p>{t('subtitle')}</p>
				</div>
				{Array.from({ length: test.nbPeriods * test.periodLen }).map(
					(_, idx) => (
						<div key={idx} className={styles.paper + ' ' + styles.pageBreak}>
							<div className={styles.paperHeader}>
								<span>
									{t('common:date')} :{' '}
									{dayjs(test.beginningDate)
										.add(idx, 'day')
										.toDate()
										.toLocaleDateString()}
								</span>
								<span>
									{t('common:day')} {idx + 1} | {t('period')}{' '}
									{Math.floor(idx / test.periodLen) + 1}
								</span>
							</div>
							<div className={styles.variables}>
								{test.monitoredVariables.map((v, index) => (
									<div
										key={index}
										className={styles.variable + ' ' + styles.avoidBreak}
									>
										{renderVariable(v)}
									</div>
								))}
								{idx > 0 && (idx - 1) % test.periodLen === 0 && (
									<>
										<div className={styles.periodQuestion}>
											<span>{t('supposition')}</span>
											<div className={styles.periodAnswer} />
										</div>
										<div className={styles.periodQuestion}>
											<span>{t('preference')}</span>
											<div className={styles.periodAnswer} />
										</div>
										<div className={styles.periodQuestion}>
											{t('preference-remark')} :
										</div>
										<div className={styles.textarea} />
									</>
								)}
							</div>
						</div>
					),
				)}
			</div>
		);
	},
);

HealthLogbook.displayName = 'HealthLogbook';
