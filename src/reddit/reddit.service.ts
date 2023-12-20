import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class RedditService {
    async getRedditAccessToken(code: string): Promise<any> {
        try {
            const requestBody = {
                grant_type: 'authorization_code',
                code: code.toString(),
                redirect_uri: 'https://violently-distinct-trout.ngrok-free.app/reddit/action/login'
            }
            const response = await axios.post(
                'https://www.reddit.com/api/v1/access_token',
                requestBody,
                {
                    auth: {
                        username: 'RQtqjQ7AsDc1Mkv04h08kw',
                        password: 'iCPtNhZyJASNVZAzqhbNIfFB-0UpQw',
                    },

                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'user-agent': 'ManageContent by u/zzFrostzz'
                    },
                },
            );
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
}