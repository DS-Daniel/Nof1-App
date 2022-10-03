import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateNof1DataDto } from './dto/create-nof1-data.dto';
import { UpdateNof1DataDto } from './dto/update-nof1-data.dto';
import { Nof1DataService } from './nof1-data.service';

/**
 * Controller managing endpoints for health variables data of N-of-1 tests.
 */
@ApiBearerAuth()
@ApiTags('nof1-data')
@Controller('nof1-data')
export class Nof1DataController {
  constructor(private readonly nof1DataService: Nof1DataService) {}

  /**
   * Create a N-of-1 health variables data document.
   * @param createNof1DataDto Dto representing data.
   * @returns The id of the created document or a BadRequest message.
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createNof1DataDto: CreateNof1DataDto) {
    return this.nof1DataService.create(createNof1DataDto);
  }

  /**
   * Retrieve a N-of-1 health variables data document.
   * @param testId The id of the document to retrieve.
   * @returns The document.
   */
  @Get(':testId')
  findOne(@Param('testId') testId: string) {
    return this.nof1DataService.findOne(testId);
  }

  /**
   * Update a N-of-1 health variables data document.
   * @param testId The id of the document.
   * @param updateNof1DataDto Dto representing data.
   * @returns A message indicating a successful update or
   * a BadRequest message.
   */
  @Patch(':testId')
  update(
    @Param('testId') testId: string,
    @Body() updateNof1DataDto: UpdateNof1DataDto,
  ) {
    return this.nof1DataService.update(testId, updateNof1DataDto);
  }

  /**
   * Delete a N-of-1 health variables data document.
   * @param testId The id of the document.
   * @returns A message indicating the document deletion.
   */
  @Delete(':testId')
  remove(@Param('testId') testId: string) {
    return this.nof1DataService.remove(testId);
  }
}
