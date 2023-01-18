import { CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";

import { Observable } from "rxjs";

import { UserRole } from "../user/user.model";


export class AdminGuard implements CanActivate {
  constructor() {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    if( !req.user ) {
      throw new HttpException('Forbidden', HttpStatus.UNAUTHORIZED);
    }

    if( req.user.role !== UserRole.ADMIN ) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
