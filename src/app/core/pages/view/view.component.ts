import { Component, OnDestroy, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { Subject } from "rxjs/internal/Subject";
import { PagesService } from "../../services/pages.service";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs";
import { ImagesComponent } from "./images/images.component";
import { AnnotationComponent } from "../../../shared/components/annotation.component";
import { AnnotationAnnotationEmmiter, Page } from "../../../shared/types/types";
import {
    BASE_ANNOTATION_SIZE,
    BASE_SCALE_VALUE,
    MAX_SCALE_VALUE,
    MIN_SCALE_VALUE,
    STEP_SCALE_VALUE,
} from "../../../shared/constants/constants";
import {
    ViewActions,
    AnnotationActions,
    AnnotationType,
} from "../../../shared/enums/enums";
import { Annotation } from "../../../shared/classes/classes";

@Component({
    selector: "view",
    templateUrl: "./view.component.html",
    standalone: true,
    imports: [ImagesComponent, AnnotationComponent],
    providers: [ApiService, PagesService],
    styleUrl: "./view.component.scss",
})
export class ViewComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public pages: Page[] = [];
    public scale = BASE_SCALE_VALUE;
    public ViewActions = ViewActions;
    public AnnotationType = AnnotationType;
    public AnnotationActions = AnnotationActions;
    public annotations: Annotation[] = [];

    constructor(
        private apiService: ApiService,
        private pagesService: PagesService,
        private route: ActivatedRoute
    ) {}

    public ngOnInit(): void {
        this.initAnnotations();
        this.initPages();
    }

    public initPages() {
        const id = this.route.snapshot.paramMap.get("image");

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

    public initAnnotations() {
        this.apiService
            .getAnnotations()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res.length) {
                    this.annotations = res || [];
                } else {
                    this.apiService
                        .setAnnotations(this.annotations.toString())
                        .pipe(takeUntil(this.destroy$))
                        .subscribe((res) => {
                            this.annotations = res;
                        });
                }
            });
    }

    public action(action: ViewActions) {
        if (
            action === ViewActions.plusScale &&
            this.scale !== MAX_SCALE_VALUE
        ) {
            this.scale += STEP_SCALE_VALUE;
        } else if (
            action === ViewActions.minusScale &&
            this.scale !== MIN_SCALE_VALUE
        ) {
            this.scale -= STEP_SCALE_VALUE;
        } else if (action === ViewActions.addText) {
            this.addAnnotation(AnnotationType.Text);
        } else if (action === ViewActions.addImage) {
            this.addAnnotation(AnnotationType.Image);
        } else if (action === ViewActions.save) {
            this.saveAnnotations();
        }
    }

    public get scaleXY() {
        return `scale(${this.scale / BASE_SCALE_VALUE})`;
    }

    public addAnnotation(type: AnnotationType) {
        this.annotations.push(this.addAnnotationInstance(type));
    }

    public addAnnotationInstance(type: AnnotationType) {
        return new Annotation({
            height: BASE_ANNOTATION_SIZE,
            id: this.annotations.length,
            x: 0,
            y: 0,
            width: BASE_ANNOTATION_SIZE,
            type: type,
            value: "",
            notSaved: true,
        });
    }

    public saveAnnotations() {
        try {
            this.annotations.forEach((annotation) => {
                annotation.notSaved = false;
            });
            this.apiService
                .setAnnotations(JSON.stringify(this.annotations))
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.annotations = res;
                });
        } catch (error) {
            alert("Quota exceeded!");
        }
    }

    public removeText(id: number) {
        this.annotations = this.annotations.filter(
            (annotation) => annotation.id !== id
        );
    }

    public normalizeAnnotationProperty(propertyValue: number) {
        return Math.round((propertyValue / this.scale) * BASE_SCALE_VALUE);
    }

    public updateAnnotation(event: AnnotationAnnotationEmmiter) {
        if (event.annotation.notSaved) {
            switch (event.annotationAction) {
                case AnnotationActions.move: {
                    event.annotation.x = this.normalizeAnnotationProperty(
                        event.annotation.x
                    );
                    event.annotation.y = this.normalizeAnnotationProperty(
                        event.annotation.y
                    );
                    break;
                }
                case AnnotationActions.resize: {
                    event.annotation.width = this.normalizeAnnotationProperty(
                        event.annotation.width
                    );
                    event.annotation.height = this.normalizeAnnotationProperty(
                        event.annotation.height
                    );
                    break;
                }
            }
        }
        const changedAnnotationIndex = this.annotations.findIndex(
            (annotation) => event.annotation.id === annotation.id
        );
        if (!isNaN(changedAnnotationIndex)) {
            this.annotations[changedAnnotationIndex] = event.annotation;
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
