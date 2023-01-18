import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { JoiValidationPipe } from '../common/pipes/validation.pipe';

import { CreateDishDto } from './dto/create-dish.dto';
import { FilterDishesDto } from './dto/filter-dishes.dto';

import { DishService } from './dish.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

import { dishSchemaJoi } from './dish.model';

@Controller('dishes')
export class DishController {
  constructor(private dishService: DishService) {}

  @Post('/get')
  getDishes(@Body() filterDishesDto: FilterDishesDto) {
    return this.dishService.getDishes(filterDishesDto);
  }

  @Post('/unapproved')
  @UseGuards(AdminGuard)
  getUnapprovedDishes(@Body() filterDishesDto) {
    return this.dishService.getUnapprovedDishes(filterDishesDto);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getDishById(@Req() request) {
    return this.dishService.getDishById(request);
  }

  @Patch('/:id/approve')
  @UseGuards(AdminGuard)
  approveDish(@Req() request) {
    return this.dishService.approveDish(request);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(dishSchemaJoi))
  createDish(@Req() request, @Body() createDishDto: CreateDishDto) {
    return this.dishService.createDish(request, createDishDto);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  updateDish(@Req() request, @Body() updateDishDto: CreateDishDto) {
    return this.dishService.updateDish(request, updateDishDto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteDish(@Req() request) {
    return this.dishService.deleteDish(request);
  }
}
