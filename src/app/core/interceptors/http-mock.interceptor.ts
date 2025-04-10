import { Injectable } from "@angular/core";
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse,
    HttpClient,
} from "@angular/common/http";
import { map, Observable, of } from "rxjs";

import * as configData from "../../../assets/mock/config.json";

@Injectable()
export class HttpMockInterceptor implements HttpInterceptor {
    public appDataConfig: any;

    constructor(private http: HttpClient) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = req;
        const handleRoute = (): Observable<any> => {
            switch (true) {
                case url.match(/\/config\/\d+$/) && method === "GET":
                    return getConfig();
                case url.match(/\/image\/\d+$/) && method === "GET":
                    return getImage();
                default:
                    return next.handle(req);
            }
        };

        const getConfig = (): Observable<any> => {
            return of(
                new HttpResponse({
                    status: 200,
                    body: configData,
                })
            );
        };

        const getImage = (): Observable<any> => {
            const urlParts = url.split("/");
            const id = Number(urlParts?.at(-1) || 1);

            return of(
                new HttpResponse({
                    status: 200,
                    body:
                        "assets/mock/" +
                        configData.pages.find((page) => page.number === id)
                            ?.imageUrl,
                })
            );
        };

        return handleRoute();
    }
}
