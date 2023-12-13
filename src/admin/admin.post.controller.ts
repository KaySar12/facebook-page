import { BadRequestException, Body, Controller, Get, Param, Post, Query, Redirect, Render, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateNewPostDto } from 'src/facebook/dto/createNewPost.dto';
import { FacebookService } from 'src/facebook/facebook.service';
import { PageDto } from './dto/page.dto';
import { access } from 'fs';
import { FacebookAuthGuard } from 'src/facebook/facebook.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { response } from 'express';

@Controller('/admin/post')
@UseGuards(FacebookAuthGuard)
export class AdminPostController {
    constructor(
        private cloudinaryService: CloudinaryService,
        private readonly facebookService: FacebookService) { }
    @Get('/')
    @Render('page/admin/posts/index')
    async index(@Query() query: PageDto, @Req() req: any) {
        // Logging the value of prev
        const response = await this.getPost(query.next, query.prev);
        const user = req.session.passport.user.user
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin -  Manage Post page';
        viewData['userName'] = `${user.displayName}`;
        viewData['posts'] = response.data;
        viewData['like_count'] = response.data;
        viewData['attachment_count'] = response.data;
        viewData['nextPage'] = response.paging?.cursors?.after || '';
        viewData['previousPage'] = response.paging?.cursors?.before || '';
        const getPages = await this.facebookService.getPages(req.user.accessToken);
        viewData['allPages'] = getPages;
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
    @UseInterceptors(FileInterceptor('fileUpload'))
    async createNewPost(@Body() body: CreateNewPostDto, @UploadedFile() file: Express.Multer.File) {
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
            const response = await this.facebookService.uploadPhotoNoStory(secureUrl);
            return await this.facebookService.createNewPostWithFile(body, response.id);
        }
        return await this.facebookService.createNewPost(body);
    }
    async uploadImageToCloudinary(file: Express.Multer.File) {
        try {
            return await this.cloudinaryService.uploadImage(file)
        } catch (error) {
            console.log(error);
            throw new BadRequestException('Invalid file type.');
        }
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
    async editPostView(@Param('id') id: string, @Req() req) {
        const user = req.session.passport.user.user
        const viewData = [];
        viewData['title'] = 'Admin Page - Edit Post - Facebook Page';
        viewData['userName'] = `${user.displayName}`;
        viewData['post'] = await this.facebookService.getPostbyId(id);
        const getPages = await this.facebookService.getPages(req.user.accessToken);
        viewData['allPages'] = getPages;
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
    @Redirect('/admin/post')
    async likePost(@Param('postId') postId: string) {
        console.log(`liked post ${postId}`)
        return await this.facebookService.LikePostAction(postId);
    }
    @Get('/:postId/unlike')
    @Redirect('/admin/post')
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