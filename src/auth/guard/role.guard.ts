import { Injectable, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from 'src/account-manager/entity/role.entity';
import { ROLES_KEY } from '../decorator/role.decorator';

@Injectable()
export class RoleGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // call AuthGuard in order to ensure user is injected in request
    const baseGuardResult = await super.canActivate(context);

    if (!baseGuardResult) {
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}
