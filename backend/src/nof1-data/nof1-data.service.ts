import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose';
import { Nof1TestsService } from '../nof1-tests/nof1-tests.service';
import { CreateNof1DataDto } from './dto/create-nof1-data.dto';
import { UpdateNof1DataDto } from './dto/update-nof1-data.dto';
import { Nof1Data, Nof1DataDoc } from './schemas/nof1Data.schema';

/**
 * Service managing documents for health variables data of N-of-1 tests.
 */
@Injectable()
export class Nof1DataService {
  constructor(
    @InjectModel(Nof1Data.name)
    private readonly nof1DataModel: Model<Nof1DataDoc>,
    private readonly nof1TestsService: Nof1TestsService,
  ) {}

  /**
   * Creates a N-of-1 health variables data document.
   * @param createNof1DataDto Dto representing data.
   * @returns The id of the created document or a BadRequest exception.
   */
  async create(createNof1DataDto: CreateNof1DataDto) {
    try {
      const doc = await this.nof1DataModel.create(createNof1DataDto);
      return { id: doc.id };
    } catch (error) {
      if (error instanceof MongooseError.ValidationError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Retrieves a N-of-1 health variables data document.
   * @param testId The id of the document to retrieve.
   * @returns The document or null.
   */
  async findOne(testId: string) {
    const response = await this.nof1DataModel.findOne({ testId }).lean();
    return { response };
  }

  /**
   * Retrieves a N-of-1 test document and its health variables data document, if any.
   * @param testId The id of the N-of-1 test.
   * @returns An object containing the N-of-1 test document and its associated
   * health variables data if any.
   */
  async patientData(testId: string) {
    const test = await this.nof1TestsService.findOne(testId);
    const nof1Data = await this.nof1DataModel.findOne({ testId }).lean();
    return { test, data: nof1Data?.data };
  }

  /**
   * Updates a N-of-1 health variables data document.
   * @param testId The id of the document.
   * @param updateNof1DataDto Dto representing data.
   * @returns A message indicating a successful update or
   * a BadRequest exception.
   */
  async update(testId: string, updateNof1DataDto: UpdateNof1DataDto) {
    try {
      const doc = await this.nof1DataModel.findOneAndUpdate(
        { testId },
        updateNof1DataDto,
      );
      return { msg: `updated : ${doc.id}` };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Updates a N-of-1 health variables data document, through a patient request.
   * Checks the validity of the test period before allowing an update.
   * It is not possible to update the data after the defined expiration time.
   * @param testId The id of the document.
   * @param updateNof1DataDto Dto representing data.
   * @returns A message indicating a successful update or
   * a BadRequest exception.
   */
  updatePatientData(testId: string, updateNof1DataDto: UpdateNof1DataDto) {
    console.log('date now: ', new Date().toLocaleDateString());
    console.log(
      'end date: ',
      updateNof1DataDto.testEndDate.toLocaleDateString(),
    );

    updateNof1DataDto.testEndDate.setDate(
      updateNof1DataDto.testEndDate.getDate() + 14,
    ); // modifications deadline

    console.log(
      'end date: ',
      updateNof1DataDto.testEndDate.toLocaleDateString(),
    );

    if (new Date() > updateNof1DataDto.testEndDate) {
      throw new BadRequestException('Deadline exceeded');
    }
    this.update(testId, updateNof1DataDto);
  }

  /**
   * Deletes a N-of-1 health variables data document.
   * @param testId The id of the document.
   * @returns A message indicating the document deletion.
   */
  async remove(testId: string) {
    await this.nof1DataModel.findOneAndDelete({ testId });
    return { msg: `Data for N-of-1 test with id: "${testId}" were deleted` };
  }
}
