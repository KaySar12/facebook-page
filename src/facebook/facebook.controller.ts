import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateNewPostDto } from './dto/createNewPost.dto';
import { SendMessageDto } from './dto/sendMessage.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('facebook')
@ApiTags('facebook')
export class FacebookController {
    constructor(private readonly facebookService: FacebookService) { }
    @Get("")
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/redirect")
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: any): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: req.user,
        };
    }

    // @Get('/user/accessToken')
    // async getUserLonglivetoken() {
    //     return this.facebookService.getUserLongLivesAccessToken();
    // }
    // @Get('/page/accessToken')
    // async getPageAccessToken() {
    //     return this.facebookService.getPageAccessToken();
    // }
    @Get('/page/conversations')
    async getPageConversation(): Promise<any> {
        return await this.facebookService.getPageConversations();
    }
    @Get('/page')
    async getPageDetail() {
        return await this.facebookService.getPageDetail();
    }
    @Post('/page/post/createNewPost')
    async createNewPost(@Body() body: CreateNewPostDto) {
        console.log('Received Payload:', body);
        return await this.facebookService.createNewPost(body);
    }
    @Post('/page/message/send')
    async sendMessageToUser(@Body() body: SendMessageDto) {
        //console.log('Received Payload:', body);
        return await this.facebookService.sendMessageToUser(body);
    }
    @Get('/page/feed')
    async getPageFeed() {
        return await this.facebookService.getPagePost();
    }
    @Post('/page/comment/:postId')
    async postComment(@Param('postId') postId: string, @Body() message: string) {
        return await this.facebookService.postComment(postId, message);
    }
    @Delete('/page/comment/:commentId')
    async deleteComment(@Param('commentId') commentId: string) {
        return await this.facebookService.deleteComment(commentId);
    }
    @Delete('/page/post/:postId')
    async deletePost(@Param('postId') postId: string) {
        return await this.facebookService.deletePost(postId);
    }
    @Post('/page/:post/update')
    async updatePost(@Param('post') postId: string, @Body() body: CreateNewPostDto) {
        return await this.facebookService.updatePost(postId, body);
    }
    @Get('/page/:postId/comments')
    async getCommentbyPostId(@Param('postId') postId: string) {
        return await this.facebookService.getCommentbyId(postId);
    }
}
