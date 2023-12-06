import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LineString } from 'typeorm';
import { CreateNewPostDto } from './dto/createNewPost.dto';
import { SendMessageDto } from './dto/sendMessage.dto';
@Injectable()
export class FacebookService {
    private userAccessToken: string
    private pageAccessToken: string
    constructor(private configService: ConfigService) {
        //Using static value for testing only
        this.userAccessToken = 'EAAPpVqwgr9cBO1KIn0WLXphpIm4okW0bR8C27sa22HeIGqsu55fKAnu4ooX1gSDMD62ZB1SwtDhUq0bgn6EBlz1JUW5fUvijs2YZC5t26vn7jTlja8f4fGHjDGO6WVGOwxGTQVbHn3LZCU4IP0ZAo8HZC0hdpUlqdDR2RXpKdIWnbqE1O8WeU427w'
        this.pageAccessToken = 'EAAPpVqwgr9cBO5LlZCTmcpQhH3qootQohfpykrMktlIVrZAAxeeiTfzQg7yBF6yBmjjw9QbZCRMGJx1gPTwFL1TEZCqHD1EHoxh3lWLZCwYjUPXKMqyzw8mngvMWOhobGhFLpnh5txvDqCC15LqaZC8eaxZCPZBSmu1HSnkOIQjC6qnK8Q5GbCLVr3mTWLjZCZBtYZD'
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
    async getPageAccessToken(userAccessToken: string): Promise<any> {
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/me/accounts`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.userAccessToken} `
            },
        }
        try {
            const response = await axios.request(options);
            //console.log(response.data);
            return response.data.data[0].access_token;
        } catch (error) {
            console.error('error at getPageAccess method');
        }
    }
    async getPageDetail() {
        const accessToken = this.pageAccessToken;
        const fields = 'link,followers_count,fan_count,name,phone,albums{photos{id,link,picture}},about,picture{url,height,width,cache_key,is_silhouette},release_date,location,current_location,general_info,personal_info,engagement,featured_video,emails,posts.limit(10){from,full_picture,icon,id,created_time,likes{id},comments{id},status_type,permalink_url,message}'
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/179668665228573?fields=${fields}`,
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
            console.error(error);
        }
    }
    async getPageConversations(): Promise<any> {
        const accessToken = this.pageAccessToken;
        const options = {
            method: 'GET',
            url: 'https://graph.facebook.com/v18.0/179668665228573/conversations?fields=name,id,senders,messages{message,from,to},updated_time',
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
        const fields = 'id,created_time,message,story,attachments,comments,likes.limit(1).summary(true)'
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/179668665228573/posts?limit=10&fields=${fields}`,
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
    async getNextPagePost(next: string) {
        const access_token = this.pageAccessToken;
        const fields = 'id,created_time,message,story,attachments,comments,likes.limit(1).summary(true)'
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/179668665228573/posts?limit=10&after=${next}&fields=${fields}`,
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
        const fields = 'id,created_time,message,story,attachments,comments,likes.limit(1).summary(true)'
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/179668665228573/posts?limit=10&previous=${previous}&fields=${fields}`,
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
        console.log(params);
        const options = {
            method: 'POST',
            url: `https://graph.facebook.com/v18.0/179668665228573/feed`,
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
    async sendMessageToUser(params: SendMessageDto) {
        const access_token = this.pageAccessToken;
        const options = {
            method: 'POST',
            url: 'https://graph.facebook.com/v18.0/179668665228573/messages',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            data: {
                recipient: params.recipient,
                messaging_type: params.messaging_type,
                message: params.message,
            },
        }
        try {
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
    async getCommentbyPostId(postId: string) {
        const access_token = this.pageAccessToken;
        console.log(postId);
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/${postId}/comments?limit=10`,
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
    async getNextCommentbyPostId(postId: string, next: string) {
        const access_token = this.pageAccessToken;
        console.log(postId);
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/${postId}/comments?limit=10&after=${next}`,
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
    async getPrevCommentbyPostId(postId: string, prev: string) {
        const access_token = this.pageAccessToken;
        console.log(postId);
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/v18.0/${postId}/comments?limit=10&previous=${prev}`,
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
}
