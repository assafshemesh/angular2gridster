"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/takeUntil");
require("rxjs/add/observable/fromEvent");
require("rxjs/add/operator/do");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/publish");
var utils_1 = require("./utils/utils");
var gridster_service_1 = require("./gridster.service");
var gridster_prototype_service_1 = require("./gridster-prototype/gridster-prototype.service");
var GridsterOptions_1 = require("./GridsterOptions");
var GridsterComponent = (function () {
    function GridsterComponent(zone, elementRef, gridster, gridsterPrototype) {
        this.zone = zone;
        this.gridsterPrototype = gridsterPrototype;
        this.optionsChange = new core_1.EventEmitter();
        this.ready = new core_1.EventEmitter();
        this.reflow = new core_1.EventEmitter();
        this.isDragging = false;
        this.isResizing = false;
        this.isReady = false;
        this.subscribtions = [];
        this.gridster = gridster;
        this.$element = elementRef.nativeElement;
    }
    GridsterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.gridsterOptions = new GridsterOptions_1.GridsterOptions(this.options);
        if (this.options.useCSSTransforms) {
            this.$element.classList.add('css-transform');
        }
        this.gridsterOptions.change
            .do(function (options) {
            _this.gridster.options = options;
            if (_this.gridster.gridList) {
                _this.gridster.gridList.options = options;
            }
        })
            .do(function (options) {
            _this.optionsChange.emit(options);
        })
            .subscribe();
        this.gridster.init(this.gridster.options, this.draggableOptions, this);
        Observable_1.Observable.fromEvent(window, 'resize')
            .debounceTime(this.gridster.options.responsiveDebounce || 0)
            .subscribe(function () {
            if (_this.gridster.options.responsiveView) {
                _this.reload();
            }
        });
        this.zone.runOutsideAngular(function () {
            var scrollSub = Observable_1.Observable.fromEvent(document, 'scroll', true)
                .subscribe(function () { return _this.updateGridsterElementData(); });
            _this.subscribtions.push(scrollSub);
        });
    };
    GridsterComponent.prototype.ngAfterContentInit = function () {
        this.gridster.start();
        this.updateGridsterElementData();
        this.connectGridsterPrototype();
        this.gridster.$positionHighlight = this.$positionHighlight.nativeElement;
    };
    GridsterComponent.prototype.ngOnDestroy = function () {
        this.subscribtions.forEach(function (sub) {
            sub.unsubscribe();
        });
    };
    GridsterComponent.prototype.setOption = function (name, value) {
        if (name === 'dragAndDrop') {
            if (value) {
                this.enableDraggable();
            }
            else {
                this.disableDraggable();
            }
        }
        if (name === 'resizable') {
            if (value) {
                this.enableResizable();
            }
            else {
                this.disableResizable();
            }
        }
        if (name === 'lanes') {
            this.gridster.options.lanes = value;
            this.gridster.gridList.fixItemsPositions(this.gridster.options);
            this.reflowGridster();
        }
        if (name === 'direction') {
            this.gridster.options.direction = value;
            this.gridster.gridList.pullItemsToLeft();
        }
        if (name === 'widthHeightRatio') {
            this.gridster.options.widthHeightRatio = parseFloat(value || 1);
        }
        if (name === 'responsiveView') {
            this.gridster.options.responsiveView = !!value;
        }
        this.gridster.gridList.setOption(name, value);
        return this;
    };
    GridsterComponent.prototype.reload = function () {
        var _this = this;
        setTimeout(function () {
            _this.gridster.fixItemsPositions();
            _this.reflowGridster();
        });
        return this;
    };
    GridsterComponent.prototype.reflowGridster = function (isInit) {
        if (isInit === void 0) { isInit = false; }
        this.gridster.reflow();
        this.reflow.emit({
            isInit: isInit,
            gridsterComponent: this
        });
    };
    GridsterComponent.prototype.updateGridsterElementData = function () {
        this.gridster.gridsterScrollData = this.getScrollPositionFromParents(this.$element);
        this.gridster.gridsterRect = this.$element.getBoundingClientRect();
    };
    GridsterComponent.prototype.setReady = function () {
        var _this = this;
        setTimeout(function () { return _this.isReady = true; });
        this.ready.emit();
    };
    GridsterComponent.prototype.adjustItemsHeightToContent = function (scrollableItemElementSelector) {
        var _this = this;
        if (scrollableItemElementSelector === void 0) { scrollableItemElementSelector = '.gridster-item-inner'; }
        this.gridster.items
            .map(function (item) {
            var scrollEl = item.$element.querySelector(scrollableItemElementSelector);
            var contentEl = scrollEl.lastElementChild;
            var scrollElDistance = utils_1.utils.getRelativeCoordinates(scrollEl, item.$element);
            var scrollElRect = scrollEl.getBoundingClientRect();
            var contentRect = contentEl.getBoundingClientRect();
            return {
                item: item,
                contentHeight: contentRect.bottom - scrollElRect.top,
                scrollElDistance: scrollElDistance
            };
        })
            .forEach(function (data) {
            data.item.h = Math.ceil(((data.contentHeight) / (_this.gridster.cellHeight - data.scrollElDistance.top)));
        });
        this.gridster.fixItemsPositions();
        this.gridster.reflow();
    };
    GridsterComponent.prototype.getScrollPositionFromParents = function (element, data) {
        if (data === void 0) { data = { scrollTop: 0, scrollLeft: 0 }; }
        if (element.parentElement && element.parentElement !== document.body) {
            data.scrollTop += element.parentElement.scrollTop;
            data.scrollLeft += element.parentElement.scrollLeft;
            return this.getScrollPositionFromParents(element.parentElement, data);
        }
        return {
            scrollTop: data.scrollTop,
            scrollLeft: data.scrollLeft
        };
    };
    GridsterComponent.prototype.connectGridsterPrototype = function () {
        var _this = this;
        var isEntered = false;
        this.gridsterPrototype.observeDropOut(this.gridster)
            .subscribe();
        var dropOverObservable = this.gridsterPrototype.observeDropOver(this.gridster)
            .publish();
        var dragObservable = this.gridsterPrototype.observeDragOver(this.gridster);
        dragObservable.dragOver
            .subscribe(function (prototype) {
            if (!isEntered) {
                return;
            }
            _this.gridster.onDrag(prototype.item);
        });
        dragObservable.dragEnter
            .subscribe(function (prototype) {
            isEntered = true;
            _this.gridster.items.push(prototype.item);
            _this.gridster.onStart(prototype.item);
        });
        dragObservable.dragOut
            .subscribe(function (prototype) {
            if (!isEntered) {
                return;
            }
            _this.gridster.onDragOut(prototype.item);
            isEntered = false;
        });
        dropOverObservable
            .subscribe(function (data) {
            if (!isEntered) {
                return;
            }
            _this.gridster.onStop(data.item.item);
            _this.gridster.removeItem(data.item.item);
            isEntered = false;
        });
        dropOverObservable.connect();
    };
    GridsterComponent.prototype.enableDraggable = function () {
        this.gridster.options.dragAndDrop = true;
        this.gridster.items
            .filter(function (item) { return item.itemComponent; })
            .forEach(function (item) { return item.itemComponent.enableDragDrop(); });
    };
    GridsterComponent.prototype.disableDraggable = function () {
        this.gridster.options.dragAndDrop = false;
        this.gridster.items
            .filter(function (item) { return item.itemComponent; })
            .forEach(function (item) { return item.itemComponent.disableDraggable(); });
    };
    GridsterComponent.prototype.enableResizable = function () {
        this.gridster.options.resizable = true;
        this.gridster.items.forEach(function (item) { return item.itemComponent.enableResizable(); });
    };
    GridsterComponent.prototype.disableResizable = function () {
        this.gridster.options.resizable = false;
        this.gridster.items.forEach(function (item) { return item.itemComponent.disableResizable(); });
    };
    return GridsterComponent;
}());
GridsterComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'gridster',
                template: "<div class=\"gridster-container\">\n      <ng-content></ng-content>\n      <div class=\"position-highlight\" style=\"display:none;\" #positionHighlight>\n        <div class=\"inner\"></div>\n      </div>\n    </div>",
                styles: ["\n    :host {\n        position: relative;\n        display: block;\n        left: 0;\n        width: 100%;\n    }\n\n    :host.gridster--dragging {\n        -moz-user-select: none;\n        -khtml-user-select: none;\n        -webkit-user-select: none;\n        -ms-user-select: none;\n        user-select: none;\n    }\n\n    .gridster-container {\n        position: relative;\n        width: 100%;\n        list-style: none;\n        -webkit-transition: width 0.2s, height 0.2s;\n        transition: width 0.2s, height 0.2s;\n    }\n\n    .position-highlight {\n        display: block;\n        position: absolute;\n        z-index: 1;\n    }\n    "],
                providers: [gridster_service_1.GridsterService],
                changeDetection: core_1.ChangeDetectionStrategy.OnPush
            },] },
];
GridsterComponent.ctorParameters = function () { return [
    { type: core_1.NgZone, },
    { type: core_1.ElementRef, },
    { type: gridster_service_1.GridsterService, },
    { type: gridster_prototype_service_1.GridsterPrototypeService, },
]; };
GridsterComponent.propDecorators = {
    'options': [{ type: core_1.Input },],
    'optionsChange': [{ type: core_1.Output },],
    'ready': [{ type: core_1.Output },],
    'reflow': [{ type: core_1.Output },],
    'draggableOptions': [{ type: core_1.Input },],
    '$positionHighlight': [{ type: core_1.ViewChild, args: ['positionHighlight',] },],
    'isDragging': [{ type: core_1.HostBinding, args: ['class.gridster--dragging',] },],
    'isResizing': [{ type: core_1.HostBinding, args: ['class.gridster--resizing',] },],
    'isReady': [{ type: core_1.HostBinding, args: ['class.gridster--ready',] },],
};
exports.GridsterComponent = GridsterComponent;
//# sourceMappingURL=gridster.component.js.map