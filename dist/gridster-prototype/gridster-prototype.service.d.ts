import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/share';
import { GridsterService } from '../gridster.service';
import { GridsterItemPrototypeDirective } from './gridster-item-prototype.directive';
import { DraggableEvent } from '../utils/DraggableEvent';
export declare class GridsterPrototypeService {
    private isDragging;
    private dragSubject;
    private dragStartSubject;
    private dragStopSubject;
    constructor();
    observeDropOver(gridster: GridsterService): Observable<any>;
    observeDropOut(gridster: GridsterService): Observable<any>;
    observeDragOver(gridster: GridsterService): {
        dragOver: Observable<GridsterItemPrototypeDirective>;
        dragEnter: Observable<GridsterItemPrototypeDirective>;
        dragOut: Observable<GridsterItemPrototypeDirective>;
    };
    dragItemStart(item: GridsterItemPrototypeDirective, event: DraggableEvent): void;
    dragItemStop(item: GridsterItemPrototypeDirective, event: DraggableEvent): void;
    updatePrototypePosition(item: GridsterItemPrototypeDirective, event: DraggableEvent): void;
    private createDragOverObservable(dragIsOver, gridster);
    private createDragEnterObservable(dragIsOver, gridster);
    private createDragOutObservable(dragIsOver, gridster);
    private isOverGridster(item, gridster, event);
}
