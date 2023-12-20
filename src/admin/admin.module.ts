import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminPostController } from "./admin.post.controller";
import { AdminCommentController } from "./admin.comment.controller";
import { AdminConversationController } from "./admin.conversation.controller";
import { FacebookStrategy } from "src/facebook/facebook.strategy";
import { FacebookAuthGuard } from "src/facebook/facebook.guard";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/user/user.module";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { TableController } from "./inprogress/admin.tableData.controller";
import { TableService } from "./inprogress/admin.tableData.service";
import { ChatController } from "./inprogress/admin.chat.controller";
import { ChatService } from "./inprogress/admin.chat.service";
import { RedditModule } from "src/reddit/reddit.module";
import { RedditService } from "src/reddit/reddit.service";



@Module({
    imports: [PassportModule.register({ session: true }), UserModule, CloudinaryModule, RedditModule],
    controllers: [AdminController, AdminPostController, AdminCommentController, AdminConversationController, TableController, ChatController],
    providers: [FacebookStrategy, FacebookAuthGuard, TableService, ChatService,RedditService],
})
export class AdminModule {

}