import { Body, Controller, Get, Param, Post, Query, Redirect, Render, Req } from '@nestjs/common';
import { CreateNewPostDto } from 'src/facebook/dto/createNewPost.dto';
import { FacebookService } from 'src/facebook/facebook.service';
import { PageDto } from './dto/page.dto';
import { access } from 'fs';
@Controller('/admin/post')
export class AdminPostController {
    constructor(private readonly facebookService: FacebookService) { }
    @Get('/')
    @Render('page/admin/posts/index')
    async index(@Query() query: PageDto,@Req() req: any) {
        console.log(req.session['accessKey']); // Logging the body of the request
        // Logging the value of prev
        const response = await this.getPost(query.next, query.prev);
       
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin -  Manage Post page';
        viewData['posts'] = response.data;
        viewData['like_count'] = response.data;
        viewData['attachment_count'] = response.data;
        viewData['nextPage'] = response.paging?.cursors?.after || '';
        viewData['previousPage'] = response.paging?.cursors?.before || '';
        return {
            viewData: viewData,
        };
    }
    async getPost(next: string, prev: string) {
        if (!next && !prev) {
            return await this.facebookService.getPagePost();
        }
        else if (next && !prev) {
            return await this.facebookService.getNextPagePost(next);
        }
        else if (!next && prev) {
            return await this.facebookService.getPrevPagePost(prev);
        }
    }
    @Post('/create')
    @Redirect('/admin/post')
    async store(@Body() body: CreateNewPostDto) {
        console.log(body);
        return await this.facebookService.createNewPost(body);
    }
    @Post('/:postId/delete')
    @Redirect('/admin/post')
    async remove(@Param('postId') postId: string) {
        console.log(`deleting post ${postId}`);
        const deletePost = await this.facebookService.deletePost(postId);
        if (deletePost) {
            console.log('Delete Post Complete')
            return deletePost;
        }
        else {
            throw new Error('Error in Deleting Post method')
        }
    }
    @Get('/:postId/deletePost')
    @Redirect('/admin')
    async removePost(@Param('postId') postId: string) {
        console.log(`deleting post ${postId}`);
        const deletePost = await this.facebookService.deletePost(postId);
        if (deletePost) {
            console.log('Delete Post Complete')
            return deletePost;
        }
        else {
            throw new Error('Error in Deleting Post method')
        }
    }
    @Get('/:id')
    @Render('page/admin/posts/edit')
    async editPostView(@Param('id') id: string) {
        const viewData = [];
        viewData['title'] = 'Admin Page - Edit Post - Facebook Page';
        viewData['post'] = await this.facebookService.getPostbyId(id);
        return {
            viewData: viewData,
        };
    }
    @Post('/:postId/update')
    @Redirect('/admin/post')
    async updatePost(@Body() body: CreateNewPostDto, @Param('postId') postId: string) {
        return await this.facebookService.updatePost(postId, body);
    }
    @Get('/:postId/like')
    @Redirect('/admin/')
    async likePost(@Param('postId') postId: string) {
        console.log(`liked post ${postId}`)
        return await this.facebookService.LikePostAction(postId);
    }
    @Get('/:postId/unlike')
    @Redirect('/admin/')
    async UnlikePost(@Param('postId') postId: string) {
        console.log(`unliked post ${postId}`)
        return await this.facebookService.DeleteLike(postId);
    }
    @Get('/:postId/likeCount')
    @Redirect('/admin/post')
    async postLikeCount(@Param('postId') postId: string) {
        const response = await this.facebookService.getPostLike(postId);
        console.log(response);
    }
}