import { Controller, Get, Query, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { RedditService } from "./reddit.service";

@Controller('reddit')
@ApiTags('reddit')
export class RedditController {
    constructor(private readonly configService: ConfigService,
        private readonly redditService: RedditService) {

    }
    @Get("/action/login")
    async RedditLoginAction(@Query() query: any, @Res() res: any): Promise<any> {
        if (query.code) {
            console.log(query.code);
            const res = await this.redditService.getRedditAccessToken(query.code);
            return res;
        }
        return res.redirect('/admin/login')
    }
}