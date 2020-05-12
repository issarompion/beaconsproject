import {Logger, getLogger, configure} from "log4js";

export class MyLogger {
    logger: Logger;
    level: string;

    constructor(level: string) {
        this.level = level;

        configure({
            appenders: {
                logstash: {
                    type: '@log4js-node/logstash-http',
                    url: 'http://localhost:5000/'
                }
            },
            categories: {
                default: { appenders: ['logstash'], level: this.level}
            }
        });
        this.logger = getLogger();
    }
    infoLog(message: any){
        switch (this.level) {
            case 'info':
                this.logger.info('Information');
                break;
            case 'debug':
                this.logger.debug('Debug', message);
                break;
            case 'error':
                this.logger.error('Error', message);
                break;
            default: break;
        }

    }

}

