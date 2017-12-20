# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.1.0"></a>
# [1.1.0](https://github.com/swiety85/angular2gridster/compare/v1.0.1...v1.1.0) (2017-12-13)


### Bug Fixes

* **demo:** fix wrong item position on prototype drop ([dde685c](https://github.com/swiety85/angular2gridster/commit/dde685c))
* **drag:** Fix exceptions when dropping item prototype with touch devices ([8053e01](https://github.com/swiety85/angular2gridster/commit/8053e01))
* **resize:** Fix initial bindings, when new item without data is added. ([7e0d0db](https://github.com/swiety85/angular2gridster/commit/7e0d0db)), closes [#158](https://github.com/swiety85/angular2gridster/issues/158)


### Features

* **demo:** Add "Remove all widgets" button to demo page ([aad2c09](https://github.com/swiety85/angular2gridster/commit/aad2c09))



<a name="1.0.1"></a>
# [1.0.1](https://github.com/swiety85/angular2gridster/compare/v1.0.0...v1.0.1) (2017-11-28)


### Bug Fixes

* **build:** fix build folder



<a name="1.0.0"></a>
# [1.0.0](https://github.com/swiety85/angular2gridster/compare/v1.0.0-alfa...v1.0.0) (2017-11-28)


### Bug Fixes

* **responsive:** Use responsive position properties for items added after gridster init ([20ddfe3](https://github.com/swiety85/angular2gridster/commit/20ddfe3)), closes [#116](https://github.com/swiety85/angular2gridster/issues/116)
* **scroll:** Use draggable options to enable/disable scroll on resize ([7345024](https://github.com/swiety85/angular2gridster/commit/7345024))
* **demo:** Remove directory demo/src/app/gridster/, add symlink ([06cc048](https://github.com/swiety85/angular2gridster/commit/06cc048))


### Features

* **resize:** configurable resize handlers ([f7f83b5](https://github.com/swiety85/angular2gridster/commit/f7f83b5)), closes [#135](https://github.com/swiety85/angular2gridster/issues/135)
* **scroll:** restrict scroll direction to gridster direction ([dabcf1a](https://github.com/swiety85/angular2gridster/commit/dabcf1a)), closes [#143](https://github.com/swiety85/angular2gridster/issues/143)



<a name="1.0.0-alfa"></a>
# [1.0.0-alfa]((https://github.com/swiety85/angular2gridster/compare/0.6.9...1.0.0-alfa)) (2017-11-19)


### Bug Fixes

* **drag:** Fix problem with focused el when dragging in IE. Issue #128

### Features

* **drag:** Provide tolerance for gridster config. Issue #71
* **drag:** Scroll container while dragging. Issue #27
* **drag:** Output bindings in gridster item on drag/resize start and end
* **resize:** Auto height for item. Issue #78



<a name="0.6.9"></a>
# [0.6.9]((https://github.com/swiety85/angular2gridster/compare/0.6.8...0.6.9)) (2017-11-04)


### Bug Fixes

* **api:** No binding update on item remove. Issue #120
* **performance** Remove unnecessary import of entirety of Rxjs

### Features

* **api** Add events when reflowing grid items. Issue #115



<a name="0.6.8"></a>
# [0.6.8]((https://github.com/swiety85/angular2gridster/compare/0.6.7...0.6.8)) (2017-10-16)


### Bug Fixes

* **drag:** Fix problem with scrolling on touch devices. Issue #111
* **drag** Fix drag position bug in scrolled container. Issue #114

### Features

* **drag** Options: direction: "none" and floating: false. Issue #109
* **performance** Disable initial animation. Issue #104
* **config** Provide option to set fixed cellWidth/cellHeight. Issue #91


<a name="0.6.7"></a>
# [0.6.7]((https://github.com/swiety85/angular2gridster/compare/0.6.6...0.6.7)) (2017-09-25)


### Bug Fixes

* **drag:** Fix problem with IE touch drag by touch-action css. Issue #72
* **performance** Prevent performance issues while dragging item with selected text inside
* **resize** Fix problem with assigning width/height to gridster element. Issue #85

### Features

* **performance** useCSSTransforms option for more effective moving rendering while dragging item
* **performance** Get rid of getBoundingRect in drag event


<a name="0.6.6"></a>
# [0.6.6]((https://github.com/swiety85/angular2gridster/compare/0.6.5...0.6.6)) (2017-08-27)


### Bug Fixes

* **drag:** Make dragging works when gridster is in scrollable element. Issue #21



<a name="0.6.5"></a>
# [0.6.5]((https://github.com/swiety85/angular2gridster/compare/0.6.4...0.6.5)) (2017-07-28)


### Bug Fixes

* **drag:** Update gridster element item on drag start
* **config:** Fix snap issue with new items and no responsive configuration
* **resize:** Fix problem with item resize when no maxWidth and maxHeight option



<a name="0.6.4"></a>
# [0.6.4]((https://github.com/swiety85/angular2gridster/compare/0.6.3...0.6.4)) (2017-07-28)


### Bug Fixes

* **deps:** Reorganise project deps - try to fix bug with angular-cli #57



<a name="0.6.3"></a>
# [0.6.3]((https://github.com/swiety85/angular2gridster/compare/0.6.2...0.6.3)) (2017-07-14)


### Bug Fixes

* **drag-drop:** fix problem with not working drag n drop events in angular 4.2.6



<a name="0.6.2"></a>
# [0.6.2]((https://github.com/swiety85/angular2gridster/compare/0.6.1...0.6.2)) (2017-07-13)


### Bug Fixes

* **drag-drop:** fix dragging new item (gridster-item-prototype) when it's placed in the area of gridster #64



<a name="0.6.1"></a>
# [0.6.1]((https://github.com/swiety85/angular2gridster/compare/0.6.0...0.6.1)) (2017-07-10)


### Bug Fixes

* **config:** fix default gridster options
* **responsiveness:** fix responsive behaviour on iPhones and iPads



<a name="0.6.0"></a>
# [0.6.0]((https://github.com/swiety85/angular2gridster/compare/0.5.3...0.6.0)) (2017-07-06)


### Bug Fixes

* **drag-drop:** solved problems with inputs in gridster-item container
* **drag-drop:** bug fix with fast dragging item from outside

### Features

* **config:** Gridster responsive behaviour
* **config:** different Gridster configuration for different breakpoints
* **drag-drop:** disabling/enabling moving item in gridster
* **resize:** disabling/enabling resizing item in gridster
* **api:** new change event on GridsterItem
* **config:** new GridsterItem options
* **deps:** update angular env to newest version
* **demo:** extend demo page
* **config:** shrink Gridster height to fit items



<a name="0.5.3"></a>
# [0.5.3]((https://github.com/swiety85/angular2gridster/compare/0.5.2...0.5.3)) (2017-05-16)


### Bug Fixes

* **drag-drop:** DnD ngOnInit gridster-item bug fix
* **api:** AOT fix for mismatching signature call

### Features

* **config:** Dynamic widthHeightRatio option change



<a name="0.5.2"></a>
# [0.5.2]((https://github.com/swiety85/angular2gridster/compare/0.5.1...0.5.2)) (2017-04-30)


### Bug Fixes

* **drag-drop:** item dragging position fix

### Features

* **doc** add System.js installation steps
* **demo** add polyfills to support older IE



<a name="0.5.1"></a>
# [0.5.1]((https://github.com/swiety85/angular2gridster/compare/0.5.0...0.5.1)) (2017-04-18)


### Bug Fixes

* **api:** fix two way binding and change event for "x", "y", "w", "h"


### Features

* **performance** Prevent detectChanges to be invoked while dragging
* **performance** Prevent detectChanges to be invoked while scrolling



<a name="0.5.0"></a>
# [0.5.0]((https://github.com/swiety85/angular2gridster/compare/0.4.1...0.5.0)) (2017-04-12)


### Bug Fixes

* **api:** fix two way binding and change event for "x" and "y"


### Features

* **resize** provide way to resize widgets by drag by every edge or corner
* **api** generate most suitable widget positions (x, y) if not given
* **api** provide two way binding and change event for "w" and "h"
* **config:** enable/disable drag n drop
* **config:** enable/disable resize
* **demo:** update demo to show resize
* **demo:** update demo to disable/enable dragging and resizing
* **demo:** update demo to push new widget without defined position



<a name="0.4.1"></a>
# [0.4.1]((https://github.com/swiety85/angular2gridster/compare/0.4.0...0.4.1)) (2017-04-01)


### Bug Fixes

* **api:** add missing dependecies


### Features

* **deps:** Add support for Angular 4



<a name="0.4.0"></a>
# [0.4.0]((https://github.com/swiety85/angular2gridster/compare/0.3.1...0.4.0)) (2017-03-20)


### Bug Fixes

* **css:** fix problem with drag and scroll on touch devieces
* **build:** recreate build env from scratch


### Features

* **drag-drop** provide directive that allows to add new widget to dashboard by dragging from outside
* **demo:** create Angular CLI demo 
* **demo:** extend demo to show drag widgets from outside
* **drag-drop:** reimplement drag n drop engine
* **api:** refactor API of gridster.service
* **api:** refactor API of gridster.component
* **api:** refactor API of gridser.item.component



<a name="0.3.1"></a>
# [0.3.1]((https://github.com/swiety85/angular2gridster/compare/0.3.0...0.3.1)) (2017-01-24)


### Bug Fixes

* **api** move IGridsterOptions and IGridsterDraggableOptions to separate files, closes [#9](https://github.com/swiety85/angular2gridster/issues/9)


<a name="0.3.0"></a>
# [0.3.0]((https://github.com/swiety85/angular2gridster/compare/0.2.3...0.3.0)) (2017-01-24)


### Bug Fixes

* **css:** move css of position-highlight outside of gridster component
* **css:** move inner item styles outside of gridster components
* **css:** fix position-highlight styles
* **demo:** fix demo styles
* **drag-drop:** fix problem of wrong mouse position when dragging and scrolling at once
* **api:** replace IGridListItem with GridsterItemComponent
* **api:** add isDragging property to GridsterItemComponent with class binding in template, instead of manipulating DOM
* **api:** remove GridList cloneItems method

### Features

* **config:** add possibility to set gridster draggable options from outside
* **config:** gridsterPositionChange Event Emmiter
* **config:** gridster item x,y two way databind
* **config:** add/remove gridster item
* **css:** set dynamic gridster container width and height set by service



<a name="0.2.3"></a>
# [0.2.3]((https://github.com/swiety85/angular2gridster/compare/0.2.2...0.2.3)) (2016-12-21)


### Bug Fixes

* **build:** fix demo - webpack server reload
* **deps:** fix issue with IGridsterOptions not found (https://github.com/swiety85/angular2gridster/issues/4)
* **config:** fix gridster item resize after position change



<a name="0.2.2"></a>
# [0.2.2](https://github.com/swiety85/angular2gridster/compare/0.2.0...0.2.2) (2016-12-11)


### Bug Fixes

* **build:** remove old Angular CLI dependencies in package.json
* **build:** fixes for build process

### Features

* **config:** add possibility to dynamically change gridster item size
* **config:** add possibility to dynamically change gridster configuration
* **demo:** add option to change size of gridster items
* **demo:** add option to change gridster direction (floating): vertical/horizontal
* **demo:** add option to change amount of gridster lines



<a name="0.2.0"></a>
# 0.2.0 (2016-12-03)


### Features

* **build:** Angular CLI build was replaced with custom webpack build
* **demo:** create demo app component 