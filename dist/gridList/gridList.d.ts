import { GridListItem } from './GridListItem';
import { IGridsterOptions } from '../IGridsterOptions';
export declare class GridList {
    items: Array<GridListItem>;
    grid: Array<Array<GridListItem>>;
    options: IGridsterOptions;
    constructor(items: Array<GridListItem>, options: IGridsterOptions);
    toString(): string;
    setOption(name: string, value: any): void;
    generateGrid(): void;
    resizeGrid(lanes: number): void;
    findPositionForItem(item: GridListItem, start: {
        x: number;
        y: number;
    }, fixedRow?: number): Array<number>;
    moveAndResize(item: GridListItem, newPosition: Array<number>, size: {
        w: number;
        h: number;
    }): void;
    moveItemToPosition(item: GridListItem, newPosition: Array<number>): void;
    resizeItem(item: GridListItem, size: {
        w: number;
        h: number;
    }): void;
    getChangedItems(initialItems: Array<GridListItem>, breakpoint?: any): Array<{
        item: GridListItem;
        changes: Array<string>;
        isNew: boolean;
    }>;
    resolveCollisions(item: GridListItem): void;
    pullItemsToLeft(fixedItem?: any): void;
    isOverFixedArea(x: number, y: number, w: number, h: number, item?: GridListItem): boolean;
    checkItemAboveEmptyArea(item: GridListItem, newPosition: {
        x: number;
        y: number;
    }): boolean;
    fixItemsPositions(options: IGridsterOptions): void;
    findDefaultPosition(width: number, height: number): number[];
    deleteItemPositionFromGrid(item: GridListItem): void;
    private isItemValidForGrid(item, options);
    private findDefaultPositionHorizontal(width, height);
    private findDefaultPositionVertical(width, height);
    private checkItemsInArea(rowStart, rowEnd, colStart, colEnd, item?);
    private sortItemsByPosition();
    private adjustSizeOfItems();
    private resetGrid();
    private itemFitsAtPosition(item, newPosition);
    private updateItemPosition(item, position);
    private updateItemSize(item, width, height);
    private markItemPositionToGrid(item);
    private ensureColumns(N);
    private getItemsCollidingWithItem(item);
    private itemsAreColliding(item1, item2);
    private tryToResolveCollisionsLocally(item);
    private findLeftMostPositionForItem(item);
    private findItemByPosition(x, y);
    private getItemByAttribute(key, value);
    private padNumber(nr, prefix);
    private getItemPosition(item);
    private setItemPosition(item, position);
}
