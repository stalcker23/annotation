import { Component, Input, OnInit } from "@angular/core";
import { FileComponent } from "../file/file.component";
import { Page } from "../../../../shared/models/models";

@Component({
    selector: "files",
    templateUrl: "./files.component.html",
    standalone: true,
    imports: [FileComponent],
    styleUrl: "./files.component.scss",
})
export class FilesComponent {
    @Input()
    public pages: Page[] = [];
    public selectedImage = "";

    public selectForPreview(image: string) {
        this.selectedImage = image;
    }

    public closePreview() {
        this.selectedImage = "";
    }
}
