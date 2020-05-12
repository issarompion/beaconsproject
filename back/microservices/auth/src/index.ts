import {AuthMessage,kafkaClient,sendKafkaMessage, fetchLastOffsets} from "shared";
const kafka = require('kafka-node')
import {Producer,Message,ConsumerOptions} from "kafka-node";
import {ENV,IUser} from "shared";
import {verify,sign} from 'jsonwebtoken';
import {compare} from 'bcryptjs';
import {UserModel} from './User';
import {IUserDocument} from './document'

const producer: Producer = new Producer(kafkaClient, { requireAcks: 1 })

const consumerOptions : ConsumerOptions = {fromOffset: false};
const authConsumer = new kafka.Consumer(kafkaClient, [{ topic:ENV.kafka_topic_auth,partitions:1}], consumerOptions);
authConsumer.on('message', (message: Message) => {
    fetchLastOffsets([ENV.kafka_topic_auth]).then(() => {
        const data : AuthMessage  = JSON.parse(message.value.toString());
        switch (data.type) {

            case (ENV.kafka_request):

                switch (data.action) {

                    case ENV.kafka_action_create:
                        create(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_auth, msg);
                        });
                        break;

                    case ENV.kafka_action_list:
                        list(data).then(msg =>{
                                sendKafkaMessage(producer, ENV.kafka_topic_auth, msg);
                        });
                        break;

                    case ENV.kafka_action_login:
                        login(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_auth, msg);
                        })
                        break;

                    case ENV.kafka_action_read:
                        read(data).then(msg =>{
                            sendKafkaMessage(producer, ENV.kafka_topic_auth, msg);
                        })

                        break;
                    case ENV.kafka_action_logout:
                        logout(data).then(msg => {
                            sendKafkaMessage(producer, ENV.kafka_topic_auth, msg);
                        })

                        break;

                    default: break;
                }
                break;
            default: break;
        }
    });
});

const list = (data:AuthMessage):Promise<AuthMessage> =>{
    return new Promise((res) => {
        UserModel.find(function(err, users) {
            if(err){
                res({
                    type : ENV.kafka_response,
                    value : err.message,
                    action : data.action,
                    id : data.id,
                    status : 404
                })
            }else{
                let value : IUser[] = []
                for(let i = 0; i <= users.length ; i++){
                    if(i == users.length){
                        res({
                            type : ENV.kafka_response,
                            value : value,
                            action : data.action,
                            id : data.id,
                            status : 200
                        })
                    }else{
                        value.push(users[i].convert())
                    }
                }
            }
        });
    });
}

const create = (data: AuthMessage) : Promise<AuthMessage> =>{
    return new Promise((res) => {
      let  newUser = new UserModel(data.value)
      newUser.save(function(err,user) {
        if(err){
            res({
                type : ENV.kafka_response,
                value : err.message,
                action : data.action,
                id : data.id,
                status : 404
            })
        }else{
        generateAuthToken(newUser)
        .then(token=>{
            res({
                type : ENV.kafka_response,
                value : newUser.convert(token),
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
                    type : ENV.kafka_response,
                    value : err.message,
                    action : data.action,
                    id : data.id,
                    status : 404
                })   
            }else{
                if(!user){
                    res({
                        type : ENV.kafka_response,
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
                                type : ENV.kafka_response,
                                value : 'Login failed! Check authentication password',
                                action : data.action,
                                id : data.id,
                                status : 401
                            })
                        }else{
                            generateAuthToken(user)
                            .then(token =>{
                                res({
                                    type : ENV.kafka_response,
                                    value : user.convert(token),
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

const read = (data: AuthMessage) : Promise<AuthMessage> =>{
    return new Promise((res) => {
        let token = data.token as string 
        verify(token,ENV.jwt_key,function(err,result:any){
            if(err){
                res({
                    type : ENV.kafka_response,
                    value : err.message,
                    action : data.action,
                    id : data.id,
                    status : 401
                })
            }
            UserModel.findOne({ _id: result._id,'tokens.token': token },function(err, user) {
                if(err){
                    res({
                        type : ENV.kafka_response,
                        value : err.message,
                        action : data.action,
                        id : data.id,
                        status : 404
                    })
                }else{
                    if (!user) {
                        res({
                            type : ENV.kafka_response,
                            value : 'Not authorized to access this resource',
                            action : data.action,
                            id : data.id,
                            status : 401
                        })
                    }else{
                        res({
                            type : ENV.kafka_response,
                            value : user.convert(token),
                            action : data.action,
                            id : data.id,
                            token : token,
                            status : 200
                        })
                    }
                }
            })
        })
    })
}

const logout = (data: AuthMessage) : Promise<AuthMessage> =>{
    return new Promise((res) => {
        let token = data.token as string 
        verify(token,ENV.jwt_key,function(err,result:any){
            if(err){
                res({
                    type : ENV.kafka_response,
                    value : err.message,
                    action : data.action,
                    id : data.id,
                    status : 401
                })
            }
            UserModel.findOne({ _id: result._id,'tokens.token': token },function(err, user) {
                if(err){
                    res({
                        type : ENV.kafka_response,
                        value : err.message,
                        action : data.action,
                        id : data.id,
                        status : 404
                        })
                }else{
                    if (!user) {
                        res({
                            type : ENV.kafka_response,
                            value : 'Not authorized to access this resource',
                            action : data.action,
                            id : data.id,
                            status : 401
                            })
                    }else{
                        user.tokens.splice(0,user.tokens.length)
                        user.save(function(err) {
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
                                value : 'logout success',
                                action : data.action,
                                id : data.id,
                                status : 200
                                })
                            }
                        })
                    }
                }
            })
        })
    })
}


