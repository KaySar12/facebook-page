import { UseGuards, Controller, Get, Request, Render, Req, Res, HttpStatus } from "@nestjs/common";
import { AuthGuard, } from "@nestjs/passport";
import { UserService } from "src/auth/user.service";
import { FacebookAuthGuard } from "src/facebook/facebook.guard";
import { FacebookService } from "src/facebook/facebook.service";
import { LocalAuthGuard } from "src/facebook/local-auth.guard";
@Controller('/admin')
export class AdminController {
    constructor(
        private readonly userService: UserService,
        private readonly facebookService: FacebookService) {
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
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Manage Home Page';
        if (req.user) {
            const userData = req.user;
            const checkExist = await this.userService.checkExist(userData.user.email);
            const userId = await this.facebookService.getUserId(userData.accessToken);
            console.log(userData.accessToken);
            if (userId === '1425721644676951') {
                const currentPageAccessToken = this.facebookService.getCurrentPageAccessToken()
                console.log(currentPageAccessToken);
                const checkToken = await this.facebookService.checkTokenData(currentPageAccessToken, userData.accessToken);
                if (!currentPageAccessToken || !checkToken) {
                    await this.renewPageAccessToken(req.user.accessToken);
                }
            }
            if (!checkExist) {
                console.log(`User ID:${userId}`);
                const createUser = {
                    userId: userId,
                    email: userData.user.email,
                    firstName: userData.user?.firstName || '',
                    lastName: userData.user?.lastName || '',
                }
                viewData['userName'] = `${createUser.firstName} ${createUser.lastName}`;
                await this.userService.create(createUser)
            }
            const pageDetail = await this.facebookService.getPageDetail();
            viewData['page'] = pageDetail;
            viewData['userName'] = `${checkExist.firstName} ${checkExist.lastName}`;
        }
        return {
            viewData: viewData,
        };
    }
    async renewPageAccessToken(ownerAccesToken: string) {
        const longLiveToken = await this.facebookService.getUserLongLivesAccessToken(ownerAccesToken);
        const pageAccessToken = await this.facebookService.getPageAccessToken(longLiveToken);
        this.facebookService.setCurrentPageAccessToken(pageAccessToken);
        console.log('renew Page Token');
    }
    @Get('/postData')
    @UseGuards(FacebookAuthGuard)
    async getpostData() {
        const pageDetail = await this.facebookService.getPageDetail();
        return pageDetail.posts.data
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
    getHello(@Request() req: any): string {
        return req.user;
    }

}