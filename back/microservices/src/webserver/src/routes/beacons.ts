import {Router, Request, Response} from 'express';
import {kafkaClient,sendKafkaMessage,BeaconMessage} from 'msconnector';
import {ENV} from 'lib';
import {IBeacon} from 'lib';
import {Producer} from 'kafka-node';
import {map} from '../index'
import * as uniqid from 'uniqid'

const router: Router = Router();
const producer: Producer = new Producer(kafkaClient, { requireAcks: 1 })

router.get('/', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = { response:response, request:request }
    const beaconMsg: BeaconMessage = { type: ENV.kafka_request, action: ENV.kafka_action_list, value: { id_client: request.params.clientId }, id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_beacon, beaconMsg);
});

router.post('/', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = { response:response, request:request }
    const currentBeacon: IBeacon = request.body;
    const beaconMsg: BeaconMessage = { type: ENV.kafka_request, action: ENV.kafka_action_create, value: currentBeacon , id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_beacon, beaconMsg);
});

router.get('/:beaconId', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = { response:response, request:request }
    const beaconMsg: BeaconMessage = { type: ENV.kafka_request, action: ENV.kafka_action_read, value: {id_client : request.params.clientId, id_beacon : request.params.beaconId}, id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_beacon, beaconMsg);
});

router.delete('/:beaconId', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = { response:response, request:request }
    const beaconMsg: BeaconMessage = { type: ENV.kafka_request, action: ENV.kafka_action_delete, value: { id_client: request.params.clientId, id_beacon :request.params.beaconId }, id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_beacon, beaconMsg);
});

router.put('/:beaconId', async (request: Request, response: Response) => {
    let id : string = uniqid.default()
    map[id] = { response:response, request:request }
    const currentBeacon: IBeacon= request.body;
    const beaconMsg: BeaconMessage = { type: ENV.kafka_request, action: ENV.kafka_action_update, value: currentBeacon , id:id, status:0};

    sendKafkaMessage(producer, ENV.kafka_topic_beacon, beaconMsg);
});

export const beaconsRouter = router;