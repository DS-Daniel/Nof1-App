import { AdministrationSchema } from "../src/entities/nof1Test";
import { generateAdministrationSchema } from "../src/utils/nof1-lib/lib";
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

describe('Nof1 lib - administrationSchema function', () => {
  const substances = [
    { name: 'Placebo', abbreviation: 'P', unit: 'ml' },
    { name: 'Aspirine', abbreviation: 'A', unit: 'g' },
  ];
  const posologies = [
    {
      substance: 'Placebo',
      posology: {
        posology: [
          {
            day: 1,
            morning: 10,
            morningFraction: 1,
            noon: 0,
            noonFraction: 1,
            evening: 0,
            eveningFraction: 1,
            night: 0,
            nightFraction: 1,
          },
          {
            day: 2,
            morning: 20,
            morningFraction: 1,
            noon: 0,
            noonFraction: 1,
            evening: 0,
            eveningFraction: 1,
            night: 0,
            nightFraction: 1,
          },
          {
            day: 3,
            morning: 30,
            morningFraction: 1,
            noon: 0,
            noonFraction: 1,
            evening: 0,
            eveningFraction: 1,
            night: 0,
            nightFraction: 1,
          },
        ],
        repeatLast: true,
      },
    },
    {
      substance: 'Aspirine',
      posology: {
        posology: [
          {
            day: 1,
            morning: 25,
            morningFraction: 1,
            noon: 0,
            noonFraction: 1,
            evening: 0,
            eveningFraction: 1,
            night: 0,
            nightFraction: 1,
          },
          {
            day: 2,
            morning: 50,
            morningFraction: 1,
            noon: 0,
            noonFraction: 1,
            evening: 0,
            eveningFraction: 1,
            night: 0,
            nightFraction: 1,
          },
          {
            day: 3,
            morning: 75,
            morningFraction: 1,
            noon: 0,
            noonFraction: 1,
            evening: 0,
            eveningFraction: 1,
            night: 0,
            nightFraction: 1,
          },
        ],
        repeatLast: true,
      },
    },
  ];
  it('should generate an administration schema correctly, without repetition', () => {
		const seq = ['P', 'A', 'P'];
		const startDate = new Date('2022-07-07T00:00:00');
		const schema = generateAdministrationSchema(
			substances,
			seq,
			posologies,
			startDate,
			3,
			3,
		);
		const res: AdministrationSchema = [
			{
				date: new Date(startDate).toLocaleDateString(),
				substance: 'Placebo',
				morning: 10,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'ml',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Placebo',
				morning: 20,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'ml',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Placebo',
				morning: 30,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'ml',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Aspirine',
				morning: 25,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'g',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Aspirine',
				morning: 50,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'g',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Aspirine',
				morning: 75,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'g',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Placebo',
				morning: 10,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'ml',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Placebo',
				morning: 20,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'ml',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Placebo',
				morning: 30,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'ml',
			},
		];
		expect(JSON.stringify(schema)).toEqual(JSON.stringify(res));
		expect(schema).toEqual(res);
	});

  it('should generate an administration schema correctly, with repetition', () => {
    const seq = ['P','A','A'];
    const startDate = new Date('2022-07-07T00:00:00');
    const schema = generateAdministrationSchema(substances, seq, posologies, startDate, 3, 3);
    const res: AdministrationSchema = [
			{
				date: new Date(startDate).toLocaleDateString(),
				substance: 'Placebo',
				morning: 10,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'ml',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Placebo',
				morning: 20,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'ml',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Placebo',
				morning: 30,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'ml',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Aspirine',
				morning: 25,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'g',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Aspirine',
				morning: 50,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'g',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Aspirine',
				morning: 75,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'g',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Aspirine',
				morning: 75,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'g',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Aspirine',
				morning: 75,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'g',
			},
			{
				date: new Date(
					startDate.setDate(startDate.getDate() + 1),
				).toLocaleDateString(),
				substance: 'Aspirine',
				morning: 75,
				morningFraction: 1,
				noon: 0,
				noonFraction: 1,
				evening: 0,
				eveningFraction: 1,
				night: 0,
				nightFraction: 1,
				unit: 'g',
			},
		];
    expect(JSON.stringify(schema)).toEqual(JSON.stringify(res));
    expect(schema).toEqual(res);
  })
});