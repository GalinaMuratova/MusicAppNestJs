import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from '../schemas/tracks.schema';
import { CreateTracksDto } from './ create-tracks.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  async getAll(@Query('album') album: string, @Query('track') track: string) {
    const query: any = {};

    if (album) {
      query.album = album;
    }

    if (track) {
      query.name = track;
    }

    return this.trackModel.find(query);
  }

  @Post()
  async create(@Body() trackDto: CreateTracksDto) {
    const track = new this.trackModel({
      name: trackDto.name,
      album: trackDto.album,
      duration: trackDto.duration,
    });

    return track.save();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const track = await this.trackModel.findById(id);

    if (track) {
      await this.trackModel.deleteOne({ _id: id });
    }

    return { message: `${track.name} deleted` };
  }
}
