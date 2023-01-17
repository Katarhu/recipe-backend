import { IIngredient, IStep } from "../dish.model";

export class CreateDishDto {
  readonly title: string;
  readonly url: string;
  readonly description: string;
  readonly time: number;
  readonly price: number;
  readonly topics: string[];
  readonly ingredients: IIngredient[];
  readonly publisher: string;
  readonly servings: number;
  readonly steps: IStep[];
  readonly duration: number;
}
