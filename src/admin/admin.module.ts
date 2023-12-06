import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminPostController } from "./admin.post.controller";
import { AdminCommentController } from "./admin.comment.controller";
import { AdminConversationController } from "./admin.conversation.controller";
import { FacebookStrategy } from "src/facebook/facebook.strategy";
import { FacebookAuthGuard } from "src/facebook/facebook.guard";



@Module({
    controllers: [AdminController, AdminPostController, AdminCommentController, AdminConversationController],
    providers: [FacebookStrategy,FacebookAuthGuard],
})
export class AdminModule { }