import { Body, Controller, Get, Param, Post, Query, Render, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { query } from "express";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { SendMessageDto } from "src/facebook/dto/sendMessage.dto";
import { FacebookAuthGuard } from "src/facebook/facebook.guard";
import { FacebookService } from "src/facebook/facebook.service";

@Controller('/admin/conversations')
@UseGuards(FacebookAuthGuard)
export class AdminConversationController {
    constructor(
        private cloudinaryService: CloudinaryService,
        private readonly facebookService: FacebookService) {
    }
    @Get('/data')
    @Render('page/admin/conversation/indexData')
    async index(@Req() req: any) {
        const getConversations = await this.facebookService.getPageConversations();
        const user = req.session.passport.user.user
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Manage Conversations';
        viewData['userName'] = `${user.displayName}`;
        viewData['conversations'] = getConversations.data;
        console.log(getConversations);
        console.log(getConversations.data[0].senders);
        console.log(getConversations.data[0].messages);
        return {
            viewData: viewData,
        };
    }
    @Get('/')
    @Render('page/admin/conversation/index')
    async indexNew(@Req() req: any) {
        const getConversations = await this.facebookService.getPageConversations();
        const user = req.session.passport.user.user
        console.log(user);
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Manage Conversations';
        viewData['userName'] = `${user.displayName}`
        viewData['conversations'] = getConversations.data;
        const getPages = await this.facebookService.getPages(req.user.accessToken);
        viewData['allPages'] = getPages;
        return {
            viewData: viewData,
        };
    }
    @Get('/messageData')
    @Render('page/admin/message/index')
    async getMessagebyId(@Query() query, @Req() req: any) {
        const conversationId = query.conversationId;
        const getConversationbyId = await this.facebookService.getConversationById(conversationId);
        const user = req.session.passport.user.user;
        const messages = getConversationbyId.messages.data;
        const viewData = [];
        console.log(messages);
        viewData['title'] = 'Admin Page - Admin - Manage Messages in a Conversation';
        viewData['userName'] = `${user.displayName}`
        viewData['messages'] = messages;
        viewData['conversationId'] = conversationId;
        const getPages = await this.facebookService.getPages(req.user.accessToken);
        viewData['allPages'] = getPages;
        return {
            viewData: viewData
        }
    }
    @Get('/message')
    @Render('page/admin/conversation/index')
    async getMessagebyIdNew(@Query() query, @Req() req: any) {
        const viewData = [];
        const getConversations = await this.facebookService.getPageConversations();
        const user = req.session.passport.user.user;
        const conversationId = query.conversationId;
        if (conversationId) {
            const getConversationbyId = await this.facebookService.getConversationById(conversationId);
            const messages = getConversationbyId.messages.data;
            console.log(messages);
            viewData['messages'] = messages;
            viewData['userName'] = `${user.displayName}`;
            viewData['conversationId'] = conversationId;
            viewData['senders'] = getConversationbyId.senders.data;
            const getPages = await this.facebookService.getPages(req.user.accessToken);
            viewData['allPages'] = getPages;
        }
        viewData['title'] = 'Admin Page - Admin - Manage Messages in a Conversation';
        viewData['conversations'] = getConversations.data;

        return {
            viewData: viewData
        }
    }
    @Post('/send/:id')
    @UseInterceptors(FileInterceptor('fileUpload'))
    async sendMessageToUser(@Param('id') receiver: string, @Body() body: any, @Res() res: any, @Query() query, @UploadedFile() file: Express.Multer.File) {
        console.log(`Sending Message to User `)
        console.log(body);
        console.log(query);
        console.log(file);
        if (!file) {
            const options: SendMessageDto = {
                recipient: receiver,
                message: body.message,
                messaging_type: 'RESPONSE'
            }
            await this.facebookService.sendMessageToUser(options)
            return res.redirect(`/admin/conversations/message?conversationId=${body.currentConversation}`)
        }
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
        const options: any = {
            recipient: receiver,
            message: body.message,
            messaging_type: 'RESPONSE',
            url: secureUrl
        }

        await this.facebookService.sendMessageAttachment(options)
        if (body.message) {
            await this.facebookService.sendMessageToUser(options)
        }
        return res.redirect(`/admin/conversations/message?conversationId=${body.currentConversation}`)
    }
}