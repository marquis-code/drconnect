import { 
  Injectable, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enquiry, EnquiryStatus } from '../schemas/enquiry.schema';
import { 
  CreateEnquiryDto, 
  UpdateEnquiryDto, 
  QueryEnquiryDto 
} from './dto/create-enquiry.dto';

@Injectable()
export class EnquiryService {
  constructor(
    @InjectModel(Enquiry.name) private enquiryModel: Model<Enquiry>,
  ) {}

  async create(createEnquiryDto: CreateEnquiryDto): Promise<Enquiry> {
    try {
      const enquiry = new this.enquiryModel(createEnquiryDto);
      return await enquiry.save();
    } catch (error) {
      throw new BadRequestException('Failed to create enquiry');
    }
  }

  async findAll(queryDto: QueryEnquiryDto) {
    const { 
      status, 
      priority, 
      assignedTo, 
      search, 
      page, 
      limit, 
      sortBy, 
      sortOrder 
    } = queryDto;

    const query: any = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [data, total] = await Promise.all([
      this.enquiryModel
        .find(query)
        // .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.enquiryModel.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Enquiry> {
    const enquiry = await this.enquiryModel.findById(id).exec();
    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }
    return enquiry;
  }

  async update(id: string, updateEnquiryDto: UpdateEnquiryDto): Promise<Enquiry> {
    const enquiry = await this.enquiryModel
      .findByIdAndUpdate(id, updateEnquiryDto, { new: true })
      .exec();

    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }

    // If status is resolved, set resolvedAt
    if (updateEnquiryDto.status === EnquiryStatus.RESOLVED && !enquiry.resolvedAt) {
      enquiry.resolvedAt = new Date();
      await enquiry.save();
    }

    return enquiry;
  }

  async remove(id: string): Promise<void> {
    const result = await this.enquiryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }
  }

  async getStatistics() {
    const total = await this.enquiryModel.countDocuments();
    const byStatus = await this.enquiryModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const byPriority = await this.enquiryModel.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    const recentEnquiries = await this.enquiryModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byPriority: byPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentEnquiries,
    };
  }

  async bulkUpdateStatus(ids: string[], status: EnquiryStatus): Promise<number> {
    const result = await this.enquiryModel.updateMany(
      { _id: { $in: ids } },
      { status }
    );
    return result.modifiedCount;
  }

  async assignEnquiry(id: string, assignedTo: string): Promise<Enquiry> {
    return this.update(id, { assignedTo });
  }
}