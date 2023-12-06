import { Controller, Get, Query, Render, UseGuards } from "@nestjs/common";
import { FacebookAuthGuard } from "src/facebook/facebook.guard";
import { FacebookService } from "src/facebook/facebook.service";

@Controller('/admin/conversations')
@UseGuards(FacebookAuthGuard)
export class AdminConversationController {
    constructor(private readonly facebookService: FacebookService) {
    }
    @Get('/')
    @Render('page/admin/conversation/index')
    async index() {
        const getConversations = await this.facebookService.getPageConversations();
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Manage Conversations';
        viewData['conversations'] = getConversations.data;
        return {
            viewData: viewData,
        };
    }
    @Get('/message')
    @Render('page/admin/message/index')
    async getMessagebyId(@Query() query) {
        const conversationId = query.conversationId;
        const getConversationbyId = await this.facebookService.getConversationById(conversationId);
        const messages = getConversationbyId.messages.data;
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Manage Messages in a Conversation';
        viewData['messages'] = messages;
        viewData['conversationId']=conversationId;
        return {
            viewData: viewData
        }
    }
    @Post()

}