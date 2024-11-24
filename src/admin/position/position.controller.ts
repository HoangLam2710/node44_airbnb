import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PositionService } from './position.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  CreatePositionDto,
  UpdateImageDto,
} from 'src/admin/position/dto/create-position.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudUploadService } from 'src/shared/cloudUpload.service';

@ApiTags('Admin Position')
@Controller('admin/position')
export class PositionController {
  constructor(
    private readonly positionService: PositionService,
    private readonly cloudUploadService: CloudUploadService,
  ) {}

  @ApiBearerAuth()
  @Post('/upload-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateImageDto })
  @UseInterceptors(FilesInterceptor('images'))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Upload successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Upload failed',
  })
  async uploadImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    try {
      const result = await this.cloudUploadService.uploadImage(
        files,
        'position',
      );
      return res.status(HttpStatus.OK).json({
        message: 'Upload successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Upload failed',
      });
    }
  }

  @ApiBearerAuth()
  @Post('/')
  @ApiBody({ type: CreatePositionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create room position successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(@Body() body: CreatePositionDto, @Res() res: Response) {
    try {
      const result = await this.positionService.create(body);

      return res.status(HttpStatus.OK).json({
        message: 'Create room position successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
