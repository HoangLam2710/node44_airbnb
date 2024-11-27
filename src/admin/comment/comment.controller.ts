import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Admin Comment')
@Controller('admin/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all comment successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll(@Res() res: Response) {
    try {
      const comments = await this.commentService.findAll();
      return res.status(HttpStatus.OK).json({
        message: 'Get all comment successfully',
        data: { comments },
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
