import { config } from "dotenv"
import { resolve } from "path"

config({ path: resolve(__dirname, "../../../.env") })

export interface Environnement {
    name: string;
    version: string;
    git: string;

    db_url: string;
    db_port: string;
    db_name: string,

    api_port: string,
    api_url: string,

    kafka_url: string,
    kafka_port: string,
    kafka_topic_auth: string,
    kafka_topic_beacon: string,
    kafka_topic_client: string,
    kafka_topic_content:string,
    kafka_topic_logger: string,
    kafka_request: string,
    kafka_response: string,
    kafka_action_list: string,
    kafka_action_read: string,
    kafka_action_update: string,
    kafka_action_delete: string,
    kafka_action_create: string,

    jwt_key:string
}

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
    password: string;
    name: string;
    id_client?: string;
}

export interface IContent {
    id_content: string;
    content: string;
    id_beacon: string;
    timestamp: number;
}

export const ENV: Environnement = {
    name: process.env.PROJECT_NAME!,
    version: process.env.PROJECT_VERSION!,
    git: process.env.GIT_URL!,

    db_port: process.env.DB_PORT!,
    db_url: process.env.DB_URL!,
    db_name: process.env.DB_NAME!,

    api_port: process.env.API_PORT!,
    api_url: process.env.API_URL!,

    kafka_url: process.env.KAFKA_URL!,
    kafka_port: process.env.KAFKA_PORT!,
    kafka_topic_auth: process.env.KAFKA_TOPIC_AUTH!,
    kafka_topic_beacon: process.env.KAFKA_TOPIC_BEACON!,
    kafka_topic_client: process.env.KAFKA_TOPIC_CLIENT!,
    kafka_topic_content: process.env.KAFKA_TOPIC_CONTENT!,
    kafka_topic_logger: process.env.KAFKA_TOPIC_LOGGER!,
    kafka_request: process.env.KAFKA_REQUEST!,
    kafka_response: process.env.KAFKA_RESPONSE!,
    kafka_action_list: process.env.KAFKA_ACTION_LIST!,
    kafka_action_read: process.env.KAFKA_ACTION_READ!,
    kafka_action_update: process.env.KAFKA_ACTION_UPDATE!,
    kafka_action_delete: process.env.KAFKA_ACTION_DELETE!,
    kafka_action_create: process.env.KAFKA_ACTION_CREATE!,

    jwt_key:process.env.JWT_KEY!,

};
