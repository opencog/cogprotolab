function fractalOvals(ctx, ratio, xx, yy, ww, hh, rr, squashX, squashY, drawCircle, fill1, str1) {
    var pixelPrecision = 1 / Math.pow (2, 1); /* set it to less, and you are doomed */
    var qang = 0.025 * Math.PI;

    var hilight = fill1;
    var stroke1 = str1;
    var fill2 = stroke1;
    var stroke2 = fill1;
    
    var shadow;

    var renders = function (minRadius, x1, y1, r1, angle, rec, mouse, data, index, cursor, selectedCursor, renderHint, renderData) {
        return render1 (minRadius, x1, y1, r1, angle, rec, mouse, data, index, cursor, selectedCursor, renderHint, renderData);
    }
    
    var render = function (minRadius, x1, y1, r1, angle, rec, mouse, data, index, cursor, selectedCursor, renderHint, renderData, parentR) {
        function getCircle (alpha, x0, y0, r0, x1, y1, r1) {
            var beta = angle + alpha - Math.PI / 2;
            
            var ra = 0;
            var xa = x0 + r0 * Math.cos (beta);
            var ya = y0 + r0 * Math.sin (beta);
            
            var rb = 2 * r1;
            var xb = x0 + (r0 + rb) * Math.cos (beta);
            var yb = y0 + (r0 + rb) * Math.sin (beta);

            var dr = (rb - ra) / 2;
            var dx = (xb - xa) / 2;
            var dy = (yb - ya) / 2;
            
            ra += dr;
            xa += dx;
            ya += dy;

            var j;
            var steps = 12;
            do {
                dx /= 2;
                dy /= 2;
                dr /= 2;
                var d = Math.sqrt (Math.pow ((xa - x1), 2) + Math.pow ((ya - y1), 2));
                if (Math.abs (ra - r1) <= d) {
                    xa -= dx;
                    ya -= dy;
                    ra -= dr;
                } else {
                    xa += dx;
                    ya += dy;
                    ra += dr;
                }
                steps--;
            } while (steps > 0 && dr > pixelPrecision);

            return {
                x: (r0 + ra) * Math.cos (beta),
                y: (r0 + ra) * Math.sin (beta),
                r: ra,
                alpha: alpha
            };
        }
        
        function getNeighbor (c1, direction, x0, y0, r0, x1, y1, r1) {
            if (direction == "+") {
                var alpha = c1.alpha / 2;
                var dalpha = alpha;
            } else {
                var alpha = (2 * Math.PI + c1.alpha) / 2;
                var dalpha = -(2 * Math.PI - alpha);
            }
            
            var steps = 12;
            do {
                var c2 = getCircle (alpha, x0, y0, r0, x1, y1, r1);
                dalpha /= 2;
                var d = Math.sqrt (Math.pow ((c1.x - c2.x), 2) + Math.pow ((c1.y - c2.y), 2));
                if ((c1.r + c2.r) >= d) {
                    alpha -= dalpha;
                } else {
                    alpha += dalpha;
                }
                steps--;
            } while (steps > 0 && Math.abs ((c1.r + c2.r) - d) > pixelPrecision);

            return c2;
        }
        
        function clear (fill) {
            if (!fill) fill = fill2
            //ctx.fillStyle = fill2;
            ctx.clearRect(0, 0, ww, hh);
        }
        
        function ellipse(ctx, x, y, xDis, yDis) {
            var kappa = 0.5522848,  // 4 * ((√(2) - 1) / 3)
                ox = xDis * kappa,  // control point offset horizontal
                oy = yDis * kappa,  // control point offset vertical
                xe = x + xDis,      // x-end
                ye = y + yDis;      // y-end

            ctx.moveTo(x - xDis, y);
            ctx.bezierCurveTo(x - xDis, y - oy, x - ox, y - yDis, x, y - yDis);
            ctx.bezierCurveTo(x + ox, y - yDis, xe, y - oy, xe, y);
            ctx.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
            ctx.bezierCurveTo(x - ox, ye, x - xDis, y + oy, x - xDis, y);
        }
        
        var i;
        
        var r0 = r1 * ratio;
        var x0 = x1 + (r1 - r0) * Math.cos (angle - Math.PI / 2);
        var y0 = y1 + (r1 - r0) * Math.sin (angle - Math.PI / 2);
        
        //if (shadow) {
            if (rec === 1 && renderHint !== "1") {
                clear();
            }
        //}
        
            
        if (
            Math.sqrt ((x1 - xx) * (x1 - xx) + (y1 - yy) * (y1 - yy)) < r1 + rr
        ) {
            //if ((r1 * squashY * squashX) >= minRadius) {
            if (r0 >= minRadius) {
                var colorFill = fill1;
                
                //if (!renderHint || (rec > 1 && renderHint === "1+") || renderHint === "1" || renderHint === "0") {
                    drawCircle (data, angle, parentR, x0, y0, r0, colorFill, stroke1, cursor, renderHint, rec, shadow);
                //}
                
                if (data.children.length > 0 && renderHint !== "1") {                   
                    var ret, idx, alp;
                    var got;
                    var c0, c1;
                    var alpha = (cursor?cursor.angle:Math.PI);
                    if (cursor && cursor.index === cursor.minIndex && alpha < Math.PI)
                        alpha = Math.PI;
                        
                    if (cursor && cursor.index === cursor.maxIndex && alpha > Math.PI)
                        alpha = Math.PI;
                        
                    if (alpha === -Infinity || alpha === Infinity)
                        alpha = Math.PI;
                    
                    var ci;
                    var oldr, delta;
        
                    c0 = getCircle (alpha, x0, y0, r0, x1, y1, r1);
                    ci = (cursor?cursor.index:0);
                    //if (c0.r * squashX * squashY >= minRadius) {
                    if (c0.r >= minRadius) {
                        got = render (minRadius, x0 + c0.x, y0 + c0.y, c0.r, angle + alpha - Math.PI, rec + 1, mouse, data.children[ci], ci, (cursor?cursor.children[ci]:null), selectedCursor, null, renderData, r1);
                        if (got) {
                            idx = ci;
                            alp = alpha;
                            ret = got;
                        }
                    }
                    
                    oldr = c0.r;
                    c1 = getNeighbor (c0, "+", x0, y0, r0, x1, y1, r1);
                    alpha = c1.alpha;
                    ci = (cursor?cursor.index:0);
                    while (ci < data.children.length - 1 /*true*/){
                        delta = c1.r > oldr;
                        ci++;
                        
                        //if (c1.r * squashX * squashY >= minRadius) {
                        if (c1.r >= minRadius) {
                            got = render (minRadius, x0 + c1.x, y0 + c1.y, c1.r, angle + alpha - Math.PI, rec + 1, mouse, data.children[ci], ci, (cursor?cursor.children[ci]:null), selectedCursor, null, renderData, r1);
                            if (!ret && got) {
                                idx = ci;
                                alp = alpha;
                                ret = got;
                            }
                        } else
                            if (!delta)
                                break;
                        
                        oldr = c1.r;
                        c1 = getNeighbor (c1, "+", x0, y0, r0, x1, y1, r1);
                        alpha = c1.alpha;
                    }
                    

                    oldr = c0.r;
                    c1 = getNeighbor (c0, "-", x0, y0, r0, x1, y1, r1);
                    alpha = c1.alpha;
                    ci = (cursor?cursor.index:0);
                    while (ci >= 1 /*true*/){
                        delta = c1.r > oldr;
                        ci--;

                        //if (c1.r * squashX * squashY >= minRadius) {
                        if (c1.r >= minRadius) {
                            got = render (minRadius, x0 + c1.x, y0 + c1.y, c1.r, angle + alpha - Math.PI, rec + 1, mouse, data.children[ci], ci, (cursor?cursor.children[ci]:null), selectedCursor, null, renderData, r1);
                            if (!ret && got) {
                                idx = ci;
                                alp = alpha;
                                ret = got;
                            }
                        } else
                            if (!delta)
                                break;
                        
                        oldr = c1.r;
                        c1 = getNeighbor (c1, "-", x0, y0, r0, x1, y1, r1);
                        alpha = c1.alpha;
                    }
                }
                
                //var cond = selectedCursor? (cursor === selectedCursor) : (mouse && Math.sqrt(Math.pow(mouse.x / squashX - x0, 2) + Math.pow(mouse.y / squashY - y0, 2)) <= r0);
                var cond = selectedCursor? (cursor === selectedCursor) : (mouse && Math.sqrt(Math.pow(mouse.x / squashX - data.currXA, 2) + Math.pow(mouse.y / squashY - data.currYA, 2)) <= data.currRA);
                
                if (cursor) {
                    cursor.data = data;
                    cursor.minIndex = 0;
                    cursor.maxIndex = data.children.length - 1;
                }
                
                if (ret || cond) {
                    var pass = {
                        rec: rec,
                        data: data,
                        index: index,
                        angle: angle,
                        index1: idx,
                        angle1: alp,
                        revertAng: alp,
                        cursor: null,
                        child: ret,
                        smallX: x0,
                        smallY: y0,
                        smallR: r0,
                        largeX: x1,
                        largeY: y1,
                        largeR: r1,
                        getMetrics: function () {
                            var c, x;
                            var a = pass.getAbsoluteAngle();
                            if (pass.parent) {
                                x = pass.parent.getMetrics ();
                                
                                var rr1 = x.r;
                                var xx1 = x.x;
                                var yy1 = x.y;
                            } else {
                                var rr1 = r1;
                                var xx1 = x1;
                                var yy1 = y1;
                            }
                            
                            var r0 = rr1 * ratio;
                            var x0 = xx1 + (rr1 - r0) * Math.cos (a - Math.PI / 2);
                            var y0 = yy1 + (rr1 - r0) * Math.sin (a - Math.PI / 2);
                            c = getCircle (pass.cursor.angle, x0, y0, r0, xx1, yy1, rr1);
                            
                            return {x: x0 + c.x, y: y0 + c.y, r: c.r};
                        },
                        getAbsoluteAngle: function () {
                            return angle;
                        },
                        getAngMin: function () {
                            var m0, m1;
                            
                            m0 = getCircle (Math.PI, x0, y0, r0, x1, y1, r1);

                            m1 = m0;
                            for (i = 0; i < pass.data.index; i++)
                                m1 = getNeighbor (m1, "+", x0, y0, r0, x1, y1, r1);
                            
                            var a = m1.alpha;//+ 3 * Math.PI / 2;
                            while (a > 2 * Math.PI) a = a - 2 * Math.PI;
                            while (a < 0) a = a + 2 * Math.PI;
                            
                            return a;
                        },
                        getAngMax: function () {
                            var m0, m1;
                            
                            m0 = getCircle (Math.PI, x0, y0, r0, x1, y1, r1);

                            m1 = m0;
                            for (i = pass.data.index; i < pass.data.parent.children.length - 1; i++)
                                m1 = getNeighbor (m1, "-", x0, y0, r0, x1, y1, r1);
                            
                            var a = m1.alpha;//+ 3 * Math.PI / 2;
                            while (a > 2 * Math.PI) a = a - 2 * Math.PI;
                            while (a < 0) a = a + 2 * Math.PI;

                            return a;
                        },
                        getCustomAngMin: function (data) {
                            var m0, m1;
                            
                            m0 = getCircle (Math.PI, x0, y0, r0, x1, y1, r1);

                            m1 = m0;
                            for (i = 0; i < data.index; i++)
                                m1 = getNeighbor (m1, "+", x0, y0, r0, x1, y1, r1);
                            
                            var a = m1.alpha;
                            while (a > 2 * Math.PI) a = a - 2 * Math.PI;
                            while (a < 0) a = a + 2 * Math.PI;
                            
                            return a;
                        },
                        getCustomAngMax: function (data) {
                            var m0, m1;
                            
                            m0 = getCircle (Math.PI, x0, y0, r0, x1, y1, r1);

                            m1 = m0;
                            for (i = data.index; i < data.parent.children.length - 1; i++)
                                m1 = getNeighbor (m1, "-", x0, y0, r0, x1, y1, r1);
                            
                            var a = m1.alpha;
                            while (a > 2 * Math.PI) a = a - 2 * Math.PI;
                            while (a < 0) a = a + 2 * Math.PI;

                            return a;
                        },
                        getCircle: function (ang) {
                            return getCircle (ang, x0, y0, r0, x1, y1, r1);
                        },
                        setAngle: (function () {
                            if (mouse) {
                                var alp1 = - angle + 3 * Math.PI / 2 + Math.atan2((y0 * squashY - mouse.y) / squashY, (x0 * squashX - mouse.x) / squashX);
                                while (alp1 > 2 * Math.PI) alp1 = alp1 - 2 * Math.PI;
                                while (alp1 < 0) alp1 = alp1 + 2 * Math.PI;
                            } else {
                                var alp1 = alp;
                            }
                            
                            var dalp = alp1 - alp;
                            
                            var c = getCircle (alp, x0, y0, r0, x1, y1, r1);
                            
                            return function (ang, percent) {
                                if (percent === undefined) percent = 1;
                                var nc = getCircle (ang, x0, y0, r0, x1, y1, r1);
                                var sang = ang - dalp * (nc.r / c.r) * percent;

                                pass.calcCursor (sang);
                                pass.revertAng = alp;
                            }
                        }) (),
                        revertAngle: function () {
                            pass.calcCursor (pass.revertAng);
                        },
                        calcCursor: function (ang) {
                            var mi, m1, m2;
                            mi = idx;
                            m2 = getCircle (ang, x0, y0, r0, x1, y1, r1);
                            
                            if (ang > Math.PI) {
                                do {
                                    m1 = m2;
                                    m2 = getNeighbor (m1, "+", x0, y0, r0, x1, y1, r1);
                                    mi++;
                                } while (m1.r < m2.r);
                                
                                pass.cursor.index = mi - 1;
                                pass.cursor.angle = m1.alpha;
                               
                            } else {
                                do {
                                    m1 = m2;
                                    m2 = getNeighbor (m1, "-", x0, y0, r0, x1, y1, r1);
                                    mi--;
                                } while (m1.r < m2.r);
                                
                                pass.cursor.index = mi + 1;
                                pass.cursor.angle = m1.alpha;
                            }
                            
                            if (pass.cursor.index < pass.cursor.minIndex) {
                                pass.cursor.index = pass.cursor.minIndex;
                                pass.cursor.angle = Math.PI;
                                pass.angle1 = pass.cursor.angle;
                            
                            } else if (pass.cursor.index > pass.cursor.maxIndex) {
                                pass.cursor.index = pass.cursor.maxIndex;
                                pass.cursor.angle = Math.PI;
                                pass.angle1 = pass.cursor.angle;
                            
                            } else                                 
                                pass.angle1 = ang;
                        },
                    };
                    
                    if (ret) ret.parent = pass;
                                        
                    return pass;
                }
            }
        }
    };
    
    return {
        render: render
    };
}

