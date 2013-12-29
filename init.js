/*
 * Yet Another Sound-Novel
 * author: Noriaki Uchiyama
 */

// $script
/*!
  * $script.js Async loader & dependency manager
  * https://github.com/ded/script.js
  * (c) Dustin Diaz 2013
  * License: MIT
  */
(function(e,t,n){typeof module!="undefined"&&module.exports?module.exports=n():typeof define=="function"&&define.amd?define(n):t[e]=n()})("$script",this,function(){function v(e,t){for(var n=0,r=e.length;n<r;++n)if(!t(e[n]))return f;return 1}function m(e,t){v(e,function(e){return!t(e)})}function g(e,t,a){function d(e){return e.call?e():r[e]}function b(){if(!--p){r[h]=1,c&&c();for(var e in s)v(e.split("|"),d)&&!m(s[e],d)&&(s[e]=[])}}e=e[l]?e:[e];var f=t&&t.call,c=f?t:a,h=f?e.join(""):t,p=e.length;return setTimeout(function(){m(e,function(e){if(e===null)return b();if(u[e])return h&&(i[h]=1),u[e]==2&&b();u[e]=1,h&&(i[h]=1),y(!n.test(e)&&o?o+e+".js":e,b)})},0),g}function y(n,r){var i=e.createElement("script"),s=f;i.onload=i.onerror=i[d]=function(){if(i[h]&&!/^c|loade/.test(i[h])||s)return;i.onload=i[d]=null,s=1,u[n]=2,r()},i.async=1,i.src=n,t.insertBefore(i,t.firstChild)}var e=document,t=e.getElementsByTagName("head")[0],n=/^https?:\/\//,r={},i={},s={},o,u={},a="string",f=!1,l="push",c="DOMContentLoaded",h="readyState",p="addEventListener",d="onreadystatechange";return!e[h]&&e[p]&&(e[p](c,function b(){e.removeEventListener(c,b,f),e[h]="complete"},f),e[h]="loading"),g.get=y,g.order=function(e,t,n){(function r(i){i=e.shift(),e.length?g(i,r):g(i,t,n)})()},g.path=function(e){o=e},g.ready=function(e,t,n){e=e[l]?e:[e];var i=[];return!m(e,function(e){r[e]||i[l](e)})&&v(e,function(e){return r[e]})?t():!function(e){s[e]=s[e]||[],s[e][l](t),n&&n(i)}(e.join("|")),g},g.done=function(e){g([null],e)},g});

// main
(function(w,d) {
    var VERSION = '0.0.1';

    var isLoadedjQuery = false;
    if(w['jQuery'] !== undefined) {
        isLoadedjQuery = true;
        w['__jQuery'] = w['jQuery'];
    }
    $script([
        'https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js',
        'https://raw.github.com/noriaki/ya-sound-novel/'+VERSION+'/extract-content-all.js'
    ], function() {
        if(isLoadedjQuery) {
            var __snjQuery = jQuery.noConflict(true);
            w['jQuery'] = w['__jQuery'];
        }
        (function($) {
            var ex = new ExtractContentJS.LayeredExtractor();
            ex.addHandler(ex.factory.getHandler('Heuristics'));
            var res = ex.extract(d);

            if(res.isSuccess) {
                var c = res.content;

                var next_sentence = function() {
                    var i = 0, texts = c.asTextFragment().split(/\u3002[^\u300D]/);
                    return function() { return texts[i++]; };
                }();

                // append background
                $('body').append($('<div id="__snbb">').attr('style', 'width:100%;height:100%;position:absolute;top:0;left:0;background:black;opacity:0.5;'));
                $('body').append($('<div id="__snbbt">').attr('style', 'width:94%;color:white;position:absolute;top:5%;left:3%;font-size:110%;font-family:serif;text-align:left;display:none;'));

                // set event and text
                $('#__snbbt').html('<p>'+res.title+'</p><p>'+res.url+'</p>').fadeIn();
                $('#__snbb,#__snbbt').on('click', function(e, s) {
                    if(s = next_sentence()) {
                        $('#__snbbt')
                            .fadeOut('fast', function() {
                                $(this).html('<p>'+s+'\u3002</p>')
                            })
                            .fadeIn();
                    } else {
                        $('#__snbbt')
                            .html('<p>End.</p>')
                            .append($('<p><a href="javascript:void(0);">close [x]</a></p>').on('click',function() { $('#__snbb,#__snbbt').remove(); }));
                    }
                });
            } else {}
        })(__snjQuery);
    });
})(window, document);
