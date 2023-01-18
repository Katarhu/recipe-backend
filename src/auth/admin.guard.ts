import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

import { UserRole } from '../user/user.model';

export class AdminGuard implements CanActivate {

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const token = req.headers.authorization.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }

      req.user = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }
    if (!req.user) {
      throw new HttpException('Forbidden', HttpStatus.UNAUTHORIZED);
    }

    if (req.user.role !== UserRole.ADMIN) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
