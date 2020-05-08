import {app} from "./express.helper";
import {ENV,IUser} from "lib";
import {Response,Request} from "express";
import {clientsRouter} from './routes/clients'
import {beaconsRouter} from './routes/beacons'
import {contentsRouter} from './routes/contents'
import {usersRouter} from './routes/users'
import {kafkaClient,ResourceMessage,AuthMessage,fetchLastOffsets} from 'msconnector';
import {ConsumerOptions, Message} from 'kafka-node';
const kafka = require('kafka-node');

export const map: any = {};

app.use('/clients',clientsRouter)
app.use('/clients/:clientId/beacons',beaconsRouter)
app.use('/clients/:clientId/beacons/:beaconId/contents',contentsRouter)
app.use('/users',usersRouter)

app.listen(ENV.api_port, function () {
    console.log('App listening on port '+ENV.api_port);
});

const consumerOptions: ConsumerOptions = {fromOffset: false};
const authConsumer = new kafka.Consumer(kafkaClient, 
    [
        { topic:'' + ENV.kafka_topic_auth, partitions:1},
        { topic:'' + ENV.kafka_topic_beacon,partitions:1},
        { topic:'' + ENV.kafka_topic_client,partitions:1},
        { topic:'' + ENV.kafka_topic_content,partitions:1},
    ], consumerOptions);
const topics: string[] = [
    '' + ENV.kafka_topic_auth,
    '' + ENV.kafka_topic_beacon,
    '' + ENV.kafka_topic_client,
    '' + ENV.kafka_topic_content
];
authConsumer.on('message', async (message: Message) => {
    fetchLastOffsets(topics).then((myOffsets) => {
        if (message.offset) {
            const data: ResourceMessage = JSON.parse(message.value.toString());
            if (data.type === 'res') {
                console.log('myOffsets', myOffsets);
                let response: Response = map[data.id].response;
                let request : RequestWithCurrentUser = map[data.id].request;
                if((data as AuthMessage).token){
                    if(data.status === 200 && [ENV.kafka_action_create, ENV.kafka_action_login, ENV.kafka_action_read].indexOf(data.action) >= 0) {
                        request.currentUser = data.value
                    }
                    response.status(data.status).send({value: data.value,token:(data as AuthMessage).token});
                }else{
                    response.status(data.status).send({value: data.value});
                }
                delete map[data.id];
            }
        }
    });
});


interface RequestWithCurrentUser extends Request {
    currentUser?: IUser;
}
