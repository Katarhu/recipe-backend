import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user.model";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }])
  ],
  providers: [
    UserService
  ],
  controllers: [
    UserController
  ],
  exports: [
    UserService,
    MongooseModule
  ]
})
export class UserModule {}
