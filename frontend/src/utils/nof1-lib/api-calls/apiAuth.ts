import { UserContextType } from '../../../context/UserContext';
import { toPhysician } from './common';

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

const getWithCredentials = async (endpoint: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}${endpoint}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		},
	);
	return await response.json();
};

export const getCaptcha = (): Promise<{ captchaImg: string }> => {
	return getWithCredentials('/captcha');
};

export const verifyCaptcha = (
	captcha: string,
): Promise<{ verified: boolean }> => {
	return getWithCredentials(`/captcha/verify/${captcha}`);
};
