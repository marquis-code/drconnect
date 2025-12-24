import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import {
  CreateEnquiryDto,
  UpdateEnquiryDto,
  QueryEnquiryDto,
} from './dto/create-enquiry.dto';
import { EnquiryStatus } from '../schemas/enquiry.schema';

@Controller('enquiries')
export class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEnquiryDto: CreateEnquiryDto, @Req() req: any) {
    // Capture IP and User Agent from request
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    return this.enquiryService.create({
      ...createEnquiryDto,
      ipAddress,
      userAgent,
    });
  }

  @Get()
  async findAll(@Query() queryDto: QueryEnquiryDto) {
    return this.enquiryService.findAll(queryDto);
  }

  @Get('statistics')
  async getStatistics() {
    return this.enquiryService.getStatistics();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.enquiryService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEnquiryDto: UpdateEnquiryDto,
  ) {
    return this.enquiryService.update(id, updateEnquiryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.enquiryService.remove(id);
  }

  @Patch(':id/assign')
  async assignEnquiry(
    @Param('id') id: string,
    @Body('assignedTo') assignedTo: string,
  ) {
    return this.enquiryService.assignEnquiry(id, assignedTo);
  }

  @Patch('bulk/status')
  async bulkUpdateStatus(
    @Body('ids') ids: string[],
    @Body('status') status: EnquiryStatus,
  ) {
    const count = await this.enquiryService.bulkUpdateStatus(ids, status);
    return {
      message: `Successfully updated ${count} enquiries`,
      count,
    };
  }
}