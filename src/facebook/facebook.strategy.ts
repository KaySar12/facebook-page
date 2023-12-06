import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor() {
        super({
            clientID: 1100983394414551,
            clientSecret: '6d4c80736b6935e9ae26c5a50a484ba0',
            callbackURL: 'http://localhost:3000/admin/',
            scope: 'email',
            profileFields: ['emails', 'name'],
        });
     }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void,
    ): Promise<any> {
        console.log('validate');
        const { name, emails } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
        };
        const payload = {
            user,
            accessToken,
        };

        done(null, payload);
    }
}