// var ctx1, shadowr1, shadowColor1, fillo1;

function Orbital (divContainer, data, quant, flatArea, scale, ovalColor, backColor, textColor, shadowRadius, shadowColor, uiscale, onIdle, onBusy, evts, callContextMenu) {
    "use strict";
    
    function prepareData (canvasScape, parent, index) {
        if (!index) index = 0;
        var fst;
        if (!parent) {
            fst = true;
            parent = {index: 0}; 
        }
        
        var data = {
            //src: canvasScape.src,
            //type: canvasScape.type,
            error: canvasScape.error,
            head: canvasScape.head,
            parent: parent,
            index: index,
            scaledBitmap: null,
            children: []
        };
        
        /*
        if (canvasScape.scaledBitmap)
            data.scaledBitmap = canvasScape.scaledBitmap;

        else
            data.scaledBitmap = Crisp.crispBitmapXY(canvasScape.canvas);

        if (canvasScape.hyperlinks) {
            data.hyperlinks = [];
            for (var i = 0; i < canvasScape.hyperlinks.length; i++) {
               var hl = canvasScape.hyperlinks[i];
               data.hyperlinks.push (
                    {
                        target: hl.target,
                        href: hl.href,
                        left: hl.left / scale,
                        top: hl.top / scale,
                        right: hl.right / scale,
                        bottom: hl.bottom / scale
                    }
                );
            }
        }
        */

        if (fst)
            parent.children = [data];
        
        if (canvasScape.children)
            for (var i = 0; i < canvasScape.children.length; i++)
                data.children.push (prepareData (canvasScape.children[i], data, i));
        
        return data;
    } 

    data = prepareData (data);
    
    var fill1 = ovalColor;
    var back1 = backColor;
    var orientation = 0;
    var curvature = 1 / 8;
    
    //var quant = 0.8;                                  // touch it and you're doomed
    var qang = quant * 0.0192 * Math.PI;              
    var qpan = quant * 12 * window.devicePixelRatio;  
    var qlevel = 8 / quant;                           
    
    var svgns = "http://www.w3.org/2000/svg";
    
    divContainer.innerHTML = "";
    // clip path
    var svg = document.createElementNS (svgns, "svg");
    svg.style.display = "block";
    svg.style.height = 0;
    divContainer.appendChild (svg);
    svg.draggable = false;
    svg.ondragstart = function () {return false};

    // main screen
    var cnv = document.createElement ("canvas");
    cnv.style.display = "block";
    divContainer.appendChild (cnv);
    cnv.draggable = false;
    cnv.ondragstart = function () {return false};
    var ctx = cnv.getContext('2d');
    
    var onHyperlink;
    var tooltip = document.createElement("DIV");
    tooltip.id = "tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.bottom = "0px";
    tooltip.style.left = "0px";
    tooltip.style.backgroundColor = "rgb(208, 208, 208)";
    tooltip.style.color = "rgb(48, 48, 48)";
    tooltip.style.visibility = "hidden";
    tooltip.style.fontFamily = "Arial, Helvetica, sans-serif";
    tooltip.style.fontSize = "10pt";
    tooltip.innerText = "";
    document.body.appendChild(tooltip);
    
    /*
    ctx.mozImageSmoothingEnabled    = true
    ctx.webkitImageSmoothingEnabled = true
    ctx.msImageSmoothingEnabled     = true
    ctx.imageSmoothingEnabled       = true
    ctx.imageSmoothingQuality       = "high"
    */
    ctx.mozImageSmoothingEnabled    = false
    ctx.webkitImageSmoothingEnabled = false
    ctx.msImageSmoothingEnabled     = false
    ctx.imageSmoothingEnabled       = false
    ctx.imageSmoothingQuality       = "low"
    //cnv.style.imageRendering = "pixelated";
    //cnv.style.fontSmooth = "never";
    //cnv.style.webkitFontSmoothing = "none";
    //cnv.setAttribute("font-smooth", "never");
    //cnv.setAttribute("image-rendering", "pixelated");
    //cnv.setAttribute("-webkit-font-smoothing", "none");
    var superSampling = 1;
    var pixelSize = 1;


    var ratio = 1 / 1.61803398875; //0.7;//575;

    var circleSize = 0.8;
    var lineWidth = 40;

    var minRadius;
    var shadowr = shadowRadius;
    var recCount = 4.5;

    var dragPrecision = Math.pow (2, 8);

    var MAX_INT32 = Math.pow (2, 31) - 1;

    /*
    ctx1 = ctx;
    shadowr1 = shadowr;
    shadowColor1 = shadowColor;
    fillo1 = fill1;
    */
    
    function invalidateCache () {
        //fishEye.clearRenderMap();
        
        function invalidateCursor (x) {
            //x.centerX = 0;
            //x.centerY = 0;
            //if (x.data)
            //    x.data.cachedCnv = null;
                
            for (var i = 0; i < x.children.length; i++) {
                if (x.children[i]) invalidateCursor (x.children[i]);
            }
        }
        
        var c = cursor;
        while (c.parent) c = c.parent;

        invalidateCursor (c);
    }
    
    function getCnvCache (data, cx, cy, rr) {
        cx = Math.round (Math.round (cx / qpan) * qpan);
        cy = Math.round (Math.round (cy / qpan) * qpan);

        var cnvCache = document.createElement ("canvas");
        var cacheW = 2 * Math.floor (rr * ratio * squashX) * fishEye.superSampling;
        var cacheH = 2 * Math.floor (rr * ratio * squashY) * fishEye.superSampling;
        cnvCache.width = cacheW;
        cnvCache.height = cacheH;
        var ctxCache = cnvCache.getContext('2d');
        var imgCache = ctxCache.createImageData(cacheW, cacheH);
    
        fishEye.renderFishEye (imgCache.data, cacheW, cacheH, 1, cx - (fishEye.data.contentWidth - data.scaledBitmap.width) / 2, cy - (fishEye.data.contentHeight - data.scaledBitmap.height) / 2, data.scaledBitmap);
        ctxCache.putImageData (imgCache, 0, 0);
        
        return cnvCache;
    }
    
    function drawCircle (data, angle, parentR, x, y, r, fill, stroke, cursor, renderHint, level, shadow) {
    //////////////////////
    var diff;
    if (renderHint === "1") diff = 2; else diff = 1;
    if (r * squashX - diff <= 0 || r * squashY - diff <= 0) return;
    //////////////////////
        if (true/*r >= minRadius*/) {

            ctx.globalAlpha = 1;
            

            if (shadow) {
            } else {
                var magn = r / (rr * ratio);
                var minr = 5;
                //parentR = r / ratio;

                var ra = r * circleSize;
                var xa = x + (r - ra) * Math.cos (angle - Math.PI / 2)
                var ya = y + (r - ra) * Math.sin (angle - Math.PI / 2)

                data.currXA = xa;
                data.currYA = ya;
                data.currRA = ra;
                if (!data.parent.currXA) {
                    data.parent.currXA = xx;
                    data.parent.currYA = yy * ratio;
                    data.parent.currRA = rr * ratio;
                    data.parent.currAngleA = Math.PI / 2;
                }

                var anglea = Math.atan2(ya - data.parent.currYA, xa - data.parent.currXA);
                data.currAnglea = anglea;

                data.currXA2 = (xa + x) / 2;
                data.currYA2 = (ya + y) / 2;
                data.currRA2 = (ra + r) / 2;
                data.currAnglea2 = (anglea + angle / 2);
                
                // whole oval
                ctx.beginPath ();
                ctx.ellipse (
                    ~~(xa * squashX),
                    ~~(ya * squashY),
                    ~~(ra * squashX),
                    ~~(ra * squashY),
                    0,
                    0,
                    2 * Math.PI,
                    false
                );
                ctx.closePath ();
                ctx.lineWidth = 0;
                ctx.fillStyle = ovalColor;
                ctx.fill ();
                

                if (data.head) {
                    /*
                    // top part
                    ctx.beginPath ();
                    ctx.ellipse (
                        x * squashX,
                        y * squashY,
                        ra * squashX - 1,
                        ra * squashY - 1,
                        0,
                        -Math.PI / 4,
                        -3 * Math.PI / 4,
                        true
                    );
                    ctx.closePath ();
                    ctx.lineWidth = 0;
                    ctx.fillStyle = textColor;
                    ctx.fill ();
                    */
                    
                    function fillText (text, xb, yb) {
                        if (Math.sqrt((xa - xx) * (xa - xx) + (ya - yy) * (ya - yy)) < rr) {
                            ctx.fillText(text, Math.round (xb - ctx.measureText(text).width / 2), Math.round (yb));
                        }
                    }

                    if (data.head !== "###ERROR###" && ra > minr) {
                        //try {
                            ctx.globalCompositeOperation = "source-atop";

                            var delta = Math.PI / 3.2

                            // top line
                            var x1 = xa + ra * Math.cos (-Math.PI / 2 - delta);
                            var y1 = ya + ra * Math.sin (-Math.PI / 2 - delta);
                            var x2 = xa + ra * Math.cos (-Math.PI / 2 + delta);
                            var y2 = ya + ra * Math.sin (-Math.PI / 2 + delta);
                            ctx.beginPath ();
                            ctx.moveTo(x1 * squashX, Math.round (y1 * squashY) + 0.5);
                            ctx.lineTo(x2 * squashX, Math.round (y2 * squashY) + 0.5);
                            ctx.closePath ();
                            ctx.lineWidth = 1 * magn;
                            ctx.strokeStyle = env.textColor;
                            ctx.stroke ();
                            
                            // bottom line
                            var x1 = xa + ra * Math.cos (Math.PI / 2 - delta);
                            var y1 = ya + ra * Math.sin (Math.PI / 2 - delta);
                            var x2 = xa + ra * Math.cos (Math.PI / 2 + delta);
                            var y2 = ya + ra * Math.sin (Math.PI / 2 + delta);
                            ctx.beginPath ();
                            ctx.moveTo(x1 * squashX, Math.round (y1 * squashY) + 0.5);
                            ctx.lineTo(x2 * squashX, Math.round (y2 * squashY) + 0.5);
                            ctx.closePath ();
                            ctx.lineWidth = 1 * magn;
                            ctx.strokeStyle = env.textColor;
                            ctx.stroke ();
                            
                            
                            // top text
                            
                            var x0 = xa;
                            var y0 = ya - ra * Math.sin (Math.PI / 2 - delta);
                            
                            var cnt = 0;
                            var text1 = "";
                            var text2 = "";
                            var text3 = "";
                            for (var st in data.stats) {
                                if (cnt >= 0 && cnt < 2) {
                                    text1 += st + ": " + Number(data.stats[st]).toFixed (2) + "; ";
        
                                } else if (cnt >=2 && cnt < 4) {
                                    text2 += st + ": " + Number(data.stats[st]).toFixed (2) + "; ";

                                } else {
                                    text3 += st + ": " + Number(data.stats[st]).toFixed (2) + "; ";
                                }
                                cnt++;
                            }
                            var lh = env.fsize * 0.25 * r / 250;
                            var lhy = lh * 1.8;
                            ctx.font = Math.round (lh) + "px monospace";
                            ctx.fillStyle = env.textColor;
                            /*
                            ctx.fillText(text1, x0 * squashX - ctx.measureText(text1).width / 2, y0 * squashY - lh * 4.3);
                            ctx.fillText(text2, x0 * squashX - ctx.measureText(text2).width / 2, y0 * squashY - lh * 4.3 + lhy);
                            ctx.fillText(text3, x0 * squashX - ctx.measureText(text3).width / 2, y0 * squashY - lh * 4.3 + lhy * 2);
                            */
                            fillText(text1, x0 * squashX, y0 * squashY - lh * 4.3);
                            fillText(text2, x0 * squashX, y0 * squashY - lh * 4.3 + lhy);
                            fillText(text3, x0 * squashX, y0 * squashY - lh * 4.3 + lhy * 2);

                            // bottom text
                            
                            var x0 = xa;
                            var y0 = ya + ra * Math.sin (Math.PI / 2 + delta);;

                            var lh = env.fsize * 0.3 * r / 250;

                            if (data.description1) {
                                var text = data.description1;
                                ctx.font = Math.round (lh) + "px monospace";
                                ctx.fillStyle = env.textColor;
                                //ctx.fillText(text, x0 * squashX - ctx.measureText(text).width / 2, y0 * squashY + lh * 2);
                                fillText(text, x0 * squashX, y0 * squashY + lh * 2);
                            }

                            if (data.description2) {
                                var text = data.description2;
                                ctx.font = Math.round (lh) + "px monospace";
                                ctx.fillStyle = env.textColor;
                                //ctx.fillText(text, x0 * squashX - ctx.measureText(text).width / 2, y0 * squashY + lh * 4);
                                fillText(text, x0 * squashX, y0 * squashY + lh * 4);
                            }

                            ctx.globalCompositeOperation = "source-over";
                        //} catch (e) {
                        //}
                    }
                    
                    // head
                    ctx.globalCompositeOperation = "source-atop";

                    var text = data.head;
                    if (text && ra > minr) {
                        var lh = env.fsize * magn / pixelSize;
                        ctx.font = "bold " + Math.round (lh) + "px monospace";
                        ctx.fillStyle = env.textColor;
                        /*
                        ctx.fillText(text, xa * squashX - ctx.measureText(text).width / 2, ya * squashY + lh / 2 * 0.7);
                        */
                        fillText (text, xa * squashX, ya * squashY + lh / 2 * 0.7);
                    }
                    
                    ctx.globalCompositeOperation = "source-over";

                    // score
                    if (level !== 1 && data.parent.parent){
                        ctx.globalCompositeOperation = "source-over";
                        var x1 = xa + (ra - lineWidth * magn) * Math.cos (anglea - Math.PI);
                        var y1 = ya + (ra - lineWidth * magn) * Math.sin (anglea - Math.PI);
                        var x2 = data.parent.currXA + (data.parent.currRA - lineWidth * magn) * Math.cos (anglea);
                        var y2 = data.parent.currYA + (data.parent.currRA - lineWidth * magn) * Math.sin (anglea);
                        ctx.lineWidth = lineWidth * rr / 500 * magn;
                        ctx.beginPath ();
                        ctx.moveTo(x1 * squashX, y1 * squashY);
                        ctx.lineTo(x2 * squashX, y2 * squashY);
                        ctx.closePath ();
                        ctx.globalCompositeOperation = "destination-over";
                        ctx.strokeStyle = ovalColor;
                        ctx.stroke();
                        
                        ctx.globalCompositeOperation = "source-over";
                        
                        var fs = env.fsize * rr / 500 * magn;
                        var lr = env.fsize * rr / 500 * magn;
                        
                        var lx = (x1 + x2) / 2;
                        var ly = (y1 + y2) / 2;
                        
                        ctx.beginPath ();
                        ctx.ellipse (
                            ~~(lx * squashX),
                            ~~(ly * squashY),
                            ~~(lr * squashX),
                            ~~(lr * squashY),
                            0,
                            0,
                            2 * Math.PI,
                            false
                        );
                        ctx.closePath ();
                        ctx.lineWidth = 0;
                        ctx.fillStyle = ovalColor;
                        ctx.fill ();

                        if (data.score !== undefined) {
                            var text = Number(data.score).toFixed (2);
                            var lh = fs / 1.4;
                            ctx.font = "bold " + lh + "px monospace";
                            ctx.fillStyle = textColor;
                            ctx.lineWidth = 0;
                            //ctx.fillText(text, lx * squashX - ctx.measureText(text).width / 2, ly * squashY + lh / 2);
                            fillText(text, lx * squashX, ly * squashY + lh / 2);
                        }
                    }
                                        
                    /*
                    if (animating === "level")
                        ctx.globalAlpha = r / (levelrr * ratio * Math.pow(1 - ratio, level - 1));
                    else
                        ctx.globalAlpha = r / (rr * ratio * Math.pow(1 - ratio, level - 1));

                    ctx.globalAlpha = Math.pow(ctx.globalAlpha, 1/2); // change this and you are doomed

                    if (data.scaledBitmap) {
                        //if (r > 5) {
                            var magn = r / (rr * ratio);
                            
                            var xo = x * squashX - r * squashX + 1;
                            var yo = y * squashY - r * squashY + 1;
                            var xi = x * squashX + r * squashX - 1;
                            var yi = y * squashY + r * squashY - 1;
                            
                            var w = xi - xo;
                            var h = yi - yo;

                            var cx, cy;
                            if (cursor) {
                                if (isNaN(cursor.centerY))
                                    cursor.centerY = ~~Math.min ( -data.scaledBitmap.height / 2 + alignY, data.scaledBitmap.height / 2);
                                cx = cursor.centerX;
                                cy = cursor.centerY;
                            } else {
                                cx = 0;
                                cy = ~~Math.min (-data.scaledBitmap.height / 2 + alignY, data.scaledBitmap.height / 2);
                            }
                            
                            if (!data.cachedCnv || data.centerX !== cx || data.centerY !== cy) {
                                data.cachedCnv = getCnvCache (data, cx, cy, rr);
                                data.centerX = cx;
                                data.centerY = cy;
                                data.cachedData = null;
                            }

                            if (renderHint === "0") {
                                ctx.drawImage(data.cachedCnv, xo, yo, w, h);
                                
                            } else if (level === 1) {
                                ctx.drawImage(data.cachedCnv, Math.round (xo), Math.round (yo));
                            
                            } else {
                                if (!data.cachedData)
                                    data.cachedData = Crisp.crispBitmap (data.cachedCnv);

                                var tmp = Math.ceil (data.cachedCnv.width / w * 0.5); //remove 0.5 and you are doomed
                                if (tmp >= Crisp.log.length)
                                    var bmpscale = Crisp.log[Crisp.log.length - 1];
                                else
                                    var bmpscale = Crisp.log[tmp] - 1;

                                bmpscale = Math.max (0, bmpscale);
                                bmpscale = Math.min (data.cachedData.images.length - 1, bmpscale);

                                ctx.drawImage (data.cachedData.images[bmpscale].canvas, xo, yo, w, h);
                            
                            }
                        //}
                    }
                    
                    if (renderHint !== "0" && renderHint !== "1") {
                        ctx.globalAlpha = 1 - ctx.globalAlpha;
                        
                        ctx.beginPath ();
                        ctx.ellipse (
                            x * squashX,
                            y * squashY,
                            r * squashX - 1,
                            r * squashY - 1,
                            0,
                            0,
                            2 * Math.PI,
                            false
                        );
                        ctx.closePath ();

                        ctx.lineWidth = 0;

                        ctx.fillStyle = back1;
                        ctx.fill ();
                    }

                    ctx.globalAlpha = 1;
                    */
                    
                    renderData.push({radius: r, data: data});
                }
            }
        }
    }
    
    function setupSelect (range) {
        select = range;
        if (range) {
            var sc = cursor;
            select.parent = null;
            select.cursor = sc;
            while (select.child) {
                select = select.child;
                
                if (!sc.children[select.index]) {
                    var cy = NaN;
                    if (select.data.scaledBitmap)
                        cy = ~~Math.min (/*center*/ -select.data.scaledBitmap.height / 2 + alignY, select.data.scaledBitmap.height / 2);
                        
                    sc.children[select.index] = {parent: sc, index: 0, centerX: 0, centerY: cy, angle: Math.PI, children: []};
                }
                
                sc = sc.children[select.index];
                select.cursor = sc;
            }
        }
    }
        
    function clear (fill) {
        if (!fill) fill = fill2
        //ctx.fillStyle = fill2;
        ctx.clearRect(0, 0, ww, hh);
    }

    function redraw (m, renderHint, selectedCursor) {
        //clear ();
        renderData = [];
        var ret = n.render (minRadius, x1, y1, r1, orientation/*0*/, 1, m, data, cursor.parent.index, cursor, selectedCursor, renderHint, renderData);
        return ret;
    }

    function getMouse(mouseEvent)
    {
      var obj = divContainer;
      var obj_left = 0;
      var obj_top = 0;
      var xpos;
      var ypos;
      while (obj.offsetParent)
      {
        obj_left += obj.offsetLeft;
        obj_top += obj.offsetTop;
        obj = obj.offsetParent;
      }
      if (mouseEvent)
      {
        //FireFox
        xpos = mouseEvent.pageX;
        ypos = mouseEvent.pageY;
      }
      else
      {
        //IE
        xpos = window.event.x + document.body.scrollLeft - 2;
        ypos = window.event.y + document.body.scrollTop - 2;
      }
      
      xpos -= obj_left;
      ypos -= obj_top;
      
      return {x: Math.floor (xpos / pixelSize), y: Math.floor (ypos / pixelSize)};
    }
    
    function setCenter (select, x, y) {
        if (select.cursor.data && select.cursor.data.scaledBitmap) {
            select.cursor.centerX = x;
            var minmaxW = Math.floor (select.cursor.data.scaledBitmap.width / 2);
            if (select.cursor.centerX > minmaxW)
                select.cursor.centerX = minmaxW;
            if (select.cursor.centerX < -minmaxW)
                select.cursor.centerX = -minmaxW;

            select.cursor.centerX = Math.floor (select.cursor.centerX)

            select.cursor.centerY = y;
            var minmaxH = Math.floor (select.cursor.data.scaledBitmap.height / 2);
            if (select.cursor.centerY > minmaxH)
                select.cursor.centerY = minmaxH;
            if (select.cursor.centerY < -minmaxH)
                select.cursor.centerY = -minmaxH;

            select.cursor.centerY = Math.floor (select.cursor.centerY)
        }
    }
    
    var qpx1, qpy1;
    function mousemovePan(x, y) {
        /*
        if (select && !animating) {
            var r0 = r1 * ratio;

            var x0 = Math.floor ((x1 + Math.sin (orientation) * (r1 - r0)) * squashX);
            var y0 = Math.floor ((y1 - Math.cos (orientation) * (r1 - r0)) * squashY);

            if (Math.ceil (Math.sqrt((x - x0) / squashX * (x - x0) / squashX + (y - y0) / squashY * (y - y0) / squashY)) < Math.floor (r0)) {
                var tmp0 = (2 * fishEye.data.width * (fishEye.data.height + Math.floor ((dragY - y0) * fishEye.superSampling)) + fishEye.data.width + Math.floor ((dragX - x0) * fishEye.superSampling)) * 4;
                var tmp1 = (2 * fishEye.data.width * (fishEye.data.height + Math.floor ((y - y0) * fishEye.superSampling)) + fishEye.data.width + Math.floor ((x - x0) * fishEye.superSampling)) * 4;
                
                setCenter (select, oldCenterX + fishEye.data.array[tmp0] - fishEye.data.array[tmp1], oldCenterY + fishEye.data.array[tmp0 + 1] - fishEye.data.array[tmp1 + 1]);
            
            } else {
                select.cursor.centerX = 0;
                select.cursor.centerY = NaN;
                if (select.cursor.data && select.cursor.data.scaledBitmap)
                    select.cursor.centerY = ~~Math.min (*center* -select.cursor.data.scaledBitmap.height / 2 + alignY, select.cursor.data.scaledBitmap.height / 2);

            }
            
            globalt0 = (new Date()).getTime();
            window.requestAnimationFrame(function () {
                var qpx = Math.round (select.cursor.centerX / qpan) * qpan;
                var qpy = Math.round (select.cursor.centerY / qpan) * qpan;
                if (qpx !== qpx1 || qpy !== qpy1) {
                    redraw ({x: mouse.x, y: mouse.y}, "1");
                    qpx1 = qpx;
                    qpy1 = qpy;
                }
            });

        }
        */
    }
    
    function setMouseHyperlink (x, y) {
        var found = false;
        if (cursor && cursor.data.scaledBitmap) {
            if (!dragging && !panning && !animating) {
                var r0 = r1 * ratio;

                var x0 = Math.floor ((x1 + Math.sin (orientation) * (r1 - r0)) * squashX);
                var y0 = Math.floor ((y1 - Math.cos (orientation) * (r1 - r0)) * squashY);

                if (Math.ceil (Math.sqrt((x - x0) / squashX * (x - x0) / squashX + (y - y0) / squashY * (y - y0) / squashY)) < Math.floor (r0)) {
                    var tmp1 = (2 * fishEye.data.width * (fishEye.data.height + Math.floor ((y - y0) * fishEye.superSampling)) + fishEye.data.width + Math.floor ((x - x0) * fishEye.superSampling)) * 4;

                    var hx = cursor.centerX + (cursor.data.scaledBitmap.width / 2 + (fishEye.data.array[tmp1] - fishEye.data.width));
                    var hy = cursor.centerY + (cursor.data.scaledBitmap.height / 2 + (fishEye.data.array[tmp1 + 1] - fishEye.data.height));
                    
                    if (cursor.data.hyperlinks) {
                        for (var i = 0; i < cursor.data.hyperlinks.length; i++) {
                            var hl = cursor.data.hyperlinks[i];
                            if (hl.top < hy && hl.bottom > hy && hl.left < hx && hl.right > hx) {
                                found = true;
                                cnv.style.cursor = "pointer";
                                tooltip.style.visibility = "visible";
                                tooltip.innerText = " " + hl.href + " ";
                                tooltip.myHref = hl.href;
                                tooltip.myTarget = hl.target;
                            }
                        }
                    }
                }
            }
        }
        if (!found) {
            cnv.style.cursor = "default";
            tooltip.style.visibility = "hidden";
            tooltip.innerText = "";
        }
    }
    
    var qang2;
    function mousemove (e) {
        "use strict";
        
        globalt0 = (new Date()).getTime();
        
        var r0 = r1 * ratio;
        
        var x0 = Math.floor ((x1 + Math.sin (orientation) * (r1 - r0)) * squashX);
        var y0 = Math.floor ((y1 - Math.cos (orientation) * (r1 - r0)) * squashY);

        mouse = getMouse (e);
        lastMouseEvent = e;
        

        if (!panning && !dragging) {
            if (mouseDown === 1) {
                if (3 < Math.sqrt(Math.pow(mouse.x - dragX, 2) + Math.pow(mouse.y - dragY, 2))) {
                    setupSelect(preSelect);
                    
                    if (!animating && select && Math.sqrt((mouse.x - x0) / squashX * (mouse.x - x0) / squashX + (mouse.y - y0) / squashY * (mouse.y - y0) / squashY) < r0) {
                        panning = true;
                        
                        oldCenterX = select.cursor.centerX;
                        oldCenterY = select.cursor.centerY;
                        
                        inertPan = [];
                        inertIdxPan = 0;
                        
                    } else {
                        dragging = true;
                        
                        inert = [];
                        inertIdx = 0;
                    }
                }
            } else if (mouseDown === 0)
                setMouseHyperlink (mouse.x, mouse.y);
        }

        var angMin, angMax;
        if ((dragging || panning) && select) {
            gettingLevel = select;

            var ang1;
            if (select.parent) {
                ang1 =
                    - select.parent.angle +
                    3 * Math.PI / 2 +
                    Math.atan2 (
                        (select.parent.smallY * squashY - mouse.y) / squashY,
                        (select.parent.smallX * squashX - mouse.x) / squashX
                    );
                    
                while (ang1 > 2 * Math.PI) ang1 = ang1 - 2 * Math.PI;
                while (ang1 < 0) ang1 = ang1 + 2 * Math.PI;
                
                ang1 = Math.min (select.getAngMax (), ang1);
                ang1 = Math.max (select.getAngMin (), ang1);
            }

            var isOnParent = select.parent;
            while (isOnParent) {
                //if (isOnParent.smallR - 1 > Math.sqrt (Math.pow (isOnParent.smallX - mouse.x / squashX, 2) + Math.pow (isOnParent.smallY - mouse.y / squashY, 2)))
                if (isOnParent.data.currRA2 - 1 > Math.sqrt (Math.pow (isOnParent.data.currXA2 - mouse.x / squashX, 2) + Math.pow (isOnParent.data.currYA2 - mouse.y / squashY, 2)))
                    break;
                    
                isOnParent = isOnParent.parent
            }

            var minR, maxR, mouseDistance;
            if (!isOnParent) {
                if (select.parent) {
                    
                    minR = select.parent.smallR;
                    maxR = select.parent.smallR + 2 * select.data.currRA2;//2 * select.parent.getCircle(ang1).r * ratio;//select.smallR;
                    mouseDistance = Math.sqrt (Math.pow (select.parent.smallX - mouse.x / squashX, 2) + Math.pow(select.parent.smallY - mouse.y / squashY, 2));
                    /*
                    minR = select.parent.data.currRA2;
                    maxR = select.parent.data.currRA2 + 2 * select.data.currRA2 ;//2 * select.parent.getCircle(ang1).r;//select.smallR;
                    mouseDistance = Math.sqrt (Math.pow (select.parent.data.currXA2 - mouse.x / squashX, 2) + Math.pow(select.parent.data.currYA2 - mouse.y / squashY, 2));
                    */
/*
ctx.beginPath ();
ctx.ellipse (
    select.data.currXA2 * squashX,
    select.data.currYA2 * squashY,
    select.data.currRA2 * squashX - 1,
    select.data.currRA2 * squashY - 1,
    0,
    0,
    2 * Math.PI,
    false
);
ctx.closePath ();
ctx.lineWidth = 0;
ctx.fillStyle = "red";
ctx.fill ();

ctx.beginPath ();
ctx.ellipse (
    select.parent.smallX * squashX,
    select.parent.smallY * squashY,
    select.parent.smallR * squashX - 1,
    select.parent.smallR * squashY - 1,
    0,
    0,
    2 * Math.PI,
    false
);
ctx.closePath ();
ctx.lineWidth = 0;
ctx.fillStyle = "blue";
ctx.fill ();
*/
                } else {
                    /*
                    minR = 0;
                    maxR = select.smallR;
                    mouseDistance = Math.sqrt (Math.pow (select.smallX - mouse.x / squashX, 2) + Math.pow(select.smallY - mouse.y / squashY, 2))
                    */
                    minR = 0;
                    maxR = select.data.currRA2;
                    mouseDistance = Math.sqrt (Math.pow (select.data.currXA2 - mouse.x / squashX, 2) + Math.pow(select.data.currYA2 - mouse.y / squashY, 2))
/*
ctx.beginPath ();
ctx.ellipse (
    select.data.currXA2 * squashX,
    select.data.currYA2 * squashY,
    select.data.currRA2 * squashX - 1,
    select.data.currRA2 * squashY - 1,
    0,
    0,
    2 * Math.PI,
    false
);
ctx.closePath ();
ctx.lineWidth = 0;
ctx.fillStyle = "red";
ctx.fill ();
*/
                }
            }

            if (!animating && dragging && select.parent && !isOnParent && mouseDistance < maxR) {
                //select.parent.setAngle (ang[1], dr);
                var myang = 0;
                var myangadd = 0;
                while (Math.abs (myang) < Math.abs (ang1 - Math.PI)) {
                    myangadd = qang * Math.sign(ang1 - Math.PI) * select.parent.getCircle(myang + Math.PI).r / (select.parent.largeR * (1 - ratio));
                    myang += myangadd;
                }
                myang -= myangadd;
                if (ang1 <= select.getAngMin () || ang1 >= select.getAngMax ())
                    myang += myangadd;
                
                var qang1 = Math.PI + myang;
                select.parent.setAngle (qang1, 0);
                //if (select.parent.getCircle(select.parent.angle1).r * squashX * squashY > minRadius) {
                    //inert[inertIdx] = {angle: select.parent.angle1, rawAngle: ang[1], percentRawAngle: dr, time: (new Date()).getTime()};
                    inert[inertIdx] = {angle: select.parent.angle1, rawAngle: ang1, percentRawAngle: 0, centerX: select.cursor.centerX, centerY: select.cursor.centerY, time: (new Date()).getTime()};
                    inertIdx++;
                    if (inertIdx === 200) inertIdx = 0;

                    //clear ();
                    var sel = select;
                    window.requestAnimationFrame(function () {
                        if (!panning) {
                            renderData = [];
                            if (qang1 !== qang2) {
                                setupSelect (n.render (minRadius, x1, y1, r1, orientation, 1, mouse, data, cursor.parent.index, cursor, sel.cursor, "1+", renderData));
                                qang2 = qang1;
                            }
                            if (!select)
                                mouseup (lastMouseEvent);
                        }
                    });
                    
                //} else {
                //    select.parent.revertAngle ();
                //}
            }
            
            if (!select) {
                mouseup (lastMouseEvent);
                
            } else {
                angMin = select.getAngMin ();
                angMax = select.getAngMax ();
                
                var ip = 0;
                var ang = [];
                var ac = select;
                while (ac && ip < 3) {
                    var phi =  ac.angle;
                        
                    ang[ip] =
                        - phi +
                        3 * Math.PI / 2 +
                        Math.atan2 (
                            (ac.smallY * squashY - mouse.y) / squashY,
                            (ac.smallX * squashX - mouse.x) / squashX
                        );
                            
                    while (ang[ip] > 2 * Math.PI) ang[ip] = ang[ip] - 2 * Math.PI;
                    while (ang[ip] < 0) ang[ip] = ang[ip] + 2 * Math.PI;
                    
                    ac = ac.parent;
                    ip++;
                }

                
                // mouse animation during zooming
                if (!isOnParent) {
                    if (mouseDistance > maxR) {
                        animateAng0 = ang[0];

                        if (!select.parent) {
                            animateAng0Start = Math.PI;

                        } else {
                            animateAng0Start = ang[1];

                        }
                    }
                        
                } else {
                    if (isOnParent !== select.parent) {
                        if (select.parent.parent) {
                            animateAng2 = select.parent.parent.angle1;
                            animateAng2Start = select.parent.parent.angle1;
                        }
                        
                    } else {
                        animateAng2 = ang[2];
                        
                        if (!animating && select.parent.parent)
                            animateAng2Start = select.parent.parent.angle1;
                            
                    }

                    if (!animateAng2)
                        animateAng2 = Math.PI;
                        
                    if (!animateAng2Start)
                        animateAng2Start = Math.PI;
                }
                
                var aa0 = animateAng0;
                /*
                animateAng0 = Math.round ((animateAng0) / qang) * qang;
                animateAng0Start = Math.PI + Math.round ((animateAng0Start - Math.PI) / qang) * qang;
                animateAng2 = Math.round ((animateAng2) / qang) * qang;
                animateAng2Start = Math.PI + Math.round ((animateAng2Start - Math.PI) / qang) * qang;
                */

                animateAng0 = Math.min (animateAng0, angMax);
                animateAng0 = Math.max (animateAng0, angMin);
                animateAng2 = Math.min (animateAng2, angMax);
                animateAng2 = Math.max (animateAng2, angMin);

                if (!animating) {
                    var topc = select;
                    while (topc.parent)
                        topc = topc.parent;

                    var i, t0, tmpi;
                
                    if (isOnParent) {
                        //alert ("level down");
                        if (level !== gettingLevel) {
                            t0 = (new Date()).getTime();
                            i = 0;
                            tmpi = 0;
                            
                            var angles = [];
                            var cc = select.parent.cursor;
                            var cp = select.parent;
                            do {
                                var angle = cp.angle1;
                                angle = Math.min (cp.getCustomAngMax (cp.data), angle);
                                angle = Math.max (cp.getCustomAngMin (cp.data), angle);
                                angles.push ([cp.angle1, angle]);
                                cc.index = cp.index1;
                                cc = cc.parent;
                                cp = cp.parent;
                            } while (cp);
                            
                            function aEnlarge () {
                                if (angles[1]) 
                                    angles[1] = [angles[1][0] * (1 - i) + angles[1][1] * (i), animateAng2Start * (1 - i) + animateAng2 * i];
                                    
                                else
                                    angles[1] = [Math.PI, animateAng2Start * (1 - i) + animateAng2 * i];
                                    
                                curAnimateAng2 = angles[1]
                                cc = select.parent.cursor;
                                cp = select.parent;
                                var ap = 0;
                                while (cp.parent) {
                                    cc.angle = (angles[ap][0] * (1 - i) + angles[ap][1] * (i)) * (1 - i) + (angles[ap + 1][0] * (1 - i) + angles[ap + 1][1] * (i)) * (i);
                                    cc = cc.parent;
                                    cp = cp.parent;
                                    ap++
                                };
                                cc.angle = (angles[ap][0] * (1 - i) + angles[ap][1] * (i)) * (1 - i) + Math.PI * i;
                                var m = topc.getCircle (topc.cursor.angle);
                                
                                var x0 = topc.smallX + m.x;
                                var y0 = topc.smallY + m.y;
                                var r0 = m.r;
                                
                                var ang = Math.atan2(y0 - y1, x0 - x1);
                                var mang = Math.atan2(y1 - y0, x1 - x0);
                                
                                var xo = x1 + r1 * Math.cos(ang);
                                var yo = y1 + r1 * Math.sin(ang);
                                
                                var r2 = r1 * r1 / r0;
                                var x2 = xo + r2 * Math.cos(mang);
                                var y2 = yo + r2 * Math.sin(mang);

                                var i1 = Math.round (i * qlevel) / qlevel;
                                if (i1 > 1) i1 = 1;
                                
                                var x = x1 + (x2 - x1) * i1;
                                var y = y1 + (y2 - y1) * i1;
                                var r = r1 + (r2 - r1) * i1;
                                
                                levelrr = r;

                                renderData = [];
                                if (tmpi !== i1 || i === 1)
                                    var atCur = n.render (minRadius, x, y, r, orientation, 1, null, cursor.data, topc.index, cursor, select.cursor, "0", renderData);

                                tmpi = i1;

                                if (i < 1) {
                                    var t1 = (new Date()).getTime();
                                    //i += 0.005 + (0.5 - Math.abs (i - 0.5)) * (t1 - t0) / 100;
                                    i += (t1 - t0) / 384;
                                    if (t1 - t0 === 0) i += 1 / 384;
                                    if (i > 1) i = 1;
                                    t0 = t1;
                                    
                                    window.requestAnimationFrame(aEnlarge)
                                } else {
                                    level = gettingLevel;
                                    inertIdx = 0;
                                    inert = [];

                                    if (!cursor.children[cursor.index]) {
                                        var cy = NaN;
                                        if (topc.child.data.scaledBitmap)
                                            cy = ~~Math.min (/*center*/ -topc.child.data.scaledBitmap.height / 2 + alignY, topc.child.data.scaledBitmap.height / 2);
                                            
                                        cursor.children[cursor.index] = {parent: cursor, centerX: 0, centerY: cy, index: 0, angle: Math.PI, children: []};
                                    }
                                        
                                    cursor = cursor.children[cursor.index];

                                    path.push (data);
                                    data = topc.child.data;
                                    
                                    panning = false;
                                    animating = false;

                                    if (atCur) {
                                        if (dragging) {
                                            setupSelect (atCur.child)
                                            redraw (null, "1+", select.cursor);
                                            mousemove (lastMouseEvent);
                                        } else {
                                            redraw ({x: mouse.x, y: mouse.y}, "1");
                                            mouseup (lastMouseEvent);
                                        }
                                        //drawCircle (select.smallX,  select.smallY, select.smallR, "green", "white", "yxz");

                                    } else {
                                        redraw ({x: mouse.x, y: mouse.y}, "1");
                                        mouseup (lastMouseEvent);
                                    }
                                    
                                    if (!dragging)
                                        idle ();
                                }
                            }
                            
                            animating = "level";
                            window.requestAnimationFrame (aEnlarge);
                        }    
                    } else if (mouseDistance > maxR + 1) {
                        //alert ("level up");
                        if (path.length > 0) {
                            if (level !== gettingLevel) {
                                i = 0;
                                t0 = (new Date()).getTime();
                                tmpi = 0;
                                
                                var angles = [];
                                var cc = select.cursor.parent;
                                var cp = select.parent;
                                while (cp) {
                                    var angle = cp.angle1;
                                    angle = Math.min (cp.getCustomAngMax (cp.data), angle);
                                    angle = Math.max (cp.getCustomAngMin (cp.data), angle);
                                    angles.push ([cp.angle1, angle]);
                                    cc.index = cp.index1;
                                    cc = cc.parent;
                                    cp = cp.parent;
                                }
                                angles.push ([Math.PI, Math.PI]);
                                
                                function aEnsmall () {
                                    cc = select.cursor.parent;
                                    cp = select.parent;
                                    var ap = 0;
                                    
                                    var lastAngle = Math.PI;
                                    while (ap < angles.length) {
                                        if (ap > 0) {
                                            cc.angle = (angles[ap][0] * (1 - i) + angles[ap][1] * (i)) * (1 - i) + (angles[ap - 1][0] * (1 - i) + angles[ap - 1][1] * (i)) * (i);
                                        } else {
                                            cc.angle = (angles[ap][0] * (1 - i) + angles[ap][1] * (i)) * (1 - i) + (animateAng0Start * (1 - i) + animateAng0 * i) * (i);
                                        }
                                        lastAngle = cc.angle;
                                        cc = cc.parent;
                                        ap++
                                    };

                                    var m = topc.getCircle (lastAngle);
                                    //var la = Math.PI + Math.round ((lastAngle - Math.PI) / qang) * qang;
                                    //var m = topc.getCircle (la);
                                    
                                    var x0 = topc.smallX + m.x;
                                    var y0 = topc.smallY + m.y;
                                    var r0 = m.r;

                                    var ang = Math.atan2(y0 - y1, x0 - x1);
                                    var mang = Math.atan2(y1 - y0, x1 - x0);
                                    
                                    var xo = x1 + r1 * Math.cos(ang);
                                    var yo = y1 + r1 * Math.sin(ang);
                                    
                                    var r2 = r1 * r1 / r0;
                                    var x2 = xo + r2 * Math.cos(mang);
                                    var y2 = yo + r2 * Math.sin(mang);

                                    var i1 = Math.round (i * qlevel) / qlevel;
                                    if (i1 > 1) i1 = 1;

                                    var x = x1 + (x2 - x1) * (1 - i1);
                                    var y = y1 + (y2 - y1) * (1 - i1);
                                    var r = r1 + (r2 - r1) * (1 - i1);

                                    levelrr = r;

                                    renderData = [];
                                    if (tmpi !== i1 || i === 1)
                                        var atCur = n.render (minRadius, x, y, r, orientation, 1, null, cursor.parent.data, cursor.parent.parent.index, cursor.parent, select.cursor, "0", renderData);

                                    tmpi = i1;

                                    if (i < 1) {
                                        var t1 = (new Date()).getTime();
                                        //i += 0.005 + (0.5 - Math.abs (i - 0.5)) * (t1 - t0) / 100;
                                        i += (t1 - t0) / 384;
                                        if (t1 - t0 === 0) i += 1 / 384;
                                        if (i > 1) i = 1
                                        t0 = t1;
                                        
                                        window.requestAnimationFrame(aEnsmall);
                                    } else {
                                        level = gettingLevel;
                                        inertIdx = 0;
                                        inert = [];

                                        cursor = cursor.parent;
                                        data = path.pop();
                                        
                                        animating = false;
                                        
                                        if (atCur) {
                                            if (dragging) {
                                                setupSelect (atCur);
                                                redraw (null, "1+", select.cursor);
                                                mousemove (lastMouseEvent);
                                            } else {
                                                redraw ({x: mouse.x, y: mouse.y}, "1");
                                                mouseup (lastMouseEvent);
                                            }
                                            //drawCircle (select.smallX,  select.smallY, select.smallR, "green", "white", "yxz");

                                        } else {
                                            redraw ({x: mouse.x, y: mouse.y}, "1");
                                            mouseup (lastMouseEvent);
                                        }                                            
                                        
                                        if (!dragging)
                                            idle ();
                                    }
                                }
                                
                                if (aa0 < 3 * Math.PI / 2 && aa0 > Math.PI / 2) {
                                    panning = false;
                                    animating = "level";
                                    cursor.centerX = 0;
                                    cursor.centerY = NaN;
                                    if (cursor.data.scaledBitmap)
                                        cursor.centerY = ~~Math.min (/*center*/ -cursor.data.scaledBitmap.height / 2 + alignY, cursor.data.scaledBitmap.height / 2);

                                    window.requestAnimationFrame (aEnsmall);
                                }
                            }
                        }
                    }
                }                    
            }
        }        
        /*
        if (!animating && panning) {
            mousemovePan(mouse.x, mouse.y);
            inertPan[inertIdxPan] = {centerX: cursor.centerX, centerY: cursor.centerY, time: (new Date()).getTime()};
            inertIdxPan++;
            if (inertIdxPan === 200) inertIdxPan = 0;
        }
        */

        /*
        setTimeout(function () {
            if (!mouseDown && !animating && !dragging && !panning)
                redraw ({x: mouse.x, y: mouse.y});
                
        }, 0);
        */
    }
    

    function mousedown (e) {
        if (animating !== "level") {
            mouse = getMouse (e);
                    
            globalt0 = (new Date()).getTime();

            if (e.which === 1) {
                preSelect = redraw ({x: mouse.x, y: mouse.y, button: e.which});
                
                if (animating) {
                    animating = false;
                }

                mouseDown = 1;
                
                dragX = mouse.x;
                dragY = mouse.y;
                
                oldCenterX = cursor.centerX;
                oldCenterY = cursor.centerY;

                var r0 = r1 * ratio;
                var x0 = Math.floor (x1 * squashX);
                var y0 = Math.floor ((y1 - (r1 - r0)) * squashY);
                
                if (Math.sqrt((dragX - x0) / squashX * (dragX - x0) / squashX + (dragY - y0) / squashY * (dragY - y0) / squashY) >= r0) {
                    if (panning) {
                        panning = false;
                    }
                }
                
                setMouseHyperlink (mouse.x, mouse.y);
                onHyperlink = tooltip.innerText;
                
                if (preSelect) {
                    cnv.style.cursor = "grabbing";
                    busy();
                }
            }
        }
    }

    function mouseup (e) {
        mouse = getMouse (e);
        mouseDown = 0;

        if (animating === "level") dragging = false;

        if (!animating && !dragging && !panning && onHyperlink !== "" && onHyperlink === tooltip.innerText) {
            window.open(tooltip.myHref, tooltip.myTarget); 
        }

        if (!animating) {
            if (dragging && inert.length > 1) {
                dragging = false;
                
                var sum = 0;
                var avgt = 0;
                var avgAng = 0;
                var i = inertIdx - 1
                var j = i - 1;
                var k = 2;
                if ((new Date()).getTime() - (inertIdx === 0? inert[inert.length - 1].time: inert[inertIdx - 1].time) < 250) {
                    while (i !== inertIdx && k > 0) {
                        if (i === 0)
                            j = inert.length - 1;
                        else
                            j = i - 1

                        if (!inert[i] || !inert[j])
                            break;
                            
                        if (inert[i].time - inert[j].time > 250)
                            break;
                            
                        if (inert[i].time < inert[j].time)
                            break;

                        var dt = inert[i].time - inert[j].time;
                        if (!avgt) {
                            avgt = dt;
                        } else {
                            avgt = (avgt + dt) / 2;
                        }

                        var dang = (inert[i].angle - inert[j].angle);
                        
                        if (!avgAng)
                            avgAng = dang;
                        else
                            avgAng = (avgAng + dang) / 2
                        
                        i -= 1; j -= 1; k -= 1;
                    }
                }
                
                if (select && avgt < 250) {
                    var c = select.parent;
                    if (inertIdx === 0) inertIdx = 1;
                    var ang0 = inert[inertIdx - 1].angle;
                    var c1 = c.getCircle(ang0).r;
                    var dang0 = inert[inertIdx - 1].angle - inert[inertIdx - 1].rawAngle;
                    var t0 = globalt0;
                    var i = 1;
                    var di = 1;
                    var tmpa0 = 0;
                    function aInert () {
                        if (animating === true) {
                            var dt = (new Date()).getTime() - t0;
                            t0 = (new Date()).getTime();
                            if (dt === 0) dt = 1;

                            di = di - dt / 384;
                            var sindi = Math.pow(di, 2);
                            if (di > 0){
                                ang0 += avgAng * sindi * (c.getCircle(ang0).r / c1);
                                if (inertIdx === 0) inertIdx = 1;
                                var a0 = ang0 - dang0;
                                a0 = Math.max (a0, select.getAngMin());
                                a0 = Math.min (a0, select.getAngMax());

                                var myang = 0;
                                var myangadd = 0;
                                while (Math.abs (myang) < Math.abs (a0 - Math.PI)) {
                                    myangadd = qang * Math.sign(a0 - Math.PI) * select.parent.getCircle(myang + Math.PI).r / (select.parent.largeR * (1 - ratio));
                                    myang += myangadd;
                                }
                                myang -= myangadd;
                                if (a0 <= select.getAngMin () || a0 >= select.getAngMax ())
                                    myang += myangadd;
                                
                                var qang1 = Math.PI + myang;
                                if (tmpa0 !== qang1) {
                                    tmpa0 = qang1;
                                    c.setAngle (qang1, 0);
                                    redraw (null, "1+", (select)?select.cursor:null);
                                }

                                /*
                                c.setAngle (a0, 0);//inert[inertIdx - 1].percentRawAngle);

                                redraw (null, "1+", (select)?select.cursor:null);
                                */
                                window.requestAnimationFrame(aInert);
                                
                            } else {
                                animating = false;
                                redraw ({x: mouse.x, y: mouse.y});
                                
                                idle ();
                            }
                        } else if (mouseDown === 1) {
                            animating = false;
                            preSelect = redraw ({x: mouse.x, y: mouse.y});

                            idle ();
                        }
                    }

                    animating = true;
                    window.requestAnimationFrame(aInert);
                }
            
                if (!animating) {
                    redraw ({x: mouse.x, y: mouse.y});
                }

            } else if (panning && inertPan.length > 1) {
                redraw ({x: mouse.x, y: mouse.y});
                idle ();
                /*
                var r0 = r1 * ratio;

                var x0 = Math.floor ((x1 + Math.sin (orientation) * (r1 - r0)) * squashX);
                var y0 = Math.floor ((y1 - Math.cos (orientation) * (r1 - r0)) * squashY);

                if (Math.ceil (Math.sqrt((mouse.x - x0) / squashX * (mouse.x - x0) / squashX + (mouse.y - y0) / squashY * (mouse.y - y0) / squashY)) < Math.floor (r0)) {
                    var avgX = 0;
                    var avgY = 0;
                    var avgt = 0;
                    var i = inertIdxPan - 1
                    var j = i - 1;
                    var k = 2;
                    if ((new Date()).getTime() - (inertIdxPan === 0? inertPan[inertPan.length - 1].time: inertPan[inertIdxPan - 1].time) < 250) {
                        while (i !== inertIdxPan && k > 0) {
                            if (i === 0)
                                j = inertPan.length - 1;
                            else
                                j = i - 1

                            if (!inertPan[i] || !inertPan[j])
                                break;
                                
                            if (inertPan[i].time - inertPan[j].time > 250) {
                                break;
                            }

                            if (inertPan[i].time < inertPan[j].time)
                                break;

                            var dt = inertPan[i].time - inertPan[j].time;
                            if (!avgt) {
                                avgt = dt;
                            } else {
                                avgt = (avgt + dt) / 2;
                            }

                            var dx = (inertPan[i].centerX - inertPan[j].centerX);
                            if (!avgX) {
                                avgX = dx;
                            } else {
                                avgX = (avgX + dx) / 2
                            }

                            var dy = (inertPan[i].centerY - inertPan[j].centerY);
                            if (!avgY) {
                                avgY = dy;
                            } else {
                                avgY = (avgY + dy) / 2
                            }

                            i -= 1; j -= 1; k -= 1;
                        }
                        
                        if (avgt < 250) {
                            var t0 = globalt0;
                            var di = 1;
                            var globalSel = select;
                            function dInert () {
                                if (animating === true) {
                                    var dt = (new Date()).getTime() - t0;
                                    t0 = (new Date()).getTime();
                                    if (dt === 0) dt = 1;

                                    di = di - dt / 384;
                                    var sindi = Math.pow(di, 2);
                                    if (di > 0){
                                        var oldx = cursor.centerX;
                                        var oldy = cursor.centerY;
                                        var px = Math.round (cursor.centerX / qpan) * qpan;
                                        var py = Math.round (cursor.centerY / qpan) * qpan;
                                        setCenter (globalSel, cursor.centerX + avgX * sindi, cursor.centerY + avgY * sindi);
                                        //setCenter (globalSel, cursor.centerX + avgX * sindi, cursor.centerY + avgY * sindi);
                                        if (oldx != cursor.centerX || oldy != cursor.centerY) {
                                            if (px !== globalSel.px || py !== globalSel.py) {
                                                redraw (null, "1", globalSel.cursor);
                                                globalSel.px = px;
                                                globalSel.py = py;
                                            }
                                                
                                            window.requestAnimationFrame(dInert);
                                            
                                        } else {
                                            panning = false;
                                            animating = false;
                                            redraw ({x: mouse.x, y: mouse.y});
                                            if (cnv.style.cursor !== "grabbing")
                                                setMouseHyperlink (mouse.x, mouse.y);

                                            idle ();
                                        }

                                    } else {
                                        panning = false;
                                        animating = false;
                                        redraw ({x: mouse.x, y: mouse.y});
                                        if (cnv.style.cursor !== "grabbing")
                                            setMouseHyperlink (mouse.x, mouse.y);

                                        idle ();
                                    }
                                } else if (mouseDown === 1) {
                                    var r0 = r1 * ratio;
                                    var x0 = Math.floor (x1 * squashX);
                                    var y0 = Math.floor ((y1 - (r1 - r0)) * squashY);
                                    
                                    if (!(Math.sqrt((dragX - x0) / squashX * (dragX - x0) / squashX + (dragY - y0) / squashY * (dragY - y0) / squashY) < r0)) {
                                        panning = false;
                                        animating = false;
                                        cursor.cachedCnv = false;
                                        preSelect = redraw ({x: mouse.x, y: mouse.y});
                                        
                                        idle ();
                                    }
                                    if (cnv.style.cursor !== "grabbing")
                                        setMouseHyperlink (mouse.x, mouse.y);
                                }
                            }
                            animating = true;
                            window.requestAnimationFrame(dInert);
                        }
                    }
                }
                    
                if (!animating){
                    panning = false;
                    redraw ({x: mouse.x, y: mouse.y});
                    
                    idle ();
                }
            */
            } else {
                dragging = false;
                panning = false;
                if (!animating) {
                    redraw ({x: mouse.x, y: mouse.y});
                    
                    idle ();
                }
            }
        }
        
        setMouseHyperlink (mouse.x, mouse.y);
    }
    
    function setDimensions(width, height) {
        ww = width;
        hh = height;

        if (ww > hh / ratio) {
            squashX = 1 / ratio;
            squashY = 1;
            rr = hh / 2 - shadowr;
            ferr = rr * uiscale;

            
        } else if (hh > ww / ratio){
            squashX = 1;
            squashY = 1 / ratio;
            rr = ww / 2 - shadowr;
            ferr = rr * uiscale;

        } else {
            if (ww > hh) {
                squashX = 1 / ratio;
                squashY = (hh - shadowr * 2) / (ww - shadowr * 2) / ratio;
                rr = (ww / 2 - shadowr) * ratio;
                ferr = rr * squashY * uiscale;
            } else {
                squashX = (ww - shadowr * 2) / (hh - shadowr * 2) / ratio;
                squashY = 1 / ratio;
                rr = (hh / 2 - shadowr) * ratio;
                ferr = rr * squashX * uiscale;
            }
        }
        
        x1 = (ww) / squashX / 2;
        y1 = (hh) / squashY / 2;// + rr * (uiscale - 1);
        
        rr = rr * uiscale;
        r1 = rr;

        xx = x1;
        yy = y1;
        
        
    }

    function resize(width, height, noidle) {
        setDimensions (width / pixelSize, height / pixelSize);
        alignX = 0;
        alignY = squashY * rr * 1 / 2;
    
        //fishEye = FishEye (ferr, squashX, squashY, superSampling, curvature, flatArea);

        n = fractalOvals (ctx, ratio, xx, yy, ww, hh, rr, squashX, squashY, drawCircle, fill1, back1);
        
        //minRadius = rr * squashX * squashY * Math.pow((1 - ratio), recCount) * ratio;
        minRadius = Math.floor(rr / ratio * Math.pow ((1 - ratio), recCount));
        minrad = minRadius;// / squashX / squashY; // if strict mode error, delete this line

        clip.setAttribute('cx', x1 * pixelSize * squashX);
        clip.setAttribute('cy', y1 * pixelSize * squashY);
        clip.setAttribute('rx', (r1) * pixelSize * squashX + shadowr);
        clip.setAttribute('ry', (r1) * pixelSize * squashY + shadowr);
        clip.setAttribute('stroke-width',  1);
        
        cnv.width = ww;
        cnv.height = hh;

        //cnv.setAttribute ("width", ww * 2 + "px");
        //cnv.setAttribute ("height", hh * 2 + "px");
        cnv.style.width = ww * pixelSize + "px";
        cnv.style.height = hh * pixelSize + "px";
        cnv.style.clipPath = "url(#clip128)";
        
        function clearData (data) {
            data.scaledBitmap = null;
            data.centerX = 0;
            data.centerY = NaN;
            
            for (var i = 0; i < data.children.length; i++)
                clearData (data.children[i]);

        }
        
        function updateCache (data) {
            if (data.scaledBitmap) {
                var cy = ~~Math.min (/*center*/ -data.scaledBitmap.height / 2 + alignY, data.scaledBitmap.height / 2);
                data.centerX = 0;
                data.centerY = cy;
                
                data.cachedCnv = getCnvCache (data, data.centerX, data.centerY, rr);
                data.cachedData = Crisp.crispBitmap (data.cachedCnv);
            }
            
            for (var i = 0; i < data.children.length; i++)
                updateCache (data.children[i]);

        }
        
        function updateCursor (c) {
            if (c) {
                c.centerX = 0;
                c.centerY = NaN;
                if (c.data && c.data.scaledBitmap)
                    c.centerY = ~~Math.min (/*center*/ -c.data.scaledBitmap.height / 2 + alignY, c.data.scaledBitmap.height / 2);
                
                for (var i = 0; i < c.children.length; i++)
                    updateCursor (c.children[i]);
                    
            }
        }
        
        var c = cursor;
        while (c.parent)
            c = c.parent;
            
        updateCursor (c);

        var d = data;
        while (d.parent)
            d = d.parent;

        clearData (d.children[0]);
        redraw ();
        if (!noidle)
            idle ();
        //updateCache (d.children[0]);
    }
    
    function busy () {
        if (onBusy) {
            onBusy ();
        }
    }
    
    function idle () {
        if (onIdle) {
            onIdle (renderData);
        }
    }
    
    var renderData;
    var mouse = {};
    var tt, ll, ww, hh, rr, ferr, xx, yy, w0, h0, squashX, squashY;
    var r1, x1, y1;
    var alignX, alignY
    var path = [], cursor, select, preSelect, animating, panning;
    var fishEye;
    cursor = {parent: null, index: 0, data: data, centerX: 0, centerY: 0, angle: Math.PI, children: []}
    cursor.parent = {index: 0, children: [cursor]};

    var level, levelrr, gettingLevel, animateAng0, animateAng0Start, animateAng2, animateAng2Start, curAnimateAng2;
    var lastMouseEvent, globalt0, globalSel;

    var mouseDown = 0;
    var dragX, dragY, dragging = false, oldCenterX, oldCenterY;
    var inert, inertIdx = 0;
    var inertPan, inertIdxPan = 0;
    
    var device = "mouse";

    var n = fractalOvals (ctx, ratio, xx, yy, ww, hh, rr, squashX, squashY, drawCircle, fill1, back1);
    var movingNode = null;

    var clipPath = document.createElementNS(svgns, 'clipPath');
    clipPath.setAttributeNS(null, 'id', 'clip128');
    svg.appendChild(clipPath);

    var clip = document.createElementNS(svgns, 'ellipse');
    clipPath.appendChild(clip);

    function setupMouseEvents () {
        window.addEventListener('mousemove', function (evt) {
            device = "mouse";
            mousemove (evt);
        }, false);
        window.addEventListener('mousedown',  function (evt) {
            device = "mouse";
            mousedown (evt);
        }, false);
        window.addEventListener('mouseup',  function (evt) {
            device = "mouse";
            mouseup (evt);
        }, false);
        
        window.addEventListener('contextmenu', function(evt) {
            if (callContextMenu) {
                evt.preventDefault();
                var sel = redraw ({x: evt.clientX, y: evt.clientY, button: 1});
                if (sel)
                    callContextMenu (evt, sel, cursor);
            }
            return false;
        }, false);
    }

    function setupTouchEvents () {
        var ongoingTouches = [];

        function copyTouch(touch) {
          return {identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY, which: 1};
        }

        function ongoingTouchIndexById(idToFind) {
          for (var i = 0; i < ongoingTouches.length; i++) {
            var id = ongoingTouches[i].identifier;
            
            if (id == idToFind) {
              return i;
            }
          }
          return -1;    // not found
        }

        window.addEventListener("touchstart", function (evt) {
            evt.preventDefault ();
            device = "touch";
            var touches = evt.changedTouches;
            
            for (var i = 0; i < touches.length; i++) {
                if (ongoingTouches.length === 0) {
                    ongoingTouches.push(copyTouch(touches[i]));
                    var idx = ongoingTouchIndexById(touches[i].identifier);
                    
                    if (idx >= 0) {
                        mousedown (ongoingTouches[idx]);
                    }
                }
            }
        }, false);

        window.addEventListener("touchmove", function (evt) {
            evt.preventDefault ();
            device = "touch";
            var touches = evt.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var idx = ongoingTouchIndexById(touches[i].identifier);

                if (idx >= 0) {
                    ongoingTouches[idx].pageX = touches[i].pageX;
                    ongoingTouches[idx].pageY = touches[i].pageY;
                    
                    mousemove (ongoingTouches[idx]);
                }
            }
        }, false);

        window.addEventListener("touchcancel", function (evt) {
            device = "touch";
            var touches = evt.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var idx = ongoingTouchIndexById(touches[i].identifier);

                if (idx >= 0) {
                    ongoingTouches[idx].pageX = touches[i].pageX;
                    ongoingTouches[idx].pageY = touches[i].pageY;

                    mouseup (ongoingTouches[idx]);

                    ongoingTouches.splice(idx, 1);
                }
            }
        }, false);

        window.addEventListener("touchend", function (evt) {
            evt.preventDefault ();
            device = "touch";
            var touches = evt.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var idx = ongoingTouchIndexById(touches[i].identifier);

                if (idx >= 0) {
                    ongoingTouches[idx].pageX = touches[i].pageX;
                    ongoingTouches[idx].pageY = touches[i].pageY;
                    
                    mouseup (ongoingTouches[idx]);

                    ongoingTouches.splice(idx, 1);
                }
            }
        }, false);
    }
    
    setupMouseEvents ();
    setupTouchEvents ();

    var initDone = false;
    if (!evts) {
        divContainer.addEventListener('resize1', function (e) {
            resize (divContainer.clientWidth, divContainer.clientHeight);
            if (!initDone) {
                idle();
                initDone = true;
            }
        });
        
        divContainer.addEventListener('redefineData', function (e) {
            data = prepareData (e.detail);
            cursor = {parent: null, index: 0, data: data, centerX: 0, centerY: 0, angle: Math.PI, children: []}
            cursor.parent = {index: 0, children: [cursor]};
            path = [];
            resize (divContainer.clientWidth, divContainer.clientHeight);
        });
        
        divContainer.addEventListener('idle', function (e) {
            idle ();
        });
        
        divContainer.addEventListener('redraw', function (e) {
            if (!animating && !dragging && !panning) {
                redraw ();
            }
        });
    }
    
    return {
        data: function () {
            var p = cursor;
            while (p.parent)
                p = p.parent;
                
            return p.children[0].data;
        }
    };
}
