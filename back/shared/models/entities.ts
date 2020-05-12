export interface IBeacon {
    id_beacon: string;
    uuid: string;
    minor: number;
    major: number;
    name: string;
    id_client: string;
    id_content?: string;
}

export interface IClient {
    id_client: string;
    name: string;
    url:string;
    img:string;
    lat:number;
    lng:number;
    address:string;
}

export interface IUser {
    id_user: string;
    email: string;
    password?: string;
    name: string;
    token?: string;
    id_client?: string;
}

export interface IContent {
    id_content: string;
    content: string;
    id_beacon: string;
    timestamp: number;
}