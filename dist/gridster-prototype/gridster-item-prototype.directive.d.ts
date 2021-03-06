import { ElementRef, EventEmitter, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import { GridsterPrototypeService } from './gridster-prototype.service';
import { GridListItem } from '../gridList/GridListItem';
import { GridsterService } from '../gridster.service';
export declare class GridsterItemPrototypeDirective implements OnInit, OnDestroy {
    private zone;
    private elementRef;
    private gridsterPrototype;
    drop: EventEmitter<{}>;
    start: EventEmitter<{}>;
    cancel: EventEmitter<{}>;
    enter: EventEmitter<{}>;
    out: EventEmitter<{}>;
    data: any;
    config: any;
    x: number;
    y: number;
    w: number;
    h: number;
    positionX: number;
    positionY: number;
    autoSize: boolean;
    $element: HTMLElement;
    drag: Observable<any>;
    dragSubscription: ISubscription;
    isDragging: boolean;
    item: GridListItem;
    containerRectange: ClientRect;
    private parentRect;
    private parentOffset;
    private subscribtions;
    readonly dragAndDrop: boolean;
    constructor(zone: NgZone, elementRef: ElementRef, gridsterPrototype: GridsterPrototypeService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    onDrop(gridster: GridsterService): void;
    onCancel(): void;
    onEnter(gridster: GridsterService): void;
    onOver(gridster: GridsterService): void;
    onOut(gridster: GridsterService): void;
    getPositionToGridster(gridster: GridsterService): {
        y: number;
        x: number;
    };
    private getContainerCoordsToGridster(gridster);
    private enableDragDrop();
    private setElementPosition(element, position);
    private updateParentElementData();
    private onStart(event);
    private onDrag(event);
    private onStop(event);
    private provideDragElement();
    private fixStylesForRelativeElement(el);
    private fixStylesForBodyHelper(el);
}
