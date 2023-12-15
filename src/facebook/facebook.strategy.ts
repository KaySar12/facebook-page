import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            clientID: process.env.client_id,
            clientSecret: process.env.client_secret,
            callbackURL: 'https://facebook-page-production.up.railway.app/admin/action/redirect',
            scope: 'email',
            profileFields: ['id', 'displayName', 'photos', 'email'],
        });
    }
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void,
    ): Promise<any> {

        const { name, emails, id, photos, displayName } = profile;
        console.log(this.configService.get('client_id'));
        const user = {
            email: emails[0].value,
            id: id,
            photos: photos,
            displayName: displayName,
            currentSelectPage: undefined,
        };
        const payload = {
            user,
            accessToken,
        };

        done(null, payload);
    }
}