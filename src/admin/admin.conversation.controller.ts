import { Body, Controller, Get, Param, Post, Query, Render, Req, Res, UseGuards } from "@nestjs/common";
import { query } from "express";
import { SendMessageDto } from "src/facebook/dto/sendMessage.dto";
import { FacebookAuthGuard } from "src/facebook/facebook.guard";
import { FacebookService } from "src/facebook/facebook.service";

@Controller('/admin/conversations')
@UseGuards(FacebookAuthGuard)
export class AdminConversationController {
    constructor(private readonly facebookService: FacebookService) {
    }
    @Get('/data')
    @Render('page/admin/conversation/indexData')
    async index(@Req() req: any) {
        const getConversations = await this.facebookService.getPageConversations();
        const user = req.session.passport.user.user
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Manage Conversations';
        viewData['userName'] = `${user?.firstName} ${user?.lastName}`
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
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Manage Conversations';
        viewData['userName'] = `${user?.firstName} ${user?.lastName}`
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
        viewData['userName'] = `${user?.firstName} ${user?.lastName}`
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

            viewData['messages'] = messages;
            viewData['userName'] = `${user?.firstName} ${user?.lastName}`
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
    async sendMessageToUser(@Param('id') receiver: string, @Body() body: any, @Res() res: any, @Query() query) {
        console.log(`Sending Message to User `)
        console.log(body);
        console.log(query)
        const options: SendMessageDto = {
            recipient: receiver,
            message: body.message,
            messaging_type: 'RESPONSE'
        }
        await this.facebookService.sendMessageToUser(options)
        return res.redirect(`/admin/conversations/message?conversationId=${body.currentConversation}`)
    }
}