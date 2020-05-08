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
  convert():IUser
};