import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { CreateAlbumsDto } from './create-albums.dto';
import {TokenAuthGuard} from "../auth/token-auth.guard";
import {PermitGuard} from "../permit/permit.guard";

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getAll(@Query('artist') artist: string, @Query('album') album: string) {
    const query: any = {};

    if (artist) {
      query.artist = artist;
    }

    if (album) {
      query.name = album;
    }
    return this.albumModel.find(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.albumModel.findById(id);
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/albums' }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumDto: CreateAlbumsDto,
  ) {
    const album = new this.albumModel({
      name: albumDto.name,
      artist: albumDto.artist,
      year: albumDto.year,
      image: file ? '/uploads/albums/' + file.filename : null,
    });

    return album.save();
  }

  @UseGuards(PermitGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const album = await this.albumModel.findById(id);

    if (album) {
      await this.albumModel.deleteOne({ _id: id });
    }

    return { message: `${album.name} deleted` };
  }
}
