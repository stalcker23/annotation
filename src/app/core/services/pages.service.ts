import { Injectable } from "@angular/core";
import { Page } from "../../shared/types/types";

@Injectable()
export class PagesService {
    public pages: Page[] = [];
}
