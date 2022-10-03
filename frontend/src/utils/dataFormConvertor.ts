import { Patient, Physician } from '../entities/people';
import { PatientFormData, PhysicianFormData, RegisterForm } from './zodValidationHook';

/**
 * Format the registration form data to API format.
 * @param data Data of the form.
 * @returns Data formatted.
 */
export const formatRegisterData = (data: RegisterForm) => {
	return {
		email: data.email,
		password: data.password,
		lastname: data.lastname,
		firstname: data.firstname,
		address: {
			street: data.street,
			zip: data.zip,
			city: data.city,
		},
		phone: data.phone,
		institution: data.institution,
	};
};

/**
 * Format the physician form data to API format.
 * @param data Data of the form.
 * @returns Data formatted.
 */
export const formatPhysicianData = (data: PhysicianFormData): Physician => {
	const physician: Physician = {
		lastname: data.lastname,
		firstname: data.firstname,
		address: {
			street: data.street,
			zip: data.zip,
			city: data.city,
		},
		phone: data.phone,
		email: data.email,
		institution: data.institution,
	};
	if (data._id !== undefined) {
		physician._id = data._id;
	}
	if (data.tests !== undefined) {
		physician.tests = data.tests;
	}
	return physician;
};

/**
 * Format physician data to physician form data.
 * @param data Physician data.
 * @returns Data formatted.
 */
export const formatPhysicianDataToForm = (
	data: Physician,
): PhysicianFormData => {
	const formData: PhysicianFormData = {
		lastname: data.lastname,
		firstname: data.firstname,
		street: data.address.street,
		zip: data.address.zip,
		city: data.address.city,
		phone: data.phone,
		email: data.email,
		institution: data.institution,
	};
	if (data._id !== undefined) {
		formData._id = data._id;
	}
	if (data.tests !== undefined) {
		formData.tests = data.tests;
	}
	return formData;
};

/**
 * Format the patient form data to API format.
 * @param data Data of the form.
 * @returns Data formatted.
 */
export const formatPatientData = (data: PatientFormData): Patient => {
	const patient: Patient = {
		lastname: data.lastname,
		firstname: data.firstname,
		address: {
			street: data.street,
			zip: data.zip,
			city: data.city,
		},
		phone: data.phone,
		email: data.email,
		insurance: data.insurance,
		insuranceNb: data.insuranceNb,
	};
	if (data._id !== undefined) {
		patient._id = data._id;
	}
	return patient;
};

/**
 * Format patient data to patient form data.
 * @param data Patient data.
 * @returns Data formatted.
 */
export const formatPatientDataToForm = (data: Patient): PatientFormData => {
	const formData: PatientFormData = {
		lastname: data.lastname,
		firstname: data.firstname,
		street: data.address.street,
		zip: data.address.zip,
		city: data.address.city,
		phone: data.phone,
		email: data.email,
		insurance: data.insurance,
		insuranceNb: data.insuranceNb,
	};
	if (data._id !== undefined) {
		formData._id = data._id;
	}
	return formData;
};
