import { Injectable } from '@nestjs/common';

@Injectable()
export class TableService {
    add(newEmployee) {
        const Pusher = require('pusher');
        const pusher = new Pusher({
            appId: '1724539',
            key: '6733a2156ab8670aa489',
            secret: 'ff7c09896b271cfde148',
            cluster: 'ap1',
            useTLS: true
        });
        pusher.trigger('employees', 'new-employee', newEmployee);
    }
}