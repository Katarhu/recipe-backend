import { Body, Controller, Delete, Get, Patch, Post, Put, Req, UseGuards, UsePipes } from "@nestjs/common";

import { JoiValidationPipe } from "../common/pipes/validation.pipe";

import { CreateDishDto } from "./dto/create-dish.dto";

import { DishService } from "./dish.service";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AdminGuard } from "../auth/admin.guard";

import { dishSchemaJoi } from "./dish.model";

@Controller('dishes')
export class DishController {

  constructor(
    private dishService: DishService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getDishes(@Req() request) {
    return this.dishService.getDishes(request);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getDishById(@Req() request) {
    return this.dishService.getDishById(request);
  }

  @Patch('/:id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  approveDish(@Req() request) {
    return this.dishService.approveDish(request);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(dishSchemaJoi))
  createDish(@Body() createDishDto: CreateDishDto) {
    return this.dishService.createDish(createDishDto);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  updateDish(@Req() request, @Body() updateDishDto: CreateDishDto) {
    return this.dishService.updateDish(request, updateDishDto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteDish(@Req() request) {
    return this.dishService.deleteDish(request);
  }
}
