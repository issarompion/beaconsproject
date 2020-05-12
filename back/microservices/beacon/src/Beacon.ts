import {IBeaconDocument} from './document';
import {ENV,IBeacon} from "shared";
import {Schema, model,connect} from 'mongoose';

const url = ENV.db_url+':'+ENV.db_port+'/'+ENV.db_name;
connect(url,{useUnifiedTopology: true, useNewUrlParser: true})
.then(() => console.log('DB Connected!'))
.catch(err => {console.log(`DB Connection Error:${err.message}`);});

const BeaconSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    uuid: {
        type: String
    },
    minor: {
        type: Number
    },
    major: {
        type: Number
    },
    id_client: {
        type: String
    }
});

BeaconSchema.methods.convert = function() : IBeacon {
    return {
        id_beacon: this._id,
        uuid: this.uuid,
        minor: this.minor,
        major: this.major,
        name: this.name,
        id_client: this.id_client
      }
};

export const BeaconModel = model<IBeaconDocument>('beacon', BeaconSchema);
