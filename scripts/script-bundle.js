(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        throw new Error("Cannot find module '" + o + "'");
      }
      var f = (n[o] = { exports: {} });
      t[o][0].call(
        f.exports,
        function (e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        },
        f,
        f.exports,
        e,
        t,
        n,
        r
      );
    }
    return n[o].exports;
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
})(
  {
    1: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function ($context, script) {
          var isPoorBrowser = $("html").hasClass("poor-browser");
          if (!Modernizr.cssanimations || isPoorBrowser) {
            $(".scroll-in-animation").removeClass("scroll-in-animation");
            $(".scroll-animation").removeClass("scroll-animation");
            return;
          }
          $(".safari i.scroll-in-animation").removeClass("scroll-in-animation");
          $(".safari i.scroll-animation").removeClass("scroll-animation");
          $context
            .find(".scroll-in-animation, .scroll-animation")
            .each(function () {
              var $this = $(this);
              var delay = $this.data("delay");
              var animation =
                $this.data("animation") + " animated css-animation-show";
              var pause = function () {
                if (delay) {
                  setTimeout(function () {
                    $this.removeClass(animation);
                  }, delay);
                } else {
                  $this.removeClass(animation);
                }
              };
              var resume = function () {
                if (delay) {
                  setTimeout(function () {
                    $this.addClass(animation);
                  }, delay);
                } else {
                  $this.addClass(animation);
                }
              };
              var start = resume;
              script.players.addPlayer($this, start, pause, resume);
            });
        };
      },
      {},
    ],
    2: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        var players = [];
        players.addPlayer = function ($view, startFunc, pauseFunc, resumeFunc) {
          players.push(
            new (function () {
              var played = false;
              var started = false;
              this.$view = $view;
              $view.addClass("player").data("player-ind", players.length);
              this.play = function () {
                if (!played) {
                  played = true;
                  if (!started) {
                    started = true;
                    startFunc();
                  } else {
                    resumeFunc();
                  }
                }
              };
              this.pause = function () {
                if (played) {
                  played = false;
                  pauseFunc();
                }
              };
            })()
          );
        };
        module.exports = players;
      },
      {},
    ],
    3: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function (script) {
          var me = this;
          var tools = require("../tools/tools.js");
          var ScrollAnimation = require("../app/scroll-animation.js");
          var $window = $(window);
          var isPoorBrowser = $("html").hasClass("poor-browser");
          var scrollAnimation = new ScrollAnimation(me, script);
          this.windowTopPos = undefined;
          this.windowBottomPos = undefined;
          this.windowH = undefined;
          this.scroll = function (windowTopP) {
            me.windowH = $window.height();
            me.windowTopPos = windowTopP;
            me.windowBottomPos = windowTopP + me.windowH;
            if (me.windowTopPos < script.topNav.state1Top()) {
              script.topNav.state1();
            } else {
              script.topNav.state2();
            }
            scrollAnimation.scroll();
            for (var i = 0; i < script.players.length; i++) {
              var viewPos = me.calcPosition(script.players[i].$view);
              if (viewPos.visible) {
                script.players[i].play();
              } else {
                script.players[i].pause();
              }
            }
          };
          this.calcPosition = function ($block) {
            var blockH = $block.height();
            var blockTopPos = $block.data("position");
            var blockBottomPos = blockTopPos + blockH;
            return {
              top: blockTopPos,
              bottom: blockBottomPos,
              height: blockH,
              visible:
                blockTopPos < me.windowBottomPos &&
                blockBottomPos > me.windowTopPos,
            };
          };
        };
      },
      { "../app/scroll-animation.js": 7, "../tools/tools.js": 11 },
    ],
    4: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function () {
          var appShare = require("../app/app-share.js");
          var isPoorBrowser = $("html").hasClass("poor-browser");
          var fadeTime = 4000;
          var moveTime = 12000;
          var st0 = { scale: 1 };
          var st1 = { scale: 1.1 };
          var rules = [
            [st0, st1],
            [st1, st0],
          ];
          var origins = [
            { or: "left top", xr: 0, yr: 0 },
            { or: "left center", xr: 0, yr: 1 },
            { or: "right top", xr: 2, yr: 0 },
            { or: "right center", xr: 2, yr: 1 },
          ];
          var lastRule = rules.length - 1;
          var lastOrigin = origins.length - 1;
          var fadeEase = TWEEN.Easing.Quartic.InOut;
          var moveEase = TWEEN.Easing.Linear.None;
          this.run = function ($slides) {
            if (isPoorBrowser) return;
            var lastI = $slides.length - 1;
            show(lastI, true);
            function show(i, isFirstRun) {
              var slide = $slides.get(i);
              var $slide = $(slide);
              var cfg = $slide.data();
              var ri = Math.round(Math.random() * lastRule);
              var ori = Math.round(Math.random() * lastOrigin);
              var rule = rules[ri];
              cfg.ssScale = rule[0]["scale"];
              cfg.ssOrig = origins[ori];
              cfg.ssOpacity = i === lastI && !isFirstRun ? 0 : 1;
              if (i === lastI && !isFirstRun) {
                new TWEEN.Tween(cfg)
                  .to({ ssOpacity: 1 }, fadeTime)
                  .easing(fadeEase)
                  .onComplete(function () {
                    $slides.each(function () {
                      $(this).data().ssOpacity = 1;
                    });
                  })
                  .start();
              }
              new TWEEN.Tween(cfg)
                .to({ ssScale: rule[1]["scale"] }, moveTime)
                .easing(moveEase)
                .start();
              if (i > 0) {
                new TWEEN.Tween({ ssOpacity: 1 })
                  .to({ ssOpacity: 0 }, fadeTime)
                  .onUpdate(function () {
                    cfg.ssOpacity = this.ssOpacity;
                  })
                  .easing(fadeEase)
                  .delay(moveTime - fadeTime)
                  .onStart(function () {
                    show(i - 1);
                  })
                  .start();
              } else {
                new TWEEN.Tween(cfg)
                  .to({}, 0)
                  .easing(fadeEase)
                  .delay(moveTime - fadeTime)
                  .onStart(function () {
                    show(lastI);
                  })
                  .start();
              }
            }
          };
        };
      },
      { "../app/app-share.js": 5 },
    ],
    5: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = new (function () {
          var me = this;
          var isOldWin =
            navigator.appVersion.indexOf("Windows NT 6.1") != -1 ||
            navigator.appVersion.indexOf("Windows NT 6.0") != -1 ||
            navigator.appVersion.indexOf("Windows NT 5.1") != -1 ||
            navigator.appVersion.indexOf("Windows NT 5.0") != -1;
          var isIE9 = $("html").hasClass("ie9");
          var isIE10 = $("html").hasClass("ie10");
          var isIE11 = $("html").hasClass("ie11");
          var isPoorBrowser = $("html").hasClass("poor-browser");
          var isMobile = $("html").hasClass("mobile");
          var factor = (function () {
            if (isIE9 || isIE10 || (isIE11 && isOldWin)) {
              return 0;
            } else if (isIE11) {
              return -0.15;
            } else if (isPoorBrowser) {
              return 0;
            } else {
              return -0.25;
            }
          })();
          this.force3D = isMobile ? false : true;
          this.parallaxMargin = function (
            script,
            secInd,
            viewOffsetFromWindowTop
          ) {
            var viewOffsetFromNavPoint =
              viewOffsetFromWindowTop -
              (secInd === 0 ? 0 : script.topNav.state2H);
            return Math.round(factor * viewOffsetFromNavPoint);
          };
        })();
      },
      {},
    ],
    6: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = new (function () {
          var appShare = require("./app-share.js");
          var themes = require("./themes.js");
          var SlideShow = require("../animation/slide-show.js");
          var slideShow = new SlideShow();
          var isPoorBrowser = $("html").hasClass("poor-browser");
          var isMobile = $("html").hasClass("mobile");
          var skewH = 60;
          var $bord = $("#top-nav, .page-border, #dot-scroll");
          var $topNav = $("#top-nav");
          var state1Colors = $topNav.data("state1-colors");
          var state2Colors = $topNav.data("state2-colors");
          var $body = $("body");
          var $views = $(".view");
          var $bacgrounds;
          this.prepare = function (callback) {
            if (
              window.location.protocol === "file:" &&
              !$("body").hasClass("example-page")
            ) {
              $(
                '<div class="file-protocol-alert alert colors-d background-80 heading fade in">	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button> Upload files to web server and open template from web server. If template is opened from local file system, some links, functions and examples may work incorrectly.</div>'
              ).appendTo("body");
            }
            if (appShare.force3D === true) {
              $("html").addClass("force3d");
            }
            if (isPoorBrowser) {
              var $bodyBg = $("body>.bg");
              $bodyBg.each(function (i) {
                if (i === $bodyBg.length - 1) {
                  $(this).css("display", "block");
                } else {
                  $(this).remove();
                }
              });
              $(".view").each(function () {
                var $viewBg = $(this).children(".bg");
                $viewBg.each(function (i) {
                  if (i === $viewBg.length - 1) {
                    $(this).css("display", "block");
                  } else {
                    $(this).remove();
                  }
                });
              });
            }
            if (isMobile) {
              var $bodyImg = $("body>img.bg");
              var $defImgSet =
                $bodyImg.length > 0 ? $bodyImg : $(".view>img.bg");
              if ($defImgSet.length > 0) {
                var $defImg = $($defImgSet[0]);
                $(".view").each(function () {
                  var $sec = $(this);
                  var $bg = $sec.children("img.bg");
                  if ($bg.length < 1) {
                    $defImg.clone().prependTo($sec);
                  }
                });
              }
              $("body>img.bg").remove();
            }
            $bacgrounds = $(".bg");
            callback();
          };
          this.setup = function (callback) {
            var goodColor = function ($el) {
              var bg = $el.css("background-color");
              return (
                bg.match(/#/i) || bg.match(/rgb\(/i) || bg.match(/rgba.*,0\)/i)
              );
            };
            $(".view.section-header").each(function () {
              var $this = $(this);
              var $next = $this.nextAll(".view").first().children(".content");
              if ($next.length > 0 && goodColor($next)) {
                $this.children(".content").addClass("skew-bottom-right");
              }
            });
            $(".view.section-footer").each(function () {
              var $this = $(this);
              var $prev = $this.prevAll(".view").first().children(".content");
              if ($prev.length > 0 && goodColor($prev)) {
                $this.children(".content").addClass("skew-top-right");
              }
            });
            $views
              .find(".content")
              .filter(
                ".skew-top-right, .skew-top-left, .skew-bottom-left, .skew-bottom-right"
              )
              .each(function () {
                var $content = $(this);
                var $view = $content.parent();
                if (
                  $content.hasClass("skew-top-right") ||
                  $content.hasClass("skew-top-left")
                ) {
                  var $prev = $view
                    .prevAll(".view")
                    .first()
                    .children(".content");
                  if ($prev.length > 0 && goodColor($prev)) {
                    var type = $content.hasClass("skew-top-right") ? 1 : 2;
                    $(
                      '<div class="skew skew-top-' +
                        (type === 1 ? "right" : "left") +
                        '"></div>'
                    )
                      .appendTo($content)
                      .css({
                        position: "absolute",
                        top: "0px",
                        width: "0px",
                        height: "0px",
                        "border-top-width": type === 2 ? skewH + "px" : "0px",
                        "border-right-width": "2880px",
                        "border-bottom-width":
                          type === 1 ? skewH + "px" : "0px",
                        "border-left-width": "0px",
                        "border-style": "solid solid solid dashed",
                        "border-bottom-color": "transparent",
                        "border-left-color": "transparent",
                      })
                      .addClass(getColorClass($prev));
                  }
                }
                if (
                  $content.hasClass("skew-bottom-left") ||
                  $content.hasClass("skew-bottom-right")
                ) {
                  var $next = $view
                    .nextAll(".view")
                    .first()
                    .children(".content");
                  if ($next.length > 0 && goodColor($next)) {
                    var type = $content.hasClass("skew-bottom-left") ? 1 : 2;
                    $(
                      '<div class="skew skew-bottom-' +
                        (type === 1 ? "left" : "right") +
                        '"></div>'
                    )
                      .appendTo($content)
                      .css({
                        position: "absolute",
                        bottom: "0px",
                        width: "0px",
                        height: "0px",
                        "border-top-width": type === 1 ? skewH + "px" : "0px",
                        "border-right-width": "0px",
                        "border-bottom-width":
                          type === 2 ? skewH + "px" : "0px",
                        "border-left-width": "2880px",
                        "border-style": "solid dashed solid solid",
                        "border-top-color": "transparent",
                        "border-right-color": "transparent",
                      })
                      .addClass(getColorClass($next));
                  }
                }
              });
            callback();
            function getColorClass($el) {
              for (var i = 0; i < themes.colors; i++) {
                var colorClass =
                  "colors-" + String.fromCharCode(65 + i).toLowerCase();
                if ($el.hasClass(colorClass)) {
                  return colorClass;
                }
              }
            }
          };
          this.ungated = function () {
            $("body, .view").each(function () {
              var $bg = $(this).children(".bg");
              if ($bg.length > 1) slideShow.run($bg);
            });
          };
          this.tick = function () {
            $bacgrounds.each(function () {
              var $this = $(this);
              var cfg = $this.data();
              var opa, xr, yr, or;
              if (cfg.ssOpacity !== undefined) {
                opa = cfg.ssOpacity;
                xr = cfg.ssOrig.xr;
                yr = cfg.ssOrig.yr;
                or = cfg.ssOrig.or;
              } else {
                opa = 1;
                xr = 1;
                yr = 1;
                or = "center center";
              }
              var x = cfg.normalX + cfg.zoomXDelta * xr;
              var y =
                cfg.normalY +
                cfg.zoomYDelta * yr +
                (cfg.parallaxY !== undefined ? cfg.parallaxY : 0);
              var sc =
                cfg.normalScale * (cfg.ssScale !== undefined ? cfg.ssScale : 1);
              if (Modernizr.csstransforms3d && appShare.force3D) {
                $this.css({
                  transform:
                    "translate3d(" +
                    x +
                    "px, " +
                    y +
                    "px, 0px) scale(" +
                    sc +
                    ", " +
                    sc +
                    ")",
                  opacity: opa,
                  "transform-origin": or + " 0px",
                });
              } else {
                $this.css({
                  transform:
                    "translate(" +
                    x +
                    "px, " +
                    y +
                    "px) scale(" +
                    sc +
                    ", " +
                    sc +
                    ")",
                  opacity: opa,
                  "transform-origin": or,
                });
              }
            });
          };
          this.buildSizes = function (script) {
            var $window = $(window);
            var wh = $window.height();
            var ww = $window.width();
            var $tnav = $("#top-nav:visible");
            var sh = wh - ($tnav.length > 0 ? script.topNav.state2H : 0);
            var $bbord = $(".page-border.bottom:visible");
            var borderH = $bbord.length > 0 ? $bbord.height() : 0;
            $(".full-size, .half-size, .one-third-size").each(function () {
              var $this = $(this);
              var minPaddingTop = parseInt(
                $this
                  .css({ "padding-top": "" })
                  .css("padding-top")
                  .replace("px", "")
              );
              var minPaddingBottom = parseInt(
                $this
                  .css({ "padding-bottom": "" })
                  .css("padding-bottom")
                  .replace("px", "")
              );
              var minFullH = sh - ($bbord.length > 0 ? borderH : 0);
              var minHalfH = Math.ceil(minFullH / 2);
              var min13H = Math.ceil(minFullH / 3);
              var min = $this.hasClass("full-size")
                ? minFullH
                : $this.hasClass("half-size")
                ? minHalfH
                : min13H;
              $this.css({
                "padding-top": minPaddingTop + "px",
                "padding-bottom": minPaddingBottom + "px",
              });
              if (
                $this.hasClass("stretch-height") ||
                $this.hasClass("stretch-full-height")
              ) {
                $this.css({ height: "" });
              }
              var thisH = $this.height();
              if (thisH < min) {
                var delta = min - thisH - minPaddingTop - minPaddingBottom;
                if (delta < 0) {
                  delta = 0;
                }
                var topPlus = Math.round(delta / 2);
                var bottomPlus = delta - topPlus;
                var newPaddingTop = minPaddingTop + topPlus;
                var newPaddingBottom = minPaddingBottom + bottomPlus;
                $this.css({
                  "padding-top": newPaddingTop + "px",
                  "padding-bottom": newPaddingBottom + "px",
                });
              }
            });
            $(".stretch-height").each(function () {
              var $this = $(this);
              var $par = $this.parent();
              var $strs = $par.find(".stretch-height");
              $strs.css("height", "");
              if ($this.outerWidth() < $par.innerWidth()) {
                $strs.css("height", $par.innerHeight() + "px");
              }
            });
            $(".stretch-full-height").each(function () {
              var $this = $(this);
              var $par = $this.parent();
              var $strs = $par.find(".stretch-full-height");
              $strs.css("height", "");
              if ($this.outerWidth() < $par.innerWidth()) {
                var parH = $par.innerHeight();
                var strsH = wh < parH ? parH : wh;
                $strs.css("height", strsH + "px");
              }
            });
            $views.each(function (i) {
              var $view = $(this);
              var $content = $view.find(".content");
              var $skewTop = $content.find(
                ".skew.skew-top-right, .skew.skew-top-left"
              );
              var $skewBottom = $content.find(
                ".skew.skew-bottom-left, .skew.skew-bottom-right"
              );
              var contentWPx = $content.width() + "px";
              $skewBottom.css({ "border-left-width": contentWPx });
              $skewTop.css({ "border-right-width": contentWPx });
              var viewH = $view.height();
              var viewW = $view.width();
              var targetH = (function () {
                var viewOffset1 = -1 * viewH;
                var viewOffset2 = 0;
                var viewOffset3 = wh - viewH;
                var viewOffset4 = wh;
                var marg1 = appShare.parallaxMargin(script, i, viewOffset1);
                var marg2 = appShare.parallaxMargin(script, i, viewOffset2);
                var marg3 = appShare.parallaxMargin(script, i, viewOffset3);
                var marg4 = appShare.parallaxMargin(script, i, viewOffset4);
                var topDelta = function (viewOffset, marg) {
                  return marg + (viewOffset > 0 ? 0 : viewOffset);
                };
                var bottomDelta = function (viewOffset, marg) {
                  var bottomOffset = viewOffset + viewH;
                  return -marg - (bottomOffset < wh ? 0 : bottomOffset - wh);
                };
                var delta = 0;
                var curDelta;
                curDelta = topDelta(viewOffset1, marg1);
                if (curDelta > delta) delta = curDelta;
                curDelta = topDelta(viewOffset2, marg2);
                if (curDelta > delta) delta = curDelta;
                curDelta = topDelta(viewOffset3, marg3);
                if (curDelta > delta) delta = curDelta;
                curDelta = topDelta(viewOffset4, marg4);
                if (curDelta > delta) delta = curDelta;
                curDelta = bottomDelta(viewOffset1, marg1);
                if (curDelta > delta) delta = curDelta;
                curDelta = bottomDelta(viewOffset2, marg2);
                if (curDelta > delta) delta = curDelta;
                curDelta = bottomDelta(viewOffset3, marg3);
                if (curDelta > delta) delta = curDelta;
                curDelta = bottomDelta(viewOffset4, marg4);
                if (curDelta > delta) delta = curDelta;
                return viewH + 2 * delta;
              })();
              $view.children("img.bg").each(function () {
                bgSize($(this), targetH, viewW, viewH);
              });
              $view.data("position", $view.offset().top);
            });
            $("section").each(function () {
              var $this = $(this);
              $this.data("position", $this.offset().top);
            });
            $("body")
              .children("img.bg")
              .each(function () {
                bgSize($(this), wh, ww, wh);
              });
            function bgSize($bg, targetH, viewW, viewH) {
              var nat = natSize($bg);
              var scale =
                viewW / targetH > nat.w / nat.h
                  ? viewW / nat.w
                  : targetH / nat.h;
              var newW = nat.w * scale;
              var newH = nat.h * scale;
              var zoomXDelta = (newW - nat.w) / 2;
              var zoomYDelta = (newH - nat.h) / 2;
              var x = Math.round((viewW - newW) / 2);
              var y = Math.round((viewH - newH) / 2);
              var cfg = $bg.data();
              cfg.normalScale = scale;
              cfg.normalX = x;
              cfg.normalY = y;
              cfg.zoomXDelta = zoomXDelta;
              cfg.zoomYDelta = zoomYDelta;
            }
          };
          this.changeSection = function (script, sectionHash) {
            var $sect = $(sectionHash);
            var cls = $sect.data("border-colors");
            if (cls) {
              $bord.removeClass(themes.colorClasses);
              $bord.addClass(cls);
            } else {
              if ($body.hasClass("state2") && state2Colors) {
                $bord.removeClass(themes.colorClasses);
                $bord.addClass(state2Colors);
              } else if (state1Colors) {
                $bord.removeClass(themes.colorClasses);
                $bord.addClass(state1Colors);
              }
            }
          };
          function natSize($bg) {
            var elem = $bg.get(0);
            var natW, natH;
            if (elem.tagName.toLowerCase() === "img") {
              natW = elem.width;
              natH = elem.height;
            } else if (elem.naturalWidth) {
              natW = elem.naturalWidth;
              natH = elem.naturalHeight;
            } else {
              var orig = $bg.width();
              $bg.css({ width: "", height: "" });
              natW = $bg.width();
              natH = $bg.height();
              $bg.css({ width: orig });
            }
            return { w: natW, h: natH };
          }
        })();
      },
      {
        "../animation/slide-show.js": 4,
        "./app-share.js": 5,
        "./themes.js": 8,
      },
    ],
    7: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function (scrolling, script) {
          var $views = $(".view");
          var appShare = require("./app-share.js");
          var isPoorBrowser = $("html").hasClass("poor-browser");
          this.scroll = function () {
            if (isPoorBrowser) return;
            $views.each(function (i) {
              var $view = $(this);
              var viewPos = scrolling.calcPosition($view);
              if (viewPos.visible) {
                var viewOffset = viewPos.top - scrolling.windowTopPos;
                $view.children(".bg:not(.static)").each(function () {
                  var cfg = $(this).data();
                  cfg.parallaxY = appShare.parallaxMargin(
                    script,
                    i,
                    viewOffset
                  );
                });
              }
            });
          };
        };
      },
      { "./app-share.js": 5 },
    ],
    8: [
      function (require, module, exports) {
        "use strict";
        module.exports = new (function () {
          var me = this;
          this.options = {
            angie: {
              style: "theme-angie",
              bgSync: ["**/*.txt", "**/*"],
              videoSync: [],
            },
            lynda: {
              style: "theme-lynda",
              bgSync: ["**/*.txt", "**/*"],
              videoSync: [],
            },
            alice: {
              style: "theme-alice",
              bgSync: ["**/*.txt", "**/*"],
              videoSync: [],
            },
            lucy: {
              style: "theme-lucy",
              bgSync: ["**/*.txt", "**/*"],
              videoSync: [],
            },
            mary: {
              style: "theme-alice",
              bgSync: ["**/*.txt", "**/*"],
              videoSync: [],
            },
            suzi: {
              style: "theme-suzi",
              bgSync: ["**/*.txt", "**/*"],
              videoSync: [],
            },
            viki: {
              style: "theme-viki",
              bgSync: ["**/*.txt", "**/*"],
              videoSync: [],
            },
            luiza: {
              style: "theme-luiza",
              bgSync: ["**/*.txt", "**/*"],
              videoSync: [],
            },
          };
          this.names = {};
          this.colors = 8;
          this.colorClasses = (function () {
            var res = "";
            for (var i = 0; i < me.colors; i++) {
              var sep = i === 0 ? "" : " ";
              res +=
                sep + "colors-" + String.fromCharCode(65 + i).toLowerCase();
            }
            return res;
          })();
        })();
      },
      {},
    ],
    9: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function (script) {
          var themes = require("../app/themes.js");
          var tools = require("../tools/tools.js");
          var loading = require("../widgets/loading.js");
          var appShare = require("../app/app-share.js");
          var colors = themes.colors;
          var me = this;
          var cPath = "";
          var customCss;
          var $window = $(window);
          var $panel;
          var $opt;
          var $toggle;
          var optW;
          var $customCss;
          var $themesSelect;
          var $colors;
          var isInitialized = false;
          this.lessVars = {};
          this.isShowPanel = (function () {
            var customizeP = tools.getUrlParameter("customize");
            if (customizeP === undefined) {
              customizeP = $.cookie("customize");
            } else {
              $.cookie("customize", "yes", { path: cPath });
            }
            return customizeP && $("#top-nav").length > 0 ? true : false;
          })();
          this.show = function () {
            setTimeout(function () {
              if (!isInitialized) {
                isInitialized = true;
                createCss(true);
                initLessVars();
                var $gate = $opt.find(".options-gate");
                $gate.css({ opacity: 0 });
                setTimeout(function () {
                  $gate.css({ visibility: "hidden" });
                }, 1000);
              }
            }, 550);
            $panel.css({ left: "0px" });
            $panel.addClass("on");
          };
          this.hide = function () {
            $panel.css({ left: -1 * optW + "px" });
            $panel.removeClass("on");
          };
          function resize() {
            $opt.css({
              height:
                $window.height() -
                parseInt($panel.css("top").replace("px", "")) -
                30 +
                "px",
            });
          }
          function themeSelectToCustom() {
            if ($themesSelect.val() !== "custom") {
              $('<option value="custom">Custom</option>').appendTo(
                $themesSelect
              );
              $themesSelect.val("custom");
              $.cookie.json = false;
              $.cookie("themeSelect", "custom", { path: cPath });
              $.cookie.json = true;
            }
          }
          function initLessVars() {
            for (var i = 0; i < colors; i++) {
              initGroup(String.fromCharCode(65 + i).toLowerCase());
            }
            initLessVar(
              '<span><span class="primary-color"></span></span>',
              ".primary-color",
              "color",
              "input.primary-bg",
              "primary-bg",
              toHex
            );
            initLessVar(
              '<span><span class="out-primary"></span></span>',
              ".out-primary",
              "opacity",
              "input.primary-out",
              "primary-out",
              outTranslator,
              outSetTranslator
            );
            initLessVar(
              '<span><span class="success-color"></span></span>',
              ".success-color",
              "color",
              "input.success-bg",
              "success-bg",
              toHex
            );
            initLessVar(
              '<span><span class="out-success"></span></span>',
              ".out-success",
              "opacity",
              "input.success-out",
              "success-out",
              outTranslator,
              outSetTranslator
            );
            initLessVar(
              '<span><span class="info-color"></span></span>',
              ".info-color",
              "color",
              "input.info-bg",
              "info-bg",
              toHex
            );
            initLessVar(
              '<span><span class="out-info"></span></span>',
              ".out-info",
              "opacity",
              "input.info-out",
              "info-out",
              outTranslator,
              outSetTranslator
            );
            initLessVar(
              '<span><span class="warning-color"></span></span>',
              ".warning-color",
              "color",
              "input.warning-bg",
              "warning-bg",
              toHex
            );
            initLessVar(
              '<span><span class="out-warning"></span></span>',
              ".out-warning",
              "opacity",
              "input.warning-out",
              "warning-out",
              outTranslator,
              outSetTranslator
            );
            initLessVar(
              '<span><span class="danger-color"></span></span>',
              ".danger-color",
              "color",
              "input.danger-bg",
              "danger-bg",
              toHex
            );
            initLessVar(
              '<span><span class="out-danger"></span></span>',
              ".out-danger",
              "opacity",
              "input.danger-out",
              "danger-out",
              outTranslator,
              outSetTranslator
            );
          }
          function initGroup(grp) {
            initLessVar(
              '<span class="colors-' +
                grp +
                '"><span class="bg-color"></span></span>',
              ".bg-color",
              "color",
              "input." + grp + "-bg",
              grp + "-bg",
              toHex
            );
            initLessVar(
              '<span class="colors-' +
                grp +
                '"><span class="text"></span></span>',
              ".text",
              "color",
              "input." + grp + "-text",
              grp + "-text",
              toHex
            );
            initLessVar(
              '<span class="colors-' +
                grp +
                '"><span class="highlight"></span></span>',
              ".highlight",
              "color",
              "input." + grp + "-highlight",
              grp + "-highlight",
              toHex
            );
            initLessVar(
              '<span class="colors-' +
                grp +
                '"><span class="link"></span></span>',
              ".link",
              "color",
              "input." + grp + "-link",
              grp + "-link",
              toHex
            );
            initLessVar(
              '<span class="colors-' +
                grp +
                '"><span class="heading"></span></span>',
              ".heading",
              "color",
              "input." + grp + "-heading",
              grp + "-heading",
              toHex
            );
            initLessVar(
              '<span class="colors-' +
                grp +
                '"><span class="out"></span></span>',
              ".out",
              "opacity",
              "input." + grp + "-out",
              grp + "-out",
              outTranslator,
              outSetTranslator
            );
          }
          function outTranslator(v) {
            return Math.round((1 - v) * 100);
          }
          function outSetTranslator(v) {
            return Math.round(v);
          }
          function initLessVar(
            getterHtml,
            getterQ,
            cssProperty,
            inputQ,
            lessVar,
            translator,
            setTranslator
          ) {
            var $g = $('<span class="getter"></span>').appendTo("body");
            $(getterHtml).appendTo($g);
            var getted = $g.find(getterQ).css(cssProperty);
            $g.remove();
            if (getted) {
              if (translator) getted = translator(getted);
            }
            me.lessVars[lessVar] = getted;
            var $inp = $opt.find(inputQ);
            $inp.val(getted);
            if (cssProperty === "color") {
              $inp.minicolors({
                control: $(this).attr("data-control") || "hue",
                defaultValue: $(this).attr("data-defaultValue") || "",
                inline: $(this).attr("data-inline") === "true",
                letterCase: $(this).attr("data-letterCase") || "lowercase",
                opacity: false,
                position: $(this).attr("data-position") || "top left",
                change: function (hex, opacity) {
                  themeSelectToCustom();
                  me.lessVars[lessVar] = hex;
                  createCss();
                },
                show: function () {
                  var $mc = $inp.parent();
                  var $mcPanel = $mc.children(".minicolors-panel");
                  var mcPanelH = $mcPanel.outerHeight(true);
                  var mcPanelW = $mcPanel.outerWidth(true);
                  var $window = $(window);
                  var wW = $window.width();
                  var wH = $window.height();
                  var offset = $mcPanel.offset();
                  var left = offset.left - $(document).scrollLeft();
                  var top = offset.top - $(document).scrollTop();
                  if (left + mcPanelW > wW) {
                    left = wW - mcPanelW - 5;
                  }
                  if (top + mcPanelH > wH) {
                    top = wH - mcPanelH - 2;
                  }
                  if (top < 0) {
                    top = 2;
                  }
                  $mcPanel.css({
                    position: "fixed",
                    left: left + "px",
                    top: top + "px",
                  });
                },
                hide: function () {
                  $inp
                    .parent()
                    .children(".minicolors-panel")
                    .css({ position: "", left: "", top: "" });
                },
                theme: "bootstrap",
              });
            } else {
              var timer;
              $inp.change(function () {
                var $el = $(this);
                var val = $el.val();
                if (timer) {
                  clearTimeout(timer);
                }
                themeSelectToCustom();
                me.lessVars[lessVar] = val;
                createCss();
              });
            }
            function colorFormat(val) {
              if (
                !val.match(
                  /^#[0-9a-fA-f][0-9a-fA-f][0-9a-fA-f][0-9a-fA-f][0-9a-fA-f][0-9a-fA-f]$/i
                )
              ) {
                if (val.match(/^#[0-9a-fA-f][0-9a-fA-f][0-9a-fA-f]$/i)) {
                  return (
                    "#" +
                    val.charAt(1) +
                    val.charAt(1) +
                    val.charAt(2) +
                    val.charAt(2) +
                    val.charAt(3) +
                    val.charAt(3)
                  );
                } else {
                  return null;
                }
              } else {
                return val;
              }
            }
          }
          function buildPanel() {
            if (!me.isShowPanel) {
              $panel.hide();
              return;
            } else {
              if (Object.keys(themes.names).length > 0) {
                for (var k in themes.names) {
                  $(
                    '<option value="' + k + '">' + themes.names[k] + "</option>"
                  ).appendTo($themesSelect);
                }
              } else {
                $themesSelect.remove();
                $('<a class="button" href="#">Reset</a>')
                  .appendTo($opt.find(".themes"))
                  .click(function (e) {
                    e.preventDefault();
                    $.cookie.json = false;
                    $.cookie("themeSelect", "", { path: cPath });
                    $.cookie.json = true;
                    me.hide();
                    loading.gate(function () {
                      location.reload();
                    });
                  });
              }
              $.cookie.json = false;
              var themeSelectC = $.cookie("themeSelect");
              $.cookie.json = true;
              if (themeSelectC === "custom") {
                themeSelectToCustom();
              } else if (themeSelectC) {
                $themesSelect.val(themeSelectC);
              } else {
                var $factory = $("#factory-theme");
                if (
                  $factory.length > 0 &&
                  $factory.css("visibility") === "hidden"
                ) {
                  var ts = themes.options[$factory.html()].style;
                  $themesSelect.val(ts);
                  $.cookie.json = false;
                  $.cookie("themeSelect", ts, { path: cPath });
                  $.cookie.json = true;
                }
              }
              $themesSelect.change(function () {
                $(".options .themes select option[value=custom]").remove();
                var href = $(this).val();
                $.cookie.json = false;
                $.cookie("themeSelect", href, { path: cPath });
                $.cookie.json = true;
                me.hide();
                loading.gate(function () {
                  location.reload();
                });
              });
              $panel.css({ left: -1 * optW + "px" });
              $toggle.click(function (e) {
                e.preventDefault();
                if ($panel.hasClass("on")) {
                  me.hide();
                } else {
                  me.show();
                }
              });
              $opt.find(".save-custom-css").click(function (e) {
                e.preventDefault();
                var $content = $customCss.find(".content");
                if ($.cookie("saveAsLess")) {
                  var lessStr = '@import "theme.less";\r\n\r\n';
                  for (var key in me.lessVars) {
                    lessStr =
                      lessStr + "@" + key + ": " + me.lessVars[key] + ";\r\n";
                    $content.text(lessStr);
                  }
                } else {
                  if (!customCss) createCss();
                  $content.text(customCss.replace(/(\r\n|\r|\n)/g, "\r\n"));
                }
                new TWEEN.Tween({ autoAlpha: 0, x: -450 })
                  .to({ autoAlpha: 1, x: 0 }, 400)
                  .onUpdate(function () {
                    $customCss.css({
                      opacity: this.autoAlpha,
                      visibility: this.autoAlpha > 0 ? "visible" : "hidden",
                    });
                    if (Modernizr.csstransforms3d && appShare.force3D) {
                      $customCss.css({
                        transform: "translate3d(" + this.x + "px, 0px, 0px)",
                      });
                    } else {
                      $customCss.css({
                        transform: "translate(" + this.x + "px, 0px)",
                      });
                    }
                  })
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
              });
              $customCss.find(".close-panel").click(function (e) {
                e.preventDefault();
                new TWEEN.Tween({ autoAlpha: 1, x: 0 })
                  .to({ autoAlpha: 0, x: -450 }, 400)
                  .onUpdate(function () {
                    $customCss.css({
                      opacity: this.autoAlpha,
                      visibility: this.autoAlpha > 0 ? "visible" : "hidden",
                    });
                    if (Modernizr.csstransforms3d && appShare.force3D) {
                      $customCss.css({
                        transform: "translate3d(" + this.x + "px, 0px, 0px)",
                      });
                    } else {
                      $customCss.css({
                        transform: "translate(" + this.x + "px, 0px)",
                      });
                    }
                  })
                  .easing(TWEEN.Easing.Linear.None)
                  .start();
              });
              tools.selectTextarea($customCss.find("textarea"));
              var colorsBg = $colors.css("background-image");
              if (!colorsBg || colorsBg == "none") {
                var $bgIm = $("img.bg");
                if ($bgIm.length > 0) {
                  $colors.css({
                    "background-image": "url('" + $bgIm.get(0).src + "')",
                    "background-position": "center center",
                    "background-size": "cover",
                  });
                }
              }
            }
          }
          function createCss(isInitOnly) {
            var custom = atob(customLess);
            $.cookie("lessVars", me.lessVars, { path: cPath });
            doLess(custom, function (css) {
              if (!isInitOnly) {
                var ems = "edit-mode-styles";
                customCss = css;
                var $cur = $("#" + ems);
                if ($cur.length < 1) {
                  $(
                    '<style type="text/css" id="' +
                      ems +
                      '">\n' +
                      css +
                      "</style>"
                  ).appendTo("head");
                  $("#custom-css").remove();
                } else {
                  if ($cur[0].innerHTML) {
                    $cur[0].innerHTML = customCss;
                  } else {
                    $cur[0].styleSheet.cssText = customCss;
                  }
                }
              }
            });
          }
          function doLess(data, callback) {
            less.render(
              data,
              {
                currentDirectory: "styles/themes/",
                filename: "styles/themes/theme-default.less",
                entryPath: "styles/themes/",
                rootpath: "styles/themes/styles/themes/",
                rootFilename: "styles/themes/theme-default.less",
                relativeUrls: false,
                useFileCache: me.lessVars || less.globalVars,
                compress: false,
                modifyVars: me.lessVars,
                globalVars: less.globalVars,
              },
              function (e, output) {
                callback(output.css);
              }
            );
          }
          function toHex(rgb) {
            if (rgb.indexOf("rgb") === -1) {
              return rgb;
            } else {
              var triplet = rgb.match(
                /[^0-9]*([0-9]*)[^0-9]*([0-9]*)[^0-9]*([0-9]*)[^0-9]*/i
              );
              return (
                "#" +
                digitToHex(triplet[1]) +
                digitToHex(triplet[2]) +
                digitToHex(triplet[3])
              );
            }
            function digitToHex(dig) {
              if (isNaN(dig)) {
                return "00";
              } else {
                var hx = parseInt(dig).toString(16);
                return hx.length == 1 ? "0" + hx : hx;
              }
            }
          }
          if (me.isShowPanel) {
            $('<div id="customize-panel"></div>')
              .appendTo("body")
              .load(
                "customize/customize.html #customize-panel>*",
                function (xhr, statusText, request) {
                  if (
                    statusText !== "success" &&
                    statusText !== "notmodified"
                  ) {
                    $("#customize-panel").remove();
                    script.afterConfigure();
                  } else {
                    $.getScript(
                      "customize/custom-less.js",
                      function (data, lessStatusText, jqxhr) {
                        if (
                          lessStatusText !== "success" &&
                          lessStatusText !== "notmodified"
                        ) {
                          $("#customize-panel").remove();
                          script.afterConfigure();
                        } else {
                          $panel = $("#customize-panel");
                          $opt = $panel.find(".options");
                          $toggle = $panel.find(".toggle-button");
                          optW = $opt.width();
                          $customCss = $panel.find(".custom-css");
                          $themesSelect = $opt.find(".themes select");
                          $colors = $opt.find(".colors");
                          $.cookie.json = true;
                          buildPanel();
                          if (tools.getUrlParameter("save-as-less")) {
                            $.cookie("saveAsLess", "yes", { path: cPath });
                          }
                          $.cookie.json = false;
                          var tsc = $.cookie("themeSelect");
                          $.cookie.json = true;
                          if (tsc === "custom") {
                            isInitialized = true;
                            me.lessVars = $.cookie("lessVars");
                            createCss();
                            initLessVars();
                            $opt
                              .find(".options-gate")
                              .css({ visibility: "hidden" });
                          }
                          $window.resize(resize);
                          resize();
                          script.afterConfigure();
                        }
                      }
                    );
                  }
                }
              );
          } else {
            script.afterConfigure();
          }
        };
      },
      {
        "../app/app-share.js": 5,
        "../app/themes.js": 8,
        "../tools/tools.js": 11,
        "../widgets/loading.js": 18,
      },
    ],
    10: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        $(function () {
          new (function () {
            var Customize = require("./customize/customize.js");
            var TopNav = require("./widgets/top-nav.js");
            var MenuToggle = require("./widgets/menu-toggle.js");
            var Players = require("./animation/players.js");
            var Scrolling = require("./animation/scrolling.js");
            var tools = require("./tools/tools.js");
            var ShowList = require("./widgets/show-list.js");
            var Gallery = require("./widgets/gallery.js");
            var fluid = require("./widgets/fluid.js");
            var Counter = require("./widgets/counter.js");
            var ChangeColors = require("./widgets/change-colors.js");
            var Sliders = require("./widgets/sliders.js");
            var loading = require("./widgets/loading.js");
            var CssAnimation = require("./animation/css-animation.js");
            var dotScroll = require("./widgets/dot-scroll.js");
            var Map = require("./widgets/map.js");
            var Skillbar = require("./widgets/skillbar.js");
            var AjaxForm = require("./widgets/ajax-form.js");
            var YoutubeBG = require("./widgets/youtube-bg.js");
            var VimeoBG = require("./widgets/vimeo-bg.js");
            var VideoBG = require("./widgets/video-bg.js");
            var app = require("./app/app.js");
            var OverlayWindow = require("./widgets/overlay-window.js");
            var isPoorBrowser = $("html").hasClass("poor-browser");
            var isAndroid43minus = $("html").hasClass(
              "android-browser-4_3minus"
            );
            var $pageTransition = $(".page-transition");
            var me = this;
            var $window = $(window);
            var $sections = $("section");
            var sectionTriggers = [];
            var lastActiveSectionHash;
            var location = document.location.hash
              ? document.location.href.replace(
                  new RegExp(document.location.hash + "$"),
                  ""
                )
              : document.location.href.replace("#", "");
            var $navLinks = (function () {
              var $res = jQuery();
              $("#top-nav .navbar-nav a").each(function () {
                var $this = $(this);
                if (
                  !this.hash ||
                  (this.href === location + this.hash &&
                    $("section" + this.hash).length > 0)
                ) {
                  $res = $res.add($this);
                }
              });
              return $res;
            })();
            var isMobile = $("html").hasClass("mobile");
            var scrolling;
            var maxScrollPosition;
            var ticker = new (function () {
              var me = this;
              window.requestAnimFrame = (function () {
                return (
                  window.requestAnimationFrame ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame ||
                  window.oRequestAnimationFrame ||
                  window.msRequestAnimationFrame ||
                  function (callback, element) {
                    window.setTimeout(callback, 1000 / 60);
                  }
                );
              })();
              var lastPosition = -1;
              this.pageIsReady = false;
              (function animate(time) {
                if (me.pageIsReady) {
                  var windowTopPos = tools.windowYOffset();
                  if (lastPosition !== windowTopPos) {
                    scrolling.scroll(windowTopPos);
                    trigNavigationLinks(windowTopPos);
                  }
                  lastPosition = windowTopPos;
                  TWEEN.update();
                  app.tick();
                }
                if (loading.queue.length > 0) {
                  loading.queue.pop()();
                }
                requestAnimFrame(animate);
              })();
            })();
            this.topNav = undefined;
            this.players = Players;
            this.afterConfigure = function () {
              var hash = window.location.hash;
              if (history && history.replaceState) {
                history.replaceState(
                  "",
                  document.title,
                  window.location.pathname + window.location.search
                );
              }
              new YoutubeBG();
              new VimeoBG();
              new VideoBG();
              app.prepare(function () {
                loading.load(function () {
                  $navLinks = $navLinks
                    .add(dotScroll.links())
                    .click(function () {
                      $navLinks.removeClass("target");
                      $(this).addClass("target");
                    });
                  me.topNav = new TopNav();
                  new MenuToggle();
                  scrolling = new Scrolling(me);
                  widgets($("body"));
                  new Gallery(onBodyHeightResize, widgets, unwidgets);
                  var windowW = $window.width();
                  var windowH = $window.height();
                  $window.resize(function () {
                    var newWindowW = $window.width();
                    var newWindowH = $window.height();
                    if (newWindowW !== windowW || newWindowH !== windowH) {
                      windowW = newWindowW;
                      windowH = newWindowH;
                      fluid.setup($("body"));
                      onBodyHeightResize();
                    }
                  });
                  app.setup(function () {
                    var finish = function () {
                      buildSizes();
                      calcNavigationLinkTriggers();
                      ticker.pageIsReady = true;
                      $navLinks.each(function () {
                        if (this.href == location) {
                          $(this).addClass("active");
                        }
                      });
                      $(".bigtext").each(function () {
                        $(this).bigtext();
                      });
                      app.ungated();
                      setTimeout(function () {
                        loading.ungate();
                        navigate(window.location.href, hash);
                      });
                    };
                    var test = function () {
                      var $excl = $(".non-preloading, .non-preloading img");
                      var $imgs = $("img").not($excl);
                      for (var i = 0; i < $imgs.length; i++) {
                        if (
                          (!$imgs[i].width || !$imgs[i].height) &&
                          (!$imgs[i].naturalWidth || !$imgs[i].naturalHeight)
                        ) {
                          setTimeout(test, 100);
                          return;
                        }
                      }
                      finish();
                    };
                    test();
                  });
                });
              });
            };
            function onBodyHeightResize() {
              buildSizes();
              scrolling.scroll(tools.windowYOffset());
              calcNavigationLinkTriggers();
            }
            function widgets($context) {
              new ShowList($context, me);
              new Sliders($context);
              if (!isMobile)
                $context.find(".hover-dir").each(function () {
                  $(this).hoverdir({ speed: 300 });
                });
              $context.find("a").click(function (e) {
                var $this = $(this);
                if ($this.data("toggle")) return;
                navigate(this.href, this.hash, e, $this);
              });
              fluid.setup($context);
              new Map($context);
              new Counter($context, me);
              new ChangeColors($context);
              new Skillbar($context, me);
              $context
                .find("input,select,textarea")
                .not("[type=submit]")
                .jqBootstrapValidation();
              new AjaxForm($context);
              new CssAnimation($context, me);
              $(".widget-tabs a").click(function (e) {
                e.preventDefault();
                $(this).tab("show");
              });
              $(".widget-tooltip").tooltip();
              $(".widget-popover").popover();
              $context.find("video").each(function () {
                if ($(this).attr("muted") !== undefined) {
                  this.muted = true;
                }
              });
              $context.find(".open-overlay-window").each(function () {
                var $this = $(this);
                var $overlay = $($this.data("overlay-window"));
                var overlayWindow = new OverlayWindow($overlay);
                $this.click(function (e) {
                  e.preventDefault();
                  overlayWindow.show();
                });
              });
              if (isPoorBrowser) {
                $context.find(".tlt-loop").remove();
              } else {
                $context.find(".textillate").each(function () {
                  var $tlt = $(this);
                  $tlt.textillate(
                    eval("(" + $tlt.data("textillate-options") + ")")
                  );
                });
              }
            }
            function unwidgets($context) {
              new Sliders($context, true);
              $context.find(".player").each(function () {
                var ind = $(this).data("player-ind");
                me.players[ind].pause();
                me.players.splice(ind, 1);
              });
            }
            function navigate(href, hash, e, $elem) {
              var hrefBH = hash
                ? href.replace(new RegExp(hash + "$"), "")
                : href;
              if (location === hrefBH && hash && hash.indexOf("!") === -1) {
                var $content = $(hash);
                if (e) {
                  e.preventDefault();
                }
                if ($content.length > 0) {
                  var offset = $content.offset().top - me.topNav.state2H;
                  var tn = $content.get(0).tagName.toLowerCase();
                  if (
                    tn === "h1" ||
                    tn === "h2" ||
                    tn === "h3" ||
                    tn === "h4" ||
                    tn === "h5" ||
                    tn === "h6"
                  ) {
                    offset -= 20;
                  }
                  if (offset < 0) offset = 0;
                  tools.scrollTo(offset);
                } else {
                  tools.scrollTo(0);
                }
              } else if (e && href !== location + "#") {
                if (!$elem.attr("target")) {
                  var pageTransition = function () {
                    e.preventDefault();
                    me.topNav.state1();
                    loading.gate(function () {
                      window.location = href;
                    });
                  };
                  if ($elem.hasClass("page-transition")) {
                    pageTransition();
                  } else {
                    $pageTransition.each(function () {
                      var container = $(this).get(0);
                      if ($.contains(container, $elem[0])) {
                        pageTransition();
                      }
                    });
                  }
                }
              }
            }
            function calcNavigationLinkTriggers() {
              var wh = $window.height();
              var triggerDelta = wh / 3;
              sectionTriggers = [];
              $sections.each(function (i) {
                var $s = $(this);
                var id = $s.attr("id");
                if (id) {
                  sectionTriggers.push({
                    hash: "#" + id,
                    triggerOffset: $s.data("position") - triggerDelta,
                  });
                }
              });
              trigNavigationLinks(tools.windowYOffset());
            }
            function trigNavigationLinks(windowTopPos) {
              var activeSectionHash;
              for (var i = 0; i < sectionTriggers.length; i++) {
                if (sectionTriggers[i].triggerOffset < windowTopPos) {
                  activeSectionHash = sectionTriggers[i].hash;
                }
              }
              if (activeSectionHash != lastActiveSectionHash) {
                var sectionLink = location + activeSectionHash;
                lastActiveSectionHash = activeSectionHash;
                $navLinks.each(function () {
                  var $a = $(this);
                  if (this.href === sectionLink) {
                    $a.addClass("active");
                    $a.removeClass("target");
                  } else {
                    $a.removeClass("active");
                  }
                });
                app.changeSection(me, activeSectionHash);
              }
            }
            function buildSizes() {
              app.buildSizes(me);
              maxScrollPosition = $("body").height() - $window.height();
              for (var i = 0; i < me.players.length; i++) {
                var $v = me.players[i].$view;
                $v.data("position", $v.offset().top);
              }
            }
            var animEnd = function (elems, end, modern, callback, time) {
              var additionTime = 100;
              var defaultTime = 1000;
              return elems.each(function () {
                var elem = this;
                if (modern && !isAndroid43minus) {
                  var done = false;
                  $(elem).bind(end, function () {
                    done = true;
                    $(elem).unbind(end);
                    return callback.call(elem);
                  });
                  if (time >= 0 || time === undefined) {
                    var wTime =
                      time === undefined ? 1000 : defaultTime + additionTime;
                    setTimeout(function () {
                      if (!done) {
                        $(elem).unbind(end);
                        callback.call(elem);
                      }
                    }, wTime);
                  }
                } else {
                  callback.call(elem);
                }
              });
            };
            $.fn.animationEnd = function (callback, time) {
              return animEnd(
                this,
                tools.animationEnd,
                Modernizr.cssanimations,
                callback,
                time
              );
            };
            $.fn.transitionEnd = function (callback, time) {
              return animEnd(
                this,
                tools.transitionEnd,
                Modernizr.csstransitions,
                callback,
                time
              );
            };
            $.fn.stopTransition = function () {
              return this.css({
                "-webkit-transition": "none",
                "-moz-transition": "none",
                "-ms-transition": "none",
                "-o-transition": "none",
                transition: "none",
              });
            };
            $.fn.cleanTransition = function () {
              return this.css({
                "-webkit-transition": "",
                "-moz-transition": "",
                "-ms-transition": "",
                "-o-transition": "",
                transition: "",
              });
            };
            $.fn.nonTransition = function (css) {
              return this.stopTransition().css(css).cleanTransition();
            };
            $.fn.transform = function (str, origin) {
              return this.css(tools.transformCss(str, origin));
            };
            $("video").each(function () {
              if ($(this).attr("muted") !== undefined) {
                this.muted = true;
              }
            });
            new Customize(me);
          })();
        });
      },
      {
        "./animation/css-animation.js": 1,
        "./animation/players.js": 2,
        "./animation/scrolling.js": 3,
        "./app/app.js": 6,
        "./customize/customize.js": 9,
        "./tools/tools.js": 11,
        "./widgets/ajax-form.js": 12,
        "./widgets/change-colors.js": 13,
        "./widgets/counter.js": 14,
        "./widgets/dot-scroll.js": 15,
        "./widgets/fluid.js": 16,
        "./widgets/gallery.js": 17,
        "./widgets/loading.js": 18,
        "./widgets/map.js": 19,
        "./widgets/menu-toggle.js": 20,
        "./widgets/overlay-window.js": 21,
        "./widgets/show-list.js": 22,
        "./widgets/skillbar.js": 23,
        "./widgets/sliders.js": 24,
        "./widgets/top-nav.js": 25,
        "./widgets/video-bg.js": 26,
        "./widgets/vimeo-bg.js": 27,
        "./widgets/youtube-bg.js": 28,
      },
    ],
    11: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = new (function () {
          var me = this;
          var script = require("../script.js");
          var isAndroidBrowser4_3minus = $("html").hasClass(
            "android-browser-4_3minus"
          );
          this.animationEnd =
            "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd";
          this.transitionEnd =
            "transitionend webkitTransitionEnd oTransitionEnd otransitionend";
          this.transition = [
            "-webkit-transition",
            "-moz-transition",
            "-ms-transition",
            "-o-transition",
            "transition",
          ];
          this.transform = [
            "-webkit-transform",
            "-moz-transform",
            "-ms-transform",
            "-o-transform",
            "transform",
          ];
          this.property = function (keys, value, obj) {
            var res = obj ? obj : {};
            for (var i = 0; i < keys.length; i++) {
              res[keys[i]] = value;
            }
            return res;
          };
          this.windowYOffset = function () {
            return window.pageYOffset != null
              ? window.pageYOffset
              : document.compatMode === "CSS1Compat"
              ? document.documentElement.scrollTop
              : document.body.scrollTop;
          };
          this.getUrlParameter = function (sParam) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split("&");
            for (var i = 0; i < sURLVariables.length; i++) {
              var sParameterName = sURLVariables[i].split("=");
              if (sParameterName[0] == sParam) {
                return decodeURI(sParameterName[1]);
              }
            }
          };
          this.selectTextarea = function ($el) {
            $el.focus(function () {
              var $this = $(this);
              $this.select();
              $this.mouseup(function () {
                $this.unbind("mouseup");
                return false;
              });
            });
          };
          var timer;
          this.time = function (label) {
            if (!timer) {
              timer = Date.now();
              console.log("==== Timer started" + (label ? " | " + label : ""));
            } else {
              var t = Date.now();
              console.log(
                "==== " + (t - timer) + " ms" + (label ? " | " + label : "")
              );
              timer = t;
            }
          };
          this.scrollTo = function (y, callback, time) {
            if (time === undefined) time = 1200;
            new TWEEN.Tween({ y: me.windowYOffset() })
              .to({ y: Math.round(y) }, time)
              .onUpdate(function () {
                window.scrollTo(0, this.y);
              })
              .easing(TWEEN.Easing.Quadratic.InOut)
              .onComplete(function () {
                if (callback) {
                  callback();
                }
              })
              .start();
          };
          this.androidStylesFix = function ($q) {
            if (isAndroidBrowser4_3minus) {
              $q.hide();
              $q.get(0).offsetHeight;
              $q.show();
            }
          };
          this.transformCss = function (str, origin) {
            var res = {
              "-webkit-transform": str,
              "-moz-transform": str,
              "-ms-transform": str,
              "-o-transform": str,
              transform: str,
            };
            if (origin) {
              res["-webkit-transform-origin"] = origin;
              res["-moz-transform-origin"] = origin;
              res["-ms-transform-origin"] = origin;
              res["-o-transform-origin"] = origin;
              res["transform-origin"] = origin;
            }
            return res;
          };
        })();
      },
      { "../script.js": 10 },
    ],
    12: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function ($context) {
          var loading = require("./loading.js");
          var $gateLoader = $(".gate .loader");
          $context.find(".ajax-form").each(function () {
            var $frm = $(this);
            $frm.submit(function (e) {
              if ($frm.find(".help-block ul").length < 1) {
                $gateLoader.addClass("show");
                loading.gate(function () {
                  var message = function (msg) {
                    $(
                      '<div class="ajax-form-alert alert heading fade in text-center">	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button> ' +
                        msg +
                        "</div>"
                    )
                      .addClass($frm.data("message-class"))
                      .appendTo("body");
                    loading.ungate();
                    $gateLoader.removeClass("show");
                  };
                  $.ajax({
                    type: $frm.attr("method"),
                    url: $frm.attr("action"),
                    data: $frm.serialize(),
                    success: function (data) {
                      $frm[0].reset();
                      message(data);
                    },
                    error: function (xhr, str) {
                      message("Error: " + xhr.responseCode);
                    },
                  });
                });
                e.preventDefault();
              }
            });
          });
        };
      },
      { "./loading.js": 18 },
    ],
    13: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function ($context) {
          var themes = require("../app/themes.js");
          $context.find(".change-colors").each(function () {
            var $group = $(this);
            var $target = $($group.data("target"));
            var $links = $group.find("a");
            var currentColors;
            for (var i = 0; i < themes.colors; i++) {
              var colors =
                "colors-" + String.fromCharCode(65 + i).toLowerCase();
              if ($target.hasClass(colors)) {
                currentColors = colors;
                $links.each(function () {
                  var $el = $(this);
                  if ($el.data("colors") === currentColors) {
                    $el.addClass("active");
                  }
                });
              }
            }
            $links.click(function (e) {
              e.preventDefault();
              var $link = $(this);
              $target.removeClass(currentColors);
              currentColors = $link.data("colors");
              $target.addClass(currentColors);
              $links.removeClass("active");
              $link.addClass("active");
            });
          });
        };
      },
      { "../app/themes.js": 8 },
    ],
    14: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function ($context, script) {
          var isPoorBrowser = $("html").hasClass("poor-browser");
          if (isPoorBrowser) return;
          $context.find(".counter .count").each(function () {
            var $this = $(this);
            var count = parseInt($this.text());
            var cnt = { n: 0 };
            var tw = new TWEEN.Tween(cnt)
              .to({ n: count }, 1000)
              .onUpdate(function () {
                $this.text(Math.round(this.n));
              })
              .easing(TWEEN.Easing.Quartic.InOut);
            var pause = function () {
              tw.stop();
            };
            var resume = function () {
              cnt.n = 0;
              tw.start();
            };
            var start = resume;
            script.players.addPlayer($this, start, pause, resume);
          });
        };
      },
      {},
    ],
    15: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = new (function () {
          var isMobile = $("html").hasClass("mobile");
          var $sec = $("body>section[id]");
          var $lnks;
          if (!isMobile && $sec.length > 1) {
            var $ul = $("#dot-scroll");
            $sec.each(function () {
              $ul.append(
                '<li><a href="#' +
                  $(this).attr("id") +
                  '"><span></span></a></li>'
              );
            });
            $lnks = $ul.find("a");
          } else {
            $lnks = jQuery();
          }
          this.links = function () {
            return $lnks;
          };
        })();
      },
      {},
    ],
    16: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = new (function () {
          this.setup = function ($context) {
            $context.find(".fluid *").each(function () {
              var $el = $(this);
              var $wrap = $el.parent(".fluid");
              var newWidth = $wrap.width();
              var ar = $el.attr("data-aspect-ratio");
              if (!ar) {
                ar = this.height / this.width;
                $el
                  .attr("data-aspect-ratio", ar)
                  .removeAttr("height")
                  .removeAttr("width");
              }
              var newHeight = Math.round(newWidth * ar);
              $el.width(Math.round(newWidth)).height(newHeight);
              $wrap.height(newHeight);
            });
          };
        })();
      },
      {},
    ],
    17: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function (onBodyHeightResize, widgets, unwidgets) {
          var tools = require("../tools/tools.js");
          var OverlayWindow = require("./overlay-window.js");
          var $topNav = $("#top-nav");
          $(".gallery").each(function (i) {
            var $gallery = $(this);
            var $overlay = $($gallery.data("overlay"));
            var overlayWindow = new OverlayWindow($overlay, widgets, unwidgets);
            var $overlayNext = $overlay.find(".next");
            var $overlayPrevios = $overlay.find(".previos");
            var $overlayClose = $overlay.find(".cross");
            var isFilter = false;
            var defaultGroup = $gallery.data("default-group")
              ? $gallery.data("default-group")
              : "all";
            var isNonFirstLayout = false;
            if (!defaultGroup) defaultGroup = "all";
            var $grid = $gallery
              .find(".grid")
              .shuffle({ group: defaultGroup, speed: 500 })
              .on("filter.shuffle", function () {
                isFilter = true;
              })
              .on("layout.shuffle", function () {
                if (isNonFirstLayout) {
                  onBodyHeightResize(true);
                } else {
                  onBodyHeightResize();
                  isNonFirstLayout = true;
                }
              })
              .on("filtered.shuffle", function () {
                if (isFilter) {
                  isFilter = false;
                }
              });
            var $btns = $gallery.find(".filter a");
            var $itemView = $gallery.find(".item-view");
            var $all = $gallery.find(".filter a[data-group=all]");
            var $items = $grid.find(".item");
            var currentGroup = defaultGroup;
            var $currentItem;
            $gallery
              .find(".filter a[data-group=" + defaultGroup + "]")
              .addClass("active");
            $items.addClass("on");
            $overlayClose.click(function (e) {
              $currentItem = false;
            });
            $btns.click(function (e) {
              e.preventDefault();
              if (isFilter) return;
              var $this = $(this);
              var isActive = $this.hasClass("active");
              var group = isActive ? "all" : $this.data("group");
              if (currentGroup !== group) {
                currentGroup = group;
                $btns.removeClass("active");
                if (!isActive) {
                  $this.addClass("active");
                } else {
                  $all.addClass("active");
                }
                $grid.shuffle("shuffle", group);
                $items.each(function () {
                  var $i = $(this);
                  var filter = eval($i.data("groups"));
                  if (group == "all" || $.inArray(group, filter) != -1) {
                    $i.addClass("on");
                  } else {
                    $i.removeClass("on");
                  }
                });
              }
            });
            $items.click(function (e) {
              e.preventDefault();
              openItem($(this));
            });
            function openItem($item) {
              $currentItem = $item;
              var url = $item.children("a")[0].hash.replace("#!", "");
              overlayWindow.show(url + " .item-content");
            }
            $overlayNext.click(function (e) {
              if (!$currentItem) {
                return;
              }
              e.preventDefault();
              var $i = $currentItem.nextAll(".on").first();
              if ($i.length < 1) {
                $i = $items.filter(".on").first();
              }
              openItem($i);
            });
            $overlayPrevios.click(function (e) {
              if (!$currentItem) {
                return;
              }
              e.preventDefault();
              var $i = $currentItem.prevAll(".on").first();
              if ($i.length < 1) {
                $i = $items.filter(".on").last();
              }
              openItem($i);
            });
          });
        };
      },
      { "../tools/tools.js": 11, "./overlay-window.js": 21 },
    ],
    18: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = new (function () {
          var tools = require("../tools/tools.js");
          var $gate = $(".gate");
          var $gateBar = $gate.find(".gate-bar");
          var $gateLoader = $gate.find(".loader");
          var isAndroidBrowser4_3minus = $("html").hasClass(
            "android-browser-4_3minus"
          );
          var me = this;
          this.queue = [];
          this.load = function (callback) {
            var urls = [];
            var $excl = $(".non-preloading, .non-preloading img");
            $("*:visible:not(script)")
              .not($excl)
              .each(function () {
                var $el = $(this);
                var name = $el[0].nodeName.toLowerCase();
                var bImg = $el.css("background-image");
                var src = $el.attr("src");
                var func = $el.data("loading");
                if (func) {
                  urls.push(func);
                } else if (
                  name === "img" &&
                  src &&
                  $.inArray(src, urls) === -1
                ) {
                  urls.push(src);
                } else if (bImg != "none") {
                  var murl = bImg.match(/url\(['"]?([^'")]*)/i);
                  if (
                    murl &&
                    murl.length > 1 &&
                    $.inArray(murl[1], urls) === -1
                  ) {
                    urls.push(murl[1]);
                  }
                }
              });
            var loaded = 0;
            if (urls.length === 0) {
              callback();
            } else {
              $gateLoader.addClass("show");
              var waterPerc = 0;
              var done = function () {
                loaded++;
                waterPerc = (loaded / urls.length) * 100;
                $gateBar.css({ width: waterPerc + "%" });
                if (loaded === urls.length) {
                  if ($gate.length < 1) {
                    callback();
                  } else {
                    $gateLoader
                      .transitionEnd(function () {
                        $gateLoader.removeClass("hided");
                        callback();
                      }, 200)
                      .addClass("hided")
                      .removeClass("show");
                  }
                }
              };
              for (var i = 0; i < urls.length; i++) {
                if (typeof urls[i] == "function") {
                  urls[i](done);
                } else {
                  var img = new Image();
                  $(img).one("load", function () {
                    me.queue.push(done);
                  });
                  img.src = urls[i];
                }
              }
            }
          };
          this.gate = function (callback) {
            $gateBar.css({ width: "0%" });
            $gate
              .transitionEnd(function () {
                if (callback) {
                  callback();
                }
              })
              .css({ opacity: 1, visibility: "visible" });
          };
          this.ungate = function (callback) {
            $gate
              .transitionEnd(function () {
                if (isAndroidBrowser4_3minus) {
                  tools.androidStylesFix($("body"));
                }
                if (callback) {
                  callback();
                }
              })
              .css({ opacity: 0, visibility: "hidden" });
          };
        })();
      },
      { "../tools/tools.js": 11 },
    ],
    19: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function ($context) {
          var tools = require("../tools/tools.js");
          var OverlayWindow = require("./overlay-window.js");
          if (typeof google == "undefined") return;
          $context.find(".map-open").each(function () {
            var $mapOpen = $(this);
            var $overlay = $($mapOpen.data("map-overlay"));
            var $mapCanvas = $overlay.find(".map-canvas");
            var mapOptions = {
              center: new google.maps.LatLng(
                $mapCanvas.data("latitude"),
                $mapCanvas.data("longitude")
              ),
              zoom: $mapCanvas.data("zoom"),
              mapTypeId: google.maps.MapTypeId.ROADMAP,
            };
            var markers = [];
            $mapCanvas.find(".map-marker").each(function () {
              var $marker = $(this);
              markers.push({
                latitude: $marker.data("latitude"),
                longitude: $marker.data("longitude"),
                text: $marker.data("text"),
              });
            });
            $mapCanvas
              .addClass("close-map")
              .wrap('<div class="map-view"></div>');
            var $mapView = $mapCanvas.parent();
            var overlayWindow = new OverlayWindow(
              $overlay,
              false,
              false,
              function () {
                new TWEEN.Tween({ autoAlpha: 1 })
                  .to({ autoAlpha: 0 }, 500)
                  .onUpdate(function () {
                    $mapView.css({
                      opacity: this.autoAlpha,
                      visibility: this.autoAlpha > 0 ? "visible" : "hidden",
                    });
                  })
                  .easing(TWEEN.Easing.Linear.None)
                  .start();
              }
            );
            var isInited = false;
            $mapOpen.click(function (event) {
              event.preventDefault();
              overlayWindow.show(false, function () {
                if (!isInited) {
                  isInited = true;
                  var map = new google.maps.Map($mapCanvas[0], mapOptions);
                  var addListener = function (marker, text) {
                    var infowindow = new google.maps.InfoWindow({
                      content: text,
                    });
                    google.maps.event.addListener(marker, "click", function () {
                      infowindow.open(map, marker);
                    });
                  };
                  for (var i = 0; i < markers.length; i++) {
                    var marker = new google.maps.Marker({
                      map: map,
                      position: new google.maps.LatLng(
                        markers[i].latitude,
                        markers[i].longitude
                      ),
                    });
                    var text = markers[i].text;
                    if (text) {
                      addListener(marker, text);
                    }
                  }
                }
                var $oc = $overlay.find(".overlay-control");
                $mapView.css({
                  height: $(window).height() - $oc.height() + "px",
                });
                new TWEEN.Tween({ autoAlpha: 0 })
                  .to({ autoAlpha: 1 }, 500)
                  .onUpdate(function () {
                    $mapView.css({
                      opacity: this.autoAlpha,
                      visibility: this.autoAlpha > 0 ? "visible" : "hidden",
                    });
                  })
                  .easing(TWEEN.Easing.Linear.None)
                  .start();
              });
            });
          });
        };
      },
      { "../tools/tools.js": 11, "./overlay-window.js": 21 },
    ],
    20: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function () {
          var $toggle = $(".menu-toggle");
          $toggle.click(function (e) {
            e.preventDefault();
            var $tg = $(this);
            if ($tg.hasClass("ext-nav-toggle")) {
              var targetQ = $tg.data("target");
              var $extNav = $(targetQ);
              var $clickEls = $(
                targetQ + ",#top-nav a:not(.menu-toggle),.page-border a"
              );
              var clickHnd = function () {
                $extNav.removeClass("show");
                $tg.removeClass("show");
                $("body").removeClass("ext-nav-show");
                $("html, body").css({ overflow: "", position: "" });
                $clickEls.unbind("click", clickHnd);
              };
              if ($tg.hasClass("show")) {
                $extNav.removeClass("show");
                $tg.removeClass("show");
                $("body").removeClass("ext-nav-show");
                $clickEls.unbind("click", clickHnd);
              } else {
                $extNav.addClass("show");
                $tg.addClass("show");
                $("body").addClass("ext-nav-show");
                $clickEls.bind("click", clickHnd);
              }
            } else {
              if ($tg.hasClass("show")) {
                $tg.removeClass("show");
              } else {
                $tg.addClass("show");
              }
            }
          });
        };
      },
      {},
    ],
    21: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function ($overlay, widgets, unwidgets, hideFunc) {
          var $overlayClose = $overlay.find(".cross");
          var $overlayZoom = $($overlay.data("overlay-zoom"));
          var $overlayView = $overlay.find(".overlay-view");
          var $overlayClose = $overlay.find(".cross");
          var me = this;
          this.show = function (load, callback) {
            var open = function () {
              $overlayZoom.addClass("overlay-zoom");
              $overlay
                .transitionEnd(function () {
                  if (load) {
                    var $loader = $overlay.find(".loader");
                    var $loadedContent = $(
                      '<div class="loaded-content"></div>'
                    );
                    $loader.addClass("show");
                    $loadedContent
                      .addClass("content-container")
                      .appendTo($overlayView);
                    $loadedContent.load(
                      load,
                      function (xhr, statusText, request) {
                        if (
                          statusText !== "success" &&
                          statusText !== "notmodified"
                        ) {
                          $loadedContent.text(statusText);
                          return;
                        }
                        var $images = $loadedContent.find("img");
                        var nimages = $images.length;
                        if (nimages > 0) {
                          $images.load(function () {
                            nimages--;
                            if (nimages === 0) {
                              show();
                            }
                          });
                        } else {
                          show();
                        }
                        function show() {
                          if (widgets) {
                            widgets($loadedContent);
                          }
                          $loadedContent.addClass("show");
                          $loader.removeClass("show");
                          if (callback) {
                            callback();
                          }
                        }
                      }
                    );
                  } else {
                    if (callback) {
                      callback();
                    }
                  }
                })
                .addClass("show");
            };
            if ($overlay.hasClass("show")) {
              me.hide(open);
            } else {
              open();
            }
          };
          this.hide = function (callback) {
            $overlayZoom.removeClass("overlay-zoom");
            $overlay.removeClass("show");
            setTimeout(function () {
              var $loadedContent = $overlay.find(".loaded-content");
              if ($loadedContent.length > 0) {
                if (unwidgets) {
                  unwidgets($loadedContent);
                }
                stopIframeBeforeRemove($loadedContent, function () {
                  $loadedContent.remove();
                  if (hideFunc) {
                    hideFunc();
                  }
                  if (callback) {
                    callback();
                  }
                });
              } else {
                if (hideFunc) {
                  hideFunc();
                }
                if (callback) {
                  callback();
                }
              }
            }, 500);
          };
          function stopIframeBeforeRemove($context, callback) {
            var isDoStop =
              $("html").hasClass("ie9") || $("html").hasClass("ie10");
            if (isDoStop) {
              $context.find("iframe").attr("src", "");
              setTimeout(function () {
                callback();
              }, 300);
            } else {
              callback();
            }
          }
          $overlayClose.click(function (e) {
            e.preventDefault();
            me.hide();
          });
        };
      },
      {},
    ],
    22: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function ($context, script) {
          $context.find(".show-list").each(function () {
            $(this)
              .wrapInner('<div class="wrapper"></div>')
              .textillate({
                loop: true,
                in: { effect: "fadeInRight", reverse: true },
                out: { effect: "fadeOutLeft", sequence: true },
                selector: ".wrapper",
              });
          });
        };
      },
      {},
    ],
    23: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function ($context, script) {
          var isPoorBrowser = $("html").hasClass("poor-browser");
          $context.find(".skillbar").each(function () {
            var $this = $(this);
            var $bar = $this.find(".skillbar-bar");
            var perc = parseInt($this.attr("data-percent").replace("%", ""));
            if (isPoorBrowser) {
              $bar.css({ width: perc + "%" });
            } else {
              var w = { width: 0 };
              var tw = new TWEEN.Tween(w)
                .to({ width: perc }, 1000)
                .onUpdate(function () {
                  $bar.css({ width: this.width + "%" });
                })
                .easing(TWEEN.Easing.Quartic.Out);
              var pause = function () {
                tw.stop();
              };
              var resume = function () {
                w.width = 0;
                tw.start();
              };
              var start = resume;
              script.players.addPlayer($this, start, pause, resume);
            }
          });
        };
      },
      {},
    ],
    24: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function ($context, isRemoved) {
          if (isRemoved) {
            $context.find(".carousel, .slider").each(function () {
              $(this).slick("unslick");
            });
            return;
          }
          var tools = require("../tools/tools.js");
          $context.find(".slider").each(function () {
            var $this = $(this);
            $this.slick({ autoplay: true, dots: true });
          });
          $context.find(".carousel").each(function () {
            var $this = $(this);
            $this.slick({
              autoplay: false,
              dots: true,
              infinite: true,
              slidesToShow: 3,
              slidesToScroll: 3,
              responsive: [
                {
                  breakpoint: 1000,
                  settings: { dots: true, slidesToShow: 2, slidesToScroll: 2 },
                },
                {
                  breakpoint: 480,
                  settings: { dots: true, slidesToShow: 1, slidesToScroll: 1 },
                },
              ],
            });
          });
        };
      },
      { "../tools/tools.js": 11 },
    ],
    25: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function () {
          var tools = require("../tools/tools.js");
          var $topNav = $("#top-nav");
          var $body = $("body");
          var isTopNav = $topNav.length > 0;
          var $topMenuNav = $topNav.find(".navbar-collapse");
          var upperH = 20;
          var bigTopNav = isTopNav ? 89 : 0;
          var smallTopNav = isTopNav ? 49 : 0;
          var themes = require("../app/themes.js");
          var topNavState1Top = (function () {
            if (isTopNav) {
              return upperH;
            } else {
              return 0;
            }
          })();
          var isTopNavState1 = false;
          var isTopNavState2 = false;
          var me = this;
          var state1Colors = $topNav.data("state1-colors");
          var state2Colors = $topNav.data("state2-colors");
          this.state1H = bigTopNav;
          this.state2H = smallTopNav;
          this.state1Top = function () {
            return topNavState1Top;
          };
          this.state1 = function () {
            if (isTopNav && !isTopNavState1) {
              $body.removeClass("state2").addClass("state1");
              isTopNavState1 = true;
              isTopNavState2 = false;
              tools.androidStylesFix($topNav);
            }
          };
          this.state2 = function () {
            if (isTopNav && !isTopNavState2) {
              $body.removeClass("state1").addClass("state2");
              isTopNavState1 = false;
              isTopNavState2 = true;
              tools.androidStylesFix($topNav);
            }
          };
          this.$menu = function () {
            return $topMenuNav;
          };
          if (isTopNav) {
            me.state1();
            $topMenuNav.find("a:not(.dropdown-toggle)").click(function () {
              $topNav.find(".navbar-collapse.in").collapse("hide");
              $topNav.find(".menu-toggle.navbar-toggle").removeClass("show");
            });
            $(window).resize(function () {
              $topNav.find(".navbar-collapse.in").collapse("hide");
              $topNav.find(".menu-toggle.navbar-toggle").removeClass("show");
            });
          }
        };
      },
      { "../app/themes.js": 8, "../tools/tools.js": 11 },
    ],
    26: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function () {
          var $videoBgs = $(".video-bg");
          if ($videoBgs.length < 1) {
            return;
          }
          var isPlayVideo = (function () {
            var isMobile = $("html").hasClass("mobile");
            var v = document.createElement("video");
            var canMP4 = v.canPlayType ? v.canPlayType("video/mp4") : false;
            return canMP4 && !isMobile;
          })();
          if (!isPlayVideo) {
            $videoBgs.each(function () {
              var $videoBg = $(this);
              var alt = $videoBg.data("alternative");
              if (alt) {
                var $img = $('<img alt class="bg" src="' + alt + '"/>');
                $videoBg.after($img).remove();
              }
            });
            return;
          }
          $videoBgs.each(function () {
            var $divBg = $(this);
            $divBg.data("loading", function (done) {
              var $videoBg = $('<video class="video-bg"></video>');
              if ($divBg.data("mute") === "yes") $videoBg[0].muted = true;
              var vol = $divBg.data("volume");
              if (vol !== undefined) $videoBg[0].volume = vol / 100;
              var doDone = function () {
                var vw = $videoBg.width();
                var vh = $videoBg.height();
                var vr = vw / vh;
                var $window = $(window);
                var resize = function () {
                  var ww = $window.width();
                  var wh = $window.height();
                  var wr = ww / wh;
                  var w, h;
                  if (vr > wr) {
                    h = Math.ceil(wh);
                    w = Math.ceil(h * vr);
                  } else {
                    w = Math.ceil(ww);
                    h = Math.ceil(w / vr);
                  }
                  $videoBg.css({
                    width: w + "px",
                    height: h + "px",
                    top: Math.round((wh - h) / 2) + "px",
                    left: Math.round((ww - w) / 2) + "px",
                  });
                };
                $window.resize(resize);
                resize();
                $videoBg[0].play();
                done();
              };
              $videoBg.on("ended", function () {
                this.currentTime = 0;
                this.play();
                if (this.ended) {
                  this.load();
                }
              });
              var isNotDone = true;
              $videoBg.on("canplaythrough", function () {
                if (isNotDone) {
                  isNotDone = false;
                  doDone();
                } else {
                  this.play();
                }
              });
              $videoBg[0].src = $divBg.data("video");
              $videoBg[0].preload = "auto";
              $divBg.after($videoBg);
              $divBg.remove();
            });
          });
        };
      },
      {},
    ],
    27: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function () {
          var $vimeoBgs = $(".vimeo-bg");
          if ($vimeoBgs.length < 1) {
            return;
          }
          if ($("html").hasClass("mobile")) {
            $vimeoBgs.each(function () {
              var $vimeoBg = $(this);
              var alt = $vimeoBg.data("alternative");
              if (alt) {
                var $img = $('<img alt class="bg" src="' + alt + '"/>');
                $vimeoBg.after($img).remove();
              }
            });
            return;
          }
          var dones = [];
          $vimeoBgs.each(function (i) {
            var $vimeoBg = $(this);
            var elId = $vimeoBg.attr("id");
            if (!elId) {
              elId = "vimeo-bg-" + i;
              $vimeoBg.attr("id", elId);
            }
            $vimeoBg.data("loading", function (done) {
              dones[elId] = done;
            });
          });
          $.getScript("https://f.vimeocdn.com/js/froogaloop2.min.js")
            .done(function (script, textStatus) {
              $vimeoBgs.each(function () {
                var $vimeoBgDiv = $(this);
                var id = $vimeoBgDiv.attr("id");
                var volume = (function () {
                  var r = $vimeoBgDiv.data("volume");
                  return r === undefined ? 0 : r;
                })();
                var videoId = $vimeoBgDiv.data("video");
                var $vimeoBg = $(
                  '<iframe class="vimeo-bg" src="https://player.vimeo.com/video/' +
                    videoId +
                    "?api=1&badge=0&byline=0&portrait=0&title=0&autopause=0&player_id=" +
                    id +
                    '&loop=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
                );
                $vimeoBgDiv.after($vimeoBg);
                $vimeoBgDiv.remove();
                $vimeoBg.attr("id", id);
                var player = $f($vimeoBg[0]);
                player.addEvent("ready", function () {
                  var resize = function (vRatio) {
                    var windowW = $(window).width();
                    var windowH = $(window).height();
                    var iFrameW = $vimeoBg.width();
                    var iFrameH = $vimeoBg.height();
                    var ifRatio = iFrameW / iFrameH;
                    var wRatio = windowW / windowH;
                    var setSize = function (vw, vh) {
                      var ifw, ifh;
                      if (ifRatio > vRatio) {
                        ifh = Math.ceil(vh);
                        ifw = Math.ceil(ifh * ifRatio);
                      } else {
                        ifw = Math.ceil(vw);
                        ifh = Math.ceil(ifw / ifRatio);
                      }
                      $vimeoBg.css({
                        width: ifw + "px",
                        height: ifh + "px",
                        top: Math.round((windowH - ifh) / 2) + "px",
                        left: Math.round((windowW - ifw) / 2) + "px",
                      });
                    };
                    if (wRatio > vRatio) {
                      var vw = windowW;
                      var vh = vw / vRatio;
                      setSize(vw, vh);
                    } else {
                      var vh = windowH;
                      var vw = vh * vRatio;
                      setSize(vw, vh);
                    }
                  };
                  player.addEvent("finish", function () {
                    player.api("play");
                  });
                  var isNotDone = true;
                  player.addEvent("play", function () {
                    if (isNotDone) {
                      isNotDone = false;
                      dones[id]();
                    }
                  });
                  player.api("setVolume", volume);
                  player.api("getVideoWidth", function (value, player_id) {
                    var w = value;
                    player.api("getVideoHeight", function (value, player_id) {
                      var h = value;
                      var vRatio = w / h;
                      $(window).resize(function () {
                        resize(vRatio);
                      });
                      resize(vRatio);
                      player.api("play");
                    });
                  });
                });
              });
            })
            .fail(function (jqxhr, settings, exception) {
              console.log("Triggered ajaxError handler.");
            });
        };
      },
      {},
    ],
    28: [
      function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = function () {
          var $youtubeBgs = $(".youtube-bg");
          if ($youtubeBgs.length < 1) {
            return;
          }
          if ($("html").hasClass("mobile")) {
            $youtubeBgs.each(function () {
              var $youtubeBg = $(this);
              var alt = $youtubeBg.data("alternative");
              if (alt) {
                var $img = $('<img alt class="bg" src="' + alt + '"/>');
                $youtubeBg.after($img).remove();
              }
            });
            return;
          }
          var dones = [];
          $youtubeBgs.each(function (i) {
            var $youtubeBg = $(this);
            var elId = $youtubeBg.attr("id");
            if (!elId) {
              elId = "youtube-bg-" + i;
              $youtubeBg.attr("id", elId);
            }
            $youtubeBg.data("loading", function (done) {
              dones[elId] = done;
            });
          });
          var tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName("script")[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
          window.onYouTubeIframeAPIReady = function () {
            $youtubeBgs.each(function () {
              var $youtubeBg = $(this);
              var videoId = $youtubeBg.data("video");
              var vol = $youtubeBg.data("volume");
              var mute = $youtubeBg.data("mute");
              var elId = $youtubeBg.attr("id");
              var isNotDone = true;
              var player = new YT.Player(elId, {
                videoId: videoId,
                playerVars: {
                  html5: 1,
                  controls: 0,
                  showinfo: 0,
                  modestbranding: 1,
                  rel: 0,
                  allowfullscreen: true,
                  iv_load_policy: 3,
                  wmode: "transparent",
                },
                events: {
                  onReady: function (event) {
                    var resize = function () {
                      var $iFrame = $(event.target.getIframe());
                      var windowW = $(window).width();
                      var windowH = $(window).height();
                      var iFrameW = $iFrame.width();
                      var iFrameH = $iFrame.height();
                      var ifRatio = iFrameW / iFrameH;
                      var wRatio = windowW / windowH;
                      var vRatio = (function () {
                        var r = $youtubeBg.data("ratio");
                        return r === undefined ? ifRatio : eval(r);
                      })();
                      var setSize = function (vw, vh) {
                        var ifw, ifh;
                        if (ifRatio > vRatio) {
                          ifh = Math.ceil(vh);
                          ifw = Math.ceil(ifh * ifRatio);
                        } else {
                          ifw = Math.ceil(vw);
                          ifh = Math.ceil(ifw / ifRatio);
                        }
                        $iFrame.css({
                          width: ifw + "px",
                          height: ifh + "px",
                          top: Math.round((windowH - ifh) / 2) + "px",
                          left: Math.round((windowW - ifw) / 2) + "px",
                        });
                      };
                      if (wRatio > vRatio) {
                        var vw = windowW;
                        var vh = vw / vRatio;
                        setSize(vw, vh);
                      } else {
                        var vh = windowH;
                        var vw = vh * vRatio;
                        setSize(vw, vh);
                      }
                    };
                    $(window).resize(resize);
                    resize();
                    event.target.setPlaybackQuality("highres");
                    if (vol !== undefined) event.target.setVolume(vol);
                    if (mute === "yes" || mute === undefined)
                      event.target.mute();
                    event.target.playVideo();
                  },
                  onStateChange: function (event) {
                    if (isNotDone && event.data === YT.PlayerState.PLAYING) {
                      isNotDone = false;
                      dones[elId]();
                    } else if (event.data === YT.PlayerState.ENDED) {
                      event.target.playVideo();
                    }
                  },
                },
              });
            });
          };
        };
      },
      {},
    ],
  },
  {},
  [10]
);
