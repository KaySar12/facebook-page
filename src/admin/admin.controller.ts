import { UseGuards, Controller, Get, Request, Post, Query, Redirect, Render, Req, Res, HttpStatus } from "@nestjs/common";
import { AuthGuard, } from "@nestjs/passport";
import { query } from "express";
import { FacebookAuthGuard } from "src/facebook/facebook.guard";
import { FacebookService } from "src/facebook/facebook.service";
import { Session } from 'express-session';
import { LocalAuthGuard } from "src/facebook/local-facebook-auth.guard";
import { FacebookStrategy } from "src/facebook/facebook.strategy";
@Controller('/admin')
export class AdminController {
    constructor(private readonly facebookService: FacebookService) {
    }

    @Get('/login')
    @Render('page/admin/login/index')
    async facebookLoginView(): Promise<any> {
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Login Page';
        return {
            viewData: viewData,
        };
    }
    //Get / logout
    @Get('/logout')
    logout(@Request() req, @Res() res: any): any {
        req.session.destroy();
        return res.redirect('/admin/login')
    }
    @Get("/action/login")
    @UseGuards(AuthGuard('facebook'))
    async LoginAction(): Promise<any> {
        console.log('login action')
        return HttpStatus.OK;
    }
    @UseGuards(LocalAuthGuard)
    @Get("/action/redirect")
    async facebookLoginRedirect(@Req() req: any, @Res() res: any): Promise<any> {
        return res.redirect('/admin')
    }

    @Get('/')
    @UseGuards(FacebookAuthGuard)
    @Render('page/admin/index')
    async index(@Req() req: any, @Res() res) {
        if (!req.user) {
            return res.redirect('/admin/login');
          }
        
        const pageDetail = await this.facebookService.getPageDetail();
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Manage Home Page';
        viewData['page'] = pageDetail;
        return {
            viewData: viewData,
        };
    }
    @Get("/about")
    @UseGuards(FacebookAuthGuard)
    @Render('page/admin/about/index')
    async about(@Req() req: any, @Res() res) {

        const response = await this.facebookService.getPageDetail();
        const viewData = [];
        viewData['id'] = response.id || 'Unavailable';
        viewData['author'] = response.name || 'Unavailable';
        viewData['description'] = response.about || 'Unavailable';
        return {
            viewData: viewData,
        };
    }

    @Get('/protected')
    @UseGuards(FacebookAuthGuard)
    getHello(@Request() req): string {
        return req.user;
    }

}