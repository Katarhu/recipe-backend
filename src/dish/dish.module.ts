import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { DishService } from './dish.service';

import { DishController } from './dish.controller';

import { DishSchema } from './dish.model';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Dish', schema: DishSchema }]),
    UserModule,
  ],
  providers: [DishService],
  controllers: [DishController],
})
export class DishModule {}
