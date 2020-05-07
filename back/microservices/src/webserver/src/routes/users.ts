import {Router, Request, Response} from 'express';
import {kafkaClient,sendKafkaMessage,AuthMessage} from 'msconnector';
import {ENV} from 'lib';
import {IUser} from 'lib';
import {Producer} from 'kafka-node';
import {map} from '../index'
import * as uniqid from 'uniqid'

const router: Router = Router();
const producer: Producer = new Producer(kafkaClient, { requireAcks: 1 })

router.post('/', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = response
    const currentUser: IUser = request.body;
    const AuthMsg: AuthMessage = { type: ENV.kafka_request, action: ENV.kafka_action_create, value: currentUser , id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_auth, AuthMsg);

});

router.post('/login', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = response
    const currentUser: IUser = request.body;
    const AuthMsg: AuthMessage = { type: ENV.kafka_request, action: ENV.kafka_action_login, value: currentUser , id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_auth, AuthMsg);

});


export const usersRouter = router;