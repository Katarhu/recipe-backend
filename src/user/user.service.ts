import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUser } from "./user.model";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>
  ) {}

  async createUser({ username, email, password }: CreateUserDto) {
    const user = new this.userModel({
      username,
      email,
      password,
      role: "user"
    });

    await user.save();

    return user;
  }

  getUserByUserName(username: string) {
    return this.userModel.findOne({ username });
  }

  getUserByUserEmail(email: string) {
    return this.userModel.findOne({ email });
  }

}
