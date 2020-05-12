import {ContentMessage,kafkaClient,sendKafkaMessage, fetchLastOffsets} from "shared";
const kafka = require('kafka-node')
import {Producer,Message,ConsumerOptions} from "kafka-node";
import {ENV,IContent} from "shared";
import {ContentModel} from "./Content";
import {IContentDocument} from './document';

const producer: Producer = new Producer(kafkaClient, { requireAcks: 1 });
const consumerOptions: ConsumerOptions = {fromOffset: false};
const authConsumer = new kafka.Consumer(kafkaClient, [{ topic:ENV.kafka_topic_content,partitions:1}], consumerOptions);
authConsumer.on('message', async (message: Message) => {
    fetchLastOffsets([ENV.kafka_topic_content]).then(() => {
        const data: ContentMessage  = JSON.parse(message.value.toString());

        switch (data.type) {

            case (ENV.kafka_request):

                switch (data.action) {

                    case ENV.kafka_action_create:
                        create(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_content, msg);
                        });
                        break;

                    case ENV.kafka_action_list:
                        list(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_content, msg);
                        });
                        break;

                    case ENV.kafka_action_read:
                        read(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_content, msg);
                        });
                        break;
                    case ENV.kafka_action_delete:
                        remove(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_content, msg);
                        });

                        break;
                    case ENV.kafka_action_update:
                        update(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_content, msg);
                        });
                        break;
                    default: break;
                }
                break;

            default: break;

        }
    });
});

const list = (data:ContentMessage): Promise<ContentMessage> =>{
    return new Promise((res) => {
        ContentModel.find({id_beacon : data.value.id_beacon},function(err, contents) {
            if(err){
                res({
                    type : ENV.kafka_response,
                    value : err.message,
                    action : data.action,
                    id : data.id,
                    status : 404
                })
            }else{
                let value : IContent[] = []
                for(let i = 0; i <= contents.length ; i++){
                    if(i == contents.length){
                        res({
                            type : ENV.kafka_response,
                            value : value,
                            action : data.action,
                            id : data.id,
                            status : 200
                        })
                    }else{
                        value.push(contents[i].convert())
                    }
                }
            }
        });
    });
}

const create = (data: ContentMessage) : Promise<ContentMessage> =>{
    return new Promise((res) => {
      data.value.timestamp = new Date().getTime()
      let  newContent = new ContentModel(data.value)
      newContent.save(function(err, content) {
        if(err){
            res({
                type : ENV.kafka_response,
                value : err.message,
                action : data.action,
                id : data.id,
                status : 404
            })
        }else{
        res({
          type : ENV.kafka_response,
          value : content.convert(),
          action : data.action,
          id : data.id,
          status : 200
          })
        }
      })
    });
}

const read = (data:ContentMessage) : Promise <ContentMessage> => {
    return new Promise((res) => {
        ContentModel.findById({_id:data.value.id_content},function(err, content) {
            if (err){
                res({
                        type : ENV.kafka_response,
                        value : err.message,
                        action : data.action,
                        id : data.id,
                        status : 404
                })
            }else{
                if(content){
                    res({
                        type : ENV.kafka_response,
                        value : content.convert(),
                        action : data.action,
                        id : data.id,
                        status : 200
                    })
                }else{
                    res({
                        type : ENV.kafka_response,
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

const remove = (data:ContentMessage) : Promise <ContentMessage> => {
    return new Promise((res) => {
        ContentModel.findByIdAndRemove({_id:data.value.id_content},function(err, content) {
            if (err){
                res({
                        type : ENV.kafka_response,
                        value : err.message,
                        action : data.action,
                        id : data.id,
                        status : 404
                })
            }else{
                if(content){
                    res({
                        type : ENV.kafka_response,
                        value : content.convert(),
                        action : data.action,
                        id : data.id,
                        status : 200
                    })
                }else{
                    res({
                        type : ENV.kafka_response,
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

const update = (data:ContentMessage) : Promise <ContentMessage> => {
    let update = {
        content: data.value.content,
        timestamp: new Date().getTime()
      }
    return new Promise((res) => {
        ContentModel.updateOne({_id:data.value.id_content},update,function(err, result) {
            if (err){
                res({
                        type : ENV.kafka_response,
                        value : err.message,
                        action : data.action,
                        id : data.id,
                        status : 404
                })
            }else{
                if(result.nModified == 0){
                    res({
                        type : ENV.kafka_response,
                        value : "Ressource not found",
                        action : data.action,
                        id : data.id,
                        status : 404
                    })
                }else{
                    res({
                        type : ENV.kafka_response,
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
