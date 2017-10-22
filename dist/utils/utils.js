"use strict";
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
    clearSelection: function clearSelection() {
        if (document['selection']) {
            document['selection'].empty();
        }
        else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }
};
//# sourceMappingURL=utils.js.map