import mongoose from "mongoose";

interface IIngredient {
  name: string;
  count: number;
  unit: string;
}

interface IStep {
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
  publisher: string;
}

const IngredientSchema = new mongoose.Schema<IIngredient>({
  name: { type: String, required: true },
  unit: { type: String, required: true}
});

const StepSchema = new mongoose.Schema<IStep>({
  title: { type: String, required: true },
  description: { type: String, required: true }
});

export const DishSchema = new mongoose.Schema<IDish>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  time: { type: Number, required: true },
  price: { type: Number, required: true },
  topics: { type: [String], default: []},
  ingredients: { type: [IngredientSchema], default: []},
  publisher: { type: String, required: true },
  servings: { type: Number, required: true },
  steps: { type: [StepSchema], default: []}
});


