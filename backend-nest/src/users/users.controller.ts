import { Controller, Delete, Post, Req, Res, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Request } from 'express';
import { Response } from 'express';
import { Model } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post()
  registerUser(@Req() req: Request) {
    const user = new this.userModel({
      username: req.body.username,
      password: req.body.password,
      displayName: req.body.displayName,
    });

    user.generateToken();

    return user.save();
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  loginUser(@Req() req: Request) {
    return { message: 'You entered successfully', user: req.user };
  }

  @UseGuards(AuthGuard('local'))
  @Delete('sessions')
  async logoutUser(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.get('Authorization');
      const success = { message: 'Success' };

      if (!token) return res.send(success);

      const user = await this.userModel.findOne({ token });

      if (!user) return res.send(success);

      user.generateToken();
      await user.save();

      return res.send(success);
    } catch (e) {
      return res.status(500).send({ message: 'Logout error' });
    }
  }
}
