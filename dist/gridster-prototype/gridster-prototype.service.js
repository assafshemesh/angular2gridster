"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/observable/fromEvent");
require("rxjs/add/operator/takeUntil");
require("rxjs/add/operator/map");
require("rxjs/add/operator/scan");
require("rxjs/add/operator/filter");
var GridsterPrototypeService = (function () {
    function GridsterPrototypeService() {
        this.isDragging = false;
        this.dragSubject = new Subject_1.Subject();
        this.dragStartSubject = new Subject_1.Subject();
        this.dragStopSubject = new Subject_1.Subject();
    }
    GridsterPrototypeService.prototype.observeDropOver = function (gridster) {
        var _this = this;
        return this.dragStopSubject.asObservable()
            .filter(function (item) {
            return _this.isInsideContainer(item.$element, gridster.gridsterComponent.$element);
        })
            .do(function (prototype) {
            prototype.onDrop(gridster);
        });
    };
    GridsterPrototypeService.prototype.observeDropOut = function (gridster) {
        var _this = this;
        return this.dragStopSubject.asObservable()
            .filter(function (item) {
            return !_this.isInsideContainer(item.$element, gridster.gridsterComponent.$element);
        })
            .do(function (prototype) {
            prototype.onCancel();
        });
    };
    GridsterPrototypeService.prototype.observeDragOver = function (gridster) {
        var _this = this;
        var over = this.dragSubject.asObservable()
            .map(function (item) {
            return {
                item: item,
                isOver: _this.isInsideContainer(item.$element, gridster.gridsterComponent.$element),
                isDrop: false
            };
        });
        var drop = this.dragStopSubject.asObservable()
            .map(function (item) {
            return {
                item: item,
                isOver: _this.isInsideContainer(item.$element, gridster.gridsterComponent.$element),
                isDrop: true
            };
        });
        var dragExt = Observable_1.Observable.merge(this.dragStartSubject.map(function () { return ({ item: null, isOver: false, isDrop: false }); }), over, drop)
            .scan(function (prev, next) {
            return {
                item: next.item,
                isOver: next.isOver,
                isEnter: prev.isOver === false && next.isOver === true,
                isOut: prev.isOver === true && next.isOver === false && !prev.isDrop,
                isDrop: next.isDrop
            };
        })
            .filter(function (data) {
            return !data.isDrop;
        });
        var dragEnter = this.createDragEnterObservable(dragExt, gridster);
        var dragOut = this.createDragOutObservable(dragExt, gridster);
        var dragOver = dragEnter.switchMap(function () {
            return _this.dragSubject.asObservable()
                .takeUntil(dragOut);
        });
        return { dragEnter: dragEnter, dragOut: dragOut, dragOver: dragOver };
    };
    GridsterPrototypeService.prototype.dragItemStart = function (item) {
        this.isDragging = true;
        this.dragStartSubject.next(item);
    };
    GridsterPrototypeService.prototype.dragItemStop = function (item) {
        this.isDragging = false;
        this.dragStopSubject.next(item);
    };
    GridsterPrototypeService.prototype.updatePrototypePosition = function (item) {
        this.dragSubject.next(item);
    };
    GridsterPrototypeService.prototype.createDragOverObservable = function (dragIsOver, gridster) {
        return dragIsOver
            .filter(function (data) {
            return data.isOver && !data.isEnter && !data.isOut;
        })
            .map(function (data) {
            return data.item;
        })
            .do(function (item) {
            item.onOver(gridster);
        });
    };
    GridsterPrototypeService.prototype.createDragEnterObservable = function (dragIsOver, gridster) {
        return dragIsOver
            .filter(function (data) {
            return data.isEnter;
        })
            .map(function (data) {
            return data.item;
        })
            .do(function (item) {
            item.onEnter(gridster);
        });
    };
    GridsterPrototypeService.prototype.createDragOutObservable = function (dragIsOver, gridster) {
        return dragIsOver
            .filter(function (data) {
            return data.isOut;
        })
            .map(function (data) {
            return data.item;
        })
            .do(function (item) {
            item.onOut(gridster);
        });
    };
    GridsterPrototypeService.prototype.isInsideContainer = function (element, containerEl) {
        var containerRect = containerEl.getBoundingClientRect();
        var elRect = element.getBoundingClientRect();
        return elRect.left > containerRect.left &&
            elRect.right < containerRect.right &&
            elRect.top > containerRect.top &&
            elRect.bottom < containerRect.bottom;
    };
    return GridsterPrototypeService;
}());
GridsterPrototypeService.decorators = [
    { type: core_1.Injectable },
];
GridsterPrototypeService.ctorParameters = function () { return []; };
exports.GridsterPrototypeService = GridsterPrototypeService;
//# sourceMappingURL=gridster-prototype.service.js.map