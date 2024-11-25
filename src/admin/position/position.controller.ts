import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PositionService } from './position.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
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
      const images = await this.cloudUploadService.uploadImage(
        files,
        'positions',
      );
      return res.status(HttpStatus.OK).json({
        message: 'Upload successfully',
        data: { images },
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
    description: 'Create position successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(@Body() body: CreatePositionDto, @Res() res: Response) {
    try {
      const position = await this.positionService.create(body);

      return res.status(HttpStatus.CREATED).json({
        message: 'Create position successfully',
        data: { position },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Get('/')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all position successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('keyword') keyword: string,
    @Res() res: Response,
  ) {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = size ? Number(size) : 10;

      const result = await this.positionService.findAll(
        formatPage,
        formatSize,
        keyword,
      );

      return res.status(HttpStatus.OK).json({
        message: 'Get all position successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Get('/:pid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get position detail successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findOne(@Param('pid') pid: string, @Res() res: Response) {
    try {
      const position = await this.positionService.findOne(pid);

      return res.status(HttpStatus.OK).json({
        message: 'Get position detail successfully',
        data: { position },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Put('/:pid')
  @ApiBody({ type: CreatePositionDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update position successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async update(
    @Param('pid') pid: string,
    @Body() body: CreatePositionDto,
    @Res() res: Response,
  ) {
    try {
      const position = await this.positionService.update(pid, body);

      return res.status(HttpStatus.OK).json({
        message: 'Update position successfully',
        data: { position },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Delete('/:pid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Remove position successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async remove(@Param('pid') pid: string, @Res() res: Response) {
    try {
      await this.positionService.remove(pid);

      return res.status(HttpStatus.OK).json({
        message: 'Remove position successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
