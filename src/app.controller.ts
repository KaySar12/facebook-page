import { Controller, Get, Param, Redirect, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@Controller('/')
@ApiTags('app')
export class AppController {
  constructor(private configService: ConfigService,
    private readonly appService: AppService) { }
  @Get("/")
  @Render("page/client/index")
  index(@Param('pageId') pageId: string) {
    let viewData = [];
    viewData['title'] = 'Home Page - Facebook Client Page';
    viewData['pageId'] = pageId;
    return {
      viewData: viewData
    };
  }
  @Get("/error")
  @Render("page/error/index")
  error() {
    let viewData = [];
    viewData['title'] = 'Error Page';
    return {
      viewData: viewData
    };
  }
  @Get("/about")
  @Render('page/client/about')
  about() {
    const viewData = [];
    viewData['title'] = 'About us - Online Store';
    viewData['subtitle'] = "About us";
    viewData['description'] = "This is an about page ...";
    viewData['author'] = 'Developed by: Your Name';
    return {
      viewData: viewData,
    };
  }
  @Get("/login")
  @Render('page/client/login/index')
  login() {
    const viewData = [];
    viewData['title'] = 'Login';
    return {
      viewData: viewData,
    };
  }
}
