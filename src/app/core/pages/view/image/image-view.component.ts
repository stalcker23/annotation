import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";
import { Page } from "../../../../shared/models/models";
import { ApiService } from "../../../services/api.service";
import { takeUntil } from "rxjs";

@Component({
    selector: "image-view",
    templateUrl: "./image-view.component.html",
    standalone: true,
    styleUrl: "./image-view.component.scss",
})
export class ImageViewComponent implements OnInit, OnDestroy {
    @Input()
    public page: Page = null;

    public image = "";

    constructor(private apiService: ApiService) {}

    private destroy$ = new Subject<void>();

    public ngOnInit(): void {
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
