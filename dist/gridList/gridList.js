"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GridCol = function (lanes) {
    for (var i = 0; i < lanes; i++) {
        this.push(null);
    }
};
GridCol.prototype = [];
var GridList = (function () {
    function GridList(items, options) {
        this.options = options;
        this.items = items;
        this.adjustSizeOfItems();
        this.generateGrid();
    }
    GridList.prototype.toString = function () {
        var widthOfGrid = this.grid.length;
        var output = '\n #|', border = '\n --', item, i, j;
        for (i = 0; i < widthOfGrid; i++) {
            output += ' ' + this.padNumber(i, ' ');
            border += '---';
        }
        output += border;
        for (i = 0; i < this.options.lanes; i++) {
            output += '\n' + this.padNumber(i, ' ') + '|';
            for (j = 0; j < widthOfGrid; j++) {
                output += ' ';
                item = this.grid[j][i];
                output += item ? this.padNumber(this.items.indexOf(item), '0') : '--';
            }
        }
        output += '\n';
        return output;
    };
    GridList.prototype.setOption = function (name, value) {
        this.options[name] = value;
    };
    GridList.prototype.generateGrid = function () {
        var i;
        this.resetGrid();
        for (i = 0; i < this.items.length; i++) {
            this.markItemPositionToGrid(this.items[i]);
        }
    };
    GridList.prototype.resizeGrid = function (lanes) {
        var currentColumn = 0;
        this.options.lanes = lanes;
        this.adjustSizeOfItems();
        this.sortItemsByPosition();
        this.resetGrid();
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i], position = this.getItemPosition(item);
            this.updateItemPosition(item, this.findPositionForItem(item, { x: currentColumn, y: 0 }));
            currentColumn = Math.max(currentColumn, position.x);
        }
        this.pullItemsToLeft();
    };
    GridList.prototype.findPositionForItem = function (item, start, fixedRow) {
        var x, y, position;
        for (x = start.x; x < this.grid.length; x++) {
            if (fixedRow !== undefined) {
                position = [x, fixedRow];
                if (this.itemFitsAtPosition(item, position)) {
                    return position;
                }
            }
            else {
                for (y = start.y; y < this.options.lanes; y++) {
                    position = [x, y];
                    if (this.itemFitsAtPosition(item, position)) {
                        return position;
                    }
                }
            }
        }
        var newCol = this.grid.length;
        var newRow = 0;
        if (fixedRow !== undefined &&
            this.itemFitsAtPosition(item, [newCol, fixedRow])) {
            newRow = fixedRow;
        }
        return [newCol, newRow];
    };
    GridList.prototype.moveAndResize = function (item, newPosition, size) {
        var position = this.getItemPosition({
            x: newPosition[0],
            y: newPosition[1],
            w: item.w,
            h: item.h
        });
        var width = size.w || item.w, height = size.h || item.h;
        this.updateItemPosition(item, [position.x, position.y]);
        this.updateItemSize(item, width, height);
        this.resolveCollisions(item);
    };
    GridList.prototype.moveItemToPosition = function (item, newPosition) {
        var position = this.getItemPosition({
            x: newPosition[0],
            y: newPosition[1],
            w: item.w,
            h: item.h
        });
        this.updateItemPosition(item, [position.x, position.y]);
        this.resolveCollisions(item);
    };
    GridList.prototype.resizeItem = function (item, size) {
        var width = size.w || item.w, height = size.h || item.h;
        this.updateItemSize(item, width, height);
        this.pullItemsToLeft(item);
    };
    GridList.prototype.getChangedItems = function (initialItems, breakpoint) {
        return this.items.map(function (item) {
            var changes = [];
            var initItem = initialItems.find(function (initItem) { return initItem.$element === item.$element; });
            if (!initItem) {
                return { item: item, changes: ['x', 'y', 'w', 'h'], isNew: true };
            }
            if (item.getValueX(breakpoint) !== initItem.getValueX(breakpoint)) {
                changes.push('x');
            }
            if (item.getValueY(breakpoint) !== initItem.getValueY(breakpoint)) {
                changes.push('y');
            }
            if (item.w !== initItem.w) {
                changes.push('w');
            }
            if (item.h !== initItem.h) {
                changes.push('h');
            }
            return { item: item, changes: changes, isNew: false };
        })
            .filter(function (itemChange) {
            return itemChange.changes.length;
        });
    };
    GridList.prototype.resolveCollisions = function (item) {
        if (!this.tryToResolveCollisionsLocally(item)) {
            this.pullItemsToLeft(item);
        }
        this.pullItemsToLeft();
    };
    GridList.prototype.pullItemsToLeft = function (fixedItem) {
        var _this = this;
        if (this.options.direction === 'none') {
            return;
        }
        this.sortItemsByPosition();
        this.resetGrid();
        if (fixedItem) {
            var fixedPosition = this.getItemPosition(fixedItem);
            this.updateItemPosition(fixedItem, [fixedPosition.x, fixedPosition.y]);
        }
        else if (!this.options.floating) {
            return;
        }
        this.items
            .filter(function (item) {
            return !item.dragAndDrop && item !== fixedItem;
        })
            .forEach(function (item) {
            var fixedPosition = _this.getItemPosition(item);
            _this.updateItemPosition(item, [fixedPosition.x, fixedPosition.y]);
        });
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i], position = this.getItemPosition(item);
            if (fixedItem && item === fixedItem || !item.dragAndDrop) {
                continue;
            }
            var x = this.findLeftMostPositionForItem(item), newPosition = this.findPositionForItem(item, { x: x, y: 0 }, position.y);
            this.updateItemPosition(item, newPosition);
        }
    };
    GridList.prototype.isOverFixedArea = function (x, y, w, h, item) {
        if (item === void 0) { item = null; }
        var itemData = { x: x, y: y, w: w, h: h };
        if (this.options.direction !== 'horizontal') {
            itemData = { x: y, y: x, w: h, h: w };
        }
        for (var i = itemData.x; i < itemData.x + itemData.w; i++) {
            for (var j = itemData.y; j < itemData.y + itemData.h; j++) {
                if (this.grid[i] && this.grid[i][j] &&
                    this.grid[i][j] !== item && !this.grid[i][j].dragAndDrop) {
                    return true;
                }
            }
        }
        return false;
    };
    GridList.prototype.checkItemAboveEmptyArea = function (item, newPosition) {
        var itemData = {
            x: newPosition.x,
            y: newPosition.y,
            w: item.w,
            h: item.h
        };
        if (!item.itemPrototype && item.x === newPosition.x && item.y === newPosition.y) {
            return true;
        }
        if (this.options.direction === 'horizontal') {
            itemData = { x: newPosition.y, y: newPosition.x, w: itemData.h, h: itemData.w };
        }
        return !this.checkItemsInArea(itemData.y, itemData.y + itemData.h - 1, itemData.x, itemData.x + itemData.w - 1, item);
    };
    GridList.prototype.fixItemsPositions = function (options) {
        var _this = this;
        var validItems = this.items
            .filter(function (item) { return item.itemComponent; })
            .filter(function (item) { return _this.isItemValidForGrid(item, options); });
        var invalidItems = this.items
            .filter(function (item) { return item.itemComponent; })
            .filter(function (item) { return !_this.isItemValidForGrid(item, options); });
        var gridList = new GridList([], options);
        gridList.items = validItems
            .map(function (item) {
            return item.copyForBreakpoint(options.breakpoint);
        });
        gridList.generateGrid();
        invalidItems.forEach(function (item) {
            var itemCopy = item.copyForBreakpoint(options.breakpoint);
            var position = gridList.findPositionForItem(itemCopy, { x: 0, y: 0 });
            gridList.items.push(itemCopy);
            gridList.setItemPosition(itemCopy, position);
            gridList.markItemPositionToGrid(itemCopy);
        });
        gridList.pullItemsToLeft();
        this.items.forEach(function (itm) {
            var cachedItem = gridList.items.filter(function (cachedItm) {
                return cachedItm.$element === itm.$element;
            })[0];
            itm.setValueX(cachedItem.x, options.breakpoint);
            itm.setValueY(cachedItem.y, options.breakpoint);
            itm.w = cachedItem.w;
            itm.h = cachedItem.h;
            itm.autoSize = cachedItem.autoSize;
        });
    };
    GridList.prototype.findDefaultPosition = function (width, height) {
        if (this.options.direction === 'horizontal') {
            return this.findDefaultPositionHorizontal(width, height);
        }
        return this.findDefaultPositionVertical(width, height);
    };
    GridList.prototype.deleteItemPositionFromGrid = function (item) {
        var position = this.getItemPosition(item);
        var x, y;
        for (x = position.x; x < position.x + position.w; x++) {
            if (!this.grid[x]) {
                continue;
            }
            for (y = position.y; y < position.y + position.h; y++) {
                if (this.grid[x][y] === item) {
                    this.grid[x][y] = null;
                }
            }
        }
    };
    GridList.prototype.isItemValidForGrid = function (item, options) {
        var itemData = options.direction === 'horizontal' ? {
            x: item.getValueY(options.breakpoint),
            y: item.getValueX(options.breakpoint),
            w: item.h,
            h: Math.min(item.w, options.lanes)
        } : {
            x: item.getValueX(options.breakpoint),
            y: item.getValueY(options.breakpoint),
            w: Math.min(item.w, options.lanes),
            h: item.h
        };
        return typeof itemData.x === 'number' &&
            typeof itemData.y === 'number' &&
            (itemData.x + itemData.w) <= options.lanes;
    };
    GridList.prototype.findDefaultPositionHorizontal = function (width, height) {
        for (var _i = 0, _a = this.grid; _i < _a.length; _i++) {
            var col = _a[_i];
            var colIdx = this.grid.indexOf(col);
            var rowIdx = 0;
            while (rowIdx < (col.length - height + 1)) {
                if (!this.checkItemsInArea(colIdx, colIdx + width - 1, rowIdx, rowIdx + height - 1)) {
                    return [colIdx, rowIdx];
                }
                rowIdx++;
            }
        }
        return [this.grid.length, 0];
    };
    GridList.prototype.findDefaultPositionVertical = function (width, height) {
        for (var _i = 0, _a = this.grid; _i < _a.length; _i++) {
            var row = _a[_i];
            var rowIdx = this.grid.indexOf(row);
            var colIdx = 0;
            while (colIdx < (row.length - width + 1)) {
                if (!this.checkItemsInArea(rowIdx, rowIdx + height - 1, colIdx, colIdx + width - 1)) {
                    return [colIdx, rowIdx];
                }
                colIdx++;
            }
        }
        return [0, this.grid.length];
    };
    GridList.prototype.checkItemsInArea = function (rowStart, rowEnd, colStart, colEnd, item) {
        for (var i = rowStart; i <= rowEnd; i++) {
            for (var j = colStart; j <= colEnd; j++) {
                if (this.grid[i] && this.grid[i][j] && (item ? this.grid[i][j] !== item : true)) {
                    return true;
                }
            }
        }
        return false;
    };
    GridList.prototype.sortItemsByPosition = function () {
        var _this = this;
        this.items.sort(function (item1, item2) {
            var position1 = _this.getItemPosition(item1), position2 = _this.getItemPosition(item2);
            if (position1.x !== position2.x) {
                return position1.x - position2.x;
            }
            if (position1.y !== position2.y) {
                return position1.y - position2.y;
            }
            return 0;
        });
    };
    GridList.prototype.adjustSizeOfItems = function () {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (item.autoSize === undefined) {
                item.autoSize = item.w === 0 || item.h === 0;
            }
            if (item.autoSize) {
                if (this.options.direction === 'horizontal') {
                    item.h = this.options.lanes;
                }
                else {
                    item.w = this.options.lanes;
                }
            }
        }
    };
    GridList.prototype.resetGrid = function () {
        this.grid = [];
    };
    GridList.prototype.itemFitsAtPosition = function (item, newPosition) {
        var position = this.getItemPosition(item);
        var x, y;
        if (newPosition[0] < 0 || newPosition[1] < 0) {
            return false;
        }
        if (newPosition[1] + position.h > this.options.lanes) {
            return false;
        }
        if (this.isOverFixedArea(item.x, item.y, item.w, item.h)) {
            return false;
        }
        for (x = newPosition[0]; x < newPosition[0] + position.w; x++) {
            var col = this.grid[x];
            if (!col) {
                continue;
            }
            for (y = newPosition[1]; y < newPosition[1] + position.h; y++) {
                if (col[y] && col[y] !== item) {
                    return false;
                }
            }
        }
        return true;
    };
    GridList.prototype.updateItemPosition = function (item, position) {
        if (item.x !== null && item.y !== null) {
            this.deleteItemPositionFromGrid(item);
        }
        this.setItemPosition(item, position);
        this.markItemPositionToGrid(item);
    };
    GridList.prototype.updateItemSize = function (item, width, height) {
        if (item.x !== null && item.y !== null) {
            this.deleteItemPositionFromGrid(item);
        }
        item.w = width;
        item.h = height;
        this.markItemPositionToGrid(item);
    };
    GridList.prototype.markItemPositionToGrid = function (item) {
        var position = this.getItemPosition(item);
        var x, y;
        this.ensureColumns(position.x + position.w);
        for (x = position.x; x < position.x + position.w; x++) {
            for (y = position.y; y < position.y + position.h; y++) {
                this.grid[x][y] = item;
            }
        }
    };
    GridList.prototype.ensureColumns = function (N) {
        for (var i = 0; i < N; i++) {
            if (!this.grid[i]) {
                this.grid.push(new GridCol(this.options.lanes));
            }
        }
    };
    GridList.prototype.getItemsCollidingWithItem = function (item) {
        var collidingItems = [];
        for (var i = 0; i < this.items.length; i++) {
            if (item !== this.items[i] &&
                this.itemsAreColliding(item, this.items[i])) {
                collidingItems.push(i);
            }
        }
        return collidingItems;
    };
    GridList.prototype.itemsAreColliding = function (item1, item2) {
        var position1 = this.getItemPosition(item1), position2 = this.getItemPosition(item2);
        return !(position2.x >= position1.x + position1.w ||
            position2.x + position2.w <= position1.x ||
            position2.y >= position1.y + position1.h ||
            position2.y + position2.h <= position1.y);
    };
    GridList.prototype.tryToResolveCollisionsLocally = function (item) {
        var collidingItems = this.getItemsCollidingWithItem(item);
        if (!collidingItems.length) {
            return true;
        }
        var _gridList = new GridList(this.items.map(function (itm) {
            return itm.copy();
        }), this.options);
        var leftOfItem;
        var rightOfItem;
        var aboveOfItem;
        var belowOfItem;
        for (var i = 0; i < collidingItems.length; i++) {
            var collidingItem = _gridList.items[collidingItems[i]], collidingPosition = this.getItemPosition(collidingItem);
            var position = this.getItemPosition(item);
            leftOfItem = [position.x - collidingPosition.w, collidingPosition.y];
            rightOfItem = [position.x + position.w, collidingPosition.y];
            aboveOfItem = [collidingPosition.x, position.y - collidingPosition.h];
            belowOfItem = [collidingPosition.x, position.y + position.h];
            if (_gridList.itemFitsAtPosition(collidingItem, leftOfItem)) {
                _gridList.updateItemPosition(collidingItem, leftOfItem);
            }
            else if (_gridList.itemFitsAtPosition(collidingItem, aboveOfItem)) {
                _gridList.updateItemPosition(collidingItem, aboveOfItem);
            }
            else if (_gridList.itemFitsAtPosition(collidingItem, belowOfItem)) {
                _gridList.updateItemPosition(collidingItem, belowOfItem);
            }
            else if (_gridList.itemFitsAtPosition(collidingItem, rightOfItem)) {
                _gridList.updateItemPosition(collidingItem, rightOfItem);
            }
            else {
                return false;
            }
        }
        this.items.forEach(function (itm, idx) {
            var cachedItem = _gridList.items.filter(function (cachedItm) {
                return cachedItm.$element === itm.$element;
            })[0];
            itm.x = cachedItem.x;
            itm.y = cachedItem.y;
            itm.w = cachedItem.w;
            itm.h = cachedItem.h;
            itm.autoSize = cachedItem.autoSize;
        });
        this.generateGrid();
        return true;
    };
    GridList.prototype.findLeftMostPositionForItem = function (item) {
        var tail = 0;
        var position = this.getItemPosition(item);
        for (var i = 0; i < this.grid.length; i++) {
            for (var j = position.y; j < position.y + position.h; j++) {
                var otherItem = this.grid[i][j];
                if (!otherItem) {
                    continue;
                }
                var otherPosition = this.getItemPosition(otherItem);
                if (this.items.indexOf(otherItem) < this.items.indexOf(item)) {
                    tail = otherPosition.x + otherPosition.w;
                }
            }
        }
        return tail;
    };
    GridList.prototype.findItemByPosition = function (x, y) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].x === x && this.items[i].y === y) {
                return this.items[i];
            }
        }
    };
    GridList.prototype.getItemByAttribute = function (key, value) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i][key] === value) {
                return this.items[i];
            }
        }
        return null;
    };
    GridList.prototype.padNumber = function (nr, prefix) {
        return nr >= 10 ? nr : prefix + nr;
    };
    GridList.prototype.getItemPosition = function (item) {
        if (this.options.direction === 'horizontal') {
            return item;
        }
        else {
            return {
                x: item.y,
                y: item.x,
                w: item.h,
                h: item.w
            };
        }
    };
    GridList.prototype.setItemPosition = function (item, position) {
        if (this.options.direction === 'horizontal') {
            item.x = position[0];
            item.y = position[1];
        }
        else {
            item.x = position[1];
            item.y = position[0];
        }
    };
    return GridList;
}());
exports.GridList = GridList;
//# sourceMappingURL=gridList.js.map