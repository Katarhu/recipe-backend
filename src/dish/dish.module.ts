import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';

@Module({
  providers: [DishService],
  controllers: [DishController]
})
export class DishModule {}
