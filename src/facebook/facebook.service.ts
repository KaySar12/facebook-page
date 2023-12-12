import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LineString } from 'typeorm';
import { CreateNewPostDto } from './dto/createNewPost.dto';
import { SendMessageDto } from './dto/sendMessage.dto';
@Injectable()
export class FacebookService {
    private pageAccessToken: string
    constructor(private configService: ConfigService) {
        //Owner access token
        //default invalid page token
        this.pageAccessToken = 'EAAPpVqwgr9cBO6P6VJ67HMaVEzk5LwwaVYZBuLiyFAwqEZAFsSYbmFbCLrajtjctvkXFMPqjwJGrPOZBzSeM8ZCzB0MBDRCnkbZAL1aN2Af8eRQRNPgKgihC39hXd6ZBKe1W4aeqgabVJiJr1HK0BN19nzfdCidVZCZBMzN7HLQKjXYJxdhZCWqZAFn0vEm6heWkAZD';
    }
    async checkTokenData(tokenToCheck: string, accessToken: string) {
        const options = {
            method: "GET",
            url: `https://graph.facebook.com/debug_token?input_token=${tokenToCheck}&access_token=${accessToken}`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        }
        try {
            const response = await axios.request(options);
            // console.log(response.data);
            const pageId = '179668665228573';
            const tokenData = response.data;
            console.log(tokenData.data.profile_id);
            if (!tokenData.data.is_valid || tokenData.data.profile_id != pageId) {
                console.log('invalid token detected')
                return false;
            }
            return true;
        } catch (error) {
            console.error('error at checkTokenData method');
            return false;
        }
    }
    setCurrentPageAccessToken(newAccessToken: string) {
        this.pageAccessToken = newAccessToken;
    }
    getCurrentPageAccessToken() {
        return this.pageAccessToken
    }
    async getUserId(accessToken: string) {
        const options = {
            method: "GET",
            url: `https://graph.facebook.com/v18.0/me`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken} `
            },
        }
        try {
            const response = await axios.request(options);
            return response.data.id;
        } catch (error) {
            console.log(error);
            console.error('error at getUserId method');
        }
    }
    async getUserLongLivesAccessToken(accessToken: string) {
        const options = {
            method: "GET",
            url: `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=1100983394414551&client_secret=6d4c80736b6935e9ae26c5a50a484ba0&fb_exchange_token=${accessToken}`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        }
        try {
            const response = await axios.request(options);
            // console.log(response.data);
            return response.data.access_token;
        } catch (error) {
            console.error('error at getUserLongLivesAccessToken method');
        }
    }
    // Step 2: Get Page Access Token
    async getPageAccessTokenById(userAccessToken: string, pageId: string) {
        try {
            const response = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${userAccessToken}`);
            const pages = response.data.data;
            const page = pages.find((p) => p.id === pageId);
            console.log(page);
            if (page) {
                return page.access_token;
            } else {
                console.error('Page not found for the given user.');
                return null;
            }
        } catch (error) {
            console.error('Error getting Page Access Token:', error.response.data);
            return null;
        }
    }
    async getPages(userAccessToken: string) {
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/me/accounts?fields=id,name,category`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${userAccessToken} `
            },
        }
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error('error at getPageAccess method');
        }
    }
    async getPageAccessToken(userAccessToken: string): Promise<any> {
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/me/accounts`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${userAccessToken} `
            },
        }
        try {
            const response = await axios.request(options);
            //console.log(response.data);
            return response.data.data[1].access_token;
        } catch (error) {
            console.error('error at getPageAccess method');
        }
    }
    async getPageDetail() {
        const accessToken = this.getCurrentPageAccessToken();
        const pageId = '179668665228573'
        const fields = 'link,followers_count,fan_count,name,phone,albums{photos{id,link,picture}},about,picture{url,height,width,cache_key,is_silhouette},release_date,location,current_location,general_info,personal_info,engagement,featured_video,emails,posts.limit(10){from,full_picture,icon,id,created_time,likes{id},comments{id},status_type,permalink_url,message}'
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/${pageId}?fields=${fields}`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken} `
            },
        };
        try {
            const response = await axios.request(options);
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
            console.error('error at getPageDetail method');
        }
    }
    async getPageConversations(): Promise<any> {
        const accessToken = this.pageAccessToken;
        const pageId = '179668665228573';
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/${pageId}/conversations?fields=name,id,senders,messages{message,from,to},updated_time`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken} `
            },
        };
        try {
            const response = await axios.request(options);
            //console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
    async getConversationById(conversationId: string) {
        const accessToken = this.pageAccessToken;
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/${conversationId}?fields=name,id,senders,messages{message,from,to,created_time},updated_time`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken} `
            },
        };
        try {
            const response = await axios.request(options);
            //console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
    async getPagePost() {
        const access_token = this.pageAccessToken;
        const pageId = '179668665228573';
        const fields = 'id,created_time,message,story,attachments,comments,likes.limit(1).summary(true)'
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/${pageId}/posts?limit=10&fields=${fields}`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        };
        try {
            const response = await axios.request(options);
            //console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('error at getPagePost method');
        }
    }
    async getNextPagePost(next: string) {
        const access_token = this.pageAccessToken;
        const pageId = '179668665228573';
        const fields = 'id,created_time,message,story,attachments,comments,likes.limit(1).summary(true)'
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/${pageId}/posts?limit=10&after=${next}&fields=${fields}`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        };

        try {
            const response = await axios.request(options);
            //console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
    async getPrevPagePost(previous: string) {
        const access_token = this.pageAccessToken;
        const pageId = '179668665228573';
        const fields = 'id,created_time,message,story,attachments,comments,likes.limit(1).summary(true)'
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/${pageId}/posts?limit=10&previous=${previous}&fields=${fields}`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        };
        try {
            const response = await axios.request(options);
            //console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
    async createNewPost(params: CreateNewPostDto): Promise<any> {
        const access_token = this.pageAccessToken;
        const pageId = '179668665228573'
        console.log(params);
        const options = {
            method: 'POST',
            url: `https://graph.facebook.com/v18.0/${pageId}/feed`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            data: {
                message: params.message.toString(),
                link: params.link ? params.link.toString() : '',
                published: params.published.toString().toLowerCase() === 'true', // Convert to boolean
            },
        };
        try {
            const response = await axios.request(options);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async createNewPostWithFile(params: CreateNewPostDto, imageId: string): Promise<any> {
        const access_token = this.pageAccessToken;
        const pageId = '179668665228573';
        console.log(params);
        const options = {
            method: 'POST',
            url: `https://graph.facebook.com/v18.0/${pageId}/feed`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            data: {
                message: params.message.toString(),
                published: params.published.toString().toLowerCase() === 'true', // Convert to boolean
                object_attachment: imageId
            },
        };
        try {
            const response = await axios.request(options);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async sendMessageToUser(params: SendMessageDto) {
        const access_token = this.pageAccessToken;
        const pageId = '179668665228573';
        const options = {
            method: 'POST',
            url: `https://graph.facebook.com/v18.0/${pageId}/messages`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            data: {
                recipient: { 'id': params.recipient },
                messaging_type: params.messaging_type,
                message: { 'text': params.message },
            },
        }
        try {
            //console.log(options.data);
            const response = await axios.request(options);
            //  console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async postComment(postId: string, message: string) {
        const access_token = this.pageAccessToken;
        const options = {
            method: 'POST',
            url: `https://graph.facebook.com/v18.0/${postId}/comments`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            data: {
                message: message,
            },
        };
        try {
            const response = await axios.request(options);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async postCommentWithFile(postId: string, message: string, url: string) {
        const access_token = this.pageAccessToken;
        const options = {
            method: 'POST',
            url: `https://graph.facebook.com/v18.0/${postId}/comments`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            data: {
                message: message,
                attachment_url: url,
            },
        };
        try {
            const response = await axios.request(options);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async getPostbyId(postId: string) {
        const access_token = this.pageAccessToken;
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/${postId}`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        };
        try {
            const response = await axios.request(options);
            //  console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async getCommentbyId(id: string) {
        const access_token = this.pageAccessToken;
        console.log(id);
        const fields = 'created_time,from,id,likes.limit(1).summary(true),message';
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/${id}/comments?fields=${fields}&limit=10`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        };
        try {
            const response = await axios.request(options);
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async getNextCommentbyId(id: string, next: string) {
        const access_token = this.pageAccessToken;
        console.log(id);
        const fields = 'created_time,from,id,likes.limit(1).summary(true),message';
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/${id}/comments?fields=${fields}&limit=10&after=${next}`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        };
        try {
            const response = await axios.request(options);
            //console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async getPrevCommentbyId(id: string, prev: string) {
        const access_token = this.pageAccessToken;
        //console.log(id);
        const fields = 'created_time,from,id,likes.limit(1).summary(true),message';
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/${id}/comments?fields=${fields}&limit=10&previous=${prev}`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        };
        try {
            const response = await axios.request(options);
            //console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async updatePost(postId: string, params: CreateNewPostDto) {
        const access_token = this.pageAccessToken;
        const options = {
            method: 'POST',
            url: `https://graph.facebook.com/v18.0/${postId}`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            data: {
                message: params.message,
                link: params.link,
                published: params.published.toString().toLowerCase() === 'true', // Convert to boolean
            },
        };
        try {
            const response = await axios.request(options);
            //  console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }

    async deletePost(postId: string) {
        const access_token = this.pageAccessToken;
        const options = {
            method: 'DELETE',
            url: `https://graph.facebook.com/v18.0/${postId}`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            }
        }
        try {
            const response = await axios.request(options);
            //  console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async deleteComment(commentId: string) {
        const access_token = this.pageAccessToken
        const options = {
            method: 'DELETE',
            url: `https://graph.facebook.com/v18.0/${commentId}`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            }
        }
        try {
            const response = await axios.request(options);
            //  console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async LikePostAction(postId: string) {
        const access_token = this.pageAccessToken
        const options = {
            method: 'POST',
            url: `https://graph.facebook.com/v18.0/${postId}/likes`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            }
        }
        try {
            const response = await axios.request(options);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async DeleteLike(postId: string) {
        const access_token = this.pageAccessToken
        const options = {
            method: 'DELETE',
            url: `https://graph.facebook.com/v18.0/${postId}/likes`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            }
        }
        try {
            const response = await axios.request(options);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async getPostLike(postId: string) {
        const access_token = this.pageAccessToken
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/${postId}/likes`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            }
        }
        try {
            const response = await axios.request(options);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async uploadPhotoNoStory(url: string) {
        console.log(url);
        const pageId = '179668665228573';
        const options = {
            method: 'Post',
            url: `https://graph.facebook.com/${pageId}/photos?no_story=true`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${this.pageAccessToken}`,
            },
            data: {
                url: url
            },
        }
        try {
            const response = await axios.request(options);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }
    async uploadPhoto(url: string) {
        const pageId = '179668665228573';
        const options = {
            method: 'Post',
            url: `https://graph.facebook.com/${pageId}/photos?`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${this.pageAccessToken}`,
            },
            data: {
                url: url
            },
        }
        try {
            const response = await axios.request(options);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.response.data);
        }
    }

}
