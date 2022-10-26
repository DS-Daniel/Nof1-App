import { UserContextType } from '../context/UserContext';
import { Nof1Data, Nof1DataUpdate, TestData } from '../entities/nof1Data';
import { AdministrationSchema, Nof1Test } from '../entities/nof1Test';
import { Patient, Physician } from '../entities/people';

/**
 * Authentication API call.
 * @param endpoint Endpoint to reach.
 * @param body Body of the request.
 * @param handleAuth Method handling the result of the API call.
 */
export const authenticate = async (
	endpoint: string,
	body: Object,
	handleAuth: (noError: boolean, user: UserContextType) => void,
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}${endpoint}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		},
	);
	const noError = response.ok;
	let result = await response.json();
	if (noError) {
		result = {
			access_token: result.access_token,
			user: toPhysician(result.user),
		};
	}
	handleAuth(noError, result);
};

/**
 * Get the user with the id passed in parameter.
 * @param token JWT API authorization token.
 * @param id Id of the user to retrieve.
 * @returns An object with the status of the request and the response.
 */
export const getUser = async (token: string, id: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/physicians/${id}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	);
	const success = response.ok;
	const result = await response.json();
	if (success) {
		return {
			success,
			response: toPhysician(result.response),
		};
	}
	return { success, response: result };
};

/**
 * Generic API GET request.
 * @param token JWT API authorization token.
 * @param endpoint Endpoint to reach.
 * @param param Parameter of the HTTP request.
 * @returns The result of the request.
 */
const apiGet = async (token: string, endpoint: string, param: string = '') => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}${endpoint}${param}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	);
	const result = await response.json();
	return result;
};

/**
 * Generic API request.
 * @param token JWT API authorization token.
 * @param body Body of the request.
 * @param method HTTP method of the request.
 * @param endpoint Endpoint to reach.
 * @param param Parameter of the HTTP request.
 * @returns An object with the status of the request and the response.
 */
