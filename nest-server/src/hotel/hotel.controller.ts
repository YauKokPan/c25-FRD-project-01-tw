import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { s3, bucketName } from '../../s3upload';
import * as fs from 'fs';
import { CreateHotelDto } from './dto/create-hotel.dto';

type UploadedData = {
  Location: string;
};

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

  @Post('test')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'profile_pic', maxCount: 1 },
    ]),
  )
  uploadFile(
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
      profile_pic?: Express.Multer.File[];
    },
  ) {
    console.log(files.file[0].originalname);
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
      // Validate input data
      // ...

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

      const postHotel = await this.hotelService.createHotel({
        ...createHotelDto,
        profile_pic: uploadedProfilePic?.Location,
        gallery_key: uploadedGalleryImages?.map((image) => ({
          hotel_img: image.Location,
          hotel_name: createHotelDto.name,
        })),
      });

      return postHotel;
    } catch (error) {
      // handle error
      console.error(error);
      throw error;
    }
  }

  private async uploadToS3(file: Express.Multer.File) {
    console.log('Uploaded files:', file);
    if (file && file.path) {
      const uploadedProfilePic = await this.uploadToS3(file);
    } else {
      console.error('File object or file path is undefined:', file);
    }

    const key = file.originalname;
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      // Body: fs.createReadStream(file.path),
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const uploadedFile = await new Promise<UploadedData>((resolve, reject) => {
      s3.upload(uploadParams, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    try {
      fs.unlinkSync(file.path);
    } catch (error) {
      console.error('Failed to remove the temporary file:', error);
    }

    return uploadedFile;
  }
}

// const postHotel = {
//   name: '1',
//   address: '1',
//   google_map_address: '1',
//   district: '1',
//   phone: '1',
//   profile_pic: uploadedProfilePic?.Location,
//   description: '1',
//   total_rooms: 1,
//   hourly_rate: 1,
//   is_deleted: false,
//   user_id: 1,
//   gallery_key: '1',
// };
