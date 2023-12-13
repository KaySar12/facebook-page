import { UseGuards, Controller, Get, Request, Render, Req, Res, HttpStatus, ForbiddenException, NotFoundException, Param } from "@nestjs/common";
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
        console.log(req.session.passport.user.user)
        const currentPageId = req.session.passport.user.currentSelectPage;
        console.log(` Current Page ID:${currentPageId}`)
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Manage Home Page';

        if (req.user) {
            const userData = req.user;
            const checkExist = await this.userService.checkExist(userData.user.email);
            const userId = userData.user.id;
            const ownerId = '1425721644676951';
            if (!checkExist) {
                console.log(`New User Detected Id:${userId}`);
                const createUser = {
                    userId: userId,
                    email: userData.user.email,
                    firstName: userData.user?.firstName || '',
                    lastName: userData.user?.lastName || '',
                }
                viewData['userName'] = `${createUser.firstName} ${createUser.lastName}`;
                await this.userService.create(createUser)
            }
            const getPages = await this.facebookService.getPages(userData.accessToken);
            if (!currentPageId) {
                this.facebookService.setCurrentPageId(getPages.data[0].id);
                console.log(`set pageId to:${getPages.data[0].id}`);
                req.session.passport.user.currentSelectPage = this.facebookService.getCurrentPageId();
            }
            if (userId === ownerId) {
                const currentPageAccessToken = this.facebookService.getCurrentPageAccessToken()
                const checkToken = await this.facebookService.checkTokenData(currentPageAccessToken, userData.accessToken);
                if (!currentPageAccessToken || !checkToken) {
                    await this.renewPageAccessToken(req.user.accessToken, this.facebookService.getCurrentPageId());
                }
            }
            const pageDetail = await this.facebookService.getPageDetail();
            viewData['page'] = pageDetail;
            viewData['pageId'] = this.facebookService.getCurrentPageId();
            viewData['allPages'] = getPages;
            viewData['userName'] = `${checkExist.firstName} ${checkExist.lastName}`;
        }
        return {
            viewData: viewData,
        };
    }
    async renewPageAccessToken(ownerAccessToken: string, pageId?: string) {

        const longLiveToken = await this.facebookService.getUserLongLivesAccessToken(ownerAccessToken);
        const pageAccessToken = await this.facebookService.getPageAccessTokenById(longLiveToken, pageId);
        this.facebookService.setCurrentPageAccessToken(pageAccessToken);
        console.log('renew Page Token');
    }
    @Get('/getPage/:pageId')
    @UseGuards(FacebookAuthGuard)
    async getPage(@Param('pageId') pageId: string, @Res() res, @Req() req) {
        //set current select page to session
        req.session.passport.user.currentSelectPage = pageId;
        //handle change page
        this.facebookService.setCurrentPageId(pageId);
        console.log(this.facebookService.getCurrentPageId());
        res.redirect('/admin')
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
        const user = req.session.passport.user.user
        const response = await this.facebookService.getPageDetail();
        const viewData = [];
        viewData['id'] = response.id || 'Unavailable';
        viewData['author'] = response.name || 'Unavailable';
        viewData['description'] = response.about || 'Unavailable';
        const getPages = await this.facebookService.getPages(req.user.accessToken);
        viewData['allPages'] = getPages;
        viewData['pageId'] = this.facebookService.getCurrentPageId() || '179668665228573';
        viewData['userName'] = `${user?.firstName} ${user?.lastName}`
        return {
            viewData: viewData,
        };
    }
    @Get('/testApi')
    @UseGuards(FacebookAuthGuard)
    async testAPI(@Request() req: any) {
        console.log(req.session.passport.user.user);
    }
}