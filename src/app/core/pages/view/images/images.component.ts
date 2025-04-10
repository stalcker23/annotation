import { AfterViewInit, Component, Input, OnDestroy } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";
import { ImageViewComponent } from "../image/image-view.component";
import { ActivatedRoute } from "@angular/router";
import { Page } from "../../../../shared/types/types";
import { FOOTER_HEIGHT } from "../../../../shared/constants/constants";

@Component({
    selector: "images",
    templateUrl: "./images.component.html",
    standalone: true,
    imports: [ImageViewComponent],
    styleUrl: "./images.component.scss",
})
export class ImagesComponent implements OnDestroy, AfterViewInit {
    @Input()
    public pages: Page[] = [];

    private destroy$ = new Subject<void>();

    constructor(private route: ActivatedRoute) {}

    public ngAfterViewInit(): void {
        this.scrollToDirectFile();
    }

    public scrollToDirectFile() {
        const imageId = this.route.snapshot.paramMap.get("image") || "1";
        const yOffset = -FOOTER_HEIGHT;
        const element = document.getElementById(imageId);

        if (element) {
            const y =
                element.getBoundingClientRect().top + window.scrollY + yOffset;

            window.scrollTo({ top: y, behavior: "smooth" });
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
