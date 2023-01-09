import { MongooseModule } from "@nestjs/mongoose";
import { Module } from '@nestjs/common';

import { DishService } from './dish.service';

import { DishController } from './dish.controller';

import { DishSchema } from "./dish.model";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Dish", schema: DishSchema }])
  ],
  providers: [DishService],
  controllers: [DishController]
})
export class DishModule {}
