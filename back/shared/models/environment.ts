export interface Environnement {
    production: boolean,
    project_name: string,

    db_uri: string,

    api_port: string,
    api_url: string,

    kafka_uri: string,
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
    kafka_action_login: string,
    kafka_action_logout: string,

    jwt_key:string
}