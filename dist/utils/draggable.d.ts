import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';
import { DraggableEvent } from './DraggableEvent';
export declare class Draggable {
    element: Element;
    dragStart: Observable<DraggableEvent>;
    dragMove: Observable<DraggableEvent>;
    dragStop: Observable<DraggableEvent>;
    private mousemove;
    private mouseup;
    private mousedown;
    private config;
    constructor(element: Element, config?: {
        handlerClass?: string;
    });
    private createDragStartObservable();
    private createDragMoveObservable(dragStart);
    private createDragStopObservable(dragStart);
    private isDragingByHandler(event);
    private isValidDragHandler(targetEl);
    private inRange(startEvent, moveEvent, range);
    private hasElementWithClass(className, target);
    private pauseEvent(e);
    private fixProblemWithDnDForIE(element);
}
