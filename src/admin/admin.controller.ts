import { UseGuards, Controller, Get, Param, Post, Query, Redirect, Render, Req, Res } from "@nestjs/common";
import { AuthGuard, } from "@nestjs/passport";
import { Request, query } from "express";
import { FacebookAuthGuard } from "src/facebook/facebook.guard";
import { FacebookService } from "src/facebook/facebook.service";
import { Session } from 'express-session';
@Controller('/admin')
export class AdminController {
    constructor(private readonly facebookService: FacebookService) {
    }
    @Get("/login")
    @Render('page/admin/login/index')
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        console.log('login Page')
    }

    @Get('/')
    @UseGuards(AuthGuard("facebook"))
    @Render('page/admin/index')
    async index(@Req() req: Request, @Res() res) {
        req.session['accesskey'] = req.user;
        const pageDetail = await this.facebookService.getPageDetail();
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Manage Home Page';
        viewData['page'] = pageDetail;
        return {
            viewData: viewData,
        };
    }
    @Get("/about")
    //@UseGuards(FacebookAuthGuard) // Use the custom FacebookAuthGuard
    @Render('page/admin/about/index')
    async about(@Req() req: any, @Res() res) {
        // Check if user is authenticated
        if (!req.session['accesskey']) {
            // Handle unauthenticated access, e.g., redirect to login page
            return res.redirect('/admin/login');
        }

        // User is authenticated, proceed with rendering the about page
        const response = await this.facebookService.getPageDetail();
        const viewData = [];
        viewData['id'] = response.id || 'Unavailable';
        viewData['author'] = response.name || 'Unavailable';
        viewData['description'] = response.about || 'Unavailable';
        return {
            viewData: viewData,
        };
    }
}