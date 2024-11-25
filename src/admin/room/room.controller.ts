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
import { RoomService } from './room.service';
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
  CreateRoomDto,
  UpdateImageDto,
} from 'src/admin/room/dto/create-room.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudUploadService } from 'src/shared/cloudUpload.service';

@ApiTags('Admin Room')
@Controller('admin/room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
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
      const images = await this.cloudUploadService.uploadImage(files, 'rooms');
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
  @ApiBody({ type: CreateRoomDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create room successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(@Body() body: CreateRoomDto, @Res() res: Response) {
    try {
      const room = await this.roomService.create(body);

      return res.status(HttpStatus.CREATED).json({
        message: 'Create room successfully',
        data: { room },
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
    description: 'Get all room successfully',
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

      const result = await this.roomService.findAll(
        formatPage,
        formatSize,
        keyword,
      );

      return res.status(HttpStatus.OK).json({
        message: 'Get all room successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Get('/find-room-by-position/:pid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get room by position successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findRoomByPid(@Param('pid') pid: string, @Res() res: Response) {
    try {
      const result = await this.roomService.findRoomByPid(pid);

      return res.status(HttpStatus.OK).json({
        message: 'Get room by position successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Get('/:rid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get room detail successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findOne(@Param('rid') rid: string, @Res() res: Response) {
    try {
      const room = await this.roomService.findOne(rid);

      return res.status(HttpStatus.OK).json({
        message: 'Get room detail successfully',
        data: { room },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Put('/:rid')
  @ApiBody({ type: CreateRoomDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update room successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async update(
    @Param('rid') rid: string,
    @Body() body: CreateRoomDto,
    @Res() res: Response,
  ) {
    try {
      const room = await this.roomService.update(rid, body);

      return res.status(HttpStatus.OK).json({
        message: 'Update room successfully',
        data: { room },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Delete('/:rid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Remove room successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async remove(@Param('rid') rid: string, @Res() res: Response) {
    try {
      await this.roomService.remove(rid);

      return res.status(HttpStatus.OK).json({
        message: 'Remove room successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