const apiCall = async (
	token: string,
	body: any,
	method: string,
	endpoint: string,
	param: string = '',
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}${endpoint}${param}`,
		{
			method: method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		},
	);
	const result = await response.json();
	return { statusCode: response.status, response: result };
};

/**
 * Retrieve the N-of-1 tests from the list of ids provided.
 * @param token JWT API authorization token.
 * @param body List of test ids.
 * @returns An object with the status of the request and the response.
 */
export const listOfTests = (token: string, body: { ids: string[] }) => {
	return apiCall(token, body, 'POST', '/nof1-tests/list');
};

/**
 * Find a N-of-1 test by its id.
 * @param token JWT API authorization token.
 * @param id Id of the test.
 * @returns The result of the request.
 */
export const findNof1TestById = (token: string, id: string) => {
	return apiGet(token, '/nof1-tests', `/${id}`);
};

/**
 * Generic API request for N-of-1 test endpoints.
 * @param token JWT API authorization token.
 * @param body Body of the request.
 * @param method HTTP method of the request.
 * @param param Parameter of the HTTP request.
 * @returns An object with the status of the request and the response.
 */
const apiNof1Test = (
	token: string,
	body: Nof1Test | Partial<Nof1Test> | undefined,
	method: string,
	param: string = '',
) => {
	return apiCall(token, body, method, '/nof1-tests', param);
};

/**
 * Create a N-of-1 test.
 * @param token JWT API authorization token.
 * @param body N-of-1 test.
 * @returns An object with the status of the request and the response.
 */
export const createNof1Test = (token: string, body: Nof1Test) => {
	return apiNof1Test(token, body, 'POST');
};

/**
 * Update a N-of-1 test.
 * @param token JWT API authorization token.
 * @param id Id of the test.
 * @param body Elements of the N-of-1 test to update.
 * @returns An object with the status of the request and the response.
 */
export const updateNof1Test = (
	token: string,
	id: string,
	body: Partial<Nof1Test>,
) => {
	return apiNof1Test(token, body, 'PATCH', `/${id}`);
};

/**
 * Delete a N-of-1 test.
 * @param token JWT API authorization token.
 * @param id Id of the test.
 * @returns An object with the status of the request and the response.
 */
export const deleteNof1Test = (token: string, id: string) => {
	return apiNof1Test(token, undefined, 'DELETE', `/${id}`);
};

/**
 * Generic API request for physicians endpoints.
 * @param token JWT API authorization token.
 * @param body Body of the request.
 * @param method HTTP method of the request.
 * @param param Parameter of the HTTP request.
 * @returns An object with the status of the request and the response.
 */
const apiPhysicians = (
	token: string,
	body: Partial<Physician>,
	method: string,
	param: string = '',
) => {
	return apiCall(token, body, method, '/physicians', param);
};

/**
 * Create a physician.
 * @param token JWT API authorization token.
 * @param body Physician.
 * @returns An object with the status of the request and the response.
 */
export const createPhysician = (token: string, body: Physician) => {
	return apiPhysicians(token, body, 'POST');
};

/**
 * Update a physician.
 * @param token JWT API authorization token.
 * @param id Id of the physician.
 * @param body Elements of the physician to update.
 * @returns An object with the status of the request and the response.
 */
export const updatePhysician = (
	token: string,
	id: string,
	body: Partial<Physician>,
) => {
	return apiPhysicians(token, body, 'PATCH', `/${id}`);
};

/**
 * Find a physician by email.
 * @param token JWT API authorization token.
 * @param email Email of the physician.
 * @returns A Physician object or null if not found.
 */
export const findPhysician = async (token: string, email: string) => {
	const { response } = await apiGet(token, '/physicians/find/', email);
	return response ? toPhysician(response) : null;
};

/**
 * Generic API request for patients endpoints.
 * @param token JWT API authorization token.
 * @param body Body of the request.
 * @param method HTTP method of the request.
 * @param param Parameter of the HTTP request.
 * @returns An object with the status of the request and the response.
 */
const apiPatients = (
	token: string,
	body: Patient,
	method: string,
	param: string = '',
) => {
	return apiCall(token, body, method, '/patients', param);
};

/**
 * Create a patient.
 * @param token JWT API authorization token.
 * @param body Patient.
 * @returns An object with the status of the request and the response.
 */
export const createPatient = (token: string, body: Patient) => {
	return apiPatients(token, body, 'POST');
};

/**
 * Update a patient.
 * @param token JWT API authorization token.
 * @param id Id of the patient.
 * @param body Updated patient.
 * @returns An object with the status of the request and the response.
 */
export const updatePatient = (token: string, id: string, body: Patient) => {
	return apiPatients(token, body, 'PATCH', `/${id}`);
};

/**
 * Find a patient by email.
 * @param token JWT API authorization token.
 * @param email Email of the patient.
 * @returns A patient object or null if not found.
 */
export const findPatient = async (token: string, email: string) => {
	const { response } = await apiGet(token, '/patients/find/', email);
	return response ? toPatient(response) : null;
};

/**
 * Check if a user exists.
 * @param token JWT API authorization token.
 * @param email User Email.
 * @returns A user if found, otherwise null.
 */
export const userExists = async (
	token: string,
	email: string,
): Promise<{ _id: string } | null> => {
	const { response } = await apiGet(token, '/users', `/${email}`);
	return response ? response : null;
};

/**
 * Update a user email.
 * @param token JWT API authorization token.
 * @param body Object with the current email and the new one.
 * @returns An object with the status of the request and the response.
 */
export const updateUser = (
	token: string,
	body: { email: string; newEmail: string },
) => {
	return apiCall(token, body, 'PATCH', '/users');
};

/**
 * Generic API request for N-of-1 patient's health variables data endpoints.
 * @param token JWT API authorization token.
 * @param body Body of the request.
 * @param method HTTP method of the request.
 * @param param Parameter of the HTTP request.
 * @returns An object with the status of the request and the response.
 */
const apiNof1Data = (
	token: string,
	body: Partial<Nof1Data>,
	method: string,
	param: string = '',
) => {
	return apiCall(token, body, method, '/nof1-data', param);
};

/**
 * Create a N-of-1 data.
 * @param token JWT API authorization token.
 * @param body N-of-1 data.
 * @returns An object with the status of the request and the response.
 */
export const createNof1Data = (token: string, body: Nof1Data) => {
	return apiNof1Data(token, body, 'POST');
};

/**
 * Update a N-of-1 data.
 * @param token JWT API authorization token.
 * @param testId Id of the N-of-1 test which is concerned.
 * @param body Data to update.
 * @returns An object with the status of the request and the response.
 */
export const updateNof1Data = (
	token: string,
	testId: string,
	body: Partial<Nof1Data>,
) => {
	return apiNof1Data(token, body, 'PATCH', `/${testId}`);
};

/**
 * Retrieves a N-of-1 test data by its id.
 * @param token JWT API authorization token.
 * @param testId Id of the test.
 * @returns The response of the request.
 */
export const findNof1Data = (token: string, testId: string) => {
	return apiGet(token, '/nof1-data', `/${testId}`);
};

/**
 * Retrieves a N-of-1 test and its health variables data.
 * @param id Id of the test.
 * @returns Promise<{
 * success: boolean;
 * response: {test: Nof1Test, data: TestData | undefined};
 * }>
 * A promise indicating the request status and the N-of-1 test and
 * its associated health variables data if any.
 */
export const getPatientData = async (token: string, id: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/nof1-data/patient/${id}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	);
	const res = await response.json();
	return { success: response.ok, response: res };
};

/**
 * Generic API request for N-of-1 patient's health variables data endpoints.
 * Requests from the patient dedicated page.
 * @param token JWT API authorization token.
 * @param body Body of the request.
 * @param method HTTP method of the request.
 * @param param Parameter of the HTTP request.
 * @returns An object with the status of the request and the response.
 */
const patientApiCall = async (
	token: string,
	body: Partial<Nof1Data>,
	method: string,
	param: string = '',
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/nof1-data/patient${param}`,
		{
			method: method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		},
	);
	const result = await response.json();
	return { success: response.ok, response: result };
};

