import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ThesisService } from './thesis.service';
import { CreateThesisDto } from './dto/create-thesis.dto';
import { UpdateThesisDto } from './dto/update-thesis.dto';

@Controller('thesis')
export class ThesisController {
  constructor(
    private readonly thesisService: ThesisService,
  ) {}

  @Post()
  create(@Body() createThesisDto: CreateThesisDto) {
    return this.thesisService.create(createThesisDto);
  }

  @Get()
  findAll() {
    return this.thesisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thesisService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateThesisDto: UpdateThesisDto,
  ) {
    return this.thesisService.update(
      +id,
      updateThesisDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thesisService.remove(+id);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/theses',
        filename: (req, file, callback) => {
          const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9);

          callback(
            null,
            uniqueName + extname(file.originalname),
          );
        },
      }),
      fileFilter: (req, file, callback) => {
        if (
          file.mimetype !== 'application/pdf'
        ) {
          return callback(
            new Error(
              'Sadece PDF dosyası yükleyebilirsiniz.',
            ),
            false,
          );
        }

        callback(null, true);
      },
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
    }),
  )
  uploadPdf(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.thesisService.uploadPdf(
      id,
      file.filename,
    );
  }
}