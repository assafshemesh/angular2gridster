"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = {
    setCssElementPosition: function ($element, position) {
        $element.style.left = position.x + 'px';
        $element.style.top = position.y + 'px';
    },
    resetCSSElementPosition: function ($element) {
        $element.style.left = '';
        $element.style.top = '';
    },
    setTransform: function ($element, position) {
        var left = position.x;
        var top = position.y;
        var translate = "translate(" + left + "px," + top + "px)";
        $element.style['transform'] = translate;
        $element.style['WebkitTransform'] = translate;
        $element.style['MozTransform'] = translate;
        $element.style['msTransform'] = translate;
        $element.style['OTransform'] = translate;
    },
    resetTransform: function ($element) {
        $element.style['transform'] = '';
        $element.style['WebkitTransform'] = '';
        $element.style['MozTransform'] = '';
        $element.style['msTransform'] = '';
        $element.style['OTransform'] = '';
    },
    clearSelection: function () {
        if (document['selection']) {
            document['selection'].empty();
        }
        else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    },
    isElementFitContainer: function (element, containerEl) {
        var containerRect = containerEl.getBoundingClientRect();
        var elRect = element.getBoundingClientRect();
        return elRect.left > containerRect.left &&
            elRect.right < containerRect.right &&
            elRect.top > containerRect.top &&
            elRect.bottom < containerRect.bottom;
    },
    isElementIntersectContainer: function (element, containerEl) {
        var containerRect = containerEl.getBoundingClientRect();
        var elRect = element.getBoundingClientRect();
        var elWidth = elRect.right - elRect.left;
        var elHeight = elRect.bottom - elRect.top;
        return (elRect.left + (elWidth / 2)) > containerRect.left &&
            (elRect.right - (elWidth / 2)) < containerRect.right &&
            (elRect.top + (elHeight / 2)) > containerRect.top &&
            (elRect.bottom - (elHeight / 2)) < containerRect.bottom;
    },
    isElementTouchContainer: function (element, containerEl) {
        var containerRect = containerEl.getBoundingClientRect();
        var elRect = element.getBoundingClientRect();
        return elRect.right > containerRect.left &&
            elRect.bottom > containerRect.top &&
            elRect.left < containerRect.right &&
            elRect.top < containerRect.bottom;
    },
    isCursorAboveElement: function (event, element) {
        var elRect = element.getBoundingClientRect();
        return event.pageX > elRect.left &&
            event.pageX < elRect.right &&
            event.pageY > elRect.top &&
            event.pageY < elRect.bottom;
    },
    getElementOuterHeight: function ($element) {
        var styleObj = window.getComputedStyle($element);
        return parseFloat(styleObj.getPropertyValue('height')) +
            parseFloat(styleObj.getPropertyValue('padding-top')) +
            parseFloat(styleObj.getPropertyValue('padding-bottom'));
    },
    getRelativeCoordinates: function (element, parentElement) {
        var parentElementRect = parentElement.getBoundingClientRect();
        var elementRect = element.getBoundingClientRect();
        return {
            top: elementRect.top - parentElementRect.top,
            left: elementRect.left - parentElementRect.left
        };
    }
};
//# sourceMappingURL=utils.js.map