/**
 * Update a N-of-1 data.
 * @param token JWT API authorization token.
 * @param testId Id of the N-of-1 test which is concerned.
 * @param body Data to update.
 * @returns An object with the status of the request and the response.
 */
export const patientDataUpdate = (
	token: string,
	testId: string,
	body: Nof1DataUpdate,
) => {
	return patientApiCall(token, body, 'PATCH', `/${testId}`);
};

/**
 * Request to send an email, with data to be exported into a XLSX file.
 * @param token JWT API authorization token.
 * @param data Data to be exported.
 * @param msg Email message.
 * @param dest Recipient email.
 * @returns The response object of the request.
 */
export const sendPharmaEmail = async (
	token: string,
	data: {
		patientInfos: string[][];
		physicianInfos: string[][];
		nof1PhysicianInfos: string[][];
		schemaHeaders: string[];
		schema: AdministrationSchema;
		substancesRecap: (string | number)[][][];
	},
	msg: {
		text: string;
		html: string;
	},
	dest: string,
  subject: string,
): Promise<{
	success: boolean;
	msg: string;
}> => {
	const body = {
    msg,
		dest,
    subject,
		data,
	};
	const { response } = await apiCall(token, body, 'POST', '/mail');
	return response;
};

/**
 * Sends an email to a patient, with an access link for
 * the health variables data form.
 * @param token JWT API authorization token.
 * @param msg Email message in text and HTML format.
 * @param dest Recipient.
 * @param tokenExp Unix date indicating the expiration date of the
 * access token for the health variables data page.
 * @param notBefore Unix date indicating the date of the access token
 * validity for the health variables data page.
 * @returns An object of type { success: boolean, msg: string }.
 */
export const sendPatientEmail = async (
	token: string,
	msg: {
		text: string;
		html: string;
	},
	dest: string,
	subject: string,
	tokenExp: number,
	notBefore: number,
): Promise<{
	success: boolean;
	msg: string;
}> => {
	const body = {
		msg,
		dest,
    subject,
		tokenExp,
		notBefore,
	};
	const { response } = await apiCall(token, body, 'POST', '/mail/patient');
	return response;
};

/**
 * Format API data to a Physician object.
 * @param data Data to format.
 * @returns A physician object.
 */
const toPhysician = (data: any): Physician => {
	return {
		_id: data._id,
		lastname: data.lastname,
		firstname: data.firstname,
		address: {
			street: data.address.street,
			zip: data.address.zip,
			city: data.address.city,
			country: data.address.country,
		},
		phone: data.phone,
		email: data.email,
		institution: data.institution,
		tests: data.tests,
	};
};

/**
 * Format API data to a Patient object.
 * @param data Data to format.
 * @returns A patient object.
 */
const toPatient = (data: any): Patient => {
	return {
		_id: data._id,
		lastname: data.lastname,
		firstname: data.firstname,
		address: {
			street: data.address.street,
			zip: data.address.zip,
			city: data.address.city,
			country: data.address.country,
		},
		phone: data.phone,
		email: data.email,
		birthYear: data.birthYear,
		insurance: data.insurance,
		insuranceNb: data.insuranceNb,
	};
};
