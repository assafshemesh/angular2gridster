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
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
require("rxjs/add/observable/fromEvent");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/takeUntil");
var gridster_prototype_service_1 = require("./gridster-prototype.service");
var GridListItem_1 = require("../gridList/GridListItem");
var draggable_1 = require("../utils/draggable");
var utils_1 = require("../utils/utils");
var GridsterItemPrototypeDirective = (function () {
    function GridsterItemPrototypeDirective(zone, elementRef, gridsterPrototype) {
        this.zone = zone;
        this.elementRef = elementRef;
        this.gridsterPrototype = gridsterPrototype;
        this.drop = new core_1.EventEmitter();
        this.start = new core_1.EventEmitter();
        this.cancel = new core_1.EventEmitter();
        this.enter = new core_1.EventEmitter();
        this.out = new core_1.EventEmitter();
        this.config = {};
        this.x = 0;
        this.y = 0;
        this.autoSize = false;
        this.isDragging = false;
        this.subscribtions = [];
        this.item = (new GridListItem_1.GridListItem()).setFromGridsterItemPrototype(this);
    }
    Object.defineProperty(GridsterItemPrototypeDirective.prototype, "dragAndDrop", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    GridsterItemPrototypeDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.zone.runOutsideAngular(function () {
            _this.enableDragDrop();
        });
    };
    GridsterItemPrototypeDirective.prototype.ngOnDestroy = function () {
        this.subscribtions.forEach(function (sub) {
            sub.unsubscribe();
        });
    };
    GridsterItemPrototypeDirective.prototype.onDrop = function (gridster) {
        if (!this.config.helper) {
            this.$element.parentNode.removeChild(this.$element);
        }
        this.drop.emit({
            item: this.item,
            gridster: gridster
        });
    };
    GridsterItemPrototypeDirective.prototype.onCancel = function () {
        this.cancel.emit({ item: this.item });
    };
    GridsterItemPrototypeDirective.prototype.onEnter = function (gridster) {
        this.enter.emit({
            item: this.item,
            gridster: gridster
        });
    };
    GridsterItemPrototypeDirective.prototype.onOver = function (gridster) { };
    GridsterItemPrototypeDirective.prototype.onOut = function (gridster) {
        this.out.emit({
            item: this.item,
            gridster: gridster
        });
    };
    GridsterItemPrototypeDirective.prototype.getPositionToGridster = function (gridster) {
        var relativeContainerCoords = this.getContainerCoordsToGridster(gridster);
        return {
            y: this.positionY - relativeContainerCoords.top,
            x: this.positionX - relativeContainerCoords.left
        };
    };
    GridsterItemPrototypeDirective.prototype.getContainerCoordsToGridster = function (gridster) {
        return {
            left: gridster.gridsterRect.left - this.parentRect.left,
            top: gridster.gridsterRect.top - this.parentRect.top
        };
    };
    GridsterItemPrototypeDirective.prototype.enableDragDrop = function () {
        var _this = this;
        var cursorToElementPosition;
        var draggable = new draggable_1.Draggable(this.elementRef.nativeElement);
        var dragStartSub = draggable.dragStart
            .subscribe(function (event) {
            _this.zone.run(function () {
                _this.$element = _this.provideDragElement();
                _this.containerRectange = _this.$element.parentElement.getBoundingClientRect();
                _this.updateParentElementData();
                _this.onStart();
                cursorToElementPosition = event.getRelativeCoordinates(_this.$element);
            });
        });
        var dragSub = draggable.dragMove
            .subscribe(function (event) {
            _this.setElementPosition(_this.$element, {
                x: event.clientX - cursorToElementPosition.x - _this.parentRect.left,
                y: event.clientY - cursorToElementPosition.y - _this.parentRect.top
            });
            _this.onDrag();
        });
        var dragStopSub = draggable.dragStop
            .subscribe(function () {
            _this.zone.run(function () {
                _this.onStop();
                _this.$element = null;
            });
        });
        var scrollSub = Observable_1.Observable.fromEvent(document, 'scroll')
            .subscribe(function () {
            if (_this.$element) {
                _this.updateParentElementData();
            }
        });
        this.subscribtions = this.subscribtions.concat([dragStartSub, dragSub, dragStopSub, scrollSub]);
    };
    GridsterItemPrototypeDirective.prototype.setElementPosition = function (element, position) {
        this.positionX = position.x;
        this.positionY = position.y;
        utils_1.utils.setCssElementPosition(element, position);
    };
    GridsterItemPrototypeDirective.prototype.updateParentElementData = function () {
        this.parentRect = this.$element.parentElement.getBoundingClientRect();
        this.parentOffset = {
            left: this.$element.parentElement.offsetLeft,
            top: this.$element.parentElement.offsetTop
        };
    };
    GridsterItemPrototypeDirective.prototype.onStart = function () {
        this.isDragging = true;
        this.$element.style.pointerEvents = 'none';
        this.$element.style.position = 'absolute';
        this.gridsterPrototype.dragItemStart(this);
        this.start.emit({ item: this.item });
    };
    GridsterItemPrototypeDirective.prototype.onDrag = function () {
        this.gridsterPrototype.updatePrototypePosition(this);
    };
    GridsterItemPrototypeDirective.prototype.onStop = function () {
        this.gridsterPrototype.dragItemStop(this);
        this.isDragging = false;
        this.$element.style.pointerEvents = 'auto';
        this.$element.style.position = '';
        utils_1.utils.resetCSSElementPosition(this.$element);
        if (this.config.helper) {
            this.$element.parentNode.removeChild(this.$element);
        }
    };
    GridsterItemPrototypeDirective.prototype.provideDragElement = function () {
        var dragElement = this.elementRef.nativeElement;
        if (this.config.helper) {
            dragElement = (dragElement).cloneNode(true);
            document.body.appendChild(this.fixStylesForBodyHelper(dragElement));
        }
        else {
            this.fixStylesForRelativeElement(dragElement);
        }
        return dragElement;
    };
    GridsterItemPrototypeDirective.prototype.fixStylesForRelativeElement = function (el) {
        if (window.getComputedStyle(el).position === 'absolute') {
            return el;
        }
        var rect = this.elementRef.nativeElement.getBoundingClientRect();
        this.containerRectange = el.parentElement.getBoundingClientRect();
        el.style.position = 'absolute';
        this.setElementPosition(el, {
            x: rect.left - this.containerRectange.left,
            y: rect.top - this.containerRectange.top
        });
        return el;
    };
    GridsterItemPrototypeDirective.prototype.fixStylesForBodyHelper = function (el) {
        var bodyRect = document.body.getBoundingClientRect();
        var rect = this.elementRef.nativeElement.getBoundingClientRect();
        el.style.position = 'absolute';
        this.setElementPosition(el, {
            x: rect.left - bodyRect.left,
            y: rect.top - bodyRect.top
        });
        return el;
    };
    return GridsterItemPrototypeDirective;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemPrototypeDirective.prototype, "drop", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemPrototypeDirective.prototype, "start", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemPrototypeDirective.prototype, "cancel", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemPrototypeDirective.prototype, "enter", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterItemPrototypeDirective.prototype, "out", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], GridsterItemPrototypeDirective.prototype, "data", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], GridsterItemPrototypeDirective.prototype, "config", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridsterItemPrototypeDirective.prototype, "w", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridsterItemPrototypeDirective.prototype, "h", void 0);
GridsterItemPrototypeDirective = __decorate([
    core_1.Directive({
        selector: '[gridsterItemPrototype]'
    }),
    __metadata("design:paramtypes", [core_1.NgZone,
        core_1.ElementRef,
        gridster_prototype_service_1.GridsterPrototypeService])
], GridsterItemPrototypeDirective);
exports.GridsterItemPrototypeDirective = GridsterItemPrototypeDirective;
//# sourceMappingURL=gridster-item-prototype.directive.js.map