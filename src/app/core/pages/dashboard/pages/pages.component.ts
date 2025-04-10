import { Component, Input } from "@angular/core";
import { PageComponent } from "../page/page.component";
import { Page } from "../../../../shared/types/types";

@Component({
    selector: "pages",
    templateUrl: "./pages.component.html",
    standalone: true,
    imports: [PageComponent],
    styleUrl: "./pages.component.scss",
})
export class PagesComponent {
    @Input()
    public pages!: Page[];

    public selectedImage = "";

    public selectForPreview(image: string) {
        this.selectedImage = image;
    }

    public closePreview() {
        this.selectedImage = "";
    }
}
