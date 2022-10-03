import { Variable } from '../../entities/variable';
import useTranslation from 'next-translate/useTranslation';
import VarLayout from './VarLayout';
import styles from '../../../styles/Nof1.module.css';

interface TextProps {
	variable: Variable;
}

/**
 * Component that render input for a text type variable.
 */
export default function Text({ variable }: TextProps) {
	const { t } = useTranslation('importData');

	return (
		<VarLayout name={variable.name} desc={variable.desc}>
			<p className={styles.txt}>{t('response')}</p>
			<div className={styles.textarea} />
		</VarLayout>
	);
}
