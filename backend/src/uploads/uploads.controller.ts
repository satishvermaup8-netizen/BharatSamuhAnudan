import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { UploadsService } from './uploads.service';

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('kyc')
  @Throttle(5, 60) // 5 uploads per minute per user
  @ApiOperation({ summary: 'Upload KYC document to S3' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadKycDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('documentType') documentType: string,
    @Req() req: Request,
  ) {
    // Extract authenticated user ID from JWT token only
    const userId = (req.user as any)?.userId;
    if (!userId) {
      throw new ForbiddenException('User ID not found in authentication token');
    }

    const result = await this.uploadsService.uploadFile(file, userId, documentType);
    return {
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: result.url,
        key: result.key,
        documentType,
      },
    };
  }
}
