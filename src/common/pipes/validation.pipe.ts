import { HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { ObjectSchema } from "joi";


@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(
    private schema: ObjectSchema
  ) {}

  transform( value: Record<string, any> ) {
    const { error } = this.schema.validate(value);

    if( error ) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return value;
  }
}
