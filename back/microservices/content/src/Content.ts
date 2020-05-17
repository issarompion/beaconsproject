import {IContentDocument} from './document';
import {ENV,IContent} from "shared";
import {Schema, model,connect} from 'mongoose';


connect(ENV.db_uri,{useUnifiedTopology: true, useNewUrlParser: true,})
.then(() => console.log('DB Connected!'))
.catch(err => {console.error(`DB Connection Error:${err.message}`);});

const ContentSchema: Schema = new Schema({
    content: {
        type: String,
    },
    id_beacon: {
        type: String,
    },
    timestamp: {
        type: Number,
    },
});

ContentSchema.methods.convert = function() : IContent {
    return {
        id_content : this._id,
        content : this.content,
        id_beacon : this.id_beacon,
        timestamp : this.timestamp
      }
}

export const ContentModel = model<IContentDocument>('content', ContentSchema);
