"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DraggableEvent = (function () {
    function DraggableEvent(event) {
        if (event.touches) {
            this.touchEvent = event;
            this.setDataFromTouchEvent(this.touchEvent);
        }
        else {
            this.mouseEvent = event;
            this.setDataFromMouseEvent(this.mouseEvent);
        }
    }
    DraggableEvent.prototype.isTouchEvent = function () {
        return !!this.touchEvent;
    };
    DraggableEvent.prototype.pauseEvent = function () {
        var event = this.touchEvent || this.mouseEvent;
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.cancelBubble = true;
        event.returnValue = false;
        return false;
    };
    DraggableEvent.prototype.getRelativeCoordinates = function (container) {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
        var rect = container.getBoundingClientRect();
        return {
            x: this.pageX - rect.left - scrollLeft,
            y: this.pageY - rect.top - scrollTop,
        };
    };
    DraggableEvent.prototype.setDataFromMouseEvent = function (event) {
        this.target = event.target;
        this.clientX = event.clientX;
        this.clientY = event.clientY;
        this.pageX = event.pageX;
        this.pageY = event.pageY;
    };
    DraggableEvent.prototype.setDataFromTouchEvent = function (event) {
        this.target = event.target;
        this.clientX = event.touches[0].clientX;
        this.clientY = event.touches[0].clientY;
        this.pageX = event.touches[0].pageX;
        this.pageY = event.touches[0].pageY;
    };
    return DraggableEvent;
}());
exports.DraggableEvent = DraggableEvent;
//# sourceMappingURL=DraggableEvent.js.map