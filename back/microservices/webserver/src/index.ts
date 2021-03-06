import {app} from "./express.helper";
import {ENV,IUser} from "shared";
import {Response,Request} from "express";
import {clientsRouter} from './routes/clients'
import {beaconsRouter} from './routes/beacons'
import {contentsRouter} from './routes/contents'
import {usersRouter} from './routes/users'
import {kafkaClient,ResourceMessage,AuthMessage,fetchLastOffsets} from "shared";
import {ConsumerOptions, Message} from 'kafka-node';
const kafka = require('kafka-node');

export const map: any = {};

app.get('/', (req: Request, res: Response) => {
    res.status(200).send(`Welcome to ${ENV.project_name} API`)
});
app.use('/clients',clientsRouter)
app.use('/clients/:clientId/beacons',beaconsRouter)
app.use('/clients/:clientId/beacons/:beaconId/contents',contentsRouter)
app.use('/users',usersRouter)

app.listen(ENV.api_port, function () {
    console.log(`Webserver running on ${ENV.api_url}:${ENV.api_port}`);
});

const consumerOptions: ConsumerOptions = {fromOffset: false};
const authConsumer = new kafka.Consumer(kafkaClient, 
    [
        { topic:ENV.kafka_topic_auth, partitions:1},
        { topic:ENV.kafka_topic_beacon,partitions:1},
        { topic:ENV.kafka_topic_client,partitions:1},
        { topic:ENV.kafka_topic_content,partitions:1},
    ], consumerOptions);
const topics: string[] = [
    ENV.kafka_topic_auth,
    ENV.kafka_topic_beacon,
    ENV.kafka_topic_client,
    ENV.kafka_topic_content
];
authConsumer.on('message', async (message: Message) => {
    fetchLastOffsets(topics).then((myOffsets) => {
        if (message.offset) {
            const data: ResourceMessage = JSON.parse(message.value.toString());
            if (data.type === ENV.kafka_response) {
                console.log('myOffsets', myOffsets);
                let response: Response = map[data.id].response;
                let request : RequestWithCurrentUser = map[data.id].request;
                if(data.status === 200 && (data as AuthMessage).token && [ENV.kafka_action_create, ENV.kafka_action_login, ENV.kafka_action_read].indexOf(data.action) >= 0) {
                    request.currentUser = data.value
                }
                response.status(data.status).send(data.value);
                delete map[data.id];
            }
        }
    });
});


interface RequestWithCurrentUser extends Request {
    currentUser?: IUser;
}
