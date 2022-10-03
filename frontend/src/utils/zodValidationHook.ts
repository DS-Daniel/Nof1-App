import { object, string } from 'zod';
import useTranslation from 'next-translate/useTranslation';
import { oneDigitOrSpecialRegex, oneLowerRegex, oneUpperRegex } from './constants';

/**
 * Returns a Zod validation schema for user registration form.
 * @returns The register form validation schema.
 */
export function useRegisterSchema() {
	const { t } = useTranslation('common');
	const common = useCommonSchema();

	return common
		.extend({
			institution: string()
				.min(1, t('formErrors.requiredField'))
				.max(32, t('formErrors.maxLen')),
			password: string()
				.min(8, t('formErrors.minLen'))
				.max(32, t('formErrors.maxLen'))
				.regex(oneUpperRegex, t('formErrors.oneUpperLetter'))
				.regex(oneLowerRegex, t('formErrors.oneLowerLetter'))
				.regex(oneDigitOrSpecialRegex, t('formErrors.oneDigitOrSpecial')),
			passwordConfirm: string().min(1, t('formErrors.passwordConfirm')),
		})
		.refine((data) => data.password === data.passwordConfirm, {
			path: ['passwordConfirm'],
			message: t('formErrors.passwordConfirmNoMatch'),
		});
}

/**
 * Registration form data.
 */
export type RegisterForm = {
	institution: string;
	firstname: string;
	lastname: string;
	phone: string;
	street: string;
	zip: string;
	city: string;
	email: string;
	password: string;
	passwordConfirm: string;
};

/**
 * Returns a Zod validation schema for common fields of the different forms.
 * @returns The common fields validation schema.
 */
function useCommonSchema() {
	const { t } = useTranslation('common');

	return object({
		firstname: string()
			.min(1, t('formErrors.requiredField'))
			.max(32, t('formErrors.maxLen')),
		lastname: string()
			.min(1, t('formErrors.requiredField'))
			.max(32, t('formErrors.maxLen')),
		phone: string()
			.min(1, t('formErrors.requiredField'))
			.max(20, t('formErrors.digitsMax'))
			.regex(/^[0-9]+$/, t('formErrors.digitsRequired')),
		street: string()
			.min(1, t('formErrors.requiredField'))
			.max(32, t('formErrors.maxLen')),
		zip: string()
			.min(1, t('formErrors.requiredField'))
			.max(20, t('formErrors.digitsMax'))
			.regex(/^[0-9]+$/, t('formErrors.digitsRequired')),
		city: string()
			.min(1, t('formErrors.requiredField'))
			.max(32, t('formErrors.maxLen')),
		email: string()
			.min(1, t('formErrors.requiredField'))
			.email(t('formErrors.emailInvalid')),
	});
}

/**
 * Returns a Zod validation schema for physician form.
 * @returns The physician form validation schema.
 */
export function usePhysicianSchema() {
	const { t } = useTranslation('common');
	const common = useCommonSchema();

	return common.extend({
		institution: string()
			.min(1, t('formErrors.requiredField'))
			.max(32, t('formErrors.maxLen')),
		_id: string().optional(),
		tests: string().array().optional(),
	});
}

export type PhysicianFormData = {
	_id?: string;
	institution: string;
	lastname: string;
	firstname: string;
	phone: string;
	email: string;
	street: string;
	zip: string;
	city: string;
	tests?: string[];
};

/**
 * Returns a Zod validation schema for patient form.
 * @returns The patient form validation schema.
 */
export function usePatientSchema() {
	const { t } = useTranslation('common');
	const common = useCommonSchema();

	return common.extend({
		insurance: string()
			.min(1, t('formErrors.requiredField'))
			.max(32, t('formErrors.maxLen')),
		insuranceNb: string()
			.min(1, t('formErrors.requiredField'))
			.max(32, t('formErrors.maxLen')),
		_id: string().optional(),
	});
}

export type PatientFormData = {
	_id?: string | undefined;
	firstname: string;
	lastname: string;
	phone: string;
	street: string;
	zip: string;
	city: string;
	email: string;
	insurance: string;
	insuranceNb: string;
};

/**
 * Returns a Zod validation schema for email form.
 * @returns The email form validation schema.
 */
export function useEmailSchema() {
	const { t } = useTranslation('common');
	return object({
		email: string()
			.min(1, t('formErrors.requiredField'))
			.email(t('formErrors.emailInvalid')),
	});
}
