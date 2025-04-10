import { Component, OnDestroy, OnInit } from "@angular/core";
import { FilesComponent } from "./files/files.component";
import { ApiService } from "../../services/api.service";
import { Subject } from "rxjs/internal/Subject";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { ActivatedRoute } from "@angular/router";
import { Page } from "../../../shared/models/models";
import { PagesService } from "../../services/pages.service";

@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.component.html",
    standalone: true,
    providers: [ApiService, PagesService],
    imports: [FilesComponent],
    styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public pages: Page[] = [];
    constructor(
        private apiService: ApiService,
        private pagesService: PagesService,
        private route: ActivatedRoute
    ) {}

    public ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get("id");

        if (!this.pagesService.pages.length) {
            this.apiService
                .getConfig(Number(id))
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.pagesService.pages = res.pages;
                });
        }
        this.pages = this.pagesService.pages;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
