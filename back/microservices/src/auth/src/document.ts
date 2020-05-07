import {Document, Model } from 'mongoose';
import {IUser} from 'lib';

export interface IUserDocument extends Document {
  // properites
  name: string,
  email: string,
  password: string,
  id_client: string,
  tokens : string[]
  // methods
  // generateAuthToken(): string
  convert():IUser
};

export interface IUserModel extends Model<IUserDocument> {
// statics
//  findByCredentials(email:string, password:string): IUserDocument;
}