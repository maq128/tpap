/*!  2013-08-22 */
KISSY.add("openjs/1.3.0/core",function(t){function e(e){function n(t){if(0!==t.indexOf("http://"))return{url:document.location.hostname};var e=document.createElement("a");e.href=t;var n=KISSY.clone({url:e.hostname});return e=null,n}e.markCtor(t.Anim),e.grantMethod(t.Anim,"run"),e.grantMethod(t.Anim,"stop"),e.grantMethod(t.Anim,"isRunning"),e.grantMethod(t.Anim,"isPaused"),e.grantMethod(t.Anim,"pause"),e.grantMethod(t.Anim,"resume"),t.NodeList.prototype.constructor=t.NodeList,e.markCtor(t.NodeList);var r="c_getDOMNodes end equals c_add item slice scrollTop scrollLeft height width c_appendTo c_prependTo c_insertBefore c_insertAfter c_animate stop run pause resume isRunning isPaused show hide toggle fadeIn fadeOut fadeToggle slideDown slideUp slideToggle c_filter test clone empty replaceWith parent hasClass c_addClass removeClass replaceClass toggleClass val text toggle offset scrollIntoView c_next c_prev c_first c_last c_siblings c_children contains remove  contains innerWidth innerHeight outerWidth outerHeight c_on c_delegate c_detach fire all len c_attr c_removeAttr c_hasAttr c_data c_hasData c_removeData".split(" "),a=t.EventObject||t.Event.DOMEventObject;e.markCtor(a),e.grantMethod(a,"halt"),e.grantMethod(a,"preventDefault"),e.grantMethod(a,"stopImmediatePropagation"),e.grantMethod(a,"stopPropagation");var o="altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which axis type".split(" ");t.each(o,function(t){e.grantRead(a.prototype,t)});var i=[/^(imagine\.taotaosou\.net)$|.\.(imagine\.taotaosou\.net)/,/.\.taobao\.(net)$/,/.\.taobaoapps\.(net)$/,/^(taegrid\.taobao\.com)$|.\.(taegrid\.taobao\.com)/,/^(uz\.taobao\.com)$|.\.(uz\.taobao\.com)/];return function(a){function o(e,n){var r=[];return n=n?o(n):[],r=t.isString(e)?t.query(e,n[0]||a.mod):t.query(e)}function c(t){return a.frame.imports.tameNode___(t,!0)}function u(){function t(e){return e.target&&(e.target=c(e.target)),e.relatedTarget&&(e.relatedTarget=c(e.relatedTarget)),e.currentTarget&&(e.currentTarget=c(e.currentTarget)),t.handle.call(this,e)}return t}var s=e.markFunction(function(e,n,r,a){var i=u();i.handle=r,r.__event_tag=r.__event_tag||[];var c=o(e);t.each(c,function(t){r.__event_tag.push({fn:i,el:t,scope:a||t})}),t.Event.on(c,n,i,a)}),d=e.markFunction(function(e,n,r,a,i){var c=u();c.handle=a,a.__event_tag=a.__event_tag||[];var s=o(e);t.each(s,function(t){a.__event_tag.push({fn:c,el:t,filter:r,scope:i||t})}),t.Event.delegate(s,n,r,c,i)}),l=e.markFunction(function(e,n,r,a){var i=o(e);if(r)for(var c=r.__event_tag||[],u=c.length-1;u>=0;u--){var s=c[u],d=a||s.el;s.scope===d&&t.inArray(s.el,i)&&(t.Event.remove(s.el,n,s.fn,a),c.splice(u,1))}else t.Event.remove(i,n)});return t.NodeList.prototype.c_on=function(t,e,n){var r=this,a=r.getDOMNodes();return s(a,t,e,n),this},t.NodeList.prototype.c_delegate=function(t,e,n,r){var a=this,o=a.getDOMNodes();return d(o,t,n,r),this},t.NodeList.prototype.c_detach=function(t,e,n){var r=this,a=r.getDOMNodes();return l(a,t,e,n),this},t.NodeList.prototype.c_getDOMNodes=function(){var e=[];return t.each(this.getDOMNodes(),function(t){e.push(c(t))}),e},t.each("add appendTo prependTo insertBefore insertAfter".split(" "),function(e){t.NodeList.prototype["c_"+e]=function(t){return this[e](o(t))}}),t.each("data hasData removeData".split(" "),function(e){t.NodeList.prototype["c_"+e]=function(t,n,r){return this[e](o(t),n,cajaAFTB.untame(r))}}),t.each("attr hasAttr removeAttr".split(" "),function(e){t.NodeList.prototype["c_"+e]=function(n,r,a){return t.isString(r)&&t.startsWith(r,"data-")?this[e](o(n),r,cajaAFTB.untame(a)):void 0}}),t.each("filter next prev first last siblings children".split(" "),function(e){t.NodeList.prototype["c_"+e]=function(n){return t.isFunction(n)?(t.error("filter参数必须是字符串"),this):this[e](n)}}),t.NodeList.prototype.len=function(){return this.length},t.NodeList.prototype.c_animate=function(){var e=t.makeArray(arguments);return t.isObject(e[0])&&(e[0]=cajaAFTB.untame(e[0])),this.animate(e[0],e[1],e[2],e[3])},t.NodeList.prototype.c_addClass=function(t){return this.addClass(t)},t.each(r,function(n){e.grantMethod(t.NodeList,n)}),{unparam:e.markFunction(function(e){return t.unparam(e)}),param:e.markFunction(function(e,n,r,a){return t.param(cajaAFTB.untame(e),n,r,a)}),unEscapeHTML:e.markFunction(function(e){return t.unEscapeHTML(e)}),escapeHTML:e.markFunction(function(e){return t.escapeHTML(e)}),substitute:e.markFunction(function(e,n){return t.substitute(e,cajaAFTB.untame(n))}),DOM:{get:e.markFunction(function(t,e){var n=o(t,e);return c(n[0],!0)}),query:e.markFunction(function(e,n){var r=o(e,n);return t.each(r,function(t,e){r[e]=c(t,!0)}),r}),text:e.markFunction(function(e,n){return t.DOM.text(o(e),n)}),offset:e.markFunction(function(e,n){return t.DOM.offset(o(e),n)}),css:e.markFunction(function(e,n){return t.DOM.css(o(e),n)}),hasClass:e.markFunction(function(e,n){return t.DOM.hasClass(o(e),n)}),addClass:e.markFunction(function(e,n){return t.DOM.addClass(o(e),n)}),removeClass:e.markFunction(function(e,n){return t.DOM.removeClass(o(e),n)}),toggleClass:e.markFunction(function(e,n){return t.DOM.toggleClass(o(e),n)}),replaceClass:e.markFunction(function(e,n,r){return t.DOM.replaceClass(o(e),n,r)}),data:e.markFunction(function(e,n,r){return t.DOM.data(o(e),n,cajaAFTB.untame(r))}),hasData:e.markFunction(function(e,n){return t.DOM.hasData(o(e),n)}),removeData:e.markFunction(function(e,n){return t.DOM.removeData(o(e),n)}),attr:e.markFunction(function(e,n,r){return t.isString(n)&&t.startsWith(n,"data-")?t.DOM.attr(o(e),n,r):void 0}),hasAttr:e.markFunction(function(e,n){return t.DOM.hasAttr(o(e),n)}),removeAttr:e.markFunction(function(e,n){return t.isString(n)&&t.startsWith(n,"data-")?t.DOM.removeAttr(o(e),n):void 0})},io:e.markFunction(function(e){var r=cajaAFTB.untame(e);r.data=cajaAFTB.untame(r.data);var a=r.url,o=!1;return a=n(a).url,t.each(i,function(t){t.test(a)&&(o=!0)}),"json"!==r.dataType&&"jsonp"!==r.dataType&&(r.dataType="jsonp"),o?t.io(t.mix(r)):function(){}}),UA:t.clone(t.UA),log:e.markFunction(function(){t.log.apply(t,arguments)}),Event:{add:s,on:s,remove:l,detach:l,delegate:d,fire:e.markFunction(function(e,n){t.Event.fire(o(e),n)})},Anim:e.markFunction(function(){var e=t.makeArray(arguments);return e[0]=o(e[0])[0],t.isObject(e[1])&&(e[1]=cajaAFTB.untame(e[1])),t.Anim.apply(window,e)}),JSON:{parse:e.markFunction(function(e){return t.JSON.parse(e)}),stringify:e.markFunction(function(e){return t.JSON.stringify(cajaAFTB.untame(e))})},all:e.markFunction(function(){return t.all(o(arguments[0]))}),alert:e.markFunction(function(t){alert(t)})}}}return t.DOM,t.Event,e},{requires:["core"]});