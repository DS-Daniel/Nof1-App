// Types for the patient's health variables data.

export type Nof1Data = {
	testId: string;
	data: TestData;
};

export type TestData = {
	day: number;
	date: Date;
	substance: string;
	data: {
		variableName: string;
		value: string;
	}[];
}[];
