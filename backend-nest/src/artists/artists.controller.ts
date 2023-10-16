import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateArtistDto } from './create-artist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { PermitGuard } from '../permit/permit.guard';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  async getAll() {
    return this.artistModel.find();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.artistModel.findById(id);
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/artists' }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() artistDto: CreateArtistDto,
  ) {
    const artist = new this.artistModel({
      name: artistDto.name,
      information: artistDto.information,
      image: file ? '/uploads/artists/' + file.filename : null,
    });

    return artist.save();
  }

  @UseGuards(PermitGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const artist = await this.artistModel.findById(id);

    if (artist) {
      await this.artistModel.deleteOne({ _id: id });
    }

    return { message: `${artist.name} deleted` };
  }
}
