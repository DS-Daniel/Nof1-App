import { apiCall, apiGet } from './common';

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
