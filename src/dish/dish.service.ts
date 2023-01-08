import { InjectModel } from "@nestjs/mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { CreateDishDto } from "./dto/create-dish.dto";
import { IDish } from "./dish.model";
import { Model } from "mongoose";

@Injectable()
export class DishService {

  constructor(
    @InjectModel("Dish") private readonly dishModel: Model<IDish>
  ) {}

  async getDishes(req) {

  }

  async getDishById(req) {
      const dish = await this.dishModel.findById(req.params.id);

      return dish;
  }

  async createDish(dto: CreateDishDto) {
    const newDish = new this.dishModel(dto);

    await newDish.save();

    return newDish;
  }

  async approveDish(req) {
    await this.dishModel.findByIdAndUpdate(req.params.id, { approved: true })
    return { message: "Dish was approved successfully" };
  }

  async updateDish(req, dto: CreateDishDto) {
    const dish = await this.dishModel.findById(req.params.id);

    if( !dish ) {
      throw new HttpException('There is no dish with such id', HttpStatus.BAD_REQUEST);
    }

    await this.dishModel.findByIdAndUpdate(req.params.id, {...dto});

    return { message: "Dish was updated successfully" };
  }

  async deleteDish(req) {
    const dish = await this.dishModel.findById(req.params.id);

    if( !dish ) {
      throw new HttpException('There is no dish with such id', HttpStatus.BAD_REQUEST);
    }

    await this.dishModel.findByIdAndRemove(req.params.id);

    return { message: "Dish was deleted successfully" };
  }

}
