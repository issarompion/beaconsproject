import {IUserDocument} from './document';
import {ENV,IUser} from "shared";
import {Schema, model,connect} from 'mongoose';
import {hash,genSalt} from 'bcryptjs';

const url = ENV.db_url+':'+ENV.db_port+'/'+ENV.db_name
connect(url,{useUnifiedTopology: true, useNewUrlParser: true,useCreateIndex: true})
.then(() => console.log('DB Connected!'))
.catch(err => {console.error(`DB Connection Error:${err.message}`);});

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    id_client: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.pre<IUserDocument>('save', function (next) {
    var user = this
    if (user.isModified('password')) {
        genSalt(10, function (err, salt) {
            if (err) { return next(err) }
            hash(user.password, salt, (err, hash) => {
                if (err) { return next(err) }
                user.password = hash
                return next()
            })
        })
    }else{
        return next()
    }
})

UserSchema.methods.convert = function(token = undefined) : IUser {
    if(token){
        return {
            id_user : this._id,
            email : this.email,
            name : this.name,
            id_client : this.id_client,
            token : token
        }
    }else{
        return {
            id_user : this._id,
            email : this.email,
            name : this.name,
            id_client : this.id_client
          }
    }

}

export const UserModel = model<IUserDocument>('user', UserSchema);
