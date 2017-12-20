"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/operator/filter");
var gridList_1 = require("./gridList/gridList");
var GridsterService = (function () {
    function GridsterService() {
        this.items = [];
        this._itemsMap = {};
        this.disabledItems = [];
        this.isInit = false;
    }
    GridsterService.prototype.isInitialized = function () {
        return this.isInit;
    };
    GridsterService.prototype.registerItem = function (item) {
        this.items.push(item);
        return item;
    };
    GridsterService.prototype.init = function (options, draggableOptions, gridsterComponent) {
        if (options === void 0) { options = {}; }
        if (draggableOptions === void 0) { draggableOptions = {}; }
        this.gridsterComponent = gridsterComponent;
        this.draggableOptions = draggableOptions;
        this.gridsterOptions = gridsterComponent.gridsterOptions;
    };
    GridsterService.prototype.start = function () {
        var _this = this;
        this.updateMaxItemSize();
        if (this.$positionHighlight) {
            this.$positionHighlight.style.display = 'none';
        }
        this.initGridList();
        this.isInit = true;
        setTimeout(function () {
            _this.copyItems();
            _this.fixItemsPositions();
            _this.gridsterComponent.reflowGridster(true);
            _this.gridsterComponent.setReady();
        });
    };
    GridsterService.prototype.initGridList = function () {
        this.gridList = new gridList_1.GridList(this.items, this.options);
    };
    GridsterService.prototype.render = function () {
        this.updateMaxItemSize();
        this.gridList.generateGrid();
        this.applySizeToItems();
        this.applyPositionToItems();
    };
    GridsterService.prototype.reflow = function () {
        this.calculateCellSize();
        this.render();
    };
    GridsterService.prototype.fixItemsPositions = function () {
        var _this = this;
        this.gridList.fixItemsPositions(this.gridsterOptions.basicOptions);
        this.gridsterOptions.responsiveOptions.forEach(function (options) {
            _this.gridList.fixItemsPositions(options);
        });
        this.updateCachedItems();
    };
    GridsterService.prototype.removeItem = function (item) {
        this.items.splice(this.items.indexOf(item), 1);
        this.gridList.deleteItemPositionFromGrid(item);
        this.removeItemFromCache(item);
    };
    GridsterService.prototype.onResizeStart = function (item) {
        this.currentElement = item.$element;
        this.copyItems();
        this._maxGridCols = this.gridList.grid.length;
        this.highlightPositionForItem(item);
        this.gridsterComponent.isResizing = true;
    };
    GridsterService.prototype.onResizeDrag = function (item) {
        var newSize = this.snapItemSizeToGrid(item);
        var sizeChanged = this.dragSizeChanged(newSize);
        var newPosition = this.snapItemPositionToGrid(item);
        var positionChanged = this.dragPositionChanged(newPosition);
        if (sizeChanged || positionChanged) {
            this.restoreCachedItems();
            this.gridList.generateGrid();
            this.previousDragPosition = newPosition;
            this.previousDragSize = newSize;
            this.gridList.moveAndResize(item, newPosition, { w: newSize[0], h: newSize[1] });
            this.applyPositionToItems(true);
            this.highlightPositionForItem(item);
        }
    };
    GridsterService.prototype.onResizeStop = function (item) {
        this.currentElement = undefined;
        this.updateCachedItems();
        this.previousDragSize = null;
        this.removePositionHighlight();
        this.gridList.pullItemsToLeft();
        this.render();
        this.gridsterComponent.isResizing = false;
        this.fixItemsPositions();
    };
    GridsterService.prototype.onStart = function (item) {
        this.currentElement = item.$element;
        this.copyItems();
        this._maxGridCols = this.gridList.grid.length;
        this.gridsterComponent.isDragging = true;
        this.gridsterComponent.updateGridsterElementData();
    };
    GridsterService.prototype.onDrag = function (item) {
        var newPosition = this.snapItemPositionToGrid(item);
        if (this.dragPositionChanged(newPosition)) {
            this.previousDragPosition = newPosition;
            if (this.options.direction === 'none' || (!this.options.floating && !item.itemPrototype)) {
                if (!this.gridList.checkItemAboveEmptyArea(item, { x: newPosition[0], y: newPosition[1] })) {
                    return;
                }
            }
            this.restoreCachedItems();
            this.gridList.generateGrid();
            this.gridList.moveItemToPosition(item, newPosition);
            this.applyPositionToItems(true);
            this.highlightPositionForItem(item);
        }
    };
    GridsterService.prototype.onDragOut = function (item) {
        this.restoreCachedItems();
        this.previousDragPosition = null;
        this.updateMaxItemSize();
        this.applyPositionToItems();
        this.removePositionHighlight();
        this.currentElement = undefined;
        var idx = this.items.indexOf(item);
        this.items.splice(idx, 1);
        this.gridList.pullItemsToLeft();
        this.render();
    };
    GridsterService.prototype.onStop = function (item) {
        this.currentElement = undefined;
        this.updateCachedItems();
        this.previousDragPosition = null;
        this.removePositionHighlight();
        this.gridList.pullItemsToLeft();
        this.gridsterComponent.isDragging = false;
    };
    GridsterService.prototype.removeItemFromCache = function (item) {
        var _this = this;
        this._items = this._items
            .filter(function (cachedItem) { return cachedItem.$element !== item.$element; });
        Object.keys(this._itemsMap)
            .forEach(function (breakpoint) {
            _this._itemsMap[breakpoint] = _this._itemsMap[breakpoint]
                .filter(function (cachedItem) { return cachedItem.$element !== item.$element; });
        });
    };
    GridsterService.prototype.copyItems = function () {
        var _this = this;
        this._items = this.items
            .filter(function (item) { return _this.isValidGridItem(item); })
            .map(function (item) {
            return item.copyForBreakpoint(null);
        });
        this.gridsterOptions.responsiveOptions.forEach(function (options) {
            _this._itemsMap[options.breakpoint] = _this.items
                .filter(function (item) { return _this.isValidGridItem(item); })
                .map(function (item) {
                return item.copyForBreakpoint(options.breakpoint);
            });
        });
    };
    GridsterService.prototype.updateMaxItemSize = function () {
        this.maxItemWidth = Math.max.apply(null, this.items.map(function (item) { return item.w; }));
        this.maxItemHeight = Math.max.apply(null, this.items.map(function (item) { return item.h; }));
    };
    GridsterService.prototype.restoreCachedItems = function () {
        var _this = this;
        var items = this.options.breakpoint ? this._itemsMap[this.options.breakpoint] : this._items;
        this.items
            .filter(function (item) { return _this.isValidGridItem(item); })
            .forEach(function (item) {
            var cachedItem = items.filter(function (cachedItm) {
                return cachedItm.$element === item.$element;
            })[0];
            item.x = cachedItem.x;
            item.y = cachedItem.y;
            item.w = cachedItem.w;
            item.h = cachedItem.h;
            item.autoSize = cachedItem.autoSize;
        });
    };
    GridsterService.prototype.isValidGridItem = function (item) {
        if (this.options.direction === 'none') {
            return !!item.itemComponent;
        }
        return true;
    };
    GridsterService.prototype.calculateCellSize = function () {
        if (this.options.direction === 'horizontal') {
            this.cellHeight = this.calculateCellHeight();
            this.cellWidth = this.options.cellWidth || this.cellHeight * this.options.widthHeightRatio;
        }
        else {
            this.cellWidth = this.calculateCellWidth();
            this.cellHeight = this.options.cellHeight || this.cellWidth / this.options.widthHeightRatio;
        }
        if (this.options.heightToFontSizeRatio) {
            this._fontSize = this.cellHeight * this.options.heightToFontSizeRatio;
        }
    };
    GridsterService.prototype.calculateCellWidth = function () {
        var gridsterWidth = parseFloat(window.getComputedStyle(this.gridsterComponent.$element).width);
        return Math.floor(gridsterWidth / this.options.lanes);
    };
    GridsterService.prototype.calculateCellHeight = function () {
        var gridsterHeight = parseFloat(window.getComputedStyle(this.gridsterComponent.$element).height);
        return Math.floor(gridsterHeight / this.options.lanes);
    };
    GridsterService.prototype.applySizeToItems = function () {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].applySize();
            if (this.options.heightToFontSizeRatio) {
                this.items[i].$element.style['font-size'] = this._fontSize;
            }
        }
    };
    GridsterService.prototype.applyPositionToItems = function (increaseGridsterSize) {
        if (!this.options.shrink) {
            increaseGridsterSize = true;
        }
        for (var i = 0; i < this.items.length; i++) {
            if (this.isCurrentElement(this.items[i].$element)) {
                continue;
            }
            this.items[i].applyPosition(this);
        }
        var child = this.gridsterComponent.$element.firstChild;
        if (this.options.direction === 'horizontal') {
            var increaseWidthWith = (increaseGridsterSize) ? this.maxItemWidth : 0;
            child.style.height = '';
            child.style.width = ((this.gridList.grid.length + increaseWidthWith) * this.cellWidth) + 'px';
        }
        else if (this.gridList.grid.length) {
            var increaseHeightWith = (increaseGridsterSize) ? this.maxItemHeight : 0;
            child.style.height = ((this.gridList.grid.length + increaseHeightWith) * this.cellHeight) + 'px';
            child.style.width = '';
        }
    };
    GridsterService.prototype.isCurrentElement = function (element) {
        if (!this.currentElement) {
            return false;
        }
        return element === this.currentElement;
    };
    GridsterService.prototype.snapItemSizeToGrid = function (item) {
        var itemSize = {
            width: parseInt(item.$element.style.width, 10) - 1,
            height: parseInt(item.$element.style.height, 10) - 1
        };
        var colSize = Math.round(itemSize.width / this.cellWidth);
        var rowSize = Math.round(itemSize.height / this.cellHeight);
        colSize = Math.max(colSize, 1);
        rowSize = Math.max(rowSize, 1);
        if (this.gridList.isOverFixedArea(item.x, item.y, colSize, rowSize, item)) {
            return [item.w, item.h];
        }
        return [colSize, rowSize];
    };
    GridsterService.prototype.generateItemPosition = function (item) {
        var position;
        if (item.itemPrototype) {
            var coords = item.itemPrototype.getPositionToGridster(this);
            position = {
                x: Math.round(coords.x / this.cellWidth),
                y: Math.round(coords.y / this.cellHeight)
            };
        }
        else {
            position = {
                x: Math.round(item.positionX / this.cellWidth),
                y: Math.round(item.positionY / this.cellHeight)
            };
        }
        return position;
    };
    GridsterService.prototype.snapItemPositionToGrid = function (item) {
        var position = this.generateItemPosition(item);
        var col = position.x;
        var row = position.y;
        col = Math.max(col, 0);
        row = Math.max(row, 0);
        if (this.options.direction === 'horizontal') {
            col = Math.min(col, this._maxGridCols);
            row = Math.min(row, this.options.lanes - item.h);
        }
        else {
            col = Math.min(col, this.options.lanes - item.w);
            row = Math.min(row, this._maxGridCols);
        }
        if (this.gridList.isOverFixedArea(col, row, item.w, item.h)) {
            return [item.x, item.y];
        }
        return [col, row];
    };
    GridsterService.prototype.dragSizeChanged = function (newSize) {
        if (!this.previousDragSize) {
            return true;
        }
        return (newSize[0] !== this.previousDragSize[0] ||
            newSize[1] !== this.previousDragSize[1]);
    };
    GridsterService.prototype.dragPositionChanged = function (newPosition) {
        if (!this.previousDragPosition) {
            return true;
        }
        return (newPosition[0] !== this.previousDragPosition[0] ||
            newPosition[1] !== this.previousDragPosition[1]);
    };
    GridsterService.prototype.highlightPositionForItem = function (item) {
        var size = item.calculateSize(this);
        var position = item.calculatePosition(this);
        this.$positionHighlight.style.width = size.width + 'px';
        this.$positionHighlight.style.height = size.height + 'px';
        this.$positionHighlight.style.left = position.left + 'px';
        this.$positionHighlight.style.top = position.top + 'px';
        this.$positionHighlight.style.display = '';
        if (this.options.heightToFontSizeRatio) {
            this.$positionHighlight.style['font-size'] = this._fontSize;
        }
    };
    GridsterService.prototype.updateCachedItems = function () {
        var _this = this;
        this.triggerOnChange(null);
        this.gridsterOptions.responsiveOptions.forEach(function (options) {
            _this.triggerOnChange(options.breakpoint);
        });
        this.copyItems();
    };
    GridsterService.prototype.triggerOnChange = function (breakpoint) {
        var items = breakpoint ? this._itemsMap[breakpoint] : this._items;
        var changeItems = this.gridList.getChangedItems(items, breakpoint);
        changeItems
            .filter(function (itemChange) {
            return itemChange.item.itemComponent;
        })
            .forEach(function (itemChange) {
            if (itemChange.changes.indexOf('x') >= 0) {
                itemChange.item.triggerChangeX(breakpoint);
            }
            if (itemChange.changes.indexOf('y') >= 0) {
                itemChange.item.triggerChangeY(breakpoint);
            }
            if (!breakpoint && itemChange.changes.indexOf('w') >= 0) {
                itemChange.item.itemComponent.wChange.emit(itemChange.item.w);
            }
            if (!breakpoint && itemChange.changes.indexOf('h') >= 0) {
                itemChange.item.itemComponent.hChange.emit(itemChange.item.h);
            }
            itemChange.item.itemComponent.change.emit({
                item: itemChange.item,
                changes: itemChange.changes,
                breakpoint: breakpoint
            });
        });
    };
    GridsterService.prototype.removePositionHighlight = function () {
        this.$positionHighlight.style.display = 'none';
    };
    return GridsterService;
}());
GridsterService.decorators = [
    { type: core_1.Injectable },
];
GridsterService.ctorParameters = function () { return []; };
exports.GridsterService = GridsterService;
//# sourceMappingURL=gridster.service.js.map