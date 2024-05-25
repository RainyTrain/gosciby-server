import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedbackDto } from './dto/createFeedback.dto';
import { UpdateFeedback } from './dto/updateFeedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private prismaService: PrismaService) {}

  async getAllFeedbacks() {
    try {
      const feedbacks = await this.prismaService.feedback.findMany();

      if (!feedbacks) {
        throw new Error();
      }

      return feedbacks;
    } catch (error) {
      throw new HttpException('Feedbacks not found', 404);
    }
  }

  async getFeedbacksForAccomodationId(id: number) {
    try {
      const feedbacks = await this.prismaService.feedback.findMany({
        where: {
          booking: { accomodationId: id },
        },
      });

      if (!feedbacks) {
        throw new Error();
      }

      return feedbacks;
    } catch (error) {
      throw new HttpException('Feedbacks not found', 404);
    }
  }

  async createNewFeedback(dto: CreateFeedbackDto) {
    try {
      const newFeedback = await this.prismaService.feedback.create({
        data: dto,
      });

      if (!newFeedback) {
        throw new Error();
      }

      return newFeedback;
    } catch (error) {
      throw new HttpException('Error while creating feedback', 400);
    }
  }

  async editFeedbackById(id: number, dto: UpdateFeedback) {
    try {
      const feedback = await this.prismaService.feedback.findUnique({
        where: { id: id },
      });

      if (!feedback) {
        throw new Error();
      }

      const updatedFeedback = await this.prismaService.feedback.update({
        where: { id: id },
        data: { ...dto },
      });

      return updatedFeedback;
    } catch (error) {
      throw new HttpException(
        'Error while editing feedback or feedback not found',
        404,
      );
    }
  }

  async deleteFeedbackById(id: number) {
    try {
      const deletedFeedback = await this.prismaService.feedback.delete({
        where: { id: id },
      });

      if (!deletedFeedback) {
        throw new Error();
      }

      return deletedFeedback;
    } catch (error) {
      throw new HttpException('Error while deleting feedback', 400);
    }
  }
}
