import {Router, Request, Response} from 'express';
import {kafkaClient,sendKafkaMessage,AuthMessage} from 'msconnector';
import {ENV} from 'lib';
import {IUser} from 'lib';
import {Producer} from 'kafka-node';
import {map} from '../index'
import * as uniqid from 'uniqid'

const router: Router = Router();
const producer: Producer = new Producer(kafkaClient, { requireAcks: 1 })


export const usersRouter = router;