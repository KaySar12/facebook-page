import { Body, Controller, Get, Param, Post, Query, Redirect, Render } from "@nestjs/common";
import { query } from "express";
import { FacebookService } from "src/facebook/facebook.service";


@Controller('/admin/comment')
export class AdminCommentController {
    constructor(private readonly facebookService: FacebookService) {
    }
    @Get('/')
    @Render('page/admin/comment/index')
    async index() {
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Manage Comment';
        return {
            viewData: viewData,
        };
    }
    @Get('/post')
    @Render('page/admin/comment/index')
    async getCommentbyPostId(@Query() query) {
        console.log(query);
        const next = query.next || '';
        const prev = query.prev || '';
        const response = await this.getData(query.postId, next, prev);
        console.log(response);
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Manage Comment';
        viewData['postId'] = query.postId;
        viewData['comments'] = response.data;
        viewData['nextPage'] = response.paging?.cursors?.after || '';
        viewData['previousPage'] = response.paging?.cursors?.before || '';
        return {
            viewData: viewData,
        }
    }
    async getData(postId: string, next: string, prev: string) {
        if (!next && !prev) {
            return await this.facebookService.getCommentbyPostId(postId);
        }
        else if (next && !prev) {
            return await this.facebookService.getNextCommentbyPostId(postId, next);
        }
        else if (!next && prev) {
            return await this.facebookService.getPrevCommentbyPostId(postId, prev);
        }
    }
    @Post('/:postId/delete')
    @Redirect('/admin/comment/post')
    async remove(@Param('postId') postId: string) {
        return await this.facebookService.deletePost(postId);
    }
    @Post('/:postId/createComment')
    @Redirect('/admin')
    async createComment(@Param('postId') postId: string, @Body('comment') comment: string) {
        await this.facebookService.postComment(postId, comment);
    }
}