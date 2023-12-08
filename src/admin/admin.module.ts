import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminPostController } from "./admin.post.controller";
import { AdminCommentController } from "./admin.comment.controller";
import { AdminConversationController } from "./admin.conversation.controller";
import { FacebookStrategy } from "src/facebook/facebook.strategy";
import { FacebookAuthGuard } from "src/facebook/facebook.guard";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/auth/user.module";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";



@Module({
    imports: [PassportModule.register({ session: true }), UserModule, CloudinaryModule],
    controllers: [AdminController, AdminPostController, AdminCommentController, AdminConversationController,],
    providers: [FacebookStrategy, FacebookAuthGuard],
})
export class AdminModule { }