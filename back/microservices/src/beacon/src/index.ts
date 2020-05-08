import {BeaconMessage,kafkaClient,sendKafkaMessage, fetchLastOffsets} from "msconnector";
const kafka = require('kafka-node');
import {Producer,Message,ConsumerOptions} from "kafka-node";
import {ENV,IBeacon} from "lib";
import {BeaconModel} from "./Beacon";
import {IBeaconDocument} from './document';
const producer: Producer = new Producer(kafkaClient, { requireAcks: 1 });

const consumerOptions: ConsumerOptions = {fromOffset: false};
const authConsumer = new kafka.Consumer(kafkaClient, [{ topic:'' + ENV.kafka_topic_beacon,partitions:1}], consumerOptions);
authConsumer.on('message', async (message: Message) => {
    fetchLastOffsets(['' + ENV.kafka_topic_beacon]).then(() => {
        const data: BeaconMessage  = JSON.parse(message.value.toString());

        switch (data.type) {

            case ('req'):

                switch (data.action) {

                    case 'create':
                        create(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_beacon, msg);
                        });
                        break;

                    case 'list':
                        list(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_beacon, msg);
                        });
                        break;

                    case 'read':
                        read(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_beacon, msg);
                        });
                        break;
                    case 'delete':
                        remove(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_beacon, msg);
                        });

                        break;
                    case 'update':
                        update(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_beacon, msg);
                        });
                        break;
                    default: break;
                }
                break;

            default: break;

        }
    });
});

const list = (data:BeaconMessage): Promise<BeaconMessage> =>{
    return new Promise((res) => {
        BeaconModel.find({id_client : data.value.id_client},function(err, beacons) {
            if(err){
                res({
                    type : 'res',
                    value : err.message,
                    action : data.action,
                    id : data.id,
                    status : 404
                })
            }else{
                let value : IBeacon[] = [];
                for(let i = 0; i <= beacons.length ; i++){
                    if(i == beacons.length){
                        res({
                            type : 'res',
                            value : value,
                            action : data.action,
                            id : data.id,
                            status : 200
                        })
                    }else{
                        value.push(beacons[i].convert())
                    }
                }
            }
        });
    });
}

const create = (data: BeaconMessage) : Promise<BeaconMessage> =>{
    return new Promise((res) => {
      let  newBeacon = new BeaconModel(data.value)
      newBeacon.save(function(err, beacon) {
        if(err){
            res({
                type : 'res',
                value : err.message,
                action : data.action,
                id : data.id,
                status : 404
            })
        }else{
        res({
          type : 'res',
          value : beacon.convert(),
          action : data.action,
          id : data.id,
          status : 200
          })
        }
      })
    });
}

const read = (data:BeaconMessage) : Promise <BeaconMessage> => {
    return new Promise((res) => {
        BeaconModel.findById({_id:data.value.id_beacon},function(err, beacon) {
            if (err){
                res({
                        type : 'res',
                        value : err.message,
                        action : data.action,
                        id : data.id,
                        status : 404
                })
            }else{
                if(beacon){
                    res({
                        type : 'res',
                        value : beacon.convert(),
                        action : data.action,
                        id : data.id,
                        status : 200
                    })
                }else{
                    res({
                        type : 'res',
                        value : "Ressource not found",
                        action : data.action,
                        id : data.id,
                        status : 404
                    })
                }
            }
        });
    });
}

const remove = (data:BeaconMessage) : Promise <BeaconMessage> => {
    return new Promise((res) => {
        BeaconModel.findByIdAndRemove({_id:data.value.id_beacon},function(err, beacon) {
            if (err){
                res({
                        type : 'res',
                        value : err.message,
                        action : data.action,
                        id : data.id,
                        status : 404
                })
            }else{
                if(beacon){
                    res({
                        type : 'res',
                        value : beacon.convert(),
                        action : data.action,
                        id : data.id,
                        status : 200
                    })
                }else{
                    res({
                        type : 'res',
                        value : "Ressource not found",
                        action : data.action,
                        id : data.id,
                        status : 404
                    })
                }
            }
        });
    });
}

const update = (data:BeaconMessage) : Promise <BeaconMessage> => {
    let update = {
        uuid: data.value.uuid,
        minor: data.value.minor,
        major: data.value.major,
        name: data.value.name
      }
    return new Promise((res) => {
        BeaconModel.updateOne({_id:data.value.id_beacon},update,function(err, result) {
            if (err){
                res({
                        type : 'res',
                        value : err.message,
                        action : data.action,
                        id : data.id,
                        status : 404
                })
            }else{
                if(result.nModified == 0){
                    res({
                        type : 'res',
                        value : "Ressource not found",
                        action : data.action,
                        id : data.id,
                        status : 404
                    })
                }else{
                    res({
                        type : 'res',
                        value : data.value,
                        action : data.action,
                        id : data.id,
                        status : 200
                    })
                }
            }
        });
    });
}
