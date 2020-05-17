import { config } from "dotenv"
import { resolve } from "path"
import { Environnement } from "../models"

config({ path: resolve(__dirname, "../../../../.env") })

export const ENV: Environnement = {
    production: (/true/i).test(process.env.PRODUCTION!),
    project_name: process.env.PROJECT_NAME!,

    db_uri: process.env.DB_URI!,

    api_port: process.env.API_PORT!,
    api_url: process.env.API_URL!,

    kafka_uri: process.env.KAFKA_URI!,
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
    kafka_action_login: process.env.KAFKA_ACTION_LOGIN!,
    kafka_action_logout: process.env.KAFKA_ACTION_LOGOUT!,

    jwt_key:process.env.JWT_KEY!,

};

console.log(ENV)