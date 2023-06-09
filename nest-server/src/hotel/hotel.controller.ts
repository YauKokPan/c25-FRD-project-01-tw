import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFiles,
  Param,
  Patch,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { s3, bucketName } from '../../s3upload';
import * as fs from 'fs';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get('allHotels')
  async getAllHotelInfo() {
    try {
      const hotels = await this.hotelService.getAllHotelInfo();
      return hotels;
    } catch (error) {
      // handle error
      console.error(error);
      throw error;
    }
  }

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profile_pic', maxCount: 1 },
      { name: 'gallery_key', maxCount: 20 },
    ]),
  )
  async createHotel(
    @UploadedFiles()
    files: {
      profile_pic?: Express.Multer.File[];
      gallery_key?: Express.Multer.File[];
    },
    @Body() createHotelDto: CreateHotelDto,
  ) {
    try {
      // Upload profile pic to S3
      const uploadedProfilePic = files.profile_pic?.[0]
        ? await this.uploadToS3(files.profile_pic[0])
        : null;

      // Upload gallery pics to S3
      const uploadedGalleryImages = files.gallery_key
        ? await Promise.all(
            files.gallery_key.map(async (image) => this.uploadToS3(image)),
          )
        : null;

      const createdHotel = await this.hotelService.createHotel({
        ...createHotelDto,
        profile_pic: uploadedProfilePic?.Location,
        gallery_key: uploadedGalleryImages?.map((image) => ({
          hotel_img: image.Location,
          hotel_name: createHotelDto.name,
        })),
      });

      const response = {
        ...createdHotel,
        profile_pic: uploadedProfilePic?.Location,
        gallery_key: uploadedGalleryImages?.map((image) => ({
          hotel_img: image.Location,
          hotel_name: createHotelDto.name,
        })),
      };
      return response;
    } catch (error) {
      // handle error
      console.error(error);
      throw error;
    }
  }

  private async uploadToS3(
    file: Express.Multer.File,
  ): Promise<ManagedUpload.SendData> {
    // Add Promise<ManagedUpload.SendData> as the return type

    const key = file.originalname;
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer || fs.createReadStream(file.path),
      ContentType: file.mimetype,
      // ACL: 'public-read',
    };

    const uploadedFile = await new Promise<ManagedUpload.SendData>(
      (resolve, reject) => {
        s3.upload(uploadParams, (err: any, data: ManagedUpload.SendData) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      },
    );

    return uploadedFile;
  }

  @Patch('softDelete/:id')
  async softDelete(@Param('id') id: number): Promise<void> {
    return this.hotelService.softDeleteHotel(+id);
  }

  @Patch('editHotel/:id')
  async editHotel(
    @Param('id') id: number,
    @Body() updateHotelDto: UpdateHotelDto,
  ): Promise<void> {
    return this.hotelService.editHotel(+id, updateHotelDto);
  }

  @Get('occupied/:id')
  async getOccupancyRates(@Param('id') id: number) {
    return await this.hotelService.getOccupancyRates(+id);
  }
}
