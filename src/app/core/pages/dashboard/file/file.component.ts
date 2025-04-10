import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from "@angular/core";
import { Subject } from "rxjs/internal/Subject";
import { takeUntil } from "rxjs";
import { ApiService } from "../../../services/api.service";
import { Router } from "@angular/router";
import { Page } from "../../../../shared/models/models";

@Component({
    selector: "file",
    templateUrl: "./file.component.html",
    standalone: true,
    styleUrl: "./file.component.scss",
})
export class FileComponent implements OnInit, OnDestroy {
    @Input()
    public page: Page = null;
    private destroy$ = new Subject<void>();

    public image = "";

    @Output()
    public selectForPreview = new EventEmitter<string>();
    constructor(
        private apiService: ApiService,
        private router: Router
    ) {}

    public ngOnInit(): void {
        this.apiService
            .getImage(this.page)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.image = res;
            });
    }

    public getPageName(page: Page) {
        return page?.imageUrl.split("/").at(-1);
    }

    public selectImageForPreview() {
        this.selectForPreview.next(this.image);
    }

    public editPage() {
        this.router.navigate([`/view/${this.page?.number}`]);
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
