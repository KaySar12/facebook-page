import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LineString } from 'typeorm';
import { CreateNewPostDto } from './dto/createNewPost.dto';
import { SendMessageDto } from './dto/sendMessage.dto';
@Injectable()
export class FacebookService {
    private userAccessToken: Promise<string>
    private pageAccessToken: Promise<string>
    constructor(private configService: ConfigService) {
        this.userAccessToken = this.getUserLongLivesAccessToken();
        this.pageAccessToken = this.getPageAccessToken();
    }

    async getUserLongLivesAccessToken() {
        const userAccessToken = 'EAAPpVqwgr9cBO1LHAfOnI0m9reixkopDmZBSzYJuJuFctk1yhmZAjFbv0zr7kIZCcvBDHmDAhUz9QOThJJ2aD8CKiNFhhjYZCD7sIgzZBA76GDhRZAlPO4M0eZA4QSZCM2ZBYFekt4EVPdvZAjk5s3SWWlYbiQCVWgAfCJSCW4XkLro62tGAs90ZAiyd8ug';
        const options = {
            method: "GET",
            url: `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=1100983394414551&client_secret=6d4c80736b6935e9ae26c5a50a484ba0&fb_exchange_token=${userAccessToken}`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        }
        try {
            const response = await axios.request(options);
            // console.log(response.data);
            return response.data.access_token;
        } catch (error) {
            console.error(error);
        }
    }
    async getPageAccessToken(): Promise<any> {
        const accessToken = await this.userAccessToken;
        const options = {
            method: 'GET',
            url: `https://graph.facebook.com/1425721644676951/accounts`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken} `
            },
        }
        try {
            const response = await axios.request(options);
            // console.log(response.data);
            return response.data.data[0].access_token;
        } catch (error) {
            console.error(error);
        }
    }
    async getPageDetail() {
        const accessToken = await this.pageAccessToken;
       // console.log(accessToken);
        const fields = 'link,followers_count,fan_count,name,phone,albums{photos{id,link,picture}},about,picture{url,height,width,cache_key,is_silhouette},release_date,location,current_location,general_info,personal_info,engagement,featured_video,emails,posts{from,full_picture,icon,id,created_time,likes{id},comments{id},status_type,permalink_url,message}'
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
        const accessToken = await this.pageAccessToken;
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
        const accessToken = await this.pageAccessToken;
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
        const access_token = await this.pageAccessToken;
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
        const access_token = await this.pageAccessToken;
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
        const access_token = await this.pageAccessToken;
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
        const access_token = await this.pageAccessToken;
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
        const access_token = await this.pageAccessToken;
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
        const access_token = await this.pageAccessToken;
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
        const access_token = await this.pageAccessToken;
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
        const access_token = await this.pageAccessToken;
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
        const access_token = await this.pageAccessToken;
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
        const access_token = await this.pageAccessToken;
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
        const access_token = await this.pageAccessToken;
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
        const access_token = await this.pageAccessToken;
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
        const access_token = await this.pageAccessToken
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
        const access_token = await this.pageAccessToken
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
        const access_token = await this.pageAccessToken
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
        const access_token = await this.pageAccessToken
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
