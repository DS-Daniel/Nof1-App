import useTranslation from 'next-translate/useTranslation';
import { Variable, VariableType } from '../entities/variable';
import { Patient, Physician } from '../entities/people';

/**
 * Returns the default available common health variables with the right translation.
 * @returns The default available common health variables.
 */
export const usePredefinedHealthVariables: () => Variable[] = () => {
	const { t } = useTranslation('createTest');
	return [
		{
			name: t('variables.var-side-effect'),
			type: VariableType.Text,
			desc: t('variables.var-side-effect-desc'),
		},
		{
			name: t('variables.var-problem'),
			type: VariableType.Text,
			desc: t('variables.var-problem-desc'),
		},
		{
			name: t('variables.var-reserved-medic'),
			type: VariableType.Text,
			desc: t('variables.var-reserved-medic-desc'),
		},
		{
			name: t('variables.var-fraction'),
			type: VariableType.Text,
			desc: t('variables.var-fraction-desc'),
		},
		{
			name: t('variables.var-interruption'),
			type: VariableType.Text,
			desc: t('variables.var-interruption-desc'),
		},
		{
			name: t('variables.var-remarks'),
			type: VariableType.Text,
			desc: t('variables.var-remarks-desc'),
		},
	];
};

/**
 * Format et returns all necessary information to send by email to the pharmacy.
 * Data are formatted into arrays with headers for futur xlsx export.
 * Headers use the locale of session for translation.
 * @param patient Patient information.
 * @param physician Physician information.
 * @param user User information.
 * @returns An object containing all information needed to be sent.
 */
export const useEmailInfos = (
	patient: Patient,
	physician: Physician,
	user: Physician,
) => {
	const { t } = useTranslation('common');
	const contact = `${user.lastname} ${user.firstname}`;
	const msg = useEmailMsg(contact, user.email, user.phone);

	const schemaHeaders = [
		t('date'),
		t('substance'),
		t('posology-table.morning'),
		t('posology-table.fraction'),
		t('posology-table.noon'),
		t('posology-table.fraction'),
		t('posology-table.evening'),
		t('posology-table.fraction'),
		t('posology-table.night'),
		t('posology-table.fraction'),
		t('measure-unit-label'),
	];
	const personHeaders = [
		t('form.firstname'),
		t('form.lastname'),
		t('form.street'),
		t('form.zip'),
		t('form.city'),
		t('form.email'),
		t('form.phone'),
	];
	const patientHeaders = [
		...personHeaders,
		t('form.insurance'),
		t('form.insuranceNb'),
	];
	const patientInfos = [
		[t('patient')],
		patientHeaders,
		[
			patient.firstname,
			patient.lastname,
			patient.address.street,
			patient.address.zip,
			patient.address.city,
			patient.email,
			patient.phone,
			patient.insurance,
			patient.insuranceNb,
		],
	];
	const physicianHeaders = [...personHeaders, t('form.institution')];
	const physicianInfos = [
		[t('physician')],
		physicianHeaders,
		[
			physician.firstname,
			physician.lastname,
			physician.address.street,
			physician.address.zip,
			physician.address.city,
			physician.email,
			physician.phone,
			physician.institution,
		],
	];
	const nof1PhysicianInfos = [
		[t('nof1-physician')],
		physicianHeaders,
		[
			user.firstname,
			user.lastname,
			user.address.street,
			user.address.zip,
			user.address.city,
			user.email,
			user.phone,
			user.institution,
		],
	];
	return {
		schemaHeaders,
		patientInfos,
		physicianInfos,
		nof1PhysicianInfos,
		msg,
	};
};

/**
 * Prepare and return the email message to be sent.
 * The message is formatted as text and html.
 * Message use the locale of session for translation.
 * @param contact Full name of the contact.
 * @param contactEmail Email of the contact.
 * @param phone Phone of the contact.
 * @returns An object containing the message as plain text and html.
 */
const useEmailMsg = (contact: string, contactEmail: string, phone: string) => {
	const { t } = useTranslation('mail');

	const text = `${t('warning')}

${t('hello')}

${t('intro')}
${t('intro1')}
${t('intro2')}

${t('contact')}
${t('contact-name', { name: contact })}
${t('contact-email', { email: contactEmail })}
${t('contact-phone', { phone: phone })}

${t('greetings')}
`;

	const html = `<p><i>${t('warning')}</i></p>
	<br/>
	<p>${t('hello')}</p>
	<p>
		${t('intro')}<br/>
		${t('intro1')}<br/>
		${t('intro2')}
	</p>
	<p>${t('contact')}</p>
	<p>
		${t('contact-name', { name: contact })}<br/>
		${t('contact-email', { email: contactEmail })}<br/>
		${t('contact-phone', { phone: phone })}
	</p>
	<p>${t('greetings')}</p>
	`;

	return { text, html };
};
