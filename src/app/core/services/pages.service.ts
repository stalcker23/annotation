import { Injectable } from "@angular/core";
import { Page } from "../../shared/models/models";

@Injectable()
export class PagesService {
    public pages: Page[] = [];
}
