import {kafkaClient} from "shared";
const kafka = require('kafka-node')
import {Message,ConsumerOptions} from "kafka-node";
import {ENV} from "shared";
const consumerOptions: ConsumerOptions = {fromOffset: false};
const authConsumer = new kafka.Consumer(kafkaClient, [{ topic:ENV.kafka_topic_logger,partitions:1}], consumerOptions);
authConsumer.on('message', async (message: Message) => {
    const data: any  = JSON.parse(message.value.toString());

    switch (data.type) {

        case (ENV.kafka_request):

            switch (data.action) {

                case ENV.kafka_action_create:
                    break;

                case ENV.kafka_action_delete:
                    break;

                case ENV.kafka_action_read:
                    break;

                case ENV.kafka_action_update:
                    break;
                    
                default: break;
            }
            break;

        default: break;

    }
});
