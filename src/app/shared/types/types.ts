import { Annotation } from "../classes/classes";
import { AnnotationActions } from "../enums/enums";

export type Page = {
    imageUrl: string;
    number: number;
};

export type AnnotationAnnotationEmmiter = {
    annotation: Annotation;
    annotationAction: AnnotationActions;
};
