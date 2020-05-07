import {AuthMessage,kafkaClient,sendKafkaMessage, fetchLastOffsets} from "msconnector";
const kafka = require('kafka-node')
import {Producer,Message,ConsumerOptions} from "kafka-node";
import {ENV} from 'lib';
import {verify,sign} from 'jsonwebtoken';
import {compare} from 'bcryptjs';
import {UserModel} from './User';
import {IUserDocument} from './document'

const producer: Producer = new Producer(kafkaClient, { requireAcks: 1 })

const consumerOptions : ConsumerOptions = {fromOffset: false};
const authConsumer = new kafka.Consumer(kafkaClient, [{ topic:'' + ENV.kafka_topic_auth,partitions:1}], consumerOptions);
authConsumer.on('message', (message: Message) => {
    fetchLastOffsets(['' + ENV.kafka_topic_auth]).then(() => {
        const data : AuthMessage  = JSON.parse(message.value.toString());
        console.log(data);
        switch (data.type) {

            case ('req'):

                switch (data.action) {

                    case 'create':
                        create(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_auth, msg);
                        });
                        break;

                    case 'login':
                        login(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_auth, msg);
                        })

                        break;

                    case 'read':

                        break;
                    case 'logout':

                        break;

                    default: break;
                }
                break;
            default: break;
        }
    });
});

const create = (data: AuthMessage) : Promise<AuthMessage> =>{
    return new Promise((res) => {
      let  newUser = new UserModel(data.value)
      newUser.save(function(err) {
        if(err.status){
            res({
                type : 'res',
                value : err.message,
                action : data.action,
                id : data.id,
                token: data.token,
                status : 404
            })
        }else{
        generateAuthToken(newUser)
        .then(token=>{
            res({
                type : 'res',
                value : newUser.convert(),
                action : data.action,
                id : data.id,
                token : token,
                status : 200
                })
        })
        }  
      })
    });
}

const login = (data: AuthMessage) : Promise<AuthMessage> =>{
    return new Promise((res) => {
        UserModel.findOne({email:data.value.email},function(err, user) {
            if(err){
                res({
                    type : 'res',
                    value : err.message,
                    action : data.action,
                    id : data.id,
                    status : 404
                })   
            }else{
                if(!user){
                    res({
                        type : 'res',
                        value : 'Login failed! Check authentication email',
                        action : data.action,
                        id : data.id,
                        status : 401
                    })
                }else{
                    compare(data.value.password, user.password)
                    .then(isPasswordMatch =>{
                        if (!isPasswordMatch) {
                            res({
                                type : 'res',
                                value : 'Login failed! Check authentication password',
                                action : data.action,
                                id : data.id,
                                status : 401
                            })
                        }else{
                            generateAuthToken(user)
                            .then(token =>{
                                res({
                                    type : 'res',
                                    value : user.convert(),
                                    action : data.action,
                                    id : data.id,
                                    token : token,
                                    status : 200
                                })
                            })
                        }
                })
            }
            }
        })
    })
}

const generateAuthToken = (user : any): Promise<string> =>{
    return new Promise((res) => {
        let token = sign({_id: user._id}, ENV.jwt_key)
        user.tokens = user.tokens.concat({token})
        user.save(function() {
            res(token)
        })
    }) 
}


