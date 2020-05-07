import {Router, Request, Response} from 'express';
import {kafkaClient,sendKafkaMessage,ClientMessage} from 'msconnector';
import {ENV} from 'lib';
import {IClient} from 'lib';
import {Producer} from 'kafka-node';
import {map} from '../index'
import * as uniqid from 'uniqid'

const router: Router = Router();
const producer: Producer = new Producer(kafkaClient, { requireAcks: 1 })

router.get('/', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = response
    const ClientMsg: ClientMessage = { type: ENV.kafka_request, action: ENV.kafka_action_list, value:undefined, id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_client, ClientMsg);

});

router.post('/', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = response
    const currentClient: IClient = request.body;
    const ClientMsg: ClientMessage = { type: ENV.kafka_request, action: ENV.kafka_action_create, value: currentClient , id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_client, ClientMsg);

});

router.get('/:clientId', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = response
    const ClientMsg: ClientMessage = { type: ENV.kafka_request, action: ENV.kafka_action_read, value: { id_client: request.params.clientId } , id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_client, ClientMsg);
});

router.delete('/:clientId', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = response
    const ClientMsg: ClientMessage = { type: ENV.kafka_request, action: ENV.kafka_action_delete, value: { id_client: request.params.clientId }, id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_client, ClientMsg);
});

router.put('/:clientId', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = response
    const currentClient: IClient = request.body;
    const ClientMsg: ClientMessage = { type: ENV.kafka_request, action: ENV.kafka_action_update, value: currentClient, id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_client, ClientMsg);
});

export const clientsRouter = router;