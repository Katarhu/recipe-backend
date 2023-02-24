export class FilterDishesDto {
  readonly skip?: number;
  readonly limit?: number;
  readonly customFilter?: string;
  readonly initial?: boolean;

  readonly config: {
    minDur: number;
    maxDur: number;
    minVal: number;
    maxVal: number;
    topics: string[];
  };
}
