import { Module } from "@nestjs/common";
import { RedditService } from "./reddit.service";
import { RedditController } from "./reddit.controller";


@Module({
    imports: [],
    providers: [RedditService],
    controllers: [RedditController],
})
export class RedditModule {

}