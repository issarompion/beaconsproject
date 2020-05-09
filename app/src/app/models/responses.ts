import {IBeacon,IClient,IContent} from './interfaces';
export interface ClientsResponse {
    value: IClient[];
}
export interface ClientResponse {
    value: IClient;
}
export interface BeaconsResponse {
    value: IBeacon[];
}
export interface BeaconResponse {
    value: IBeacon;
}
export interface ContentsResponse {
    value: IContent[];
}
export interface ContentResponse {
    value: IContent;
}

