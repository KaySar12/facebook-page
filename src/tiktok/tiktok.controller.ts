import { Controller, Get, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";

@Controller('tiktok')
@ApiTags('tiktok')
export class TikTokController {
    constructor(private readonly configService: ConfigService) {

    }
    @Get('/oauth')
    async oauth(@Req() req, @Res() res) {
        const csrfState = Math.random().toString(36).substring(2);
        res.cookie('csrfState', csrfState, { maxAge: 60000 });
        let url = 'https://www.tiktok.com/v2/auth/authorize/';
        url += `?client_key=aw9lhw1om1pz0jwh`;
        url += `&scope=user.info.basic`;
        url += `&response_type=code`;
        url += `&redirect_uri=https%3A%2F%2Fviolently-distinct-trout.ngrok-free.app`;
        url += `&state=` + csrfState;

        res.redirect(url);
    }
}