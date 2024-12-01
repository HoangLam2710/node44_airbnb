import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Admin Comment')
@Controller('admin/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @Get('/')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all comment successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Res() res: Response,
  ) {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = size ? Number(size) : 10;

      const comments = await this.commentService.findAll(
        formatPage,
        formatSize,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Get all comment successfully',
        data: { ...comments },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Get('/:cid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get comment detail successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findOne(@Param('cid') cid: string, @Res() res: Response) {
    try {
      const comment = await this.commentService.findOne(cid);

      return res.status(HttpStatus.OK).json({
        message: 'Get comment detail successfully',
        data: { comment },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
