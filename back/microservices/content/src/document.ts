import {Document} from 'mongoose';
import {IContent} from "shared";

export interface IContentDocument extends Document {
  // properites
  name: string,
  url:string,
  img:string,
  lat:number,
  lng:number,
  address:string
  // methods
  convert():IContent
};