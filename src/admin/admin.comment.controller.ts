import { Body, Controller, Get, Param, Post, Query, Redirect, Render, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { query } from "express";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { FacebookAuthGuard } from "src/facebook/facebook.guard";
import { FacebookService } from "src/facebook/facebook.service";


@Controller('/admin/comment')
@UseGuards(FacebookAuthGuard)
export class AdminCommentController {
    constructor(private cloudinaryService: CloudinaryService,
        private readonly facebookService: FacebookService) {
    }
    @Get('/')
    @Render('page/admin/comment/index')
    async index(@Req() req: any) {
        const user = req.session.passport.user.user
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Manage Comment';
        viewData['userName'] = `${user?.firstName} ${user?.lastName}`
        const getPages = await this.facebookService.getPages(req.user.accessToken);
        viewData['allPages'] = getPages;
        return {
            viewData: viewData,
        };
    }
    @Get('/getComment')
    @Render('page/admin/comment/index')
    async getCommentbyPostId(@Query() query, @Req() req: any) {
        const user = req.session.passport.user.user
        console.log(query);
        const next = query.next || '';
        const prev = query.prev || '';
        const response = await this.getData(query.id, next, prev);
        console.log(response);
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Manage Comment';
        viewData['userName'] = `${user?.firstName} ${user?.lastName}`
        viewData['postId'] = query.id || '';
        viewData['comments'] = response.data;
        viewData['nextPage'] = response.paging?.cursors?.after || '';
        viewData['previousPage'] = response.paging?.cursors?.before || '';
        return {
            viewData: viewData,
        }
    }
    async getData(id: string, next: string, prev: string) {
        if (!next && !prev) {
            return await this.facebookService.getCommentbyId(id);
        }
        else if (next && !prev) {
            return await this.facebookService.getNextCommentbyId(id, next);
        }
        else if (!next && prev) {
            return await this.facebookService.getPrevCommentbyId(id, prev);
        }
    }
    @Get('/:commentId/delete')
    async remove(@Param('commentId') commentId: string, @Query() query: any, @Res() res: any) {
        await this.facebookService.deleteComment(commentId);
        return res.redirect(`/admin/comment/getComment?id=${query.postId}`)
    }
    @Post('/:postId/createComment')
    @UseInterceptors(FileInterceptor('fileUpload'))
    async createComment(@Param('postId') postId: string, @Body('message') comment: string, @UploadedFile() file: Express.Multer.File, @Res() res: any) {
        if (file) {
            const secureUrl = await this.cloudinaryService
                .uploadImage(file)
                .then((data) => {
                    return data.secure_url;
                })
                .catch((err) => {
                    return {
                        statusCode: 400,
                        message: err.message,
                    };
                });
            await this.facebookService.uploadPhotoNoStory(secureUrl);
            await this.facebookService.postCommentWithFile(postId, comment, secureUrl);
            console.log('post with file');
            return res.redirect(`/admin/comment/getComment?id=${postId}`);
        }
        console.log('post without file')
        await this.facebookService.postComment(postId, comment);
        return res.redirect(`/admin/comment/getComment?id=${postId}`);
    }
}