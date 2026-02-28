import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private s3: AWS.S3 | null = null;
  private bucket: string;
  private isConfigured = false;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');

    if (accessKeyId && secretAccessKey) {
      this.s3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        region: this.configService.get('AWS_S3_REGION', 'ap-south-1'),
      });
      this.isConfigured = true;
      this.logger.log('S3 upload service configured successfully');
    } else {
      this.logger.warn(
        'AWS credentials not configured. S3 uploads will fail. ' +
        'Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.'
      );
    }
    
    this.bucket = this.configService.get('AWS_S3_BUCKET', 'bharat-samuh-anudan-uploads');
  }

  private ensureConfigured(): AWS.S3 {
    if (!this.isConfigured || !this.s3) {
      throw new BadRequestException(
        'S3 upload service is not configured. Please contact support.'
      );
    }
    return this.s3;
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    documentType: string,
  ): Promise<{ url: string; key: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and PDF are allowed.');
    }

    // Validate file size (configurable, default 5MB)
    const maxSizeMB = this.configService.get('UPLOAD_MAX_SIZE_MB', 5);
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(`File size exceeds ${maxSizeMB}MB limit`);
    }

    // Generate unique filename with safe extension validation
    const allowedExts = ['jpg', 'jpeg', 'png', 'pdf'];
    // Prevent double extension attacks (e.g., file.jpg.exe)
    const dotCount = (file.originalname.match(/\./g) || []).length;
    if (dotCount !== 1) {
      throw new BadRequestException('Invalid filename. Files must have exactly one extension.');
    }
    const lastDotIndex = file.originalname.lastIndexOf('.');
    const fileExt = lastDotIndex > 0
      ? file.originalname.slice(lastDotIndex + 1).toLowerCase()
      : '';
    // Validate: must have extension and it must be in allowed list
    if (!fileExt || !allowedExts.includes(fileExt)) {
      throw new BadRequestException('Invalid file extension. Only jpg, jpeg, png, and pdf are allowed.');
    }
    // Sanitize documentType to prevent path traversal
    const sanitizedDocType = documentType.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!sanitizedDocType) {
      throw new BadRequestException('Invalid document type. Only alphanumeric characters, hyphens, and underscores are allowed.');
    }
    const key = `kyc/${userId}/${sanitizedDocType}_${uuidv4()}.${fileExt}`;

    // Upload to S3 (no public ACL - use signed URLs for access)
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL removed - files are private by default
    };

    await this.ensureConfigured().upload(params).promise();

    // Generate signed URL for temporary access (15 minutes default)
    const url = await this.getSignedUrl(key);

    return { url, key };
  }

  async deleteFile(key: string): Promise<void> {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: this.bucket,
      Key: key,
    };

    await this.ensureConfigured().deleteObject(params).promise();
  }

  /**
   * Generate a pre-signed URL for temporary access to a private S3 object
   * @param key - The S3 object key
   * @param expiresInSeconds - URL expiration time in seconds (default: 3600 = 60 minutes)
   *                        Extended for KYC review sessions - refresh if needed via API
   * @returns Pre-signed URL string
   */
  async getSignedUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresInSeconds,
    };

    return this.ensureConfigured().getSignedUrlPromise('getObject', params);
  }
}
