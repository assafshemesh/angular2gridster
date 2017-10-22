"use strict";
var GridListItem = (function () {
    function GridListItem() {
    }
    Object.defineProperty(GridListItem.prototype, "$element", {
        get: function () {
            return this.getItem().$element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "x", {
        get: function () {
            var item = this.getItem();
            var breakpoint = item.gridster ? item.gridster.options.breakpoint : null;
            return this.getValueX(breakpoint);
        },
        set: function (value) {
            var item = this.getItem();
            var breakpoint = item.gridster ? item.gridster.options.breakpoint : null;
            this.setValueX(value, breakpoint);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "y", {
        get: function () {
            var item = this.getItem();
            var breakpoint = item.gridster ? item.gridster.options.breakpoint : null;
            return this.getValueY(breakpoint);
        },
        set: function (value) {
            var item = this.getItem();
            var breakpoint = item.gridster ? item.gridster.options.breakpoint : null;
            this.setValueY(value, breakpoint);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "w", {
        get: function () {
            var item = this.getItem();
            return item.w;
        },
        set: function (value) {
            this.getItem().w = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "h", {
        get: function () {
            var item = this.getItem();
            return item.h;
        },
        set: function (value) {
            this.getItem().h = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "autoSize", {
        get: function () {
            return this.getItem().autoSize;
        },
        set: function (value) {
            this.getItem().autoSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "dragAndDrop", {
        get: function () {
            return !!this.getItem().dragAndDrop;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "resizable", {
        get: function () {
            return !!this.getItem().resizable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "positionX", {
        get: function () {
            var item = this.itemComponent || this.itemPrototype;
            if (!item) {
                return null;
            }
            return item.positionX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "positionY", {
        get: function () {
            var item = this.itemComponent || this.itemPrototype;
            if (!item) {
                return null;
            }
            return item.positionY;
        },
        enumerable: true,
        configurable: true
    });
    GridListItem.prototype.setFromGridsterItem = function (item) {
        if (this.isItemSet()) {
            throw new Error('GridListItem is already set.');
        }
        this.itemComponent = item;
        return this;
    };
    GridListItem.prototype.setFromGridsterItemPrototype = function (item) {
        if (this.isItemSet()) {
            throw new Error('GridListItem is already set.');
        }
        this.itemPrototype = item;
        return this;
    };
    GridListItem.prototype.setFromObjectLiteral = function (item) {
        if (this.isItemSet()) {
            throw new Error('GridListItem is already set.');
        }
        this.itemObject = item;
        return this;
    };
    GridListItem.prototype.copy = function () {
        var itemCopy = new GridListItem();
        return itemCopy.setFromObjectLiteral({
            $element: this.$element,
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            autoSize: this.autoSize,
            dragAndDrop: this.dragAndDrop,
            resizable: this.resizable
        });
    };
    GridListItem.prototype.copyForBreakpoint = function (breakpoint) {
        var itemCopy = new GridListItem();
        return itemCopy.setFromObjectLiteral({
            $element: this.$element,
            x: this.getValueX(breakpoint),
            y: this.getValueY(breakpoint),
            w: this.w,
            h: this.h,
            autoSize: this.autoSize,
            dragAndDrop: this.dragAndDrop,
            resizable: this.resizable
        });
    };
    GridListItem.prototype.getValueX = function (breakpoint) {
        var item = this.getItem();
        return item[this.getXProperty(breakpoint)];
    };
    GridListItem.prototype.getValueY = function (breakpoint) {
        var item = this.getItem();
        return item[this.getYProperty(breakpoint)];
    };
    GridListItem.prototype.setValueX = function (value, breakpoint) {
        var item = this.getItem();
        item[this.getXProperty(breakpoint)] = value;
    };
    GridListItem.prototype.setValueY = function (value, breakpoint) {
        var item = this.getItem();
        item[this.getYProperty(breakpoint)] = value;
    };
    GridListItem.prototype.triggerChangeX = function (breakpoint) {
        var item = this.itemComponent;
        if (item) {
            item[this.getXProperty(breakpoint) + 'Change'].emit(this.getValueX(breakpoint));
        }
    };
    GridListItem.prototype.triggerChangeY = function (breakpoint) {
        var item = this.itemComponent;
        if (item) {
            item[this.getYProperty(breakpoint) + 'Change'].emit(this.getValueY(breakpoint));
        }
    };
    GridListItem.prototype.hasPositions = function (breakpoint) {
        var x = this.getValueX(breakpoint);
        var y = this.getValueY(breakpoint);
        return (x || x === 0) &&
            (y || y === 0);
    };
    GridListItem.prototype.applyPosition = function (gridster) {
        var position = this.calculatePosition(gridster);
        this.itemComponent.positionX = position.left;
        this.itemComponent.positionY = position.top;
        this.itemComponent.updateElemenetPosition();
    };
    GridListItem.prototype.calculatePosition = function (gridster) {
        if (!gridster && !this.itemComponent) {
            return { left: 0, top: 0 };
        }
        gridster = gridster || this.itemComponent.gridster;
        return {
            left: this.x * gridster.cellWidth,
            top: this.y * gridster.cellHeight
        };
    };
    GridListItem.prototype.applySize = function (gridster) {
        var size = this.calculateSize(gridster);
        this.$element.style.width = size.width + 'px';
        this.$element.style.height = size.height + 'px';
    };
    GridListItem.prototype.calculateSize = function (gridster) {
        if (!gridster && !this.itemComponent) {
            return { width: 0, height: 0 };
        }
        gridster = gridster || this.itemComponent.gridster;
        var width = this.w;
        var height = this.h;
        if (gridster.options.direction === 'vertical') {
            width = Math.min(this.w, gridster.options.lanes);
        }
        if (gridster.options.direction === 'horizontal') {
            height = Math.min(this.h, gridster.options.lanes);
        }
        return {
            width: width * gridster.cellWidth,
            height: height * gridster.cellHeight
        };
    };
    GridListItem.prototype.getXProperty = function (breakpoint) {
        if (breakpoint && this.itemComponent) {
            return GridListItem.X_PROPERTY_MAP[breakpoint];
        }
        else {
            return 'x';
        }
    };
    GridListItem.prototype.getYProperty = function (breakpoint) {
        if (breakpoint && this.itemComponent) {
            return GridListItem.Y_PROPERTY_MAP[breakpoint];
        }
        else {
            return 'y';
        }
    };
    GridListItem.prototype.getItem = function () {
        var item = this.itemComponent || this.itemPrototype || this.itemObject;
        if (!item) {
            throw new Error('GridListItem is not set.');
        }
        return item;
    };
    GridListItem.prototype.isItemSet = function () {
        return this.itemComponent || this.itemPrototype || this.itemObject;
    };
    return GridListItem;
}());
GridListItem.BREAKPOINTS = ['sm', 'md', 'lg', 'xl'];
GridListItem.X_PROPERTY_MAP = {
    sm: 'xSm',
    md: 'xMd',
    lg: 'xLg',
    xl: 'xXl'
};
GridListItem.Y_PROPERTY_MAP = {
    sm: 'ySm',
    md: 'yMd',
    lg: 'yLg',
    xl: 'yXl'
};
exports.GridListItem = GridListItem;
//# sourceMappingURL=GridListItem.js.map