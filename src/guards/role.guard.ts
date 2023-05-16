import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserService } from '../user/user.service';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ERole } from '../types/user.type';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ERole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    let { user } = context.switchToHttp().getRequest();
    user = await this.userService.findUserById(user.id);

    return requiredRoles.includes(user.role);
  }
}
