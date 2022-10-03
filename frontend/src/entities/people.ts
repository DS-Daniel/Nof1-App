interface PersonCommon {
	_id?: string;
	lastname: string;
	firstname: string;
	address: {
		street: string;
		zip: string;
		city: string;
	};
	phone: string;
	email: string;
}

export interface Patient extends PersonCommon {
	insurance: string;
	insuranceNb: string;
}

export interface Physician extends PersonCommon {
	institution: string;
	tests?: string[];
}

/**
 * @returns A Physician object with default values.
 */
export const defaultPhysician = () => {
	return {
		lastname: '',
		firstname: '',
		address: {
			street: '',
			zip: '',
			city: '',
		},
		phone: '',
		email: '',
		institution: '',
	};
};

/**
 * @returns A Patient object with default values.
 */
export const defaultPatient = () => {
	return {
		lastname: '',
		firstname: '',
		address: {
			street: '',
			zip: '',
			city: '',
		},
		phone: '',
		email: '',
		institution: '',
		insurance: '',
		insuranceNb: '',
	};
};
