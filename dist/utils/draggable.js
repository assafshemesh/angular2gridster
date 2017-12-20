"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/fromEvent");
require("rxjs/add/operator/takeUntil");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/filter");
require("rxjs/add/observable/merge");
require("rxjs/add/operator/map");
require("rxjs/add/operator/share");
require("rxjs/add/operator/take");
require("rxjs/add/operator/skip");
var DraggableEvent_1 = require("./DraggableEvent");
var utils_1 = require("./utils");
var Draggable = (function () {
    function Draggable(element, config) {
        if (config === void 0) { config = {}; }
        this.mousemove = Observable_1.Observable.merge(Observable_1.Observable.fromEvent(document, 'mousemove'), Observable_1.Observable.fromEvent(document, 'touchmove', { passive: true })).share();
        this.mouseup = Observable_1.Observable.merge(Observable_1.Observable.fromEvent(document, 'mouseup'), Observable_1.Observable.fromEvent(document, 'touchend'), Observable_1.Observable.fromEvent(document, 'touchcancel')).share();
        this.config = {
            handlerClass: null,
            scroll: true,
            scrollEdge: 36,
            scrollDirection: null
        };
        this.autoScrollingInterval = [];
        this.element = element;
        this.mousedown = Observable_1.Observable.merge(Observable_1.Observable.fromEvent(element, 'mousedown'), Observable_1.Observable.fromEvent(element, 'touchstart')).share();
        this.config = __assign({}, this.config, config);
        this.dragStart = this.createDragStartObservable().share();
        this.dragMove = this.createDragMoveObservable(this.dragStart);
        this.dragStop = this.createDragStopObservable(this.dragStart);
        this.fixProblemWithDnDForIE(element);
        this.requestAnimationFrame = window.requestAnimationFrame || (function (callback) { return setTimeout(callback, 1000 / 60); });
        this.cancelAnimationFrame = window.cancelAnimationFrame || (function (cafID) { return clearTimeout(cafID); });
    }
    Draggable.prototype.createDragStartObservable = function () {
        var _this = this;
        return this.mousedown
            .map(function (md) { return new DraggableEvent_1.DraggableEvent(md); })
            .filter(function (event) { return _this.isDragingByHandler(event); })
            .do(function (e) {
            e.pauseEvent();
            if (document.activeElement) {
                document.activeElement.blur();
            }
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
            .filter(function (val) { return !!val; })
            .do(function (event) {
            if (_this.config.scroll) {
                _this.startScroll(_this.element, event);
            }
        });
    };
    Draggable.prototype.createDragStopObservable = function (dragStart) {
        var _this = this;
        return dragStart
            .switchMap(function () {
            return _this.mouseup.take(1);
        })
            .map(function (e) { return new DraggableEvent_1.DraggableEvent(e); })
            .do(function () {
            _this.autoScrollingInterval.forEach(function (raf) { return _this.cancelAnimationFrame(raf); });
        });
    };
    Draggable.prototype.startScroll = function (item, event) {
        var _this = this;
        var scrollContainer = this.getScrollContainer(item);
        this.autoScrollingInterval.forEach(function (raf) { return _this.cancelAnimationFrame(raf); });
        if (scrollContainer) {
            this.startScrollForContainer(event, scrollContainer);
        }
        else {
            this.startScrollForWindow(event);
        }
    };
    Draggable.prototype.startScrollForContainer = function (event, scrollContainer) {
        if (!this.config.scrollDirection || this.config.scrollDirection === 'vertical') {
            this.startScrollVerticallyForContainer(event, scrollContainer);
        }
        if (!this.config.scrollDirection || this.config.scrollDirection === 'horizontal') {
            this.startScrollHorizontallyForContainer(event, scrollContainer);
        }
    };
    Draggable.prototype.startScrollVerticallyForContainer = function (event, scrollContainer) {
        if (event.pageY - this.getOffset(scrollContainer).top < this.config.scrollEdge) {
            this.startAutoScrolling(scrollContainer, -Draggable.SCROLL_SPEED, 'scrollTop');
        }
        else if ((this.getOffset(scrollContainer).top + scrollContainer.getBoundingClientRect().height) -
            event.pageY < this.config.scrollEdge) {
            this.startAutoScrolling(scrollContainer, Draggable.SCROLL_SPEED, 'scrollTop');
        }
    };
    Draggable.prototype.startScrollHorizontallyForContainer = function (event, scrollContainer) {
        if (event.pageX - scrollContainer.getBoundingClientRect().left < this.config.scrollEdge) {
            this.startAutoScrolling(scrollContainer, -Draggable.SCROLL_SPEED, 'scrollLeft');
        }
        else if ((this.getOffset(scrollContainer).left + scrollContainer.getBoundingClientRect().width) -
            event.pageX < this.config.scrollEdge) {
            this.startAutoScrolling(scrollContainer, Draggable.SCROLL_SPEED, 'scrollLeft');
        }
    };
    Draggable.prototype.startScrollForWindow = function (event) {
        if (!this.config.scrollDirection || this.config.scrollDirection === 'vertical') {
            this.startScrollVerticallyForWindow(event);
        }
        if (!this.config.scrollDirection || this.config.scrollDirection === 'horizontal') {
            this.startScrollHorizontallyForWindow(event);
        }
    };
    Draggable.prototype.startScrollVerticallyForWindow = function (event) {
        var scrollingElement = document.scrollingElement || document.documentElement || document.body;
        if ((event.pageY - window.pageYOffset) < this.config.scrollEdge) {
            this.startAutoScrolling(scrollingElement, -Draggable.SCROLL_SPEED, 'scrollTop');
        }
        else if ((window.innerHeight - (event.pageY - window.pageYOffset)) < this.config.scrollEdge) {
            this.startAutoScrolling(scrollingElement, Draggable.SCROLL_SPEED, 'scrollTop');
        }
    };
    Draggable.prototype.startScrollHorizontallyForWindow = function (event) {
        var scrollingElement = document.scrollingElement || document.documentElement || document.body;
        if ((event.pageX - window.pageXOffset) < this.config.scrollEdge) {
            this.startAutoScrolling(scrollingElement, -Draggable.SCROLL_SPEED, 'scrollLeft');
        }
        else if ((window.innerWidth - (event.pageX - window.pageXOffset)) < this.config.scrollEdge) {
            this.startAutoScrolling(scrollingElement, Draggable.SCROLL_SPEED, 'scrollLeft');
        }
    };
    Draggable.prototype.getScrollContainer = function (node) {
        var nodeOuterHeight = utils_1.utils.getElementOuterHeight(node);
        if (node.scrollHeight > Math.ceil(nodeOuterHeight)) {
            return node;
        }
        if (!(new RegExp('(body|html)', 'i')).test(node.parentNode.tagName)) {
            return this.getScrollContainer(node.parentNode);
        }
        return null;
    };
    Draggable.prototype.startAutoScrolling = function (node, amount, direction) {
        this.autoScrollingInterval.push(this.requestAnimationFrame(function () {
            this.startAutoScrolling(node, amount, direction);
        }.bind(this)));
        return node[direction] += (amount * 0.25);
    };
    Draggable.prototype.getOffset = function (el) {
        var rect = el.getBoundingClientRect();
        return {
            left: rect.left + this.getScroll('scrollLeft', 'pageXOffset'),
            top: rect.top + this.getScroll('scrollTop', 'pageYOffset')
        };
    };
    Draggable.prototype.getScroll = function (scrollProp, offsetProp) {
        if (typeof window[offsetProp] !== 'undefined') {
            return window[offsetProp];
        }
        if (document.documentElement.clientHeight) {
            return document.documentElement[scrollProp];
        }
        return document.body[scrollProp];
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
        if (this.isTouchDevice() && this.isIEorEdge()) {
            element.style['touch-action'] = 'none';
        }
    };
    Draggable.prototype.isTouchDevice = function () {
        return 'ontouchstart' in window
            || navigator.maxTouchPoints;
    };
    Draggable.prototype.isIEorEdge = function () {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }
        return false;
    };
    return Draggable;
}());
Draggable.SCROLL_SPEED = 20;
exports.Draggable = Draggable;
//# sourceMappingURL=draggable.js.map