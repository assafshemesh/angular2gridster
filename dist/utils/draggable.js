"use strict";
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/fromEvent");
require("rxjs/add/operator/takeUntil");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/merge");
require("rxjs/add/operator/map");
var DraggableEvent_1 = require("./DraggableEvent");
var utils_1 = require("./utils");
var Draggable = (function () {
    function Draggable(element, config) {
        if (config === void 0) { config = {}; }
        this.mousemove = Observable_1.Observable.merge(Observable_1.Observable.fromEvent(document, 'mousemove'), Observable_1.Observable.fromEvent(document, 'touchmove', { passive: true })).share();
        this.mouseup = Observable_1.Observable.merge(Observable_1.Observable.fromEvent(document, 'mouseup'), Observable_1.Observable.fromEvent(document, 'touchend'), Observable_1.Observable.fromEvent(document, 'touchcancel')).share();
        this.config = {
            handlerClass: null
        };
        this.element = element;
        this.mousedown = Observable_1.Observable.merge(Observable_1.Observable.fromEvent(element, 'mousedown'), Observable_1.Observable.fromEvent(element, 'touchstart')).share();
        this.config.handlerClass = config.handlerClass;
        this.dragStart = this.createDragStartObservable().share();
        this.dragMove = this.createDragMoveObservable(this.dragStart);
        this.dragStop = this.createDragStopObservable(this.dragStart);
        this.fixProblemWithDnDForIE(element);
    }
    Draggable.prototype.createDragStartObservable = function () {
        var _this = this;
        return this.mousedown
            .map(function (md) { return new DraggableEvent_1.DraggableEvent(md); })
            .filter(function (event) { return _this.isDragingByHandler(event); })
            .do(function (e) {
            e.pauseEvent();
            document.activeElement.blur();
            utils_1.utils.clearSelection();
        })
            .switchMap(function (startEvent) {
            return _this.mousemove
                .map(function (mm) { return new DraggableEvent_1.DraggableEvent(mm); })
                .filter(function (moveEvent) { return _this.inRange(startEvent, moveEvent, 5); })
                .map(function () { return startEvent; })
                .takeUntil(_this.mouseup)
                .take(1);
        });
    };
    Draggable.prototype.createDragMoveObservable = function (dragStart) {
        var _this = this;
        return dragStart
            .switchMap(function () {
            return _this.mousemove
                .skip(1)
                .map(function (mm) { return new DraggableEvent_1.DraggableEvent(mm); })
                .takeUntil(_this.mouseup);
        })
            .filter(function (val) { return !!val; });
    };
    Draggable.prototype.createDragStopObservable = function (dragStart) {
        var _this = this;
        return dragStart
            .switchMap(function () {
            return _this.mouseup.take(1);
        });
    };
    Draggable.prototype.isDragingByHandler = function (event) {
        if (!this.isValidDragHandler(event.target)) {
            return false;
        }
        return !this.config.handlerClass ||
            (this.config.handlerClass && this.hasElementWithClass(this.config.handlerClass, event.target));
    };
    Draggable.prototype.isValidDragHandler = function (targetEl) {
        return ['input', 'textarea'].indexOf(targetEl.tagName.toLowerCase()) === -1;
    };
    Draggable.prototype.inRange = function (startEvent, moveEvent, range) {
        return Math.abs(moveEvent.clientX - startEvent.clientX) > range ||
            Math.abs(moveEvent.clientY - startEvent.clientY) > range;
    };
    Draggable.prototype.hasElementWithClass = function (className, target) {
        while (target !== this.element) {
            if (target.classList.contains(className)) {
                return true;
            }
            target = target.parentElement;
        }
        return false;
    };
    Draggable.prototype.pauseEvent = function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
    };
    Draggable.prototype.fixProblemWithDnDForIE = function (element) {
        element.style['touch-action'] = 'none';
    };
    return Draggable;
}());
exports.Draggable = Draggable;
//# sourceMappingURL=draggable.js.map