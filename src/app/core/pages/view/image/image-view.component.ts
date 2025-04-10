import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";
import { ApiService } from "../../../services/api.service";
import { takeUntil } from "rxjs";
import { Page } from "../../../../shared/types/types";

@Component({
    selector: "image-view",
    templateUrl: "./image-view.component.html",
    standalone: true,
    styleUrl: "./image-view.component.scss",
})
export class ImageViewComponent implements OnInit, OnDestroy {
    @Input()
    public page!: Page;

    public image = "";
    private destroy$ = new Subject<void>();

    constructor(private apiService: ApiService) {}

    public ngOnInit(): void {
        this.initImage();
    }

    public initImage() {
        this.apiService
            .getImage(this.page)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.image = res;
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
