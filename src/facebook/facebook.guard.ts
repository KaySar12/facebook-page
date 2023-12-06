import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class FacebookAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log(request);
    // Check if the user is authenticated with Facebook
    return !!request.user;
  }
}
