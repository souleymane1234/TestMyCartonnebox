/*
 Highcharts JS v10.3.2 (2022-11-28)

 Annotations module

 (c) 2009-2021 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (c) { "object" === typeof module && module.exports ? (c["default"] = c, module.exports = c) : "function" === typeof define && define.amd ? define("highcharts/modules/annotations", ["highcharts"], function (t) { c(t); c.Highcharts = t; return c }) : c("undefined" !== typeof Highcharts ? Highcharts : void 0) })(function (c) {
    function t(c, l, w, n) { c.hasOwnProperty(l) || (c[l] = n.apply(null, w), "function" === typeof CustomEvent && window.dispatchEvent(new CustomEvent("HighchartsModuleLoaded", { detail: { path: l, module: c[l] } }))) } c = c ? c._modules : {};
    t(c, "Extensions/Annotations/AnnotationChart.js", [c["Core/Utilities.js"]], function (c) {
        function l(a, d) { a = this.initAnnotation(a); this.options.annotations.push(a.options); C(d, !0) && (a.redraw(), a.graphic.attr({ opacity: 1 })); return a } function p() {
            var a = this; a.plotBoxClip = this.renderer.clipRect(this.plotBox); a.controlPointsGroup = a.renderer.g("control-points").attr({ zIndex: 99 }).clip(a.plotBoxClip).add(); a.options.annotations.forEach(function (d, g) {
                if (!a.annotations.some(function (a) { return a.options === d })) {
                    var b =
                        a.initAnnotation(d); a.options.annotations[g] = b.options
                }
            }); a.drawAnnotations(); b(a, "redraw", a.drawAnnotations); b(a, "destroy", function () { a.plotBoxClip.destroy(); a.controlPointsGroup.destroy() }); b(a, "exportData", function (d) {
                var g = (this.options.exporting && this.options.exporting.csv || {}).columnHeaderFormatter, b = !d.dataRows[1].xValues, e = a.options.lang && a.options.lang.exportData && a.options.lang.exportData.annotationHeader, h = function (a) {
                    if (g) { var d = g(a); if (!1 !== d) return d } d = e + " " + a; return b ? {
                        columnTitle: d,
                        topLevelColumnTitle: d
                    } : d
                }, f = d.dataRows[0].length, C = a.options.exporting && a.options.exporting.csv && a.options.exporting.csv.annotations && a.options.exporting.csv.annotations.itemDelimiter, r = a.options.exporting && a.options.exporting.csv && a.options.exporting.csv.annotations && a.options.exporting.csv.annotations.join; a.annotations.forEach(function (a) {
                    a.options.labelOptions && a.options.labelOptions.includeInDataExport && a.labels.forEach(function (a) {
                        if (a.options.text) {
                            var g = a.options.text; a.points.forEach(function (a) {
                                var b =
                                    a.x, e = a.series.xAxis ? a.series.xAxis.options.index : -1, h = !1; if (-1 === e) { a = d.dataRows[0].length; for (var m = Array(a), q = 0; q < a; ++q)m[q] = ""; m.push(g); m.xValues = []; m.xValues[e] = b; d.dataRows.push(m); h = !0 } h || d.dataRows.forEach(function (a) { !h && a.xValues && void 0 !== e && b === a.xValues[e] && (r && a.length > f ? a[a.length - 1] += C + g : a.push(g), h = !0) }); if (!h) { a = d.dataRows[0].length; m = Array(a); for (q = 0; q < a; ++q)m[q] = ""; m[0] = b; m.push(g); m.xValues = []; void 0 !== e && (m.xValues[e] = b); d.dataRows.push(m) }
                            })
                        }
                    })
                }); var q = 0; d.dataRows.forEach(function (a) {
                    q =
                    Math.max(q, a.length)
                }); for (var c = q - d.dataRows[0].length, D = 0; D < c; D++) { var A = h(D + 1); b ? (d.dataRows[0].push(A.topLevelColumnTitle), d.dataRows[1].push(A.columnTitle)) : d.dataRows[0].push(A) }
            })
        } function n() { this.plotBoxClip.attr(this.plotBox); this.annotations.forEach(function (a) { a.redraw(); a.graphic.animate({ opacity: 1 }, a.animationConfig) }) } function k(a) {
            var b = this.annotations, h = "annotations" === a.coll ? a : d(b, function (d) { return d.options.id === a }); h && (g(h, "remove"), e(this.options.annotations, h.options), e(b,
                h), h.destroy())
        } function f() { this.annotations = []; this.options.annotations || (this.options.annotations = []) } function a(a) { this.chart.hasDraggedAnnotation || a.apply(this, Array.prototype.slice.call(arguments, 1)) } var b = c.addEvent, e = c.erase, d = c.find, g = c.fireEvent, C = c.pick, D = c.wrap, A = [], r; (function (d) {
            d.compose = function (d, g, e) {
                -1 === A.indexOf(g) && (A.push(g), b(g, "afterInit", f), g = g.prototype, g.addAnnotation = l, g.callbacks.push(p), g.collectionsWithInit.annotations = [l], g.collectionsWithUpdate.push("annotations"),
                    g.drawAnnotations = n, g.removeAnnotation = k, g.initAnnotation = function (a) { a = new (d.types[a.type] || d)(this, a); this.annotations.push(a); return a }); -1 === A.indexOf(e) && (A.push(e), D(e.prototype, "onContainerMouseDown", a))
            }
        })(r || (r = {})); return r
    }); t(c, "Extensions/Annotations/AnnotationDefaults.js", [c["Core/Utilities.js"]], function (c) {
        var l = c.defined; return {
            visible: !0, animation: {}, crop: !0, draggable: "xy", labelOptions: {
                align: "center", allowOverlap: !1, backgroundColor: "rgba(0, 0, 0, 0.75)", borderColor: "#000000", borderRadius: 3,
                borderWidth: 1, className: "highcharts-no-tooltip", crop: !1, formatter: function () { return l(this.y) ? "" + this.y : "Annotation label" }, includeInDataExport: !0, overflow: "justify", padding: 5, shadow: !1, shape: "callout", style: { fontSize: "11px", fontWeight: "normal", color: "contrast" }, useHTML: !1, verticalAlign: "bottom", x: 0, y: -16
            }, shapeOptions: { stroke: "rgba(0, 0, 0, 0.75)", strokeWidth: 1, fill: "rgba(0, 0, 0, 0.75)", r: 0, snap: 2 }, controlPointOptions: {
                events: {}, style: { cursor: "pointer", fill: "#ffffff", stroke: "#000000", "stroke-width": 2 },
                height: 10, symbol: "circle", visible: !1, width: 10
            }, events: {}, zIndex: 6
        }
    }); t(c, "Extensions/Annotations/EventEmitter.js", [c["Core/Globals.js"], c["Core/Utilities.js"]], function (c, l) {
        var p = c.doc, n = c.isTouchDevice, k = l.addEvent, f = l.fireEvent, a = l.objectEach, b = l.pick, e = l.removeEvent; return function () {
            function d() { } d.prototype.addEvents = function () {
                var d = this, b = function (a) { k(a, n ? "touchstart" : "mousedown", function (a) { d.onMouseDown(a) }, { passive: !1 }) }; b(this.graphic.element); (d.labels || []).forEach(function (a) {
                    a.options.useHTML &&
                    a.graphic.text && b(a.graphic.text.element)
                }); a(d.options.events, function (a, b) { var e = function (e) { "click" === b && d.cancelClick || a.call(d, d.chart.pointer.normalize(e), d.target) }; if (-1 === (d.nonDOMEvents || []).indexOf(b)) d.graphic.on(b, e); else k(d, b, e, { passive: !1 }) }); if (d.options.draggable && (k(d, "drag", d.onDrag), !d.graphic.renderer.styledMode)) {
                    var e = { cursor: { x: "ew-resize", y: "ns-resize", xy: "move" }[d.options.draggable] }; d.graphic.css(e); (d.labels || []).forEach(function (a) {
                        a.options.useHTML && a.graphic.text &&
                        a.graphic.text.css(e)
                    })
                } d.isUpdating || f(d, "add")
            }; d.prototype.destroy = function () { this.removeDocEvents(); e(this); this.hcEvents = null }; d.prototype.mouseMoveToRadians = function (a, d, b) { var e = a.prevChartY - b, g = a.prevChartX - d; b = a.chartY - b; a = a.chartX - d; this.chart.inverted && (d = g, g = e, e = d, d = a, a = b, b = d); return Math.atan2(b, a) - Math.atan2(e, g) }; d.prototype.mouseMoveToScale = function (a, d, b) { d = (a.chartX - d || 1) / (a.prevChartX - d || 1); a = (a.chartY - b || 1) / (a.prevChartY - b || 1); this.chart.inverted && (b = a, a = d, d = b); return { x: d, y: a } };
            d.prototype.mouseMoveToTranslation = function (a) { var d = a.chartX - a.prevChartX; a = a.chartY - a.prevChartY; if (this.chart.inverted) { var b = a; a = d; d = b } return { x: d, y: a } }; d.prototype.onDrag = function (a) {
                if (this.chart.isInsidePlot(a.chartX - this.chart.plotLeft, a.chartY - this.chart.plotTop, { visiblePlotOnly: !0 })) {
                    var d = this.mouseMoveToTranslation(a); "x" === this.options.draggable && (d.y = 0); "y" === this.options.draggable && (d.x = 0); this.points.length ? this.translate(d.x, d.y) : (this.shapes.forEach(function (a) {
                        return a.translate(d.x,
                            d.y)
                    }), this.labels.forEach(function (a) { return a.translate(d.x, d.y) })); this.redraw(!1)
                }
            }; d.prototype.onMouseDown = function (a) {
                a.preventDefault && a.preventDefault(); if (2 !== a.button) {
                    var d = this, e = d.chart.pointer; a = e.normalize(a); var g = a.chartX, c = a.chartY; d.cancelClick = !1; d.chart.hasDraggedAnnotation = !0; d.removeDrag = k(p, n ? "touchmove" : "mousemove", function (a) { d.hasDragged = !0; a = e.normalize(a); a.prevChartX = g; a.prevChartY = c; f(d, "drag", a); g = a.chartX; c = a.chartY }, n ? { passive: !1 } : void 0); d.removeMouseUp = k(p, n ? "touchend" :
                        "mouseup", function (a) { var e = b(d.target && d.target.annotation, d.target); e && (e.cancelClick = d.hasDragged); d.cancelClick = d.hasDragged; d.hasDragged = !1; d.chart.hasDraggedAnnotation = !1; f(b(e, d), "afterUpdate"); d.onMouseUp(a) }, n ? { passive: !1 } : void 0)
                }
            }; d.prototype.onMouseUp = function (a) { var d = this.chart; a = this.target || this; var b = d.options.annotations; d = d.annotations.indexOf(a); this.removeDocEvents(); b[d] = a.options }; d.prototype.removeDocEvents = function () {
                this.removeDrag && (this.removeDrag = this.removeDrag()); this.removeMouseUp &&
                    (this.removeMouseUp = this.removeMouseUp())
            }; return d
        }()
    }); t(c, "Extensions/Annotations/ControlPoint.js", [c["Extensions/Annotations/EventEmitter.js"], c["Core/Utilities.js"]], function (c, l) {
        var p = this && this.__extends || function () {
            var f = function (a, b) { f = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (a, d) { a.__proto__ = d } || function (a, d) { for (var b in d) d.hasOwnProperty(b) && (a[b] = d[b]) }; return f(a, b) }; return function (a, b) {
                function e() { this.constructor = a } f(a, b); a.prototype = null === b ? Object.create(b) :
                    (e.prototype = b.prototype, new e)
            }
        }(), n = l.merge, k = l.pick; c = function (f) {
            function a(a, e, d, g) { var b = f.call(this) || this; b.graphic = void 0; b.nonDOMEvents = ["drag"]; b.chart = a; b.target = e; b.options = d; b.index = k(d.index, g); return b } p(a, f); a.prototype.destroy = function () { f.prototype.destroy.call(this); this.graphic && (this.graphic = this.graphic.destroy()); this.options = this.target = this.chart = null }; a.prototype.redraw = function (a) { this.graphic[a ? "animate" : "attr"](this.options.positioner.call(this, this.target)) }; a.prototype.render =
                function () { var a = this.chart, e = this.options; this.graphic = a.renderer.symbol(e.symbol, 0, 0, e.width, e.height).add(a.controlPointsGroup).css(e.style); this.setVisibility(e.visible); this.addEvents() }; a.prototype.setVisibility = function (a) { this.graphic[a ? "show" : "hide"](); this.options.visible = a }; a.prototype.update = function (a) { var b = this.chart, d = this.target, g = this.index; a = n(!0, this.options, a); this.destroy(); this.constructor(b, d, a, g); this.render(b.controlPointsGroup); this.redraw() }; return a
        }(c); ""; return c
    });
    t(c, "Extensions/Annotations/MockPoint.js", [c["Core/Series/SeriesRegistry.js"], c["Core/Utilities.js"]], function (c, l) {
        var p = c.series.prototype, n = l.defined, k = l.fireEvent; c = function () {
            function f(a, b, e) { this.plotY = this.plotX = void 0; this.mock = !0; this.series = { visible: !0, chart: a, getPlotBox: p.getPlotBox }; this.target = b || null; this.options = e; this.applyOptions(this.getOptions()) } f.fromPoint = function (a) { return new f(a.series.chart, null, { x: a.x, y: a.y, xAxis: a.series.xAxis, yAxis: a.series.yAxis }) }; f.pointToPixels = function (a,
                b) { var e = a.series, d = e.chart, g = a.plotX || 0, f = a.plotY || 0; d.inverted && (a.mock ? (g = a.plotY, f = a.plotX) : (g = d.plotWidth - (a.plotY || 0), f = d.plotHeight - (a.plotX || 0))); e && !b && (a = e.getPlotBox(), g += a.translateX, f += a.translateY); return { x: g, y: f } }; f.pointToOptions = function (a) { return { x: a.x, y: a.y, xAxis: a.series.xAxis, yAxis: a.series.yAxis } }; f.prototype.applyOptions = function (a) { this.command = a.command; this.setAxis(a, "x"); this.setAxis(a, "y"); this.refresh() }; f.prototype.getLabelConfig = function () { return { x: this.x, y: this.y, point: this } };
            f.prototype.getOptions = function () { return this.hasDynamicOptions() ? this.options(this.target) : this.options }; f.prototype.hasDynamicOptions = function () { return "function" === typeof this.options }; f.prototype.isInsidePlot = function () { var a = this.plotX, b = this.plotY, e = this.series.xAxis, d = this.series.yAxis, g = { x: a, y: b, isInsidePlot: !0, options: {} }; e && (g.isInsidePlot = n(a) && 0 <= a && a <= e.len); d && (g.isInsidePlot = g.isInsidePlot && n(b) && 0 <= b && b <= d.len); k(this.series.chart, "afterIsInsidePlot", g); return g.isInsidePlot }; f.prototype.refresh =
                function () { var a = this.series, b = a.xAxis; a = a.yAxis; var e = this.getOptions(); b ? (this.x = e.x, this.plotX = b.toPixels(e.x, !0)) : (this.x = void 0, this.plotX = e.x); a ? (this.y = e.y, this.plotY = a.toPixels(e.y, !0)) : (this.y = null, this.plotY = e.y); this.isInside = this.isInsidePlot() }; f.prototype.refreshOptions = function () { var a = this.series, b = a.xAxis; a = a.yAxis; this.x = this.options.x = b ? this.options.x = b.toValue(this.plotX, !0) : this.plotX; this.y = this.options.y = a ? a.toValue(this.plotY, !0) : this.plotY }; f.prototype.rotate = function (a, b,
                    e) { if (!this.hasDynamicOptions()) { var d = Math.cos(e); e = Math.sin(e); var g = this.plotX - a, f = this.plotY - b; this.plotX = g * d - f * e + a; this.plotY = g * e + f * d + b; this.refreshOptions() } }; f.prototype.scale = function (a, b, e, d) { if (!this.hasDynamicOptions()) { var g = this.plotY * d; this.plotX = (1 - e) * a + this.plotX * e; this.plotY = (1 - d) * b + g; this.refreshOptions() } }; f.prototype.setAxis = function (a, b) { b += "Axis"; a = a[b]; var e = this.series.chart; this.series[b] = "object" === typeof a ? a : n(a) ? e[b][a] || e.get(a) : null }; f.prototype.toAnchor = function () {
                        var a =
                            [this.plotX, this.plotY, 0, 0]; this.series.chart.inverted && (a[0] = this.plotY, a[1] = this.plotX); return a
                    }; f.prototype.translate = function (a, b, e, d) { this.hasDynamicOptions() || (this.plotX += e, this.plotY += d, this.refreshOptions()) }; return f
        }(); ""; return c
    }); t(c, "Extensions/Annotations/Controllables/Controllable.js", [c["Extensions/Annotations/ControlPoint.js"], c["Extensions/Annotations/MockPoint.js"], c["Core/Tooltip.js"], c["Core/Utilities.js"]], function (c, l, w, n) {
        var k = n.isObject, f = n.isString, a = n.merge, b = n.splat;
        n = function () {
            function e(a, b, e, f) { this.graphic = void 0; this.annotation = a; this.chart = a.chart; this.collection = "label" === f ? "labels" : "shapes"; this.options = b; this.points = []; this.controlPoints = []; this.index = e; this.itemType = f; this.init(a, b, e) } e.prototype.addControlPoints = function () { var d = this, b = this.controlPoints, e = this.options.controlPoints || []; e.forEach(function (f, g) { f = a(d.options.controlPointOptions, f); f.index || (f.index = g); e[g] = f; b.push(new c(d.chart, d, f)) }) }; e.prototype.anchor = function (d) {
                var b = d.series.getPlotBox(),
                e = d.series.chart, f = d.mock ? d.toAnchor() : w.prototype.getAnchor.call({ chart: d.series.chart }, d); f = { x: f[0] + (this.options.x || 0), y: f[1] + (this.options.y || 0), height: f[2] || 0, width: f[3] || 0 }; return { relativePosition: f, absolutePosition: a(f, { x: f.x + (d.mock ? b.translateX : e.plotLeft), y: f.y + (d.mock ? b.translateY : e.plotTop) }) }
            }; e.prototype.attr = function () { for (var a = 0; a < arguments.length; a++); this.graphic.attr.apply(this.graphic, arguments) }; e.prototype.attrsFromOptions = function (a) {
                var d = this.constructor.attrsMap, b = {}, e =
                    this.chart.styledMode, f; for (f in a) { var c = d[f]; "undefined" === typeof d[f] || e && -1 !== ["fill", "stroke", "stroke-width"].indexOf(c) || (b[c] = a[f]) } return b
            }; e.prototype.destroy = function () { this.graphic && (this.graphic = this.graphic.destroy()); this.tracker && (this.tracker = this.tracker.destroy()); this.controlPoints.forEach(function (a) { return a.destroy() }); this.options = this.controlPoints = this.points = this.chart = null; this.annotation && (this.annotation = null) }; e.prototype.getPointsOptions = function () {
                var a = this.options;
                return a.points || a.point && b(a.point)
            }; e.prototype.init = function (a, b, e) { this.annotation = a; this.chart = a.chart; this.options = b; this.points = []; this.controlPoints = []; this.index = e; this.linkPoints(); this.addControlPoints() }; e.prototype.linkPoints = function () { var a = this.getPointsOptions(), b = this.points, e = a && a.length || 0, f; for (f = 0; f < e; f++) { var c = this.point(a[f], b[f]); if (!c) { b.length = 0; return } c.mock && c.refresh(); b[f] = c } return b }; e.prototype.point = function (a, b) {
                if (a && a.series) return a; b && null !== b.series || (k(a) ?
                    b = new l(this.chart, this, a) : f(a) ? b = this.chart.get(a) || null : "function" === typeof a && (b = a.call(b, this), b = b.series ? b : new l(this.chart, this, a))); return b
            }; e.prototype.render = function (a) { this.controlPoints.forEach(function (a) { return a.render() }) }; e.prototype.redraw = function (a) { this.controlPoints.forEach(function (d) { return d.redraw(a) }) }; e.prototype.rotate = function (a, b, e) { this.transform("rotate", a, b, e) }; e.prototype.scale = function (a, b, e, f) { this.transform("scale", a, b, e, f) }; e.prototype.setControlPointsVisibility =
                function (a) { this.controlPoints.forEach(function (b) { b.setVisibility(a) }) }; e.prototype.shouldBeDrawn = function () { return !!this.points.length }; e.prototype.transform = function (a, b, e, f, c) { var d = this; if (this.chart.inverted) { var h = b; b = e; e = h } this.points.forEach(function (h, g) { return d.transformPoint(a, b, e, f, c, g) }, this) }; e.prototype.transformPoint = function (a, b, e, f, c, r) { var d = this.points[r]; d.mock || (d = this.points[r] = l.fromPoint(d)); d[a](b, e, f, c) }; e.prototype.translate = function (a, b) {
                    this.transform("translate", null,
                        null, a, b)
                }; e.prototype.translatePoint = function (a, b, e) { this.transformPoint("translate", null, null, a, b, e) }; e.prototype.translateShape = function (a, b, e) { var d = this.annotation.chart, f = this.annotation.userOptions, c = d.annotations.indexOf(this.annotation); d = d.options.annotations[c]; this.translatePoint(a, b, 0); e && this.translatePoint(a, b, 1); d[this.collection][this.index].point = this.options.point; f[this.collection][this.index].point = this.options.point }; e.prototype.update = function (b) {
                    var d = this.annotation; b = a(!0,
                        this.options, b); var e = this.graphic.parentGroup; this.destroy(); this.constructor(d, b, this.index, this.itemType); this.render(e); this.redraw()
                }; return e
        }(); ""; return n
    }); t(c, "Extensions/Annotations/Controllables/ControllableDefaults.js", [], function () {
        return {
            defaultMarkers: {
                arrow: { tagName: "marker", attributes: { id: "arrow", refY: 5, refX: 9, markerWidth: 10, markerHeight: 10 }, children: [{ tagName: "path", attributes: { d: "M 0 0 L 10 5 L 0 10 Z", "stroke-width": 0 } }] }, "reverse-arrow": {
                    tagName: "marker", attributes: {
                        id: "reverse-arrow",
                        refY: 5, refX: 1, markerWidth: 10, markerHeight: 10
                    }, children: [{ tagName: "path", attributes: { d: "M 0 5 L 10 0 L 10 10 Z", "stroke-width": 0 } }]
                }
            }
        }
    }); t(c, "Extensions/Annotations/Controllables/ControllablePath.js", [c["Extensions/Annotations/Controllables/Controllable.js"], c["Extensions/Annotations/Controllables/ControllableDefaults.js"], c["Core/Globals.js"], c["Core/Utilities.js"]], function (c, l, w, n) {
        function k(a) { return function (b) { this.attr(a, "url(#" + b + ")") } } function f() {
            this.options.defs = D(e, this.options.defs ||
                {})
        } function a(a, b) { var d = { attributes: { id: a } }, e = { stroke: b.color || "none", fill: b.color || "rgba(0, 0, 0, 0.75)" }; d.children = b.children && b.children.map(function (a) { return D(e, a) }); b = D(!0, { attributes: { markerWidth: 20, markerHeight: 20, refX: 0, refY: 0, orient: "auto" } }, b, d); b = this.definition(b); b.id = a; return b } var b = this && this.__extends || function () {
            var a = function (b, d) {
                a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (a, b) { a.__proto__ = b } || function (a, b) { for (var d in b) b.hasOwnProperty(d) && (a[d] = b[d]) };
                return a(b, d)
            }; return function (b, d) { function e() { this.constructor = b } a(b, d); b.prototype = null === d ? Object.create(d) : (e.prototype = d.prototype, new e) }
        }(), e = l.defaultMarkers, d = n.addEvent, g = n.defined, C = n.extend, D = n.merge, A = n.uniqueKey, r = [], h = k("marker-end"), q = k("marker-start"), F = "rgba(192,192,192," + (w.svg ? .0001 : .002) + ")"; return function (e) {
            function c(a, b, d) { a = e.call(this, a, b, d, "shape") || this; a.type = "path"; return a } b(c, e); c.compose = function (b, e) {
                -1 === r.indexOf(b) && (r.push(b), d(b, "afterGetContainer", f)); -1 ===
                    r.indexOf(e) && (r.push(e), e.prototype.addMarker = a)
            }; c.prototype.toD = function () {
                var a = this.options.d; if (a) return "function" === typeof a ? a.call(this) : a; a = this.points; var b = a.length, d = [], e = b, f = a[0], c = e && this.anchor(f).absolutePosition, h = 0; if (c) for (d.push(["M", c.x, c.y]); ++h < b && e;)f = a[h], e = f.command || "L", c = this.anchor(f).absolutePosition, "M" === e ? d.push([e, c.x, c.y]) : "L" === e ? d.push([e, c.x, c.y]) : "Z" === e && d.push([e]), e = f.series.visible; return e && this.graphic ? this.chart.renderer.crispLine(d, this.graphic.strokeWidth()) :
                    null
            }; c.prototype.shouldBeDrawn = function () { return e.prototype.shouldBeDrawn.call(this) || !!this.options.d }; c.prototype.render = function (a) {
                var b = this.options, d = this.attrsFromOptions(b); this.graphic = this.annotation.chart.renderer.path([["M", 0, 0]]).attr(d).add(a); b.className && this.graphic.addClass(b.className); this.tracker = this.annotation.chart.renderer.path([["M", 0, 0]]).addClass("highcharts-tracker-line").attr({ zIndex: 2 }).add(a); this.annotation.chart.styledMode || this.tracker.attr({
                    "stroke-linejoin": "round",
                    stroke: F, fill: F, "stroke-width": this.graphic.strokeWidth() + 2 * b.snap
                }); e.prototype.render.call(this); C(this.graphic, { markerStartSetter: q, markerEndSetter: h }); this.setMarkers(this)
            }; c.prototype.redraw = function (a) { if (this.graphic) { var b = this.toD(), d = a ? "animate" : "attr"; b ? (this.graphic[d]({ d: b }), this.tracker[d]({ d: b })) : (this.graphic.attr({ d: "M 0 -9000000000" }), this.tracker.attr({ d: "M 0 -9000000000" })); this.graphic.placed = this.tracker.placed = !!b } e.prototype.redraw.call(this, a) }; c.prototype.setMarkers = function (a) {
                var b =
                    a.options, d = a.chart, e = d.options.defs, f = b.fill, c = g(f) && "none" !== f ? f : b.stroke;["markerStart", "markerEnd"].forEach(function (f) { var h = b[f], g; if (h) { for (g in e) { var m = e[g]; if ((h === (m.attributes && m.attributes.id) || h === m.id) && "marker" === m.tagName) { var q = m; break } } q && (h = a[f] = d.renderer.addMarker((b.id || A()) + "-" + h, D(q, { color: c })), a.attr(f, h.getAttribute("id"))) } })
            }; c.attrsMap = { dashStyle: "dashstyle", strokeWidth: "stroke-width", stroke: "stroke", fill: "fill", zIndex: "zIndex" }; return c
        }(c)
    }); t(c, "Extensions/Annotations/Controllables/ControllableRect.js",
        [c["Extensions/Annotations/Controllables/Controllable.js"], c["Extensions/Annotations/Controllables/ControllablePath.js"], c["Core/Utilities.js"]], function (c, l, w) {
            var n = this && this.__extends || function () {
                var f = function (a, b) { f = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (a, b) { a.__proto__ = b } || function (a, b) { for (var d in b) b.hasOwnProperty(d) && (a[d] = b[d]) }; return f(a, b) }; return function (a, b) {
                    function e() { this.constructor = a } f(a, b); a.prototype = null === b ? Object.create(b) : (e.prototype = b.prototype,
                        new e)
                }
            }(), k = w.merge; return function (f) {
                function a(a, e, d) { a = f.call(this, a, e, d, "shape") || this; a.type = "rect"; a.translate = f.prototype.translateShape; return a } n(a, f); a.prototype.render = function (a) { var b = this.attrsFromOptions(this.options); this.graphic = this.annotation.chart.renderer.rect(0, -9E9, 0, 0).attr(b).add(a); f.prototype.render.call(this) }; a.prototype.redraw = function (a) {
                    if (this.graphic) {
                        var b = this.anchor(this.points[0]).absolutePosition; if (b) this.graphic[a ? "animate" : "attr"]({
                            x: b.x, y: b.y, width: this.options.width,
                            height: this.options.height
                        }); else this.attr({ x: 0, y: -9E9 }); this.graphic.placed = !!b
                    } f.prototype.redraw.call(this, a)
                }; a.attrsMap = k(l.attrsMap, { width: "width", height: "height" }); return a
            }(c)
        }); t(c, "Extensions/Annotations/Controllables/ControllableCircle.js", [c["Extensions/Annotations/Controllables/Controllable.js"], c["Extensions/Annotations/Controllables/ControllablePath.js"], c["Core/Utilities.js"]], function (c, l, w) {
            var n = this && this.__extends || function () {
                var f = function (a, b) {
                    f = Object.setPrototypeOf || { __proto__: [] } instanceof
                    Array && function (a, b) { a.__proto__ = b } || function (a, b) { for (var d in b) b.hasOwnProperty(d) && (a[d] = b[d]) }; return f(a, b)
                }; return function (a, b) { function e() { this.constructor = a } f(a, b); a.prototype = null === b ? Object.create(b) : (e.prototype = b.prototype, new e) }
            }(), k = w.merge; return function (f) {
                function a(a, e, d) { a = f.call(this, a, e, d, "shape") || this; a.type = "circle"; a.translate = f.prototype.translateShape; return a } n(a, f); a.prototype.redraw = function (a) {
                    if (this.graphic) {
                        var b = this.anchor(this.points[0]).absolutePosition;
                        if (b) this.graphic[a ? "animate" : "attr"]({ x: b.x, y: b.y, r: this.options.r }); else this.graphic.attr({ x: 0, y: -9E9 }); this.graphic.placed = !!b
                    } f.prototype.redraw.call(this, a)
                }; a.prototype.render = function (a) { var b = this.attrsFromOptions(this.options); this.graphic = this.annotation.chart.renderer.circle(0, -9E9, 0).attr(b).add(a); f.prototype.render.call(this) }; a.prototype.setRadius = function (a) { this.options.r = a }; a.attrsMap = k(l.attrsMap, { r: "r" }); return a
            }(c)
        }); t(c, "Extensions/Annotations/Controllables/ControllableEllipse.js",
            [c["Extensions/Annotations/Controllables/Controllable.js"], c["Extensions/Annotations/Controllables/ControllablePath.js"], c["Core/Utilities.js"]], function (c, l, w) {
                var n = this && this.__extends || function () {
                    var a = function (b, e) { a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (a, b) { a.__proto__ = b } || function (a, b) { for (var d in b) b.hasOwnProperty(d) && (a[d] = b[d]) }; return a(b, e) }; return function (b, e) {
                        function d() { this.constructor = b } a(b, e); b.prototype = null === e ? Object.create(e) : (d.prototype = e.prototype,
                            new d)
                    }
                }(), k = w.merge, f = w.defined; return function (a) {
                    function b(b, d, f) { b = a.call(this, b, d, f, "shape") || this; b.type = "ellipse"; return b } n(b, a); b.prototype.init = function (b, d, c) { f(d.yAxis) && d.points.forEach(function (a) { a.yAxis = d.yAxis }); f(d.xAxis) && d.points.forEach(function (a) { a.xAxis = d.xAxis }); a.prototype.init.call(this, b, d, c) }; b.prototype.render = function (b) { this.graphic = this.annotation.chart.renderer.createElement("ellipse").attr(this.attrsFromOptions(this.options)).add(b); a.prototype.render.call(this) };
                    b.prototype.translate = function (b, d) { a.prototype.translateShape.call(this, b, d, !0) }; b.prototype.getDistanceFromLine = function (a, b, f, c) { return Math.abs((b.y - a.y) * f - (b.x - a.x) * c + b.x * a.y - b.y * a.x) / Math.sqrt((b.y - a.y) * (b.y - a.y) + (b.x - a.x) * (b.x - a.x)) }; b.prototype.getAttrs = function (a, b) { var d = a.x, e = a.y, f = b.x, c = b.y; b = (d + f) / 2; a = (e + c) / 2; var r = Math.sqrt((d - f) * (d - f) / 4 + (e - c) * (e - c) / 4); e = 180 * Math.atan((c - e) / (f - d)) / Math.PI; b < d && (e += 180); d = this.getRY(); return { cx: b, cy: a, rx: r, ry: d, angle: e } }; b.prototype.getRY = function () {
                        var a =
                            this.getYAxis(); return f(a) ? Math.abs(a.toPixels(this.options.ry) - a.toPixels(0)) : this.options.ry
                    }; b.prototype.getYAxis = function () { return this.chart.yAxis[this.options.yAxis] }; b.prototype.getAbsolutePosition = function (a) { return this.anchor(a).absolutePosition }; b.prototype.redraw = function (b) {
                        if (this.graphic) {
                            var d = this.getAbsolutePosition(this.points[0]), e = this.getAbsolutePosition(this.points[1]); e = this.getAttrs(d, e); if (d) this.graphic[b ? "animate" : "attr"]({
                                cx: e.cx, cy: e.cy, rx: e.rx, ry: e.ry, rotation: e.angle,
                                rotationOriginX: e.cx, rotationOriginY: e.cy
                            }); else this.graphic.attr({ x: 0, y: -9E9 }); this.graphic.placed = !!d
                        } a.prototype.redraw.call(this, b)
                    }; b.prototype.setYRadius = function (a) { var b = this.annotation.userOptions.shapes; this.options.ry = a; b && b[0] && (b[0].ry = a, b[0].ry = a) }; b.attrsMap = k(l.attrsMap, { ry: "ry" }); return b
                }(c)
            }); t(c, "Extensions/Annotations/Controllables/ControllableLabel.js", [c["Extensions/Annotations/Controllables/Controllable.js"], c["Core/FormatUtilities.js"], c["Extensions/Annotations/MockPoint.js"],
            c["Core/Tooltip.js"], c["Core/Utilities.js"]], function (c, l, w, n, k) {
                function f(a, b, e, f, c) { var h = c && c.anchorX; c = c && c.anchorY; var q = e / 2; if (d(h) && d(c)) { var r = [["M", h, c]]; var g = b - c; 0 > g && (g = -f - g); g < e && (q = h < a + e / 2 ? g : e - g); c > b + f ? r.push(["L", a + q, b + f]) : c < b ? r.push(["L", a + q, b]) : h < a ? r.push(["L", a, b + f / 2]) : h > a + e && r.push(["L", a + e, b + f / 2]) } return r || [] } var a = this && this.__extends || function () {
                    var a = function (b, d) {
                        a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (a, b) { a.__proto__ = b } || function (a, b) {
                            for (var d in b) b.hasOwnProperty(d) &&
                                (a[d] = b[d])
                        }; return a(b, d)
                    }; return function (b, d) { function e() { this.constructor = b } a(b, d); b.prototype = null === d ? Object.create(d) : (e.prototype = d.prototype, new e) }
                }(), b = l.format, e = k.extend, d = k.isNumber, g = k.pick, p = []; return function (d) {
                    function c(a, b, e) { return d.call(this, a, b, e, "label") || this } a(c, d); c.alignedPosition = function (a, b) {
                        var d = a.align, e = a.verticalAlign, f = (b.x || 0) + (a.x || 0), c = (b.y || 0) + (a.y || 0), h, g; "right" === d ? h = 1 : "center" === d && (h = 2); h && (f += (b.width - (a.width || 0)) / h); "bottom" === e ? g = 1 : "middle" === e &&
                            (g = 2); g && (c += (b.height - (a.height || 0)) / g); return { x: Math.round(f), y: Math.round(c) }
                    }; c.compose = function (a) { -1 === p.indexOf(a) && (p.push(a), a.prototype.symbols.connector = f) }; c.justifiedOptions = function (a, b, d, e) {
                        var f = d.align, c = d.verticalAlign, h = b.box ? 0 : b.padding || 0, g = b.getBBox(); b = { align: f, verticalAlign: c, x: d.x, y: d.y, width: b.width, height: b.height }; d = (e.x || 0) - a.plotLeft; e = (e.y || 0) - a.plotTop; var q = d + h; 0 > q && ("right" === f ? b.align = "left" : b.x = (b.x || 0) - q); q = d + g.width - h; q > a.plotWidth && ("left" === f ? b.align = "right" :
                            b.x = (b.x || 0) + a.plotWidth - q); q = e + h; 0 > q && ("bottom" === c ? b.verticalAlign = "top" : b.y = (b.y || 0) - q); q = e + g.height - h; q > a.plotHeight && ("top" === c ? b.verticalAlign = "bottom" : b.y = (b.y || 0) + a.plotHeight - q); return b
                    }; c.prototype.translatePoint = function (a, b) { d.prototype.translatePoint.call(this, a, b, 0) }; c.prototype.translate = function (a, b) {
                        var d = this.annotation.chart, e = this.annotation.userOptions, f = d.annotations.indexOf(this.annotation); f = d.options.annotations[f]; d.inverted && (d = a, a = b, b = d); this.options.x += a; this.options.y +=
                            b; f[this.collection][this.index].x = this.options.x; f[this.collection][this.index].y = this.options.y; e[this.collection][this.index].x = this.options.x; e[this.collection][this.index].y = this.options.y
                    }; c.prototype.render = function (a) {
                        var b = this.options, e = this.attrsFromOptions(b), f = b.style; this.graphic = this.annotation.chart.renderer.label("", 0, -9999, b.shape, null, null, b.useHTML, null, "annotation-label").attr(e).add(a); this.annotation.chart.styledMode || ("contrast" === f.color && (f.color = this.annotation.chart.renderer.getContrast(-1 <
                            c.shapesWithoutBackground.indexOf(b.shape) ? "#FFFFFF" : b.backgroundColor)), this.graphic.css(b.style).shadow(b.shadow)); b.className && this.graphic.addClass(b.className); this.graphic.labelrank = b.labelrank; d.prototype.render.call(this)
                    }; c.prototype.redraw = function (a) {
                        var e = this.options, f = this.text || e.format || e.text, c = this.graphic, g = this.points[0]; c ? (c.attr({ text: f ? b(String(f), g.getLabelConfig(), this.annotation.chart) : e.formatter.call(g, this) }), e = this.anchor(g), (f = this.position(e)) ? (c.alignAttr = f, f.anchorX =
                            e.absolutePosition.x, f.anchorY = e.absolutePosition.y, c[a ? "animate" : "attr"](f)) : c.attr({ x: 0, y: -9999 }), c.placed = !!f, d.prototype.redraw.call(this, a)) : this.redraw(a)
                    }; c.prototype.anchor = function (a) { var b = d.prototype.anchor.apply(this, arguments), e = this.options.x || 0, f = this.options.y || 0; b.absolutePosition.x -= e; b.absolutePosition.y -= f; b.relativePosition.x -= e; b.relativePosition.y -= f; return b }; c.prototype.position = function (a) {
                        var b = this.graphic, d = this.annotation.chart, f = this.points[0], k = this.options, l = a.absolutePosition,
                        r = a.relativePosition, p = f.series.visible && w.prototype.isInsidePlot.call(f); if (b && p) {
                            var u = b.width; a = void 0 === u ? 0 : u; u = b.height; var C = void 0 === u ? 0 : u; k.distance ? u = n.prototype.getPosition.call({ chart: d, distance: g(k.distance, 16) }, a, C, { plotX: r.x, plotY: r.y, negative: f.negative, ttBelow: f.ttBelow, h: r.height || r.width }) : k.positioner ? u = k.positioner.call(this) : (f = { x: l.x, y: l.y, width: 0, height: 0 }, u = c.alignedPosition(e(k, { width: a, height: C }), f), "justify" === this.options.overflow && (u = c.alignedPosition(c.justifiedOptions(d,
                                b, k, u), f))); k.crop && (b = u.x - d.plotLeft, k = u.y - d.plotTop, p = d.isInsidePlot(b, k) && d.isInsidePlot(b + a, k + C))
                        } return p ? u : null
                    }; c.attrsMap = { backgroundColor: "fill", borderColor: "stroke", borderWidth: "stroke-width", zIndex: "zIndex", borderRadius: "r", padding: "padding" }; c.shapesWithoutBackground = ["connector"]; return c
                }(c)
            }); t(c, "Extensions/Annotations/Controllables/ControllableImage.js", [c["Extensions/Annotations/Controllables/Controllable.js"], c["Extensions/Annotations/Controllables/ControllableLabel.js"]], function (c,
                l) {
                    var p = this && this.__extends || function () { var c = function (k, f) { c = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (a, b) { a.__proto__ = b } || function (a, b) { for (var e in b) b.hasOwnProperty(e) && (a[e] = b[e]) }; return c(k, f) }; return function (k, f) { function a() { this.constructor = k } c(k, f); k.prototype = null === f ? Object.create(f) : (a.prototype = f.prototype, new a) } }(); return function (c) {
                        function k(f, a, b) { f = c.call(this, f, a, b, "shape") || this; f.type = "image"; f.translate = c.prototype.translateShape; return f } p(k, c);
                        k.prototype.render = function (f) { var a = this.attrsFromOptions(this.options), b = this.options; this.graphic = this.annotation.chart.renderer.image(b.src, 0, -9E9, b.width, b.height).attr(a).add(f); this.graphic.width = b.width; this.graphic.height = b.height; c.prototype.render.call(this) }; k.prototype.redraw = function (f) {
                            if (this.graphic) { var a = this.anchor(this.points[0]); if (a = l.prototype.position.call(this, a)) this.graphic[f ? "animate" : "attr"]({ x: a.x, y: a.y }); else this.graphic.attr({ x: 0, y: -9E9 }); this.graphic.placed = !!a } c.prototype.redraw.call(this,
                                f)
                        }; k.attrsMap = { width: "width", height: "height", zIndex: "zIndex" }; return k
                    }(c)
            }); t(c, "Core/Chart/ChartNavigationComposition.js", [], function () { var c; (function (c) { c.compose = function (c) { c.navigation || (c.navigation = new l(c)); return c }; var l = function () { function c(c) { this.updates = []; this.chart = c } c.prototype.addUpdate = function (c) { this.chart.navigation.updates.push(c) }; c.prototype.update = function (c, f) { var a = this; this.updates.forEach(function (b) { b.call(a.chart, c, f) }) }; return c }(); c.Additions = l })(c || (c = {})); return c });
    t(c, "Extensions/Annotations/NavigationBindingsUtilities.js", [c["Core/Utilities.js"]], function (c) {
        var l = c.defined, p = c.isNumber, n = c.pick, k = { backgroundColor: "string", borderColor: "string", borderRadius: "string", color: "string", fill: "string", fontSize: "string", labels: "string", name: "string", stroke: "string", title: "string" }; return {
            annotationsFieldsTypes: k, getAssignedAxis: function (c) {
                return c.filter(function (a) {
                    var b = a.axis.getExtremes(), e = b.min; b = b.max; var d = n(a.axis.minPointOffset, 0); return p(e) && p(b) && a.value >=
                        e - d && a.value <= b + d && !a.axis.options.isInternal
                })[0]
            }, getFieldType: function (c, a) { c = k[c]; a = typeof a; l(c) && (a = c); return { string: "text", number: "number", "boolean": "checkbox" }[a] }
        }
    }); t(c, "Extensions/Annotations/NavigationBindingsDefaults.js", [c["Extensions/Annotations/NavigationBindingsUtilities.js"], c["Core/Utilities.js"]], function (c, l) {
        var p = c.getAssignedAxis, n = l.isNumber, k = l.merge; return {
            lang: {
                navigation: {
                    popup: {
                        simpleShapes: "Simple shapes", lines: "Lines", circle: "Circle", ellipse: "Ellipse", rectangle: "Rectangle",
                        label: "Label", shapeOptions: "Shape options", typeOptions: "Details", fill: "Fill", format: "Text", strokeWidth: "Line width", stroke: "Line color", title: "Title", name: "Name", labelOptions: "Label options", labels: "Labels", backgroundColor: "Background color", backgroundColors: "Background colors", borderColor: "Border color", borderRadius: "Border radius", borderWidth: "Border width", style: "Style", padding: "Padding", fontSize: "Font size", color: "Color", height: "Height", shapes: "Shape options"
                    }
                }
            }, navigation: {
                bindingsClassName: "highcharts-bindings-container",
                bindings: {
                    circleAnnotation: {
                        className: "highcharts-circle-annotation", start: function (c) { var a = this.chart.pointer.getCoordinates(c); c = p(a.xAxis); a = p(a.yAxis); var b = this.chart.options.navigation; if (c && a) return this.chart.addAnnotation(k({ langKey: "circle", type: "basicAnnotation", shapes: [{ type: "circle", point: { x: c.value, y: a.value, xAxis: c.axis.options.index, yAxis: a.axis.options.index }, r: 5 }] }, b.annotationsOptions, b.bindings.circleAnnotation.annotationsOptions)) }, steps: [function (c, a) {
                            var b = a.options.shapes;
                            b = b && b[0] && b[0].point || {}; if (n(b.xAxis) && n(b.yAxis)) { var e = this.chart.inverted; var d = this.chart.xAxis[b.xAxis].toPixels(b.x); b = this.chart.yAxis[b.yAxis].toPixels(b.y); e = Math.max(Math.sqrt(Math.pow(e ? b - c.chartX : d - c.chartX, 2) + Math.pow(e ? d - c.chartY : b - c.chartY, 2)), 5) } a.update({ shapes: [{ r: e }] })
                        }]
                    }, ellipseAnnotation: {
                        className: "highcharts-ellipse-annotation", start: function (c) {
                            var a = this.chart.pointer.getCoordinates(c); c = p(a.xAxis); a = p(a.yAxis); var b = this.chart.options.navigation; if (c && a) return this.chart.addAnnotation(k({
                                langKey: "ellipse",
                                type: "basicAnnotation", shapes: [{ type: "ellipse", xAxis: c.axis.options.index, yAxis: a.axis.options.index, points: [{ x: c.value, y: a.value }, { x: c.value, y: a.value }], ry: 1 }]
                            }, b.annotationsOptions, b.bindings.ellipseAnnotation.annotationOptions))
                        }, steps: [function (c, a) { a = a.shapes[0]; var b = a.getAbsolutePosition(a.points[1]); a.translatePoint(c.chartX - b.x, c.chartY - b.y, 1); a.redraw(!1) }, function (c, a) {
                            a = a.shapes[0]; var b = a.getAbsolutePosition(a.points[0]), e = a.getAbsolutePosition(a.points[1]); c = a.getDistanceFromLine(b,
                                e, c.chartX, c.chartY); b = a.getYAxis(); c = Math.abs(b.toValue(0) - b.toValue(c)); a.setYRadius(c); a.redraw(!1)
                        }]
                    }, rectangleAnnotation: {
                        className: "highcharts-rectangle-annotation", start: function (c) {
                            c = this.chart.pointer.getCoordinates(c); var a = p(c.xAxis), b = p(c.yAxis); if (a && b) {
                                c = a.value; var e = b.value; a = a.axis.options.index; b = b.axis.options.index; var d = this.chart.options.navigation; return this.chart.addAnnotation(k({
                                    langKey: "rectangle", type: "basicAnnotation", shapes: [{
                                        type: "path", points: [{
                                            xAxis: a, yAxis: b, x: c,
                                            y: e
                                        }, { xAxis: a, yAxis: b, x: c, y: e }, { xAxis: a, yAxis: b, x: c, y: e }, { xAxis: a, yAxis: b, x: c, y: e }, { command: "Z" }]
                                    }]
                                }, d.annotationsOptions, d.bindings.rectangleAnnotation.annotationsOptions))
                            }
                        }, steps: [function (c, a) { var b = a.options.shapes; b = b && b[0] && b[0].points || []; var e = this.chart.pointer.getCoordinates(c); c = p(e.xAxis); e = p(e.yAxis); c && e && (c = c.value, e = e.value, b[1].x = c, b[2].x = c, b[2].y = e, b[3].y = e, a.update({ shapes: [{ points: b }] })) }]
                    }, labelAnnotation: {
                        className: "highcharts-label-annotation", start: function (c) {
                            var a = this.chart.pointer.getCoordinates(c);
                            c = p(a.xAxis); a = p(a.yAxis); var b = this.chart.options.navigation; if (c && a) return this.chart.addAnnotation(k({ langKey: "label", type: "basicAnnotation", labelOptions: { format: "{y:.2f}" }, labels: [{ point: { xAxis: c.axis.options.index, yAxis: a.axis.options.index, x: c.value, y: a.value }, overflow: "none", crop: !0 }] }, b.annotationsOptions, b.bindings.labelAnnotation.annotationsOptions))
                        }
                    }
                }, events: {}, annotationsOptions: { animation: { defer: 0 } }
            }
        }
    }); t(c, "Extensions/Annotations/NavigationBindings.js", [c["Core/Chart/ChartNavigationComposition.js"],
    c["Core/Defaults.js"], c["Core/FormatUtilities.js"], c["Core/Globals.js"], c["Extensions/Annotations/NavigationBindingsDefaults.js"], c["Extensions/Annotations/NavigationBindingsUtilities.js"], c["Core/Utilities.js"]], function (c, l, w, n, k, f, a) {
        function b(a, b) { var c = z.Element.prototype, d = c.matches || c.msMatchesSelector || c.webkitMatchesSelector, e = null; if (c.closest) e = c.closest.call(a, b); else { do { if (d.call(a, b)) return a; a = a.parentElement || a.parentNode } while (null !== a && 1 === a.nodeType) } return e } function e() {
            this.chart.navigationBindings &&
            this.chart.navigationBindings.deselectAnnotation()
        } function d() { this.navigationBindings && this.navigationBindings.destroy() } function g() { var a = this.options; a && a.navigation && a.navigation.bindings && (this.navigationBindings = new L(this, a.navigation), this.navigationBindings.initEvents(), this.navigationBindings.initUpdate()) } function p() {
            var a = this.navigationBindings; if (this && a) {
                var b = !1; this.series.forEach(function (a) { !a.options.isInternal && a.visible && (b = !0) }); if (this.navigationBindings && this.navigationBindings.container &&
                    this.navigationBindings.container[0]) { var c = this.navigationBindings.container[0]; x(a.boundClassNames, function (a, d) { if (d = c.querySelectorAll("." + d)) for (var e = 0; e < d.length; e++) { var f = d[e], m = f.className; "normal" === a.noDataState ? -1 !== m.indexOf("highcharts-disabled-btn") && f.classList.remove("highcharts-disabled-btn") : b ? -1 !== m.indexOf("highcharts-disabled-btn") && f.classList.remove("highcharts-disabled-btn") : -1 === m.indexOf("highcharts-disabled-btn") && (f.className += " highcharts-disabled-btn") } }) }
            }
        } function D() { this.deselectAnnotation() }
        function A() { this.selectedButtonElement = null } function r(a) {
            var b = a.prototype.defaultOptions.events && a.prototype.defaultOptions.events.click; E(!0, a.prototype.defaultOptions.events, {
                click: function (a) {
                    var c = this, d = c.chart.navigationBindings, e = d.activeAnnotation; b && b.call(c, a); e !== c ? (d.deselectAnnotation(), d.activeAnnotation = c, c.setControlPointsVisibility(!0), u(d, "showPopup", {
                        annotation: c, formType: "annotation-toolbar", options: d.annotationToFields(c), onSubmit: function (a) {
                            if ("remove" === a.actionType) d.activeAnnotation =
                                !1, d.chart.removeAnnotation(c); else { var b = {}; d.fieldsToOptions(a.fields, b); d.deselectAnnotation(); a = b.typeOptions; "measure" === c.options.type && (a.crosshairY.enabled = 0 !== a.crosshairY.strokeWidth, a.crosshairX.enabled = 0 !== a.crosshairX.strokeWidth); c.update(b) }
                        }
                    })) : u(d, "closePopup"); a.activeAnnotation = !0
                }
            })
        } var h = l.setOptions, q = w.format, F = n.doc, z = n.win, G = f.getFieldType, y = a.addEvent, t = a.attr, u = a.fireEvent, H = a.isArray, B = a.isFunction, I = a.isNumber, J = a.isObject, E = a.merge, x = a.objectEach, m = a.pick, v = [], L = function () {
            function a(a,
                b) { this.selectedButton = this.boundClassNames = void 0; this.chart = a; this.options = b; this.eventsToUnbind = []; this.container = this.chart.container.getElementsByClassName(this.options.bindingsClassName || ""); this.container.length || (this.container = F.getElementsByClassName(this.options.bindingsClassName || "")) } a.compose = function (b, c) {
                    -1 === v.indexOf(b) && (v.push(b), y(b, "remove", e), r(b), x(b.types, function (a) { r(a) })); -1 === v.indexOf(c) && (v.push(c), y(c, "destroy", d), y(c, "load", g), y(c, "render", p)); -1 === v.indexOf(a) && (v.push(a),
                        y(a, "closePopup", D), y(a, "deselectButton", A)); -1 === v.indexOf(h) && (v.push(h), h(k))
                }; a.prototype.initEvents = function () {
                    var a = this, b = a.chart, c = a.container, d = a.options; a.boundClassNames = {}; x(d.bindings || {}, function (b) { a.boundClassNames[b.className] = b });[].forEach.call(c, function (b) { a.eventsToUnbind.push(y(b, "click", function (c) { var d = a.getButtonEvents(b, c); d && -1 === d.button.className.indexOf("highcharts-disabled-btn") && a.bindingsButtonClick(d.button, d.events, c) })) }); x(d.events || {}, function (b, c) {
                        B(b) && a.eventsToUnbind.push(y(a,
                            c, b, { passive: !1 }))
                    }); a.eventsToUnbind.push(y(b.container, "click", function (c) { !b.cancelClick && b.isInsidePlot(c.chartX - b.plotLeft, c.chartY - b.plotTop, { visiblePlotOnly: !0 }) && a.bindingsChartClick(this, c) })); a.eventsToUnbind.push(y(b.container, n.isTouchDevice ? "touchmove" : "mousemove", function (b) { a.bindingsContainerMouseMove(this, b) }, n.isTouchDevice ? { passive: !1 } : void 0))
                }; a.prototype.initUpdate = function () { var a = this; c.compose(this.chart).navigation.addUpdate(function (b) { a.update(b) }) }; a.prototype.bindingsButtonClick =
                    function (a, b, c) {
                        var d = this.chart, e = d.renderer.boxWrapper, f = !0; this.selectedButtonElement && (this.selectedButtonElement.classList === a.classList && (f = !1), u(this, "deselectButton", { button: this.selectedButtonElement }), this.nextEvent && (this.currentUserDetails && "annotations" === this.currentUserDetails.coll && d.removeAnnotation(this.currentUserDetails), this.mouseMoveEvent = this.nextEvent = !1)); f ? (this.selectedButton = b, this.selectedButtonElement = a, u(this, "selectButton", { button: a }), b.init && b.init.call(this, a, c),
                            (b.start || b.steps) && d.renderer.boxWrapper.addClass("highcharts-draw-mode")) : (d.stockTools && d.stockTools.toggleButtonActiveClass(a), e.removeClass("highcharts-draw-mode"), this.mouseMoveEvent = this.nextEvent = !1, this.selectedButton = null)
                    }; a.prototype.bindingsChartClick = function (a, c) {
                        a = this.chart; var d = this.activeAnnotation, e = this.selectedButton; a = a.renderer.boxWrapper; d && (d.cancelClick || c.activeAnnotation || !c.target.parentNode || b(c.target, ".highcharts-popup") ? d.cancelClick && setTimeout(function () {
                            d.cancelClick =
                            !1
                        }, 0) : u(this, "closePopup")); e && e.start && (this.nextEvent ? (this.nextEvent(c, this.currentUserDetails), this.steps && (this.stepIndex++, e.steps[this.stepIndex] ? this.mouseMoveEvent = this.nextEvent = e.steps[this.stepIndex] : (u(this, "deselectButton", { button: this.selectedButtonElement }), a.removeClass("highcharts-draw-mode"), e.end && e.end.call(this, c, this.currentUserDetails), this.mouseMoveEvent = this.nextEvent = !1, this.selectedButton = null))) : (this.currentUserDetails = e.start.call(this, c)) && e.steps ? (this.stepIndex =
                            0, this.steps = !0, this.mouseMoveEvent = this.nextEvent = e.steps[this.stepIndex]) : (u(this, "deselectButton", { button: this.selectedButtonElement }), a.removeClass("highcharts-draw-mode"), this.steps = !1, this.selectedButton = null, e.end && e.end.call(this, c, this.currentUserDetails)))
                    }; a.prototype.bindingsContainerMouseMove = function (a, b) { this.mouseMoveEvent && this.mouseMoveEvent(b, this.currentUserDetails) }; a.prototype.fieldsToOptions = function (a, b) {
                        x(a, function (a, c) {
                            var d = parseFloat(a), e = c.split("."), f = e.length - 1; !I(d) ||
                                a.match(/px/g) || c.match(/format/g) || (a = d); if ("undefined" !== a) { var h = b; e.forEach(function (b, c) { var d = m(e[c + 1], ""); f === c ? h[b] = a : (h[b] || (h[b] = d.match(/\d/g) ? [] : {}), h = h[b]) }) }
                        }); return b
                    }; a.prototype.deselectAnnotation = function () { this.activeAnnotation && (this.activeAnnotation.setControlPointsVisibility(!1), this.activeAnnotation = !1) }; a.prototype.annotationToFields = function (b) {
                        function c(a, d, e, m, h) {
                            if (e && a && -1 === g.indexOf(d) && (0 <= (e.indexOf && e.indexOf(d)) || e[d] || !0 === e)) if (H(a)) m[d] = [], a.forEach(function (a,
                                b) { J(a) ? (m[d][b] = {}, x(a, function (a, e) { c(a, e, f[d], m[d][b], d) })) : c(a, 0, f[d], m[d], d) }); else if (J(a)) { var v = {}; H(m) ? (m.push(v), v[d] = {}, v = v[d]) : m[d] = v; x(a, function (a, b) { c(a, b, 0 === d ? e : f[d], v, d) }) } else "format" === d ? m[d] = [q(a, b.labels[0].points[0]).toString(), "text"] : H(m) ? m.push([a, G(h, a)]) : m[d] = [a, G(d, a)]
                        } var d = b.options, e = a.annotationsEditable, f = e.nestedOptions, h = m(d.type, d.shapes && d.shapes[0] && d.shapes[0].type, d.labels && d.labels[0] && d.labels[0].type, "label"), g = a.annotationsNonEditable[d.langKey] || [], v =
                            { langKey: d.langKey, type: h }; x(d, function (a, b) { "typeOptions" === b ? (v[b] = {}, x(d[b], function (a, d) { c(a, d, f, v[b], d) })) : c(a, b, e[h], v, b) }); return v
                    }; a.prototype.getClickedClassNames = function (a, b) { var d = b.target; b = []; for (var c; d && ((c = t(d, "class")) && (b = b.concat(c.split(" ").map(function (a) { return [a, d] }))), d = d.parentNode, d !== a);); return b }; a.prototype.getButtonEvents = function (a, b) {
                        var d = this, c; this.getClickedClassNames(a, b).forEach(function (a) { d.boundClassNames[a[0]] && !c && (c = { events: d.boundClassNames[a[0]], button: a[1] }) });
                        return c
                    }; a.prototype.update = function (a) { this.options = E(!0, this.options, a); this.removeEvents(); this.initEvents() }; a.prototype.removeEvents = function () { this.eventsToUnbind.forEach(function (a) { return a() }) }; a.prototype.destroy = function () { this.removeEvents() }; a.annotationsEditable = {
                        nestedOptions: {
                            labelOptions: ["style", "format", "backgroundColor"], labels: ["style"], label: ["style"], style: ["fontSize", "color"], background: ["fill", "strokeWidth", "stroke"], innerBackground: ["fill", "strokeWidth", "stroke"], outerBackground: ["fill",
                                "strokeWidth", "stroke"], shapeOptions: ["fill", "strokeWidth", "stroke"], shapes: ["fill", "strokeWidth", "stroke"], line: ["strokeWidth", "stroke"], backgroundColors: [!0], connector: ["fill", "strokeWidth", "stroke"], crosshairX: ["strokeWidth", "stroke"], crosshairY: ["strokeWidth", "stroke"]
                        }, circle: ["shapes"], ellipse: ["shapes"], verticalLine: [], label: ["labelOptions"], measure: ["background", "crosshairY", "crosshairX"], fibonacci: [], tunnel: ["background", "line", "height"], pitchfork: ["innerBackground", "outerBackground"], rect: ["shapes"],
                        crookedLine: [], basicAnnotation: ["shapes", "labelOptions"]
                    }; a.annotationsNonEditable = { rectangle: ["crosshairX", "crosshairY", "labelOptions"], ellipse: ["labelOptions"], circle: ["labelOptions"] }; return a
        }(); ""; return L
    }); t(c, "Extensions/Annotations/Popup/PopupAnnotations.js", [c["Core/Globals.js"], c["Core/Utilities.js"]], function (c, l) {
        function p(d, c, l, r, h, q) {
            var F = this; if (c) {
                var z = this.addInput, G = this.lang, y, C; e(r, function (e, f) {
                    y = "" !== l ? l + "." + f : f; b(e) && (!a(e) || a(e) && b(e[0]) ? (C = G[f] || f, C.match(/\d/g) || h.push([!0,
                        C, d]), p.call(F, d, c, y, e, h, !1)) : h.push([F, y, "annotation", d, e]))
                }); q && (g(h, function (a) { return a[1].match(/format/g) ? -1 : 1 }), k && h.reverse(), h.forEach(function (a) { !0 === a[0] ? f("span", { className: "highcharts-annotation-title" }, void 0, a[2]).appendChild(n.createTextNode(a[1])) : (a[4] = { value: a[4][0], type: a[4][1] }, z.apply(a[0], a.splice(1))) }))
            }
        } var n = c.doc, k = c.isFirefox, f = l.createElement, a = l.isArray, b = l.isObject, e = l.objectEach, d = l.pick, g = l.stableSort; return {
            addForm: function (a, b, d, c) {
                if (a) {
                    var e = this.container,
                    g = this.lang, k = f("h2", { className: "highcharts-popup-main-title" }, void 0, e); k.appendChild(n.createTextNode(g[b.langKey] || b.langKey || "")); k = f("div", { className: "highcharts-popup-lhs-col highcharts-popup-lhs-full" }, void 0, e); var l = f("div", { className: "highcharts-popup-bottom-row" }, void 0, e); p.call(this, k, a, "", b, [], !0); this.addButton(l, c ? g.addButton || "Add" : g.saveButton || "Save", c ? "add" : "save", e, d)
                }
            }, addToolbar: function (a, b, c) {
                var e = this, g = this.lang, k = this.container, l = this.showForm; -1 === k.className.indexOf("highcharts-annotation-toolbar") &&
                    (k.className += " highcharts-annotation-toolbar"); a && (k.style.top = a.plotTop + 10 + "px"); f("span", void 0, void 0, k).appendChild(n.createTextNode(d(g[b.langKey] || b.langKey, b.shapes && b.shapes[0].type, ""))); var p = this.addButton(k, g.removeButton || "Remove", "remove", k, c); p.className += " highcharts-annotation-remove-button"; p.style["background-image"] = "url(" + this.iconsURL + "destroy.svg)"; p = this.addButton(k, g.editButton || "Edit", "edit", k, function () { l.call(e, "annotation-edit", a, b, c) }); p.className += " highcharts-annotation-edit-button";
                p.style["background-image"] = "url(" + this.iconsURL + "edit.svg)"
            }
        }
    }); t(c, "Extensions/Annotations/Popup/PopupIndicators.js", [c["Core/Renderer/HTML/AST.js"], c["Core/Globals.js"], c["Extensions/Annotations/NavigationBindingsUtilities.js"], c["Core/Series/SeriesRegistry.js"], c["Core/Utilities.js"]], function (c, l, t, n, k) {
        function f(a) {
            var b = z("div", { className: "highcharts-popup-lhs-col" }, void 0, a); a = z("div", { className: "highcharts-popup-rhs-col" }, void 0, a); z("div", { className: "highcharts-popup-rhs-col-wrapper" },
                void 0, a); return { lhsCol: b, rhsCol: a }
        } function a(a, d, e, f) {
            var m = this, g = m.lang, x = d.querySelectorAll(".highcharts-popup-lhs-col")[0]; d = d.querySelectorAll(".highcharts-popup-rhs-col")[0]; var k = "edit" === e; e = k ? a.series : a.options.plotOptions || {}; if (a || !e) {
                var l, q = []; k || y(e) ? y(e) && (q = w.call(this, e)) : q = p.call(this, e, f); H(q, function (a, b) { a = a.indicatorFullName.toLowerCase(); b = b.indicatorFullName.toLowerCase(); return a < b ? -1 : a > b ? 1 : 0 }); x.children[1] && x.children[1].remove(); var n = z("ul", { className: "highcharts-indicator-list" },
                    void 0, x), E = d.querySelectorAll(".highcharts-popup-rhs-col-wrapper")[0]; q.forEach(function (d) {
                        var e = d.indicatorFullName, f = d.indicatorType, g = d.series; l = z("li", { className: "highcharts-indicator-list" }, void 0, n); l.appendChild(h.createTextNode(e));["click", "touchstart"].forEach(function (d) {
                            F(l, d, function () {
                                var d = E.parentNode.children[1], e = g.params || g.options.params; E.innerHTML = c.emptyHTML; z("h3", { className: "highcharts-indicator-title" }, void 0, E).appendChild(h.createTextNode(A(g, f).indicatorFullName)); z("input",
                                    { type: "hidden", name: "highcharts-type-" + f, value: f }, void 0, E); r.call(m, f, "series", a, E, g, g.linkedParent && g.linkedParent.options.id); e.volumeSeriesID && r.call(m, f, "volume", a, E, g, g.linkedParent && e.volumeSeriesID); b.call(m, a, "params", e, f, E); d && (d.style.display = "block"); k && g.options && z("input", { type: "hidden", name: "highcharts-id-" + f, value: g.options.id }, void 0, E).setAttribute("highcharts-data-series-id", g.options.id)
                            })
                        })
                    }); 0 < n.childNodes.length ? n.childNodes[0].click() : k || (c.setElementHTML(E.parentNode.children[0],
                        g.noFilterMatch || ""), E.parentNode.children[1].style.display = "none")
            }
        } function b(a, c, e, f, v) { var m = this; if (a) { var h = this.addInput; u(e, function (e, k) { var x = c + "." + k; G(e) && x && (K(e) && (h.call(m, x, f, v, {}), b.call(m, a, x, e, f, v)), x in B ? (x = d.call(m, f, x, v), g.call(m, a, c, x, f, k, e)) : "params.volumeSeriesID" === x || y(e) || h.call(m, x, f, v, { value: e, type: "number" })) }) } } function e(b, d) {
            var c = this, e = d.querySelectorAll(".highcharts-popup-lhs-col")[0]; d = this.lang.clearFilter; e = z("div", { className: "highcharts-input-wrapper" }, void 0,
                e); var f = this.addInput("searchIndicators", "input", e, { value: "", type: "text", htmlFor: "search-indicators", labelClassName: "highcharts-input-search-indicators-label" }), g = z("a", { textContent: d }, void 0, e); f.classList.add("highcharts-input-search-indicators"); g.classList.add("clear-filter-button"); F(f, "input", function (d) { a.call(c, b, c.container, "add", this.value); g.style.display = this.value.length ? "inline-block" : "none" });["click", "touchstart"].forEach(function (d) {
                    F(g, d, function () {
                        f.value = ""; a.call(c, b, c.container,
                            "add", ""); g.style.display = "none"
                    })
                })
        } function d(a, b, d) { var c = b.split("."); c = c[c.length - 1]; a = "highcharts-" + b + "-type-" + a; var e = this.lang; z("label", { htmlFor: a }, null, d).appendChild(h.createTextNode(e[c] || b)); d = z("select", { name: a, className: "highcharts-popup-field", id: "highcharts-select-" + b }, null, d); d.setAttribute("id", "highcharts-select-" + b); return d } function g(a, b, d, c, e, f, g) {
            "series" === b || "volume" === b ? a.series.forEach(function (a) {
                var c = a.options, e = c.name || c.params ? a.name : c.id || ""; "highcharts-navigator-series" !==
                    c.id && c.id !== (g && g.options && g.options.id) && (G(f) || "volume" !== b || "column" !== a.type || (f = c.id), z("option", { value: c.id }, void 0, d).appendChild(h.createTextNode(e)))
            }) : c && e && I[e + "-" + c].forEach(function (a) { z("option", { value: a }, void 0, d).appendChild(h.createTextNode(a)) }); G(f) && (d.value = f)
        } function p(a, b) {
            var d = this.chart && this.chart.options.lang, c = d && d.navigation && d.navigation.popup && d.navigation.popup.indicatorAliases, e = [], f; u(a, function (a, d) {
                var m = a && a.options; if (a.params || m && m.params) if (m = A(a, d), d = m.indicatorFullName,
                    m = m.indicatorType, b) { var g = b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); g = new RegExp(g, "i"); var h = c && c[m] && c[m].join(" ") || ""; if (d.match(g) || h.match(g)) f = { indicatorFullName: d, indicatorType: m, series: a }, e.push(f) } else f = { indicatorFullName: d, indicatorType: m, series: a }, e.push(f)
            }); return e
        } function w(a) { var b = []; a.forEach(function (a) { a.is("sma") && b.push({ indicatorFullName: a.name, indicatorType: a.type, series: a }) }); return b } function A(a, b) {
            var d = a.options, c = q[b] && q[b].prototype.nameBase || b.toUpperCase(); d && d.type &&
                (b = a.options.type, c = a.name); return { indicatorFullName: c, indicatorType: b }
        } function r(a, b, c, e, f, h) { c && (a = d.call(this, a, b, e), g.call(this, c, b, a, void 0, void 0, void 0, f), G(h) && (a.value = h)) } var h = l.doc, q = n.seriesTypes, F = k.addEvent, z = k.createElement, G = k.defined, y = k.isArray, K = k.isObject, u = k.objectEach, H = k.stableSort, B; (function (a) { a[a["params.algorithm"] = 0] = "params.algorithm"; a[a["params.average"] = 1] = "params.average" })(B || (B = {})); var I = {
            "algorithm-pivotpoints": ["standard", "fibonacci", "camarilla"], "average-disparityindex": ["sma",
                "ema", "dema", "tema", "wma"]
        }; return {
            addForm: function (b, d, c) {
                d = this.lang; if (b) {
                    this.tabs.init.call(this, b); var m = this.container.querySelectorAll(".highcharts-tab-item-content"); f(m[0]); e.call(this, b, m[0]); a.call(this, b, m[0], "add"); var g = m[0].querySelectorAll(".highcharts-popup-rhs-col")[0]; this.addButton(g, d.addButton || "add", "add", g, c); f(m[1]); a.call(this, b, m[1], "edit"); g = m[1].querySelectorAll(".highcharts-popup-rhs-col")[0]; this.addButton(g, d.saveButton || "save", "edit", g, c); this.addButton(g, d.removeButton ||
                        "remove", "remove", g, c)
                }
            }, getAmount: function () { var a = 0; this.series.forEach(function (b) { (b.params || b.options.params) && a++ }); return a }
        }
    }); t(c, "Extensions/Annotations/Popup/PopupTabs.js", [c["Core/Globals.js"], c["Core/Utilities.js"]], function (c, l) {
        function p() { return e("div", { className: "highcharts-tab-item-content highcharts-no-mousewheel" }, void 0, this.container) } function n(b, c) {
            var d = this.container, f = this.lang, g = "highcharts-tab-item"; 0 === c && (g += " highcharts-tab-disabled"); c = e("span", { className: g }, void 0,
                d); c.appendChild(a.createTextNode(f[b + "Button"] || b)); c.setAttribute("highcharts-data-tab-type", b); return c
        } function k(a, b) { var d = this.container.querySelectorAll(".highcharts-tab-item-content"); a.className += " highcharts-tab-item-active"; d[b].className += " highcharts-tab-item-show" } function f(a) {
            var d = this; this.container.querySelectorAll(".highcharts-tab-item").forEach(function (c, e) {
                0 === a && "edit" === c.getAttribute("highcharts-data-tab-type") || ["click", "touchstart"].forEach(function (a) {
                    b(c, a, function () {
                        var a =
                            d.container, b = a.querySelectorAll(".highcharts-tab-item"); a = a.querySelectorAll(".highcharts-tab-item-content"); for (var c = 0; c < b.length; c++)b[c].classList.remove("highcharts-tab-item-active"), a[c].classList.remove("highcharts-tab-item-show"); k.call(d, this, e)
                    })
                })
            })
        } var a = c.doc, b = l.addEvent, e = l.createElement; return { init: function (a) { if (a) { a = this.indicators.getAmount.call(a); var b = n.call(this, "add"); n.call(this, "edit", a); p.call(this); p.call(this); f.call(this, a); k.call(this, b, 0) } } }
    }); t(c, "Extensions/Annotations/Popup/Popup.js",
        [c["Core/Renderer/HTML/AST.js"], c["Core/Defaults.js"], c["Core/Globals.js"], c["Extensions/Annotations/Popup/PopupAnnotations.js"], c["Extensions/Annotations/Popup/PopupIndicators.js"], c["Extensions/Annotations/Popup/PopupTabs.js"], c["Core/Utilities.js"]], function (c, l, t, n, k, f, a) {
            function b(a, b) {
                var c = Array.prototype.slice.call(a.querySelectorAll("input")), d = Array.prototype.slice.call(a.querySelectorAll("select")), e = a.querySelectorAll("#highcharts-select-series > option:checked")[0]; a = a.querySelectorAll("#highcharts-select-volume > option:checked")[0];
                var f = { actionType: b, linkedTo: e && e.getAttribute("value") || "", fields: {} }; c.forEach(function (a) { var b = a.getAttribute("highcharts-data-name"); a.getAttribute("highcharts-data-series-id") ? f.seriesId = a.value : b ? f.fields[b] = a.value : f.type = a.value }); d.forEach(function (a) { var b = a.id; "highcharts-select-series" !== b && "highcharts-select-volume" !== b && (b = b.split("highcharts-select-")[1], f.fields[b] = a.value) }); a && (f.fields["params.volumeSeriesID"] = a.getAttribute("value") || ""); return f
            } var e = l.getOptions, d = t.doc, g =
                a.addEvent, p = a.createElement; l = a.extend; var w = a.fireEvent, A = a.pick; a = function () {
                    function a(a, b, c) { this.chart = c; this.iconsURL = b; this.lang = e().lang.navigation.popup; this.container = p("div", { className: "highcharts-popup highcharts-no-tooltip" }, void 0, a); g(this.container, "mousedown", function () { var a = c && c.navigationBindings && c.navigationBindings.activeAnnotation; if (a) { a.cancelClick = !0; var b = g(t.doc, "click", function () { setTimeout(function () { a.cancelClick = !1 }, 0); b() }) } }); this.addCloseBtn() } a.prototype.init =
                        function (b, c, d) { a.call(this, b, c, d) }; a.prototype.addCloseBtn = function () { var a = this, b = this.iconsURL, c = p("div", { className: "highcharts-popup-close" }, void 0, this.container); c.style["background-image"] = "url(" + (b.match(/png|svg|jpeg|jpg|gif/ig) ? b : b + "close.svg") + ")";["click", "touchstart"].forEach(function (b) { g(c, b, function () { if (a.chart) { var b = a.chart.navigationBindings; w(b, "closePopup"); b && b.selectedButtonElement && w(b, "deselectButton", { button: b.selectedButtonElement }) } else a.closePopup() }) }) }; a.prototype.addInput =
                            function (a, b, c, e) { var f = a.split("."); f = f[f.length - 1]; var g = this.lang; b = "highcharts-" + b + "-" + A(e.htmlFor, f); b.match(/\d/g) || p("label", { htmlFor: b, className: e.labelClassName }, void 0, c).appendChild(d.createTextNode(g[f] || f)); c = p("input", { name: b, value: e.value, type: e.type, className: "highcharts-popup-field" }, void 0, c); c.setAttribute("highcharts-data-name", a); return c }; a.prototype.addButton = function (a, c, e, f, k) {
                                var h = this, l = p("button", void 0, void 0, a); l.appendChild(d.createTextNode(c)); k && ["click", "touchstart"].forEach(function (a) {
                                    g(l,
                                        a, function () { h.closePopup(); return k(b(f, e)) })
                                }); return l
                            }; a.prototype.showPopup = function () { var a = this.container, b = a.querySelectorAll(".highcharts-popup-close")[0]; this.formType = void 0; a.innerHTML = c.emptyHTML; 0 <= a.className.indexOf("highcharts-annotation-toolbar") && (a.classList.remove("highcharts-annotation-toolbar"), a.removeAttribute("style")); a.appendChild(b); a.style.display = "block"; a.style.height = "" }; a.prototype.closePopup = function () { this.container.style.display = "none" }; a.prototype.showForm = function (a,
                                b, c, d) { b && (this.showPopup(), "indicators" === a && this.indicators.addForm.call(this, b, c, d), "annotation-toolbar" === a && this.annotations.addToolbar.call(this, b, c, d), "annotation-edit" === a && this.annotations.addForm.call(this, b, c, d), "flag" === a && this.annotations.addForm.call(this, b, c, d, !0), this.formType = a, this.container.style.height = this.container.offsetHeight + "px") }; return a
                }(); l(a.prototype, { annotations: n, indicators: k, tabs: f }); return a
        }); t(c, "Extensions/Annotations/Popup/PopupComposition.js", [c["Extensions/Annotations/Popup/Popup.js"],
        c["Core/Utilities.js"]], function (c, l) {
            function p() { this.popup && this.popup.closePopup() } function n(a) { this.popup || (this.popup = new c(this.chart.container, this.chart.options.navigation.iconsURL || this.chart.options.stockTools && this.chart.options.stockTools.gui.iconsURL || "https://code.highcharts.com/10.3.2/gfx/stock-icons/", this.chart)); this.popup.showForm(a.formType, this.chart, a.options, a.onSubmit) } function k(a, b) {
                this.inClass(b.target, "highcharts-popup") || a.apply(this, Array.prototype.slice.call(arguments,
                    1))
            } var f = l.addEvent, a = l.wrap, b = []; return { compose: function (c, d) { -1 === b.indexOf(c) && (b.push(c), f(c, "closePopup", p), f(c, "showPopup", n)); -1 === b.indexOf(d) && (b.push(d), a(d.prototype, "onContainerMouseDown", k)) } }
        }); t(c, "Extensions/Annotations/Annotation.js", [c["Core/Animation/AnimationUtilities.js"], c["Extensions/Annotations/AnnotationChart.js"], c["Extensions/Annotations/AnnotationDefaults.js"], c["Extensions/Annotations/Controllables/Controllable.js"], c["Extensions/Annotations/Controllables/ControllableRect.js"],
        c["Extensions/Annotations/Controllables/ControllableCircle.js"], c["Extensions/Annotations/Controllables/ControllableEllipse.js"], c["Extensions/Annotations/Controllables/ControllablePath.js"], c["Extensions/Annotations/Controllables/ControllableImage.js"], c["Extensions/Annotations/Controllables/ControllableLabel.js"], c["Extensions/Annotations/ControlPoint.js"], c["Extensions/Annotations/EventEmitter.js"], c["Extensions/Annotations/MockPoint.js"], c["Extensions/Annotations/NavigationBindings.js"], c["Extensions/Annotations/Popup/PopupComposition.js"],
        c["Core/Utilities.js"]], function (c, l, t, n, k, f, a, b, e, d, g, C, D, A, r, h) {
            function p(a) { var b = a.graphic; a = a.points.some(function (a) { return !1 !== a.series.visible && !1 !== a.visible }); b && (a ? "hidden" === b.visibility && b.show() : b.hide()) } function w(a, b) { var c = {};["labels", "shapes"].forEach(function (d) { var e = a[d]; e && (c[d] = b[d] ? J(b[d]).map(function (a, b) { return B(e[b], a) }) : a[d]) }); return c } var z = this && this.__extends || function () {
                var a = function (b, c) {
                    a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (a, b) {
                        a.__proto__ =
                        b
                    } || function (a, b) { for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]) }; return a(b, c)
                }; return function (b, c) { function d() { this.constructor = b } a(b, c); b.prototype = null === c ? Object.create(c) : (d.prototype = c.prototype, new d) }
            }(), G = c.getDeferredAnimation, y = n.prototype, K = h.destroyObjectProperties, u = h.erase, H = h.fireEvent, B = h.merge, I = h.pick, J = h.splat; c = function (c) {
                function h(a, b) {
                    var d = c.call(this) || this; d.annotation = void 0; d.coll = "annotations"; d.collection = void 0; d.animationConfig = void 0; d.graphic = void 0; d.group =
                        void 0; d.labelCollector = void 0; d.labelsGroup = void 0; d.shapesGroup = void 0; d.chart = a; d.points = []; d.controlPoints = []; d.coll = "annotations"; d.labels = []; d.shapes = []; d.options = B(d.defaultOptions, b); d.userOptions = b; b = w(d.options, b); d.options.labels = b.labels; d.options.shapes = b.shapes; d.init(a, d.options); return d
                } z(h, c); h.compose = function (a, c, e) { l.compose(h, a, c); d.compose(e); b.compose(a, e); A.compose(h, a); r.compose(A, c) }; h.prototype.addClipPaths = function () {
                    this.setClipAxes(); this.clipXAxis && this.clipYAxis &&
                        this.options.crop && (this.clipRect = this.chart.renderer.clipRect(this.getClipBox()))
                }; h.prototype.addLabels = function () { var a = this, b = this.options.labels || []; b.forEach(function (c, d) { c = a.initLabel(c, d); B(!0, b[d], c.options) }) }; h.prototype.addShapes = function () { var a = this, b = this.options.shapes || []; b.forEach(function (c, d) { c = a.initShape(c, d); B(!0, b[d], c.options) }) }; h.prototype.destroy = function () {
                    var a = this.chart, b = function (a) { a.destroy() }; this.labels.forEach(b); this.shapes.forEach(b); this.clipYAxis = this.clipXAxis =
                        null; u(a.labelCollectors, this.labelCollector); c.prototype.destroy.call(this); y.destroy.call(this); K(this, a)
                }; h.prototype.destroyItem = function (a) { u(this[a.itemType + "s"], a); a.destroy() }; h.prototype.getClipBox = function () { if (this.clipXAxis && this.clipYAxis) return { x: this.clipXAxis.left, y: this.clipYAxis.top, width: this.clipXAxis.width, height: this.clipYAxis.height } }; h.prototype.init = function (a, b, c) {
                    a = this.chart; b = this.options.animation; this.linkPoints(); this.addControlPoints(); this.addShapes(); this.addLabels();
                    this.setLabelCollector(); this.animationConfig = G(a, b)
                }; h.prototype.initLabel = function (a, b) { a = B(this.options.labelOptions, { controlPointOptions: this.options.controlPointOptions }, a); b = new d(this, a, b); b.itemType = "label"; this.labels.push(b); return b }; h.prototype.initShape = function (a, b) { a = B(this.options.shapeOptions, { controlPointOptions: this.options.controlPointOptions }, a); b = new h.shapesMap[a.type](this, a, b); b.itemType = "shape"; this.shapes.push(b); return b }; h.prototype.redraw = function (a) {
                    this.linkPoints();
                    this.graphic || this.render(); this.clipRect && this.clipRect.animate(this.getClipBox()); this.redrawItems(this.shapes, a); this.redrawItems(this.labels, a); y.redraw.call(this, a)
                }; h.prototype.redrawItem = function (a, b) { a.linkPoints(); a.shouldBeDrawn() ? (a.graphic || this.renderItem(a), a.redraw(I(b, !0) && a.graphic.placed), a.points.length && p(a)) : this.destroyItem(a) }; h.prototype.redrawItems = function (a, b) { for (var c = a.length; c--;)this.redrawItem(a[c], b) }; h.prototype.remove = function () { return this.chart.removeAnnotation(this) };
                h.prototype.render = function () {
                    var a = this.chart.renderer; this.graphic = a.g("annotation").attr({ opacity: 0, zIndex: this.options.zIndex, visibility: this.options.visible ? "inherit" : "hidden" }).add(); this.shapesGroup = a.g("annotation-shapes").add(this.graphic); this.options.crop && this.shapesGroup.clip(this.chart.plotBoxClip); this.labelsGroup = a.g("annotation-labels").attr({ translateX: 0, translateY: 0 }).add(this.graphic); this.addClipPaths(); this.clipRect && this.graphic.clip(this.clipRect); this.renderItems(this.shapes);
                    this.renderItems(this.labels); this.addEvents(); y.render.call(this)
                }; h.prototype.renderItem = function (a) { a.render("label" === a.itemType ? this.labelsGroup : this.shapesGroup) }; h.prototype.renderItems = function (a) { for (var b = a.length; b--;)this.renderItem(a[b]) }; h.prototype.setClipAxes = function () {
                    var a = this.chart.xAxis, b = this.chart.yAxis, c = (this.options.labels || []).concat(this.options.shapes || []).reduce(function (c, d) { d = d && (d.point || d.points && d.points[0]); return [a[d && d.xAxis] || c[0], b[d && d.yAxis] || c[1]] }, []);
                    this.clipXAxis = c[0]; this.clipYAxis = c[1]
                }; h.prototype.setControlPointsVisibility = function (a) { var b = function (b) { b.setControlPointsVisibility(a) }; y.setControlPointsVisibility.call(this, a); this.shapes.forEach(b); this.labels.forEach(b) }; h.prototype.setLabelCollector = function () { var a = this; a.labelCollector = function () { return a.labels.reduce(function (a, b) { b.options.allowOverlap || a.push(b.graphic); return a }, []) }; a.chart.labelCollectors.push(a.labelCollector) }; h.prototype.setOptions = function (a) {
                    this.options =
                    B(this.defaultOptions, a)
                }; h.prototype.setVisibility = function (a) { var b = this.options, c = this.chart.navigationBindings; a = I(a, !b.visible); this.graphic.attr("visibility", a ? "inherit" : "hidden"); a || (this.setControlPointsVisibility(!1), c.activeAnnotation === this && c.popup && "annotation-toolbar" === c.popup.formType && H(c, "closePopup")); b.visible = a }; h.prototype.update = function (a, b) {
                    var c = this.chart, d = w(this.userOptions, a), e = c.annotations.indexOf(this); a = B(!0, this.userOptions, a); a.labels = d.labels; a.shapes = d.shapes;
                    this.destroy(); this.constructor(c, a); c.options.annotations[e] = a; this.isUpdating = !0; I(b, !0) && c.redraw(); H(this, "afterUpdate"); this.isUpdating = !1
                }; h.ControlPoint = g; h.MockPoint = D; h.shapesMap = { rect: k, circle: f, ellipse: a, path: b, image: e }; h.types = {}; return h
            }(C); B(!0, c.prototype, n.prototype, B(c.prototype, { nonDOMEvents: ["add", "afterUpdate", "drag", "remove"], defaultOptions: t })); ""; return c
        }); t(c, "masters/modules/annotations.src.js", [c["Core/Globals.js"], c["Extensions/Annotations/Annotation.js"]], function (c,
            l) { c.Annotation = l; l.compose(c.Chart, c.Pointer, c.SVGRenderer) })
});
//# sourceMappingURL=annotations.js.map