import { Body, Controller, Post, UseGuards, Req, UsePipes } from "@nestjs/common";

import { createUserJoi, userCredentialsJoi } from "../user/user.model";
import { UserCredentialsDto } from "../user/dto/user-credentials.dto";
import { JoiValidationPipe } from "../common/pipes/validation.pipe";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {}

  @Post('/login')
  @UsePipes(new JoiValidationPipe(userCredentialsJoi))
  login(@Body() userCredentials: UserCredentialsDto) {
    return this.authService.login(userCredentials);
  }

  @Post('/register')
  @UsePipes(new JoiValidationPipe(createUserJoi))
  register(@Body() userCredentials: CreateUserDto) {
    return this.authService.register(userCredentials);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  auth(@Req() req) {
    return this.authService.auth(req);
  }

}
