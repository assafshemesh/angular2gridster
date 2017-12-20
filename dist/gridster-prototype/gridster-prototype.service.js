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
require("rxjs/add/operator/share");
var utils_1 = require("../utils/utils");
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
            .filter(function (data) { return _this.isOverGridster(data.item, gridster, data.event); })
            .do(function (data) {
            data.item.onDrop(gridster);
        });
    };
    GridsterPrototypeService.prototype.observeDropOut = function (gridster) {
        var _this = this;
        return this.dragStopSubject.asObservable()
            .filter(function (data) { return !_this.isOverGridster(data.item, gridster, data.event); })
            .do(function (data) {
            data.item.onCancel();
        });
    };
    GridsterPrototypeService.prototype.observeDragOver = function (gridster) {
        var _this = this;
        var over = this.dragSubject.asObservable()
            .map(function (data) { return ({
            item: data.item,
            event: data.event,
            isOver: _this.isOverGridster(data.item, gridster, data.event),
            isDrop: false
        }); });
        var drop = this.dragStopSubject.asObservable()
            .map(function (data) { return ({
            item: data.item,
            event: data.event,
            isOver: _this.isOverGridster(data.item, gridster, data.event),
            isDrop: true
        }); });
        var dragExt = Observable_1.Observable.merge(this.dragStartSubject.map(function () { return ({ item: null, isOver: false, isDrop: false }); }), over, drop)
            .scan(function (prev, next) {
            return {
                item: next.item,
                event: next.event,
                isOver: next.isOver,
                isEnter: prev.isOver === false && next.isOver === true,
                isOut: prev.isOver === true && next.isOver === false && !prev.isDrop,
                isDrop: next.isDrop
            };
        })
            .filter(function (data) {
            return !data.isDrop;
        }).share();
        var dragEnter = this.createDragEnterObservable(dragExt, gridster);
        var dragOut = this.createDragOutObservable(dragExt, gridster);
        var dragOver = dragEnter.switchMap(function () {
            return _this.dragSubject.asObservable()
                .takeUntil(dragOut);
        })
            .map(function (data) { return data.item; });
        return { dragEnter: dragEnter, dragOut: dragOut, dragOver: dragOver };
    };
    GridsterPrototypeService.prototype.dragItemStart = function (item, event) {
        this.isDragging = true;
        this.dragStartSubject.next({ item: item, event: event });
    };
    GridsterPrototypeService.prototype.dragItemStop = function (item, event) {
        this.isDragging = false;
        this.dragStopSubject.next({ item: item, event: event });
    };
    GridsterPrototypeService.prototype.updatePrototypePosition = function (item, event) {
        this.dragSubject.next({ item: item, event: event });
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
    GridsterPrototypeService.prototype.isOverGridster = function (item, gridster, event) {
        var el = item.$element;
        var elContainer = gridster.gridsterComponent.$element;
        var tolerance = gridster.options.tolerance;
        switch (tolerance) {
            case 'fit':
                return utils_1.utils.isElementFitContainer(el, elContainer);
            case 'intersect':
                return utils_1.utils.isElementIntersectContainer(el, elContainer);
            case 'touch':
                return utils_1.utils.isElementTouchContainer(el, elContainer);
            default:
                return utils_1.utils.isCursorAboveElement(event, elContainer);
        }
    };
    return GridsterPrototypeService;
}());
GridsterPrototypeService.decorators = [
    { type: core_1.Injectable },
];
GridsterPrototypeService.ctorParameters = function () { return []; };
exports.GridsterPrototypeService = GridsterPrototypeService;
//# sourceMappingURL=gridster-prototype.service.js.map