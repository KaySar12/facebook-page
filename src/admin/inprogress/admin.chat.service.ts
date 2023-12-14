import { Injectable } from "@nestjs/common";

const Sentiment = require('sentiment');

@Injectable()
export class ChatService {

    addMessage(data) {
        const Pusher = require('pusher');
        const sentiment = new Sentiment();
        const sentimentScore = sentiment.analyze(data.message).score;

        const chat = {
            user: data.user,
            message: data.message,
            sentiment: sentimentScore
        }

        const pusher = new Pusher({
            appId: '1724539',
            key: '6733a2156ab8670aa489',
            secret: 'ff7c09896b271cfde148',
            cluster: 'ap1',
            useTLS: true
        });

        pusher.trigger('chats', 'new-chat', chat);
    }
}