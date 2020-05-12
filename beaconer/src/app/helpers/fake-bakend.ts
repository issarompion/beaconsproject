import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { IClient, IBeacon, IContent } from '../models/entities';

const clients: IClient[] = [
    {id_client: '1',name: "ESIR",url:"https://esir.univ-rennes1.fr",img:"https://esir.univ-rennes1.fr/sites/esir.univ-rennes1.fr/files/esir_0.png",lat:0,lng:1},
    {id_client: '2',name: "INSA",url:"https://www.insa-rennes.fr/typo3temp/_processed_/b/8/csm_logo_Insa_afec26181c.png",lat:0,lng:1}
]
const beacons : IBeacon[] = [
    {id_beacon: '1', uuid : "12345678-9101-1121-3141-516171819203",name : "BDE",major : 1,minor : 1,id_client : "1"},
    {id_beacon: '2', uuid : "12345678-9101-1121-3141-516171819203",name : "BDE",major : 2,minor : 2,id_client : "1"}
]
const contents : IContent[] = [
    {id_content:'1',id_beacon : '1', content : "# BDE", timestamp : new Date().getTime()},
    {id_content:'2',id_beacon : '1', content : "# old BDE", timestamp : new Date().getTime()-1000},
]


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/clients') && method === 'GET':
                    return getClients();
                case url.endsWith('/clients/1') && method === 'GET':
                    return getClient();
                case url.endsWith('/clients/1/beacons') && method === 'GET':
                    return getBeacons();
                case url.endsWith('/clients/1/beacons/1') && method === 'GET':
                    return getBeacon();
                case url.endsWith('/clients/1/beacons/1/contents') && method === 'GET':
                    return getContents();
                case url.endsWith('/clients/1/beacons/1/contents') && method === 'GET':
                    return getContent();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function getClients(){
            return ok(clients)
        }

        function getClient(){
            const client = clients.find(x => x.id_client === '1')
            if(!client) return notFound('Client not found');
            return ok(client)
        }

        function getBeacons(){
            const _beacons = beacons.filter(x => x.id_client ==='1')
            return ok(_beacons)
        }

        function getBeacon(){
            const beacon = beacons.find(x => x.id_beacon === '1')
            if(!beacon) return notFound('Beacon not found');
            return ok(beacon)
        }

        function getContents(){
            const _contents = contents.filter(x => x.id_beacon === '1')
            return ok(_contents)
        }

        function getContent(){
            const content = contents.find(x => x.content === '1')
            if(!content) return notFound('Content not found');
            return ok(content)
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function notFound(message : string){
            return throwError({ status : 404, error: message });
        }

        function unauthorized(message : string) {
            return throwError({ status: 401, error: message});
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};