import {IBeacon, IClient, IContent, IUser, Environnement} from 'lib';
import {ENV} from "lib";

export interface DefaultMessage {
    type: string,
    id : string,
    status : number
}
export interface ResourceMessage extends DefaultMessage {
    action: string,
    value : any
}

export interface AuthMessage extends DefaultMessage{
    action:string,
    value: IUser|any,
    token?:string
}
export interface BeaconMessage extends ResourceMessage{
    value: IBeacon|any
}
export interface ClientMessage extends ResourceMessage{
    value: IClient|any
}
export interface ContentMessage extends ResourceMessage{
    value: IContent|any
}
