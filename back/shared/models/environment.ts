export interface Environnement {
    production: boolean,
    project_path:string,
    project_name: string,

    db_url: string,
    db_port: string,
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
    kafka_action_login: string,
    kafka_action_logout: string,
    kafka_ca_certificate?:string,
    kafka_acess_certificate?:string,
    kafka_acess_key?:string,

    jwt_key:string
}