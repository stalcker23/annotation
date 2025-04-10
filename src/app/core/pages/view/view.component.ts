import { Component, OnDestroy, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { Subject } from "rxjs/internal/Subject";
import { PagesService } from "../../services/pages.service";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs";
import { Page } from "../../../shared/models/models";
import { ImagesComponent } from "./images/images.component";
import { AnnotationComponent } from "../../../shared/components/annotation.component";

export enum AnnotationType {
    Text = "Text",
    Image = "Image",
}
export class Annotation {
    public id: number;
    public x: number;
    public y: number;
    public height: number;
    public width: number;
    public type: AnnotationType;
    public value: string | ArrayBuffer | null;
    public notSaved: boolean;

    constructor(initializer: Annotation) {
        this.height = initializer.height;
        this.id = initializer.id;
        this.x = initializer.x;
        this.y = initializer.y;
        this.width = initializer.width;
        this.type = initializer.type;
        this.value = initializer.value;
        this.notSaved = initializer.notSaved;
    }
}
export enum Actions {
    plusScale = "plusScale",
    minusScale = "minusScale",
    addText = "addText",
    addImage = "addImage",
    save = "save",
}

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
    public scale = 100;
    public Actions = Actions;
    public AnnotationType = AnnotationType;

    public annotations: Annotation[] = [];

    constructor(
        private apiService: ApiService,
        private pagesService: PagesService,
        private route: ActivatedRoute
    ) {}

    public ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get("image");
        const annotations = localStorage.getItem("annotations");
        if (annotations) {
            this.annotations = JSON.parse(annotations) || [];
        } else {
            localStorage.setItem("annotations", this.annotations.toString());
        }

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

    public action(operator: Actions) {
        if (operator === Actions.plusScale && this.scale !== 200) {
            this.scale += 10;
        } else if (operator === Actions.minusScale && this.scale !== 50) {
            this.scale -= 10;
        } else if (operator === Actions.addText) {
            this.addAnnotation(AnnotationType.Text);
        } else if (operator === Actions.addImage) {
            this.addAnnotation(AnnotationType.Image);
        } else if (operator === Actions.save) {
            this.saveAnnotations();
        }
    }

    public get scaleXY() {
        return `scale(${this.scale / 100})`;
    }

    public get scaleMargin() {
        return `${(1000 * this.scale) / 100}px`;
    }

    public addAnnotation(type: AnnotationType) {
        this.annotations.push(this.addAnnotationInstance(type));
    }

    public addAnnotationInstance(type: AnnotationType) {
        return new Annotation({
            height: 150,
            id: this.annotations.length,
            x: 0,
            y: 0,
            width: 150,
            type: type,
            value: "",
            notSaved: true,
        });
    }

    public saveAnnotations() {
        try {
            this.annotations.forEach(
                (annotation) => (annotation.notSaved = false)
            );
            localStorage.setItem(
                "annotations",
                JSON.stringify(this.annotations)
            );
        } catch (e) {
            alert("Quota exceeded!");
        }
    }

    public removeText(id: number) {
        this.annotations = this.annotations.filter(
            (annotation) => annotation.id !== id
        );
    }

    public updateAnnotation(changedAnnotation: Annotation) {
        const changedAnnotationIndex = this.annotations.findIndex(
            (annotation) => changedAnnotation.id === annotation.id
        );
        if (!isNaN(changedAnnotationIndex)) {
            this.annotations[changedAnnotationIndex] = changedAnnotation;
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
