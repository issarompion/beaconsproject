import {KafkaClient, KafkaClientOptions, Offset} from 'kafka-node';
import {ENV} from 'lib';
const clientOptions: KafkaClientOptions = {kafkaHost: `${ENV.kafka_url}:${ENV.kafka_port}`};
export const kafkaClient: KafkaClient = new KafkaClient(clientOptions);
export const offset: Offset = new Offset(kafkaClient);
export {sendKafkaMessage} from './utils/kafka'
export {ResourceMessage,AuthMessage,BeaconMessage,ClientMessage,ContentMessage} from './IMessage'
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
