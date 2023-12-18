import { Controller, Post, Res, Body, HttpStatus } from "@nestjs/common"
import { ChatService } from "./admin.chat.service"

@Controller('message')
export class ChatController {
    constructor(private chatService: ChatService) { }
    @Post()
    postMessage(@Res() res, @Body() data) {
        console.log('new Message Detected !!')
        this.chatService.addMessage(data)
        res.status(HttpStatus.OK).send("Message posted successfully")
    }
}