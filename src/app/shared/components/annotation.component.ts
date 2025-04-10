import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from "@angular/core";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CdkDrag } from "@angular/cdk/drag-drop";
import {
    Annotation,
    AnnotationType,
} from "../../core/pages/view/view.component";

@Component({
    selector: "annotation",
    templateUrl: "./annotation.component.html",
    standalone: true,
    imports: [DragDropModule, CdkDrag],
    styleUrl: "./annotation.component.scss",
})
export class AnnotationComponent implements AfterViewInit {
    @Input()
    public annotation!: Annotation;

    @Output()
    public removeTextEmmiter = new EventEmitter<number>();

    @Output()
    public updateAnnotationEmmiter = new EventEmitter<Annotation>();

    @ViewChild("annotationView", { static: false })
    private annotationView!: ElementRef;

    public AnnotationType = AnnotationType;

    public removeText() {
        this.removeTextEmmiter.next(this.annotation.id);
    }

    public onDragEnded(event: any) {
        const annotation = event.source
            .getRootElement()
            .getBoundingClientRect();

        const imagesContainerX = document
            .getElementsByClassName("images-container")[0]
            .getBoundingClientRect().x;
        this.annotation.x = annotation.x - imagesContainerX;
        this.annotation.y = annotation.y + window.scrollY;
        this.annotation.notSaved = true;
        this.updateAnnotationEmmiter.next(this.annotation);
    }

    public onResize(event: any) {
        const annotation = event.srcElement;
        this.annotation.width = annotation.getBoundingClientRect().width;
        this.annotation.height = annotation.getBoundingClientRect().height;
        this.annotation.notSaved = true;
        this.updateAnnotationEmmiter.next(this.annotation);
    }

    public onFocusOut(event: any) {
        const annotation = event.srcElement;
        this.annotation.value = annotation.value;
        this.annotation.notSaved = true;
        this.updateAnnotationEmmiter.next(this.annotation);
    }

    public ngAfterViewInit() {
        const el = this.annotationView.nativeElement;
        if (this.annotation.x || this.annotation.y) {
            el.style.top = this.annotation.y + "px";
            el.style.left = this.annotation.x + "px";
        } else {
            el.style.top = (this.annotation.y = window.scrollY + 112) + "px";
            el.style.left = this.annotation.x = 0;
            this.updateAnnotationEmmiter.next(this.annotation);
        }
    }

    public get getBorderColor() {
        return this.annotation.notSaved ? "yellow" : "green";
    }

    public onFileChanged(event: any) {
        const files = event.target.files;
        if (files.length === 0) return;

        const mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (_event) => {
            this.annotation.value = reader.result;
        };
    }
}
