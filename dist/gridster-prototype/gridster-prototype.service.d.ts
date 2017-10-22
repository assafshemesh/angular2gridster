import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/filter';
import { GridsterService } from '../gridster.service';
import { GridsterItemPrototypeDirective } from './gridster-item-prototype.directive';
export declare class GridsterPrototypeService {
    private isDragging;
    private dragSubject;
    private dragStartSubject;
    private dragStopSubject;
    constructor();
    observeDropOver(gridster: GridsterService): Observable<GridsterItemPrototypeDirective>;
    observeDropOut(gridster: GridsterService): Observable<GridsterItemPrototypeDirective>;
    observeDragOver(gridster: GridsterService): {
        dragOver: Observable<GridsterItemPrototypeDirective>;
        dragEnter: Observable<GridsterItemPrototypeDirective>;
        dragOut: Observable<GridsterItemPrototypeDirective>;
    };
    dragItemStart(item: GridsterItemPrototypeDirective): void;
    dragItemStop(item: GridsterItemPrototypeDirective): void;
    updatePrototypePosition(item: GridsterItemPrototypeDirective): void;
    private createDragOverObservable(dragIsOver, gridster);
    private createDragEnterObservable(dragIsOver, gridster);
    private createDragOutObservable(dragIsOver, gridster);
    private isInsideContainer(element, containerEl);
}
