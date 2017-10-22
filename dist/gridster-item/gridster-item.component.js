"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
require("rxjs/Rx");
var gridster_service_1 = require("../gridster.service");
var GridListItem_1 = require("../gridList/GridListItem");
var draggable_1 = require("../utils/draggable");
var gridList_1 = require("../gridList/gridList");
var utils_1 = require("../utils/utils");
var GridsterItemComponent = (function () {
    function GridsterItemComponent(zone, elementRef, gridster) {
        this.zone = zone;
        this.xChange = new core_1.EventEmitter();
        this.yChange = new core_1.EventEmitter();
        this.xSmChange = new core_1.EventEmitter();
        this.ySmChange = new core_1.EventEmitter();
        this.xMdChange = new core_1.EventEmitter();
        this.yMdChange = new core_1.EventEmitter();
        this.xLgChange = new core_1.EventEmitter();
        this.yLgChange = new core_1.EventEmitter();
        this.xXlChange = new core_1.EventEmitter();
        this.yXlChange = new core_1.EventEmitter();
        this.wChange = new core_1.EventEmitter();
        this.hChange = new core_1.EventEmitter();
        this.change = new core_1.EventEmitter();
        this.dragAndDrop = true;
        this.resizable = true;
        this.options = {};
        this.isDragging = false;
        this.isResizing = false;
        this.defaultOptions = {
            minWidth: 1,
            minHeight: 1,
            maxWidth: Infinity,
            maxHeight: Infinity,
            defaultWidth: 1,
            defaultHeight: 1
        };
        this.subscriptions = [];
        this.dragSubscriptions = [];
        this.resizeSubscriptions = [];
        this.gridster = gridster;
        this.elementRef = elementRef;
        this.$element = elementRef.nativeElement;
        this.item = (new GridListItem_1.GridListItem()).setFromGridsterItem(this);
        if (this.gridster.isInitialized()) {
            this.preventAnimation();
        }
    }
    Object.defineProperty(GridsterItemComponent.prototype, "positionX", {
        get: function () {
            return this._positionX;
        },
        set: function (value) {
            this._positionX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItemComponent.prototype, "positionY", {
        get: function () {
            return this._positionY;
        },
        set: function (value) {
            this._positionY = value;
        },
        enumerable: true,
        configurable: true
    });
    GridsterItemComponent.prototype.ngOnInit = function () {
        this.options = Object.assign(this.defaultOptions, this.options);
        this.w = this.w || this.options.defaultWidth;
        this.h = this.h || this.options.defaultHeight;
        if (this.gridster.isInitialized()) {
            if (this.x || this.x === 0) {
                this.item.setValueX(this.x, this.gridster.options.breakpoint);
            }
            if (this.y || this.y === 0) {
                this.item.setValueY(this.y, this.gridster.options.breakpoint);
            }
            this.setPositionsOnItem();
        }
        this.gridster.registerItem(this.item);
        this.gridster.calculateCellSize();
        this.item.applySize();
        this.item.applyPosition();
        if (this.dragAndDrop) {
            this.enableDragDrop();
        }
        if (this.gridster.isInitialized()) {
            this.gridster.render();
        }
    };
    GridsterItemComponent.prototype.ngAfterViewInit = function () {
        if (this.gridster.options.resizable && this.item.resizable) {
            this.enableResizable();
        }
    };
    GridsterItemComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (!this.gridster.gridList) {
            return;
        }
        if (changes['dragAndDrop'] && !changes['dragAndDrop'].isFirstChange()) {
            if (changes['dragAndDrop'].currentValue && this.gridster.options.dragAndDrop) {
                this.enableDragDrop();
            }
            else {
                this.disableDraggable();
            }
        }
        if (changes['resizable'] && !changes['resizable'].isFirstChange()) {
            if (changes['resizable'].currentValue) {
                this.enableResizable();
            }
            else {
                this.disableResizable();
            }
        }
        if (changes['w'] && !changes['w'].isFirstChange()) {
            if (changes['w'].currentValue > this.options.maxWidth) {
                this.w = this.options.maxWidth;
                setTimeout(function () {
                    _this.wChange.emit(_this.w);
                });
            }
        }
        if (changes['h'] && !changes['h'].isFirstChange()) {
            if (changes['h'].currentValue > this.options.maxHeight) {
                this.h = this.options.maxHeight;
                setTimeout(function () {
                    _this.hChange.emit(_this.h);
                });
            }
        }
    };
    GridsterItemComponent.prototype.ngOnDestroy = function () {
        var _this = this;
        var index = this.gridster.items.indexOf(this.item);
        if (index >= 0) {
            this.gridster.items.splice(index, 1);
        }
        setTimeout(function () {
            _this.gridster.gridList.pullItemsToLeft();
            _this.gridster.render();
        });
        this.subscriptions.forEach(function (sub) {
            sub.unsubscribe();
        });
        this.disableDraggable();
        this.disableResizable();
    };
    GridsterItemComponent.prototype.updateElemenetPosition = function () {
        if (this.gridster.options.useCSSTransforms) {
            utils_1.utils.setTransform(this.$element, { x: this._positionX, y: this._positionY });
        }
        else {
            utils_1.utils.setCssElementPosition(this.$element, { x: this._positionX, y: this._positionY });
        }
    };
    GridsterItemComponent.prototype.setPositionsOnItem = function () {
        var _this = this;
        if (!this.item.hasPositions(null)) {
            this.setPositionsForGrid(this.gridster.gridsterOptions.basicOptions);
        }
        this.gridster.gridsterOptions.responsiveOptions
            .filter(function (options) { return !_this.item.hasPositions(options.breakpoint); })
            .forEach(function (options) { return _this.setPositionsForGrid(options); });
    };
    GridsterItemComponent.prototype.enableResizable = function () {
        var _this = this;
        if (this.resizeSubscriptions.length || !this.resizable) {
            return;
        }
        this.zone.runOutsideAngular(function () {
            [].forEach.call(_this.$element.querySelectorAll('.gridster-item-resizable-handler'), function (handler) {
                handler.style.display = 'block';
                var draggable = new draggable_1.Draggable(handler);
                var direction;
                var startEvent;
                var startData;
                var cursorToElementPosition;
                var dragStartSub = draggable.dragStart
                    .subscribe(function (event) {
                    _this.zone.run(function () {
                        _this.isResizing = true;
                        startEvent = event;
                        direction = _this.getResizeDirection(handler);
                        startData = _this.createResizeStartObject(direction);
                        cursorToElementPosition = event.getRelativeCoordinates(_this.$element);
                        _this.gridster.onResizeStart(_this.item);
                    });
                });
                var dragSub = draggable.dragMove
                    .subscribe(function (event) {
                    var scrollData = _this.gridster.gridsterScrollData;
                    _this.resizeElement({
                        direction: direction,
                        startData: startData,
                        position: {
                            x: event.clientX - cursorToElementPosition.x - _this.gridster.gridsterRect.left,
                            y: event.clientY - cursorToElementPosition.y - _this.gridster.gridsterRect.top
                        },
                        startEvent: startEvent,
                        moveEvent: event,
                        scrollDiffX: scrollData.scrollLeft - startData.scrollLeft,
                        scrollDiffY: scrollData.scrollTop - startData.scrollTop
                    });
                    _this.gridster.onResizeDrag(_this.item);
                });
                var dragStopSub = draggable.dragStop
                    .subscribe(function () {
                    _this.zone.run(function () {
                        _this.isResizing = false;
                        _this.gridster.onResizeStop(_this.item);
                    });
                });
                _this.resizeSubscriptions = _this.resizeSubscriptions.concat([dragStartSub, dragSub, dragStopSub]);
            });
        });
    };
    GridsterItemComponent.prototype.disableResizable = function () {
        this.resizeSubscriptions.forEach(function (sub) {
            sub.unsubscribe();
        });
        this.resizeSubscriptions = [];
        [].forEach.call(this.$element.querySelectorAll('.gridster-item-resizable-handler'), function (handler) {
            handler.style.display = '';
        });
    };
    GridsterItemComponent.prototype.enableDragDrop = function () {
        var _this = this;
        if (this.dragSubscriptions.length) {
            return;
        }
        this.zone.runOutsideAngular(function () {
            var cursorToElementPosition;
            var draggable = new draggable_1.Draggable(_this.$element, {
                handlerClass: _this.gridster.draggableOptions.handlerClass
            });
            var dragStartSub = draggable.dragStart
                .subscribe(function (event) {
                _this.zone.run(function () {
                    _this.gridster.onStart(_this.item);
                    _this.isDragging = true;
                    cursorToElementPosition = event.getRelativeCoordinates(_this.$element);
                });
            });
            var dragSub = draggable.dragMove
                .subscribe(function (event) {
                var scrollData = _this.gridster.gridsterScrollData;
                _this.positionY = (event.clientY - cursorToElementPosition.y - scrollData.scrollTop -
                    _this.gridster.gridsterRect.top);
                _this.positionX = (event.clientX - cursorToElementPosition.x - scrollData.scrollLeft -
                    _this.gridster.gridsterRect.left);
                _this.updateElemenetPosition();
                _this.gridster.onDrag(_this.item);
            });
            var dragStopSub = draggable.dragStop
                .subscribe(function () {
                _this.zone.run(function () {
                    _this.gridster.onStop(_this.item);
                    _this.gridster.render();
                    _this.isDragging = false;
                });
            });
            _this.dragSubscriptions = _this.dragSubscriptions.concat([dragStartSub, dragSub, dragStopSub]);
        });
    };
    GridsterItemComponent.prototype.disableDraggable = function () {
        this.dragSubscriptions.forEach(function (sub) {
            sub.unsubscribe();
        });
        this.dragSubscriptions = [];
    };
    GridsterItemComponent.prototype.setPositionsForGrid = function (options) {
        var _this = this;
        var x, y;
        var position = this.findPosition(options);
        x = options.direction === 'horizontal' ? position[0] : position[1];
        y = options.direction === 'horizontal' ? position[1] : position[0];
        this.item.setValueX(x, options.breakpoint);
        this.item.setValueY(y, options.breakpoint);
        setTimeout(function () {
            _this.item.triggerChangeX(options.breakpoint);
            _this.item.triggerChangeY(options.breakpoint);
        });
    };
    GridsterItemComponent.prototype.findPosition = function (options) {
        var gridList = new gridList_1.GridList(this.gridster.items.map(function (item) { return item.copyForBreakpoint(options.breakpoint); }), options);
        return gridList.findPositionForItem(this.item, { x: 0, y: 0 });
    };
    GridsterItemComponent.prototype.createResizeStartObject = function (direction) {
        var scrollData = this.gridster.gridsterScrollData;
        return {
            top: this.positionY,
            left: this.positionX,
            height: parseInt(this.$element.style.height, 10),
            width: parseInt(this.$element.style.width, 10),
            minX: Math.max(this.item.x + this.item.w - this.options.maxWidth, 0),
            maxX: this.item.x + this.item.w - this.options.minWidth,
            minY: Math.max(this.item.y + this.item.h - this.options.maxHeight, 0),
            maxY: this.item.y + this.item.h - this.options.minHeight,
            minW: this.options.minWidth,
            maxW: Math.min(this.options.maxWidth, (this.gridster.options.direction === 'vertical' && direction.indexOf('w') < 0) ?
                this.gridster.options.lanes - this.item.x : this.options.maxWidth, direction.indexOf('w') >= 0 ?
                this.item.x + this.item.w : this.options.maxWidth),
            minH: this.options.minHeight,
            maxH: Math.min(this.options.maxHeight, (this.gridster.options.direction === 'horizontal' && direction.indexOf('n') < 0) ?
                this.gridster.options.lanes - this.item.y : this.options.maxHeight, direction.indexOf('n') >= 0 ?
                this.item.y + this.item.h : this.options.maxHeight),
            scrollLeft: scrollData.scrollLeft,
            scrollTop: scrollData.scrollTop
        };
    };
    GridsterItemComponent.prototype.preventAnimation = function () {
        var _this = this;
        this.$element.classList.add('no-transition');
        setTimeout(function () {
            _this.$element.classList.remove('no-transition');
        }, 500);
        return this;
    };
    GridsterItemComponent.prototype.getResizeDirection = function (handler) {
        for (var i = handler.classList.length - 1; i >= 0; i--) {
            if (handler.classList[i].match('handle-')) {
                return handler.classList[i].split('-')[1];
            }
        }
    };
    GridsterItemComponent.prototype.resizeElement = function (config) {
        if (config.direction.indexOf('n') >= 0) {
            this.resizeToNorth(config);
        }
        if (config.direction.indexOf('w') >= 0) {
            this.resizeToWest(config);
        }
        if (config.direction.indexOf('e') >= 0) {
            this.resizeToEast(config);
        }
        if (config.direction.indexOf('s') >= 0) {
            this.resizeToSouth(config);
        }
    };
    GridsterItemComponent.prototype.resizeToNorth = function (config) {
        var height = config.startData.height + config.startEvent.clientY -
            config.moveEvent.clientY - config.scrollDiffY;
        if (height < (config.startData.minH * this.gridster.cellHeight)) {
            this.setMinHeight('n', config);
        }
        else if (height > (config.startData.maxH * this.gridster.cellHeight)) {
            this.setMaxHeight('n', config);
        }
        else {
            this.positionY = config.position.y;
            this.$element.style.height = height + 'px';
        }
    };
    GridsterItemComponent.prototype.resizeToWest = function (config) {
        var width = config.startData.width + config.startEvent.clientX -
            config.moveEvent.clientX - config.scrollDiffX;
        if (width < (config.startData.minW * this.gridster.cellWidth)) {
            this.setMinWidth('w', config);
        }
        else if (width > (config.startData.maxW * this.gridster.cellWidth)) {
            this.setMaxWidth('w', config);
        }
        else {
            this.positionX = config.position.x;
            this.updateElemenetPosition();
            this.$element.style.width = width + 'px';
        }
    };
    GridsterItemComponent.prototype.resizeToEast = function (config) {
        var width = config.startData.width + config.moveEvent.clientX -
            config.startEvent.clientX + config.scrollDiffX;
        if (width > (config.startData.maxW * this.gridster.cellWidth)) {
            this.setMaxWidth('e', config);
        }
        else if (width < (config.startData.minW * this.gridster.cellWidth)) {
            this.setMinWidth('e', config);
        }
        else {
            this.$element.style.width = width + 'px';
        }
    };
    GridsterItemComponent.prototype.resizeToSouth = function (config) {
        var height = config.startData.height + config.moveEvent.clientY -
            config.startEvent.clientY + config.scrollDiffY;
        if (height > config.startData.maxH * this.gridster.cellHeight) {
            this.setMaxHeight('s', config);
        }
        else if (height < config.startData.minH * this.gridster.cellHeight) {
            this.setMinHeight('s', config);
        }
        else {
            this.$element.style.height = height + 'px';
        }
    };
    GridsterItemComponent.prototype.setMinHeight = function (direction, config) {
        if (direction === 'n') {
            this.$element.style.height = (config.startData.minH * this.gridster.cellHeight) + 'px';
            this.positionY = config.startData.maxY * this.gridster.cellHeight;
        }
        else {
            this.$element.style.height = (config.startData.minH * this.gridster.cellHeight) + 'px';
        }
    };
    GridsterItemComponent.prototype.setMinWidth = function (direction, config) {
        if (direction === 'w') {
            this.$element.style.width = (config.startData.minW * this.gridster.cellWidth) + 'px';
            this.positionX = config.startData.maxX * this.gridster.cellWidth;
            this.updateElemenetPosition();
        }
        else {
            this.$element.style.width = (config.startData.minW * this.gridster.cellWidth) + 'px';
        }
    };
    GridsterItemComponent.prototype.setMaxHeight = function (direction, config) {
        if (direction === 'n') {
            this.$element.style.height = (config.startData.maxH * this.gridster.cellHeight) + 'px';
            this.positionY = config.startData.minY * this.gridster.cellHeight;
        }
        else {
            this.$element.style.height = (config.startData.maxH * this.gridster.cellHeight) + 'px';
        }
    };
    GridsterItemComponent.prototype.setMaxWidth = function (direction, config) {
        if (direction === 'w') {
            this.$element.style.width = (config.startData.maxW * this.gridster.cellWidth) + 'px';
            this.positionX = config.startData.minX * this.gridster.cellWidth;
            this.updateElemenetPosition();
        }
        else {
            this.$element.style.width = (config.startData.maxW * this.gridster.cellWidth) + 'px';
        }
    };
    return GridsterItemComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridsterItemComponent.prototype, "x", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "xChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridsterItemComponent.prototype, "y", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "yChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridsterItemComponent.prototype, "xSm", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "xSmChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridsterItemComponent.prototype, "ySm", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "ySmChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridsterItemComponent.prototype, "xMd", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "xMdChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridsterItemComponent.prototype, "yMd", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "yMdChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridsterItemComponent.prototype, "xLg", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "xLgChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridsterItemComponent.prototype, "yLg", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "yLgChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridsterItemComponent.prototype, "xXl", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "xXlChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridsterItemComponent.prototype, "yXl", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "yXlChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridsterItemComponent.prototype, "w", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "wChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridsterItemComponent.prototype, "h", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "hChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "change", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "dragAndDrop", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "resizable", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "options", void 0);
__decorate([
    core_1.HostBinding('class.is-dragging'),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "isDragging", void 0);
__decorate([
    core_1.HostBinding('class.is-resizing'),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "isResizing", void 0);
GridsterItemComponent = __decorate([
    core_1.Component({
        selector: 'gridster-item',
        template: "<div class=\"gridster-item-inner\">\n      <ng-content></ng-content>\n      <div class=\"gridster-item-resizable-handler handle-s\"></div>\n      <div class=\"gridster-item-resizable-handler handle-e\"></div>\n      <div class=\"gridster-item-resizable-handler handle-n\"></div>\n      <div class=\"gridster-item-resizable-handler handle-w\"></div>\n      <div class=\"gridster-item-resizable-handler handle-se\"></div>\n      <div class=\"gridster-item-resizable-handler handle-ne\"></div>\n      <div class=\"gridster-item-resizable-handler handle-sw\"></div>\n      <div class=\"gridster-item-resizable-handler handle-nw\"></div>\n    </div>",
        styles: ["\n    :host {\n        display: block;\n        position: absolute;\n        top: 0;\n        left: 0;\n        z-index: 1;\n        transition: all 200ms ease;\n        transition-property: left, top;\n    }\n\n    :host-context(.css-transform)  {\n        transition-property: transform;\n    }\n\n    :host.is-dragging, :host.is-resizing {\n        -webkit-transition: none;\n        transition: none;\n        z-index: 9999;\n    }\n\n    :host.no-transition {\n        -webkit-transition: none;\n        transition: none;\n    }\n    .gridster-item-resizable-handler {\n        position: absolute;\n        z-index: 2;\n        display: none;\n    }\n\n    .gridster-item-resizable-handler.handle-n {\n      cursor: n-resize;\n      height: 10px;\n      right: 0;\n      top: 0;\n      left: 0;\n    }\n\n    .gridster-item-resizable-handler.handle-e {\n      cursor: e-resize;\n      width: 10px;\n      bottom: 0;\n      right: 0;\n      top: 0;\n    }\n\n    .gridster-item-resizable-handler.handle-s {\n      cursor: s-resize;\n      height: 10px;\n      right: 0;\n      bottom: 0;\n      left: 0;\n    }\n\n    .gridster-item-resizable-handler.handle-w {\n      cursor: w-resize;\n      width: 10px;\n      left: 0;\n      top: 0;\n      bottom: 0;\n    }\n\n    .gridster-item-resizable-handler.handle-ne {\n      cursor: ne-resize;\n      width: 10px;\n      height: 10px;\n      right: 0;\n      top: 0;\n    }\n\n    .gridster-item-resizable-handler.handle-nw {\n      cursor: nw-resize;\n      width: 10px;\n      height: 10px;\n      left: 0;\n      top: 0;\n    }\n\n    .gridster-item-resizable-handler.handle-se {\n      cursor: se-resize;\n      width: 0;\n      height: 0;\n      right: 0;\n      bottom: 0;\n      border-style: solid;\n      border-width: 0 0 10px 10px;\n      border-color: transparent;\n    }\n\n    .gridster-item-resizable-handler.handle-sw {\n      cursor: sw-resize;\n      width: 10px;\n      height: 10px;\n      left: 0;\n      bottom: 0;\n    }\n\n    :host(:hover) .gridster-item-resizable-handler.handle-se {\n      border-color: transparent transparent #ccc\n    }\n\n    .gridster-item-inner {\n     position: absolute;\n     background: #fff;     \n     top: 10px;\n     bottom: 10px;\n     left: 10px;\n     right: 10px;          \n     box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n    }\n    "],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __param(1, core_1.Inject(core_1.ElementRef)),
    __param(2, core_1.Inject(gridster_service_1.GridsterService)),
    __metadata("design:paramtypes", [core_1.NgZone,
        core_1.ElementRef,
        gridster_service_1.GridsterService])
], GridsterItemComponent);
exports.GridsterItemComponent = GridsterItemComponent;
//# sourceMappingURL=gridster-item.component.js.map