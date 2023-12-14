import { Module } from "@nestjs/common";
import { TikTokController } from "./tiktok.controller";
import { TikTokService } from "./tiktok.service";

@Module({
    imports: [],
    providers: [TikTokService],
    controllers: [TikTokController],
})
export class TikTokModule {

}