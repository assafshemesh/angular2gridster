"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/distinctUntilChanged");
var GridsterOptions = (function () {
    function GridsterOptions(config) {
        var _this = this;
        this.defaults = {
            lanes: 5,
            direction: 'horizontal',
            widthHeightRatio: 1,
            shrink: false,
            responsiveView: true,
            dragAndDrop: true,
            resizable: false,
            useCSSTransforms: false,
            floating: true,
            tolerance: 'pointer'
        };
        this.responsiveOptions = [];
        this.breakpointsMap = {
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200
        };
        this.basicOptions = config;
        this.responsiveOptions = this.extendResponsiveOptions(config.responsiveOptions || []);
        this.change = Observable_1.Observable.merge(Observable_1.Observable.of(this.getOptionsByWidth(document.documentElement.clientWidth)), Observable_1.Observable.fromEvent(window, 'resize')
            .debounceTime(config.responsiveDebounce || 0)
            .map(function (event) { return _this.getOptionsByWidth(document.documentElement.clientWidth); }))
            .distinctUntilChanged(null, function (options) { return options.minWidth; });
    }
    GridsterOptions.prototype.getOptionsByWidth = function (width) {
        var i = 0;
        var options = Object.assign({}, this.defaults, this.basicOptions);
        while (this.responsiveOptions[i]) {
            if (this.responsiveOptions[i].minWidth <= width) {
                options = this.responsiveOptions[i];
            }
            i++;
        }
        return options;
    };
    GridsterOptions.prototype.extendResponsiveOptions = function (responsiveOptions) {
        var _this = this;
        return responsiveOptions
            .filter(function (options) { return options.breakpoint; })
            .map(function (options) {
            return Object.assign({
                minWidth: _this.breakpointsMap[options.breakpoint] || 0
            }, options);
        })
            .sort(function (curr, next) { return curr.minWidth - next.minWidth; })
            .map(function (options) { return Object.assign({}, _this.defaults, _this.basicOptions, options); });
    };
    return GridsterOptions;
}());
exports.GridsterOptions = GridsterOptions;
//# sourceMappingURL=GridsterOptions.js.map