import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
@Injectable()
export class FacebookAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    if (!request.isAuthenticated()) {
      const response = context.switchToHttp().getResponse()
      return response.redirect('/admin/login');
    }
    return request.isAuthenticated();
  }
}