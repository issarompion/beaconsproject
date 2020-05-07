import {app} from "./express.helper";
import {ENV} from "lib";
import {Response} from "express";
import {clientsRouter} from './routes/clients'
import {beaconsRouter} from './routes/beacons'
import {contentsRouter} from './routes/contents'
import {usersRouter} from './routes/users'
import {kafkaClient,ResourceMessage,fetchLastOffsets} from 'msconnector';
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
        console.log('myoffsets', myOffsets);
        if (message.offset) {
            console.log(message);
            const data: ResourceMessage = JSON.parse(message.value.toString());
            if (data.type === 'res') {
                let response: Response = map[data.id];
                response.status(data.status).send({value: data.value});
                delete map[data.id];
            }
        }
    });
});
