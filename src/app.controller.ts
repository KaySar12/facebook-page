import { Controller, Get, Redirect, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) { }
  @Get("/")
  @Render("page/client/index")
  index() {
    let viewData = [];
    viewData['title'] = 'Home Page - Facebook Client Page';
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
}
