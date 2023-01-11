import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import * as jwt from "jsonwebtoken";
import * as bcrypt from 'bcryptjs'

import { UserCredentialsDto } from "../user/dto/user-credentials.dto";
import { CreateUserDto } from "../user/dto/create-user.dto";

import { UserService } from "../user/user.service";


interface JWTPayload {
  _id: string;
  email: string;
  username: string;
  role: string;
}

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService
  ) {}

  async login(dto: UserCredentialsDto) {
    const user = await this.userService.getUserByUserEmail(dto.email);

    if( !user ) {
      throw new HttpException('Email or password is incorrect', HttpStatus.BAD_REQUEST);
    }

    const isPasswordCorrect = await bcrypt.compare(dto.password, user.password );

    if( !isPasswordCorrect ) {
      throw new HttpException('Username or password is incorrect', HttpStatus.BAD_REQUEST);
    }

    const token = this.createToken({ _id: String(user._id), email: user.email, username: user.username, role: user.role });

    return {
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token
    }
  }

  async register(dto: CreateUserDto) {

    //const isUsernameTaken = await this.userService.getUserByUserName(dto.username);
    const isEmailTaken = await this.userService.getUserByUserEmail(dto.email);

    if( isEmailTaken ) {
      throw new HttpException('Email is already taken', HttpStatus.FORBIDDEN);
    }

    // if( isUsernameTaken ) {
    //   throw new HttpException('Username is already taken', HttpStatus.BAD_REQUEST);
    // }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.createUser({ username: dto.username, email: dto.email, password: hashedPassword });

    const token = this.createToken({ _id: String(user._id), username: user.username, email: user.email, role: user.role });

    return {
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token
    }
  }

  async auth(req) {
    const user = await this.userService.getUserByUserEmail(req.user.email);

    if( !user ) {
      throw new HttpException('There is no user with such email', HttpStatus.FORBIDDEN);
    }

    return {
      user: {
        _id: user._id,
        email: user.email,
        password: user.password
      }
    }
  }

  private createToken(payload: JWTPayload) {
    return jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: '24h'
      }
    )
  }
}
