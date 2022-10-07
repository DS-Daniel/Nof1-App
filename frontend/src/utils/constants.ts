// KEY for session storage
export const USER_CTX_KEY = 'userCtx';

// REGEX
export const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
export const oneUpperRegex = new RegExp('(?=.*[A-Z])');
export const oneLowerRegex = new RegExp('(?=.*[a-z])');
export const oneDigitOrSpecialRegex = new RegExp('((?=.*[0-9])|([^A-Za-z0-9]))');

// ENUMS
export enum TestStatus {
	Draft = 'draft',
	Ready = 'ready',
	Ongoing = 'ongoing',
	Ended = 'ended',
	Interrupted = 'interrupted',
}

// N-of-1 creation: parameter for randomization strategy
export const maxRepOptions = [1, 2, 3, 4, 5];

// Token expiration margin, in days.
export const tokenExpMargin = 14;