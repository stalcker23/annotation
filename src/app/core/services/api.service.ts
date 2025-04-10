import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Page } from "../../shared/models/models";

@Injectable()
export class ApiService {
    constructor(private http: HttpClient) {}

    public getPages() {
        return this.http.get("/pages");
    }

    public getConfig(id: number): Observable<any> {
        return this.http.get(`/config/${id}`);
    }

    public getImage(page: Page): Observable<any> {
        return this.http.get(`/image/${page?.number}`);
    }
}
