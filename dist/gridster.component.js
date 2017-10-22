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
require("rxjs/add/operator/takeUntil");
require("rxjs/add/observable/fromEvent");
var gridster_service_1 = require("./gridster.service");
var gridster_prototype_service_1 = require("./gridster-prototype/gridster-prototype.service");
var GridsterOptions_1 = require("./GridsterOptions");
var GridsterComponent = (function () {
    function GridsterComponent(zone, elementRef, gridster, gridsterPrototype) {
        this.zone = zone;
        this.gridsterPrototype = gridsterPrototype;
        this.optionsChange = new core_1.EventEmitter();
        this.isDragging = false;
        this.isResizing = false;
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
    GridsterComponent.prototype.ngAfterViewInit = function () {
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
            this.gridster.reflow();
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
            _this.gridster.reflow();
        });
        return this;
    };
    GridsterComponent.prototype.updateGridsterElementData = function () {
        this.gridster.gridsterScrollData = this.getScrollPositionFromParents(this.$element);
        this.gridster.gridsterRect = this.$element.getBoundingClientRect();
    };
    GridsterComponent.prototype.getScrollPositionFromParents = function (element, data) {
        if (data === void 0) { data = { scrollTop: 0, scrollLeft: 0 }; }
        if (element.parentElement !== document.body) {
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
        this.gridsterPrototype.observeDragOver(this.gridster).dragOver
            .subscribe(function (prototype) {
            if (!isEntered) {
                return;
            }
            _this.gridster.onDrag(prototype.item);
        });
        this.gridsterPrototype.observeDragOver(this.gridster).dragEnter
            .subscribe(function (prototype) {
            isEntered = true;
            _this.gridster.items.push(prototype.item);
            _this.gridster.onStart(prototype.item);
        });
        this.gridsterPrototype.observeDragOver(this.gridster).dragOut
            .subscribe(function (prototype) {
            if (!isEntered) {
                return;
            }
            _this.gridster.onDragOut(prototype.item);
            isEntered = false;
        });
        dropOverObservable
            .subscribe(function (prototype) {
            if (!isEntered) {
                return;
            }
            _this.gridster.onStop(prototype.item);
            var idx = _this.gridster.items.indexOf(prototype.item);
            _this.gridster.items.splice(idx, 1);
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
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], GridsterComponent.prototype, "options", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridsterComponent.prototype, "optionsChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], GridsterComponent.prototype, "draggableOptions", void 0);
__decorate([
    core_1.ViewChild('positionHighlight'),
    __metadata("design:type", Object)
], GridsterComponent.prototype, "$positionHighlight", void 0);
__decorate([
    core_1.HostBinding('class.gridster--dragging'),
    __metadata("design:type", Object)
], GridsterComponent.prototype, "isDragging", void 0);
__decorate([
    core_1.HostBinding('class.gridster--resizing'),
    __metadata("design:type", Object)
], GridsterComponent.prototype, "isResizing", void 0);
GridsterComponent = __decorate([
    core_1.Component({
        selector: 'gridster',
        template: "<div class=\"gridster-container\">\n      <ng-content></ng-content>\n      <div class=\"position-highlight\" style=\"display:none;\" #positionHighlight>\n        <div class=\"inner\"></div>\n      </div>\n    </div>",
        styles: ["\n    :host {\n        position: relative;\n        display: block;\n        left: 0;\n        width: 100%;\n    }\n\n    :host.gridster--dragging {\n        -moz-user-select: none;\n        -khtml-user-select: none;\n        -webkit-user-select: none;\n        -ms-user-select: none;\n        user-select: none;\n    }\n\n    .gridster-container {\n        position: relative;\n        width: 100%;\n        list-style: none;\n        -webkit-transition: width 0.2s, height 0.2s;\n        transition: width 0.2s, height 0.2s;\n    }\n\n    .position-highlight {\n        display: block;\n        position: absolute;\n        z-index: 1;\n    }\n    "],
        providers: [gridster_service_1.GridsterService],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [core_1.NgZone,
        core_1.ElementRef, gridster_service_1.GridsterService,
        gridster_prototype_service_1.GridsterPrototypeService])
], GridsterComponent);
exports.GridsterComponent = GridsterComponent;
//# sourceMappingURL=gridster.component.js.map