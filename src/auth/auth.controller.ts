import { Body, Controller, Post, UseGuards, Req } from "@nestjs/common";
import { UserCredentialsDto } from "../user/dto/user-credentials.dto";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {}

  @Post('/login')
  login(@Body() userCredentials: UserCredentialsDto) {
    return this.authService.login(userCredentials);
  }

  @Post('/register')
  register(@Body() userCredentials: CreateUserDto) {
    return this.authService.register(userCredentials);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  auth(@Req() req) {
    return this.authService.auth(req);
  }

}
