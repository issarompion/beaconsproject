import {Router, Request, Response} from 'express';
import {kafkaClient,sendKafkaMessage,ContentMessage} from 'msconnector';
import {ENV} from 'lib';
import {IContent} from 'lib';
import {Producer} from 'kafka-node';
import {map} from '../index'
import * as uniqid from 'uniqid'

const router: Router = Router();
const producer: Producer = new Producer(kafkaClient, { requireAcks: 1 })

router.get('/', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = { response:response, request:request }
    const contentMsg: ContentMessage = { type: ENV.kafka_request, action: ENV.kafka_action_list, value: { id_client: request.params.clientId, id_beacon : request.params.beaconId }, id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_content, contentMsg);
});

router.post('/', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = { response:response, request:request }
    const currentBeacon: IContent = request.body;
    const contentMsg: ContentMessage = { type: ENV.kafka_request, action: ENV.kafka_action_create, value: currentBeacon , id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_content, contentMsg);
});

router.get('/:contentId', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = { response:response, request:request }
    const contentMsg: ContentMessage = { type: ENV.kafka_request, action: ENV.kafka_action_read, value: {id_client : request.params.clientId, id_beacon : request.params.beaconId, id_content :request.params.contentId }, id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_content, contentMsg);
});

router.delete('/:contentId', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = { response:response, request:request }
    const contentMsg: ContentMessage = { type: ENV.kafka_request, action: ENV.kafka_action_delete, value: { id_client: request.params.clientId, id_beacon : request.params.beaconId, id_content :request.params.contentId }, id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_content, contentMsg);
});

router.put('/:contentId', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = { response:response, request:request }
    const currentContent: IContent = request.body;
    const contentMsg: ContentMessage = { type: ENV.kafka_request, action: ENV.kafka_action_update, value: currentContent, id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_content, contentMsg);
});


export const contentsRouter = router;