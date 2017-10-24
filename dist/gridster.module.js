"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var gridster_component_1 = require("./gridster.component");
var gridster_item_component_1 = require("./gridster-item/gridster-item.component");
var gridster_item_prototype_directive_1 = require("./gridster-prototype/gridster-item-prototype.directive");
var gridster_prototype_service_1 = require("./gridster-prototype/gridster-prototype.service");
var GridsterModule = (function () {
    function GridsterModule() {
    }
    return GridsterModule;
}());
GridsterModule.decorators = [
    { type: core_1.NgModule, args: [{
                imports: [
                    common_1.CommonModule
                ],
                declarations: [
                    gridster_component_1.GridsterComponent,
                    gridster_item_component_1.GridsterItemComponent,
                    gridster_item_prototype_directive_1.GridsterItemPrototypeDirective
                ],
                exports: [
                    gridster_component_1.GridsterComponent,
                    gridster_item_component_1.GridsterItemComponent,
                    gridster_item_prototype_directive_1.GridsterItemPrototypeDirective
                ],
                providers: [
                    gridster_prototype_service_1.GridsterPrototypeService
                ]
            },] },
];
GridsterModule.ctorParameters = function () { return []; };
exports.GridsterModule = GridsterModule;
//# sourceMappingURL=gridster.module.js.map