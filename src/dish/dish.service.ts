import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { FilterDishesDto } from "./dto/filter-dishes.dto";
import { CreateDishDto } from "./dto/create-dish.dto";

import { IDish } from "./dish.model";
import { UserRole } from "../user/user.model";

@Injectable()
export class DishService {

  constructor(
    @InjectModel("Dish") private readonly dishModel: Model<IDish>
  ) {}

  async getDishes(filterDto: FilterDishesDto) {
    const { skip = 0, limit = Number.MAX_SAFE_INTEGER, customFilter = ''} = filterDto;

    const filterRegex = new RegExp(`^${customFilter}`);

    return this.dishModel.find({ title: filterRegex, approved: true })
      .skip(skip)
      .limit(limit)
  }

  async getUnapprovedDishes(filterDto: FilterDishesDto) {
    const { skip = 0, limit = Number.MAX_SAFE_INTEGER, customFilter = ''} = filterDto;

    const filterRegex = new RegExp(`^${customFilter}`);

    return this.dishModel.find({ title: filterRegex, approved: false })
      .skip(skip)
      .limit(limit)
  }

  async getDishById(req) {
      return this.dishModel.findById(req.params.id);
  }

  async createDish(req, dto: CreateDishDto) {
    const newDish = new this.dishModel({ ...dto, publisherId: req.user._id });

    await newDish.save();

    return newDish;
  }

  async approveDish(req) {
    await this.dishModel.findByIdAndUpdate(req.params.id, { approved: true })
    return { message: "Dish was approved successfully" };
  }

  async updateDish(req, dto: CreateDishDto) {
    const dish = await this.dishModel.findById(req.params.id);
    const requestUserId = req.user._id;

    if( !dish ) {
      throw new HttpException('There is no dish with such id', HttpStatus.BAD_REQUEST);
    }

    if( dish.publisherId !== requestUserId) {
      throw new HttpException('This operation is forbidden', HttpStatus.FORBIDDEN);
    }

    await this.dishModel.findByIdAndUpdate(req.params.id, {...dto, approved: false});

    return { message: "Dish was updated successfully" };
  }

  async deleteDish(req) {
    const dish = await this.dishModel.findById(req.params.id);

    if( !dish ) {
      throw new HttpException('There is no dish with such id', HttpStatus.BAD_REQUEST);
    }

    if( dish.publisherId !== req.user._id && !(req.user.role !== UserRole.ADMIN)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    await this.dishModel.findByIdAndRemove(req.params.id);

    return { message: "Dish was deleted successfully" };
  }

}
