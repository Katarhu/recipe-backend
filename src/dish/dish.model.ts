import mongoose from "mongoose";

import * as Joi from 'joi';


export interface IIngredient {
  name: string;
  unit: string;
}

export interface IStep {
  title: string;
  description: string;
}

export interface IDish {
  title: string;
  url: string;
  description: string;
  time: number;
  price: number;
  topics: string[];
  ingredients: IIngredient[];
  steps: IStep[];
  servings: number;
  publisherId: string;
  approved: boolean;
}

// SCHEMAS

const IngredientSchema = new mongoose.Schema<IIngredient>({
  name: { type: String, required: true },
  unit: { type: String, required: true}
}, { _id: false });

const StepSchema = new mongoose.Schema<IStep>({
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { _id: false });

export const DishSchema = new mongoose.Schema<IDish>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: Number, required: true },
  price: { type: Number, required: true },
  topics: { type: [String], default: [] },
  ingredients: { type: [IngredientSchema], default: [] },
  publisherId: { type: String, required: true },
  servings: { type: Number, required: true },
  steps: { type: [StepSchema], default: [] },
  approved: { type: Boolean, default: false }
});


// JOI

const ingredientsSchemaJoi = Joi.object().keys({
  name: Joi.string()
    .required(),

  unit: Joi.string()
    .required()
});

const stepsSchemaJoi = Joi.object().keys({
  title: Joi.string()
    .required(),

  description: Joi.string()
    .required()
})

export const dishSchemaJoi = Joi.object({
  title: Joi.string()
    .required(),

  url: Joi.string()
    .required(),

  description: Joi.string()
    .required(),

  time: Joi.number()
    .required()
    .positive()
    .integer(),

  price: Joi.number()
    .required()
    .integer()
    .positive(),

  topics: Joi.array()
    .required()
    .min(1)
    .items(
      Joi.string()
        .required()
    ),

  ingredients: Joi.array()
    .required()
    .min(1)
    .items(
      ingredientsSchemaJoi
    ),

  publisher: Joi.string()
    .required(),

  servings: Joi.number()
    .required()
    .integer()
    .positive(),

  steps: Joi.array()
    .required()
    .min(1)
    .items(
      stepsSchemaJoi
    )
}).options({allowUnknown: true});
