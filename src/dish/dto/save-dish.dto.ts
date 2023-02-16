import * as Joi from "joi";

type SavedDish = [string, number];

export class SaveDishDto {
  readonly dishesToSave: SavedDish[];
}

const dishTupleJoi = Joi.array().items(Joi.string().required(), Joi.number().required());

export const saveDishJoi = Joi.object({
  dishesToSave: Joi.array().required().items(dishTupleJoi),
});