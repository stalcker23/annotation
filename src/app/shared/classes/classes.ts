import { AnnotationType } from "../enums/enums";
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
