import { UseGuards, Controller, Get, Request, Render, Req, Res, HttpStatus, Param, Query, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard, } from "@nestjs/passport";
import { UserService } from "src/user/user.service";
import { FacebookAuthGuard } from "src/facebook/facebook.guard";
import { FacebookService } from "src/facebook/facebook.service";
import { LocalAuthGuard } from "src/facebook/local-auth.guard";
import { RedditService } from "src/reddit/reddit.service";
import { User } from "src/user/user.entity";
@Controller('/admin')
export class AdminController {
    constructor(
        private readonly userService: UserService,
        private readonly facebookService: FacebookService,
        private readonly redditService: RedditService,
        private readonly configService: ConfigService

    ) {
    }

    @Get('/login')
    @Render('page/admin/login/index')
    async facebookLoginView(@Req() req, @Res() res, @Query() query: any): Promise<any> {
        console.log(query);
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
            console.log(userData);
            const getPages = await this.facebookService.getPages(userData.accessToken);
            const checkExist = await this.userService.checkExist(userData.user.email);
            const userId = userData.user.id;
            const ownerId = this.configService.get('owner_id');
            if (!checkExist) {
                console.log(userData);
                console.log(`New User Detected Id:${userId}`);
                console.log(getPages.data);
                const createUser = {
                    userId: userId,
                    email: userData.user.email,
                    displayName: userData.user.displayName,
                    facebookPage: getPages.data,
                }
                viewData['userName'] = userData.user.displayName;
                await this.userService.create(createUser)
            }

            if (!currentPageId) {
                this.facebookService.setCurrentPageId(getPages.data[0].id);
                console.log(`set pageId to:${getPages.data[0].id}`);
                req.session.passport.user.currentSelectPage = getPages.data[0].id;
            }
            if (userId === ownerId) {
                const currentPageAccessToken = this.facebookService.getCurrentPageAccessToken()
                const checkToken = await this.facebookService.checkTokenData(currentPageAccessToken, userData.accessToken);
                if (!currentPageAccessToken || !checkToken) {
                    const userAccessToken = req.user.accessToken
                    const currentPage = req.session.passport.user.currentSelectPage
                    await this.renewPageAccessToken(userAccessToken, currentPage);
                }
            }
            const pageDetail = await this.facebookService.getPageDetail();
            viewData['page'] = pageDetail;
            viewData['pageId'] = this.facebookService.getCurrentPageId();
            viewData['allPages'] = getPages;
            viewData['userName'] = req.user.user.displayName;
        }
        return {
            viewData: viewData,
        };
    }
    async renewPageAccessToken(ownerAccessToken: string, pageId: string) {
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
        console.log(`Current page  ${this.facebookService.getCurrentPageId()}`);
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
        viewData['userName'] = req.user.user.displayName;
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