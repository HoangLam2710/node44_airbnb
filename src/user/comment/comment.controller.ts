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
} from '@nestjs/common';
import { CommentService } from './comment.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCommentDto } from 'src/user/comment/dto/create-comment.dto';
import { Response } from 'express';
import { UpdateCommentDto } from 'src/user/comment/dto/update-comment.dto';

@ApiTags('User Comment')
@Controller('user/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @Post('/')
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create comment successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(@Body() body: CreateCommentDto, @Res() res: Response) {
    try {
      const comment = await this.commentService.create(body);

      return res.status(HttpStatus.CREATED).json({
        message: 'Create comment successfully',
        data: { comment },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Get('/:rid')
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
  async findAllByRoom(
    @Param('rid') rid: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Res() res: Response,
  ) {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = size ? Number(size) : 10;

      const comments = await this.commentService.findAllByRoom(
        rid,
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
  @Put('/:cid')
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update comment successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async update(
    @Param('cid') cid: string,
    @Body() body: UpdateCommentDto,
    @Res() res: Response,
  ) {
    try {
      const comment = await this.commentService.update(cid, body);

      return res.status(HttpStatus.OK).json({
        message: 'Update comment successfully',
        data: { comment },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Delete('/:cid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Remove comment successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async remove(@Param('cid') cid: string, @Body() body, @Res() res: Response) {
    try {
      await this.commentService.remove(cid, body.uid);

      return res.status(HttpStatus.OK).json({
        message: 'Remove comment successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
