import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { IUser, IClient } from '../models/interfaces';

const users: IUser[] = [{ id_user: '1', email :'test@gmail.com', name: 'test', password: 'test', id_client: 'Test' }];
const clients: IClient[] = [{id_client: '1',name: "ESIR",url:"https://esir.univ-rennes1.fr",img:"https://esir.univ-rennes1.fr/sites/esir.univ-rennes1.fr/files/esir_0.png",lat:0,lng:1}]

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
                case url.endsWith('/users/login') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.endsWith('/clients') && method === 'GET':
                    return getClients();
                case url.endsWith('/users') && method === 'POST':
                    return create();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { email, password } = body;
            const user = users.find(x => x.email === email && x.password === password);
            if (!user) return error({
                value:'email or password is incorrect'
            });
            return ok({
                value : {
                    id_user: user.id_user,
                    email : user.email,
                    id_client : user.id_client,
                    name: user.name,
                    token: 'fake-jwt-token'
                }
            })
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok({ value : users });
        }

        function getClients(){
            return ok({
                value : clients
            })
        }

        function create(){
            const user = body;
            const copy = users.find(x => x.email === body.email)
            if(copy){
                return error({
                    value: body.email + ' already exists'
                })
            }else{
                users.push(user)
                return ok({
                    value : {
                        id_user: user.id_user,
                        email : user.email,
                        id_client : user.id_client,
                        name: user.name,
                        token: 'fake-jwt-token'
                    }
                })
            }
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: message });
        }

        function unauthorized() {
            return throwError({ status: 401, error: {
                value : 'Unauthorised'}
            });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};