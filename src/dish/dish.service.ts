import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId } from 'mongoose';
import { Model } from 'mongoose';

import { FilterDishesDto } from './dto/filter-dishes.dto';
import { CreateDishDto } from './dto/create-dish.dto';

import { IDish } from './dish.model';
import { UserRole } from '../user/user.model';
import { SaveDishDto } from './dto/save-dish.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class DishService {
  constructor(
    @InjectModel('Dish') private readonly dishModel: Model<IDish>,
    private userService: UserService,
  ) {}

  async getDishes({
    skip = 0,
    limit = Number.MAX_SAFE_INTEGER,
    customFilter = '',
  }: FilterDishesDto) {
    const filterRegex = new RegExp(customFilter, 'gim');

    return this.dishModel
      .find({ title: filterRegex, approved: true })
      .skip(skip)
      .limit(limit);
  }

  async getUnapprovedDishes({
    skip = 0,
    limit = Number.MAX_SAFE_INTEGER,
    customFilter = '',
  }: FilterDishesDto) {
    const filterRegex = new RegExp(customFilter, 'gim');

    return this.dishModel
      .find({ title: filterRegex, approved: false })
      .skip(skip)
      .limit(limit);
  }

  async getUserSavedDishes(
    req,
    {
      skip = 0,
      limit = Number.MAX_SAFE_INTEGER,
      customFilter = '',
    }: FilterDishesDto,
  ) {
    const user = await this.userService.getUserById(req.user._id);

    if (!user) {
      throw new HttpException(
        'There is no user with such id',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const filterRegex = new RegExp(customFilter, 'gim');

    const dishesId = [...user.savedDishes.keys()];

    const savedDishes = await this.dishModel
      .find({ _id: { $in: dishesId }, title: filterRegex })
      .skip(skip)
      .limit(limit);

    return savedDishes.map((dish) => {
      const servings = user.savedDishes.get(dish._id.toString());

      dish.servings = servings;

      return dish;
    });
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
    await this.dishModel.findByIdAndUpdate(req.params.id, { approved: true });
    return { message: 'Dish was approved successfully' };
  }

  async saveDishes(req, { dishesToSave }: SaveDishDto) {
    if (!dishesToSave) {
      throw new HttpException(
        'Field dishesToSave was not provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.getUserById(req.user._id);

    if (!user) {
      throw new HttpException(
        'There is no user with such id',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const invalidIds = [];

    const validatedDishesToSave = dishesToSave.filter(([dishId]) => {
      if (!isValidObjectId(dishId)) {
        invalidIds.push(dishId);
        return false;
      }

      return true;
    });

    user.savedDishes = new Map([...user.savedDishes, ...validatedDishesToSave]);

    user.save();

    if (invalidIds.length !== 0) {
      return {
        message: "Dishes was saved successfully, but some id's were invalid",
        invalidIds,
      };
    }

    return {
      message: 'Dishes was saved successfully',
    };
  }

  async removeDishFromSaved(req) {
    const user = await this.userService.getUserById(req.user._id);

    if (!user) {
      throw new HttpException(
        'There is no user with such id',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.savedDishes.has(req.params.id)) {
      throw new HttpException(
        'There is no saved dish with such id',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.savedDishes.delete(req.params.id);

    user.save();

    return {
      message: 'Dish was removed from saved',
    };
  }

  async updateDish(req, dto: CreateDishDto) {
    const dish = await this.dishModel.findById(req.params.id);
    const requestUserId = req.user._id;

    if (!dish) {
      throw new HttpException(
        'There is no dish with such id',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dish.publisherId !== requestUserId) {
      throw new HttpException(
        'This operation is forbidden',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.dishModel.findByIdAndUpdate(req.params.id, {
      ...dto,
      approved: false,
    });

    return { message: 'Dish was updated successfully' };
  }

  async deleteDish(req) {
    const dish = await this.dishModel.findById(req.params.id);

    if (!dish) {
      throw new HttpException(
        'There is no dish with such id',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      dish.publisherId !== req.user._id &&
      !(req.user.role !== UserRole.ADMIN)
    ) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    await this.dishModel.findByIdAndRemove(req.params.id);

    return { message: 'Dish was deleted successfully' };
  }
}
