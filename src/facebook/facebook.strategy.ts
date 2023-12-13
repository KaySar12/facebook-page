import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            clientID: 1100983394414551,
            clientSecret: '6d4c80736b6935e9ae26c5a50a484ba0',
            callbackURL: 'https://violently-distinct-trout.ngrok-free.app/admin/action/redirect',
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
            firstName: name.givenName,
            lastName: name.familyName,
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