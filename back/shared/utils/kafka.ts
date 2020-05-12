import { Producer, KafkaClient, KafkaClientOptions, Offset } from 'kafka-node';
import { ENV } from "../helpers";
import { BeaconMessage, ClientMessage, AuthMessage, ContentMessage } from "../models"

const clientOptions: KafkaClientOptions = {kafkaHost: `${ENV.kafka_url}:${ENV.kafka_port}`};
export const kafkaClient: KafkaClient = new KafkaClient(clientOptions);
export const offset: Offset = new Offset(kafkaClient);

export const sendKafkaMessage = ( prod: Producer, topicVal: string, msg: BeaconMessage | ClientMessage | AuthMessage | ContentMessage  ) => {
       prod.send([{ topic: topicVal, messages: JSON.stringify(msg) }], () => {
            console.log('send producer', topicVal, msg.type, msg.action, msg.value,msg.status,msg.id);
        });
    };

export interface MyOffset {
    topic: string;
    offset: number;
}

export const fetchLastOffsets = (topics: string[]): Promise<Offset[]> => {
    return new Promise((res) => {
        offset.fetchLatestOffsets(topics,function(error: Error, offsets: Offset[]){
            res(offsets);
        });
    })
};