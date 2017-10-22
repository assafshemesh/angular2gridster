import { GridsterItemComponent } from '../gridster-item/gridster-item.component';
import { GridsterItemPrototypeDirective } from '../gridster-prototype/gridster-item-prototype.directive';
import { GridsterService } from '../gridster.service';
export declare class GridListItem {
    static BREAKPOINTS: Array<string>;
    static X_PROPERTY_MAP: any;
    static Y_PROPERTY_MAP: any;
    itemComponent: GridsterItemComponent;
    itemPrototype: GridsterItemPrototypeDirective;
    itemObject: any;
    readonly $element: any;
    x: number;
    y: number;
    w: number;
    h: number;
    autoSize: boolean;
    readonly dragAndDrop: boolean;
    readonly resizable: boolean;
    readonly positionX: number;
    readonly positionY: number;
    constructor();
    setFromGridsterItem(item: GridsterItemComponent): GridListItem;
    setFromGridsterItemPrototype(item: GridsterItemPrototypeDirective): GridListItem;
    setFromObjectLiteral(item: Object): GridListItem;
    copy(): GridListItem;
    copyForBreakpoint(breakpoint?: any): GridListItem;
    getValueX(breakpoint?: any): any;
    getValueY(breakpoint?: any): any;
    setValueX(value: number, breakpoint?: any): void;
    setValueY(value: number, breakpoint?: any): void;
    triggerChangeX(breakpoint?: any): void;
    triggerChangeY(breakpoint?: any): void;
    hasPositions(breakpoint?: any): any;
    applyPosition(gridster?: GridsterService): void;
    calculatePosition(gridster?: GridsterService): {
        left: number;
        top: number;
    };
    applySize(gridster?: GridsterService): void;
    calculateSize(gridster?: GridsterService): {
        width: number;
        height: number;
    };
    private getXProperty(breakpoint?);
    private getYProperty(breakpoint?);
    private getItem();
    private isItemSet();
}
