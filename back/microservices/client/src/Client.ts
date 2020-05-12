import {IClientDocument} from './document';
import {ENV,IClient} from "shared";
import {Schema, model,connect} from 'mongoose';

const url = ENV.db_url+':'+ENV.db_port+'/'+ENV.db_name
connect(url,{useUnifiedTopology: true, useNewUrlParser: true,})
.then(() => console.log('DB Connected!'))
.catch(err => {console.log(`DB Connection Error:${err.message}`);});

const ClientSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    url: {
        type: String,
    },
    img: {
        type: String,
    },
    lat: {
        type: Number,
    },
    lng: {
        type: Number,
    },
});

ClientSchema.methods.convert = function() : IClient {
    return {
        id_client : this._id,
        name : this.name,
        url : this.url,
        img : this.img,
        lat : this.lat,
        lng: this.lng,
        address : this.address
      }
}


export const ClientModel = model<IClientDocument>('client', ClientSchema);
