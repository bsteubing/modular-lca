/*
Copyright (c) 2012 Chris Pettitt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/(function(){function c(a){var b={};a.forEach(function(a,c){b[a]=c});return b}function d(a,b){Object.keys(a).forEach(function(c){b[c]=a[c]})}function f(a){return Math.min.apply(null,a)}function g(a){return Math.max.apply(null,a)}function i(a){return Array.prototype.concat.apply([],a)}function k(a){return Object.keys(a).map(function(b){return a[b]})}function l(a){var b={};for(var c=0;c<a.length;++c){var d=a[c];for(var e=0;e<d.length;++e){var f=d[e];b[f]=f}}var g=[];for(var h in b)g.push(b[h]);return g}function r(a,b,c,d){return function(e){if(!arguments.length)return b[c];b[c]=e;d&&d(e);return a}}function s(){function c(b){var d=a,f=2*b,g=f+1,h=b;if(f<d.length){h=d[f].pri<d[h].pri?f:h;g<d.length&&(h=d[g].pri<d[h].pri?g:h);if(h!==b){e(b,h);c(h)}}}function d(b){var c=a,d=c[b].pri,f;while(b>0){f=b>>1;if(c[f].pri<d)break;e(b,f);b=f}}function e(c,d){var e=a,f=b,g=e[c];e[c]=e[d];e[d]=g;f[e[c].key]=c;f[e[d].key]=d}function f(){return a.length}function g(){return Object.keys(b)}function h(a){return a in b}function i(c){var d=b[c];if(d!==undefined)return a[d].pri}function j(c,e){if(c in b)return!1;var f={key:c,pri:e},g=a.length;b[c]=g;a.push(f);d(g);return!0}function k(){if(f()>0)return a[0].key}function l(){e(0,a.length-1);var d=a.pop();delete b[d.key];c(0);return d.key}function m(c,e){var f=b[c];if(e>a[f].pri)throw new Error("New priority is greater than current priority. Key: "+c+" Old: "+a[f].pri+" New: "+e);a[f].pri=e;d(f)}var a=[],b={};return{size:f,keys:g,has:h,priority:i,add:j,min:k,removeMin:l,decrease:m}}dagre={};dagre.version="0.0.6";dagre.graph={};dagre.graph=function(){function g(a,b,c){var d=a[b];d||(d=a[b]={count:0,edges:{}});d.count++;d.edges[c]=!0}function h(a,b,c){var d=a[b];--d.count===0?delete a[b]:delete d.edges[c]}function m(b){var c=a[b];if(b in a)return c;throw new Error("Node '"+b+"' is not in graph:\n"+e.toString())}function n(a){var b=d[a];if(!b)throw new Error("Edge '"+a+"' is not in graph:\n"+e.toString());return b}var a={},b={},c={},d={},e={},f=0;e.addNode=function(d,f){if(e.hasNode(d))throw new Error("Graph already has node '"+d+"':\n"+e.toString());a[d]={id:d,value:f};b[d]={};c[d]={}};e.delNode=function(d){m(d);e.edges(d).forEach(function(a){e.delEdge(a)});delete b[d];delete c[d];delete a[d]};e.node=function(a){return m(a).value};e.hasNode=function(b){return b in a};e.addEdge=function(a,h,i,j){m(h);m(i);if(a===null)a="_ANON-"+ ++f;else if(e.hasEdge(a))throw new Error("Graph already has edge '"+a+"':\n"+e.toString());d[a]={id:a,source:h,target:i,value:j};g(b[i],h,a);g(c[h],i,a)};e.delEdge=function(a){var e=n(a);h(b[e.target],e.source,a);h(c[e.source],e.target,a);delete d[a]};e.edge=function(a){return n(a).value};e.source=function(a){return n(a).source};e.target=function(a){return n(a).target};e.hasEdge=function(a){return a in d};e.successors=function(b){m(b);return j(c[b]).map(function(b){return a[b].id})};e.predecessors=function(c){m(c);return j(b[c]).map(function(b){return a[b].id})};e.neighbors=function(d){m(d);var e={};j(c[d]).map(function(a){e[a]=!0});j(b[d]).map(function(a){e[a]=!0});return j(e).map(function(b){return a[b].id})};e.nodes=function(){var a=[];e.eachNode(function(b,c){a.push(b)});return a};e.eachNode=function(b){for(var c in a){var d=a[c];b(d.id,d.value)}};e.edges=function(a,b){var f,g;if(!arguments.length){f=[];e.eachEdge(function(a){f.push(a)});return f}if(arguments.length===1)return l([e.inEdges(a),e.outEdges(a)]);if(arguments.length===2){m(a);m(b);g=c[a];f=b in g?j(g[b].edges):[];return f.map(function(a){return d[a].id})}};e.eachEdge=function(a){for(var b in d){var c=d[b];a(c.id,c.source,c.target,c.value)}};e.inEdges=function(a){m(a);return i(k(b[a]).map(function(a){return j(a.edges)}))};e.outEdges=function(a){m(a);return i(k(c[a]).map(function(a){return j(a.edges)}))};e.subgraph=function(a){var b=dagre.graph();a.forEach(function(a){b.addNode(a,e.node(a))});k(d).forEach(function(a){b.hasNode(a.source)&&b.hasNode(a.target)&&b.addEdge(a.id,a.source,a.target,e.edge(a.id))});return b};e.toString=function(){var b="GRAPH:\n";b+="    Nodes:\n";j(a).forEach(function(c){b+="        "+c+": "+JSON.stringify(a[c].value)+"\n"});b+="    Edges:\n";j(d).forEach(function(a){var c=d[a];b+="        "+a+" ("+c.source+" -> "+c.target+"): "+JSON.stringify(d[a].value)+"\n"});return b};return e};dagre.layout=function(){function i(){function d(a,c){var d=c[a].dagre.id;if(!b.hasNode(d))throw new Error(a+" node for '"+e+"' not in node list");return d}var b=dagre.graph(),c=0;a.nodes.forEach(function(a){var d="id"in a?a.id:"_N"+c++;a.dagre={id:d,width:a.width,height:a.height};b.addNode(d,a.dagre)});a.edges.forEach(function(a){var e=d("source",a),f=d("target",a);a.dagre={points:[]};if(e!==f){var g="id"in a?a.id:"_E"+c++;a.dagre.id=g;a.dagre.minLen=a.minLen||1;a.dagre.width=a.width||0;a.dagre.height=a.height||0;b.addEdge(g,e,f,a.dagre)}});return b}function j(){var b=h.rankSep();try{if(!a.nodes.length)return;var e=i();e.eachEdge(function(a,b,c,d){d.minLen*=2});h.rankSep(b/2);c.run(e);d.run(e);k(e);f.run(e);g.run(e);l(e);m(e);c.undo(e)}finally{h.rankSep(b)}return h}function k(a){var b=0;a.eachEdge(function(c,d,e,f){var g=a.node(d).rank,h=a.node(e).rank;if(g+1<h){for(var i=d,j=g+1,k=0;j<h;++j,++k){var l="_D"+ ++b,m={width:f.width,height:f.height,edge:{id:c,source:d,target:e,attrs:f},rank:j,dummy:!0};k===0?m.index=0:j+1===h&&(m.index=1);a.addNode(l,m);a.addEdge(null,i,l,{});i=l}a.addEdge(null,i,e,{});a.delEdge(c)}})}function l(a){var b={};a.eachNode(function(b,c){if(c.dummy&&"index"in c){var d=c.edge;a.hasEdge(d.id)||a.addEdge(d.id,d.source,d.target,d.attrs);var e=a.edge(d.id).points;e[c.index]={x:c.x,y:c.y,ul:c.ul,ur:c.ur,dl:c.dl,dr:c.dr};a.delNode(b)}})}function m(a){a.eachEdge(function(a,b,c,d){d.reversed&&d.points.reverse()})}function n(a){return function(){if(!arguments.length)return a();a.apply(null,arguments);return h}}var a={nodes:[],edges:[],debugLevel:0},b=q(),c=dagre.layout.acyclic(),d=dagre.layout.rank(),f=dagre.layout.order(),g=dagre.layout.position(),h={};h.nodes=r(h,a,"nodes");h.edges=r(h,a,"edges");h.orderIters=n(f.iterations);h.nodeSep=n(g.nodeSep);h.edgeSep=n(g.edgeSep);h.universalSep=n(g.universalSep);h.rankSep=n(g.rankSep);h.rankDir=n(g.rankDir);h.debugAlignment=n(g.debugAlignment);h.debugLevel=r(h,a,"debugLevel",function(a){b.enabled(a);c.debugLevel(a);d.debugLevel(a);f.debugLevel(a);g.debugLevel(a)});h.run=b.wrap("Total layout",j);return h};dagre.layout.acyclic=function(){function d(b){function f(a){if(a in d)return;d[a]=c[a]=!0;b.outEdges(a).forEach(function(d){var g=b.target(d),h;if(g in c){h=b.edge(d);b.delEdge(d);h.reversed=!0;++e;b.addEdge(d,g,a,h)}else f(g)});delete c[a]}var c={},d={},e=0;b.eachNode(function(a){f(a)});a.debugLevel>=2&&console.log("Acyclic Phase: reversed "+e+" edge(s)")}var a={debugLevel:0},b=q(),c={};c.debugLevel=r(c,a,"debugLevel",function(a){b.enabled(a)});c.run=b.wrap("Acyclic Phase",d);c.undo=function(a){a.eachEdge(function(b,c,d,e){if(e.reversed){delete e.reversed;a.delEdge(b);a.addEdge(b,d,c,e)}})};return c};dagre.layout.rank=function(){function d(a){e(a);m(a).forEach(function(b){var c=a.subgraph(b);g(c);h(c)})}function e(a){var b={},c=s();a.eachNode(function(d){c.add(d,a.inEdges(d).length);b[d]=0});while(c.size()>0){var d=c.min();if(c.priority(d)>0)throw new Error("Input graph is not acyclic: "+a.toString());c.removeMin();var e=b[d];a.node(d).rank=e;a.outEdges(d).forEach(function(d){var f=a.target(d);b[f]=Math.max(b[f],e+(a.edge(d).minLen||1));c.decrease(f,c.priority(f)-1)})}}function g(a){function e(f,g){d[f]=!0;a.node(f).rank=g;c[f].forEach(function(c){if(!(c in d)){var h=b[i(f,c)];e(c,g+(a.edges(f,c).length?h:-h))}})}var b={};a.eachEdge(function(a,c,d,e){var f=i(c,d);b[f]=Math.max(b[f]||1,e.minLen||1)});var c=dagre.util.prim(a,function(c,d){return Math.abs(a.node(c).rank-a.node(d).rank)-b[i(c,d)]}),d={};e(a.nodes()[0],0);return c}function h(a){var b=f(a.nodes().map(function(b){return a.node(b).rank}));a.eachNode(function(a,c){c.rank-=b})}function i(a,b){return a<b?a.length+":"+a+"-"+b:b.length+":"+b+"-"+a}var a={debugLevel:0},b=q(),c={};c.debugLevel=r(c,a,"debugLevel",function(a){b.enabled(a)});c.run=b.wrap("Rank Phase",d);return c};dagre.layout.order=function(){function f(c){var d=g(c),e=n(d),f=a(c,d);b.debugLevel>=2&&console.log("Order phase start cross count: "+f);var h,i,j;for(i=0,j=0;j<4&&i<b.iterations;++i,++j){h=k(c,i,d);if(h<f){e=n(d);f=h;j=0}b.debugLevel>=3&&console.log("Order phase iter "+i+" cross count: "+f)}e.forEach(function(a){a.forEach(function(a,b){c.node(a).order=b})});if(b.debugLevel>=2){console.log("Order iterations: "+i);console.log("Order phase best cross count: "+f)}return e}function g(a){var b=[];a.eachNode(function(a,c){var d=b[c.rank]||(b[c.rank]=[]);d.push(a)});return b}function i(a){return function(b){var c=[];a.inEdges(b).forEach(function(b){c.push(a.source(b))});return c}}function j(a){return function(b){var c=[];a.outEdges(b).forEach(function(b){c.push(a.target(b))});return c}}function k(b,c,d){var e;if(c%2===0)for(e=1;e<d.length;++e)l(d[e-1],d[e],i(b));else for(e=d.length-2;e>=0;--e)l(d[e+1],d[e],j(b));return a(b,d)}function l(a,b,d){var e=c(b),f=m(a,b,d),g=b.filter(function(a){return f[a]!==-1});g.sort(function(a,b){return f[a]-f[b]||e[a]-e[b]});for(var h=b.length-1;h>=0;--h)f[b[h]]!==-1&&(b[h]=g.pop())}function m(a,b,d){var e=c(a),f={};b.forEach(function(a){var b=d(a);f[a]=b.length>0?h(b.map(function(a){return e[a]}))/b.length:-1});return f}function n(a){return a.map(function(a){return a.slice(0)})}var b={iterations:24,debugLevel:0},d=q(),e={};e.iterations=r(e,b,"iterations");e.debugLevel=r(e,b,"debugLevel",function(a){d.enabled(a)});e.run=d.wrap("Order Phase",f);e._barycenterLayer=l;return e};var a=dagre.layout.order.crossCount=function(a,c){var d=0,e;c.forEach(function(c){e&&(d+=b(a,e,c));e=c});return d},b=dagre.layout.order.bilayerCrossCount=function(a,b,d){var e=c(d),f=[];b.forEach(function(b){var c=[];a.outEdges(b).forEach(function(b){c.push(e[a.target(b)])});c.sort(function(a,b){return a-b});f=f.concat(c)});var g=1;while(g<d.length)g<<=1;var h=2*g-1;g-=1;var i=[];for(var j=0;j<h;++j)i[j]=0;var k=0;f.forEach(function(a){var b=a+g;++i[b];var c=0;while(b>0){b%2&&(k+=i[b+1]);b=b-1>>1;++i[b]}});return k};dagre.layout.position=function(){function d(b){var c=[];b.eachNode(function(a,b){var d=c[b.rank]||(c[b.rank]=[]);d[b.order]=a});var d=h(b,c),e={};["u","d"].forEach(function(a){a==="d"&&c.reverse();["l","r"].forEach(function(f){f==="r"&&p(c);var g=a+f,h=i(b,c,d,a==="u"?"predecessors":"successors");e[g]=j(b,c,h.pos,h.root,h.align);f==="r"&&o(e[g]);f==="r"&&p(c)});a==="d"&&c.reverse()});n(b,c,e);b.eachNode(function(a){var c=[];for(var d in e){w(d,b,a,e[d][a]);c.push(e[d][a])}c.sort(function(a,b){return a-b});v(b,a,(c[1]+c[2])/2)});var k=f(b.nodes().map(function(a){return v(b,a)-s(b,a)/2}));b.eachNode(function(a){v(b,a,v(b,a)-k)});var l=0;c.forEach(function(c){var d=g(c.map(function(a){return t(b,a)}));l+=d/2;c.forEach(function(a){x(b,a,l)});l+=d/2+a.rankSep})}function e(a,b){return a<b?a.toString().length+":"+a+"-"+b:b.toString().length+":"+b+"-"+a}function h(a,b){var c={},d={};if(b.length<=2)return c;b[1].forEach(function(a,b){d[a]=b});for(var f=1;f<b.length-1;++f){var g=b[f],h=b[f+1],i=0,j=0;for(var k=0;k<h.length;++k){var l=h[k];d[l]=k;var m=undefined;if(a.node(l).dummy){var n=a.predecessors(l)[0];a.node(n).dummy&&(m=d[n])}m===undefined&&k===h.length-1&&(m=g.length-1);if(m!==undefined){for(;j<=k;++j)a.predecessors(h[j]).forEach(function(a){var b=d[a];if(b<i||b>m)c[e(h[j],a)]=!0});i=m}}}return c}function i(a,b,c,d){var f={},g={},h={};b.forEach(function(a){a.forEach(function(a,b){g[a]=a;h[a]=a;f[a]=b})});b.forEach(function(b){var i=-1;b.forEach(function(b){var j=a[d](b),k;if(j.length>0){j.sort(function(a,b){return f[a]-f[b]});k=(j.length-1)/2;j.slice(Math.floor(k),Math.ceil(k)+1).forEach(function(a){if(h[b]===b&&!c[e(a,b)]&&i<f[a]){h[a]=b;h[b]=g[b]=g[a];i=f[a]}})}})});return{pos:f,root:g,align:h}}function j(a,b,c,d,e){function j(b){if(!(b in i)){i[b]=0;var k=b;do{if(c[k]>0){var l=d[h[k]];j(l);f[b]===b&&(f[b]=f[l]);var m=u(a,h[k])+u(a,k);f[b]!==f[l]?g[f[l]]=Math.min(g[f[l]]||Number.POSITIVE_INFINITY,i[b]-i[l]-m):i[b]=Math.max(i[b],i[l]+m)}k=e[k]}while(k!==b)}}var f={},g={},h={},i={};b.forEach(function(a){a.forEach(function(b,c){f[b]=b;c>0&&(h[b]=a[c-1])})});k(d).forEach(function(a){j(a)});b.forEach(function(a){a.forEach(function(a){i[a]=i[d[a]];var b=g[f[a]];d[a]===a&&b<Number.POSITIVE_INFINITY&&(i[a]+=b)})});return i}function l(a,b,c){return f(b.map(function(a){var b=a[0];return c[b]}))}function m(a,b,c){return g(b.map(function(a){var b=a[a.length-1];return c[b]}))}function n(a,b,c){var d={},e={},f,g={},h=Number.POSITIVE_INFINITY;for(var i in c){var j=c[i];d[i]=l(a,b,j);e[i]=m(a,b,j);var k=e[i]-d[i];if(k<h){h=k;f=i}}["u","d"].forEach(function(a){["l","r"].forEach(function(b){var c=a+b;g[c]=b==="l"?d[f]-d[c]:e[f]-e[c]})});for(var i in c)a.eachNode(function(a){c[i][a]+=g[i]})}function o(a){for(var b in a)a[b]=-a[b]}function p(a){a.forEach(function(a){a.reverse()})}function s(b,c){switch(a.rankDir){case"LR":return b.node(c).height;default:return b.node(c).width}}function t(b,c){switch(a.rankDir){case"LR":return b.node(c).width;default:return b.node(c).height}}function u(b,c){if(a.universalSep!==null)return a.universalSep;var d=s(b,c),e=b.node(c).dummy?a.edgeSep:a.nodeSep;return(d+e)/2}function v(b,c,d){switch(a.rankDir){case"LR":if(arguments.length<3)return b.node(c).y;b.node(c).y=d;break;default:if(arguments.length<3)return b.node(c).x;b.node(c).x=d}}function w(b,c,d,e){switch(a.rankDir){case"LR":if(arguments.length<3)return c.node(d)[b];c.node(d)[b]=e;break;default:if(arguments.length<3)return c.node(d)[b];c.node(d)[b]=e}}function x(b,c,d){switch(a.rankDir){case"LR":if(arguments.length<3)return b.node(c).x;b.node(c).x=d;break;default:if(arguments.length<3)return b.node(c).y;b.node(c).y=d}}var a={nodeSep:50,edgeSep:10,universalSep:null,rankSep:30,rankDir:"TB",debugLevel:0},b=q(),c={};c.nodeSep=r(c,a,"nodeSep");c.edgeSep=r(c,a,"edgeSep");c.universalSep=r(c,a,"universalSep");c.rankSep=r(c,a,"rankSep");c.rankDir=r(c,a,"rankDir");c.debugLevel=r(c,a,"debugLevel",function(a){b.enabled(a)});c.run=b.wrap("Position Phase",d);return c};dagre.util={};var h=dagre.util.sum=function(a){return a.reduce(function(a,b){return a+b},0)},j=dagre.util.keys=Object.keys,m=dagre.util.components=function(a){function d(b,e){if(!(b in c)){c[b]=!0;e.push(b);a.neighbors(b).forEach(function(a){d(a,e)})}}var b=[],c={};a.eachNode(function(a){var c=[];d(a,c);c.length>0&&b.push(c)});return b},n=dagre.util.prim=function(a,b){var c={},d={},e=s();if(a.nodes().length===0)return c;a.eachNode(function(a){e.add(a,Number.POSITIVE_INFINITY);c[a]=[]});e.decrease(a.nodes()[0],0);var f,g=!1;while(e.size()>0){f=e.removeMin();if(f in d){c[f].push(d[f]);c[d[f]].push(f)}else{if(g)throw new Error("Input graph is not connected:\n"+a.toString());g=!0}a.neighbors(f).forEach(function(a){var c=e.priority(a);if(c!==undefined){var g=b(f,a);if(g<c){d[a]=f;e.decrease(a,g)}}})}return c},o=dagre.util.intersectRect=function(a,b){var c=a.x,d=a.y,e=b.x-c,f=b.y-d,g=a.width/2,h=a.height/2,i,j;if(Math.abs(f)*g>Math.abs(e)*h){f<0&&(h=-h);i=f===0?0:h*e/f;j=h}else{e<0&&(g=-g);i=g;j=e===0?0:g*f/e}return{x:c+i,y:d+j}},p=dagre.util.pointStr=function(a){return a.x+","+a.y},q=function(){var a={},b=!1;a.enabled=function(c){if(!arguments.length)return b;b=c;return a};a.wrap=function(a,c){return function(){var d=b?(new Date).getTime():null;try{return c.apply(null,arguments)}finally{d&&console.log(a+" time: "+((new Date).getTime()-d)+"ms")}}};return a};dagre.dot={};dagre.dot.toGraph=function(a){function f(a,b){if(!c.hasNode(a)){c.addNode(a,j.get("node",{id:a}));c.node(a).label===undefined&&(c.node(a).label=a)}b&&d(b,c.node(a))}function h(a,b,e){var f=a+"-"+b,h=g[f];h||(h=g[f]=0);g[f]++;var i=e.id||f+"-"+h,k={};d(j.get("edge",e),k);d({id:i},k);c.addEdge(i,a,b,k)}function i(a){function e(a){c.push(a)}var b={},c=[],d;e(a);while(c.length!==0){d=c.pop();switch(d.type){case"node":b[d.id]=!0;break;case"edge":d.elems.forEach(e);break;case"subgraph":d.stmts.forEach(e)}}return dagre.util.keys(b)}function k(a){var b=a.attrs;switch(a.type){case"node":f(a.id,b);break;case"edge":var c,d;a.elems.forEach(function(a){k(a);switch(a.type){case"node":d=[a.id];break;case"subgraph":d=i(a);break;default:throw new Error("Unsupported type incident on edge: "+a.type)}c&&c.forEach(function(a){d.forEach(function(c){h(a,c,b);e&&h(c,a,b)})});c=d});break;case"subgraph":j.enterSubGraph();a.stmts.forEach(function(a){k(a)});j.exitSubGraph();break;case"attr":j.set(a.attrType,b);break;default:throw new Error("Unsupported statement type: "+a.type)}}var b=dot_parser.parse(a),c=dagre.graph(),e=b.type==="graph",g={},j={_default:{},get:function(b,c){if(typeof this._default[b]!="undefined"){var e={};d(this._default[b],e);d(c,e);return e}return c},set:function(b,c){this._default[b]=this.get(b,c)},enterSubGraph:function(){function a(){}a.prototype=this._default;var b=new a;this._default=b},exitSubGraph:function(){this._default=Object.getPrototypeOf(this._default)}};b.stmts&&b.stmts.forEach(function(a){k(a)});return c};dagre.dot.toObjects=function(a){var b=dagre.dot.toGraph(a),c=b.nodes().map(function(a){return b.node(a)}),d=b.edges().map(function(a){var c=b.edge(a);c.source=b.node(b.source(a));c.target=b.node(b.target(a));return c});return{nodes:c,edges:d}};dot_parser=function(){function a(a){return'"'+a.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\x08/g,"\\b").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\f/g,"\\f").replace(/\r/g,"\\r").replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g,escape)+'"'}var b={parse:function(b,c){function i(a,b,c){var d=a,e=c-a.length;for(var f=0;f<e;f++)d=b+d;return d}function j(a){var b=a.charCodeAt(0),c,d;if(b<=255){c="x";d=2}else{c="u";d=4}return"\\"+c+i(b.toString(16).toUpperCase(),"0",d)}function k(a){if(e<g)return;if(e>g){g=e;h=[]}h.push(a)}function l(){var a,c,d,g,h,i,j,l,n,o,p,q,r,s,t,u;s=e;t=e;a=[];c=M();while(c!==null){a.push(c);c=M()}if(a!==null){u=e;c=I();if(c!==null){d=M();if(d!==null)c=[c,d];else{c=null;e=u}}else{c=null;e=u}c=c!==null?c:"";if(c!==null){d=J();if(d!==null){g=[];h=M();while(h!==null){g.push(h);h=M()}if(g!==null){h=C();h=h!==null?h:"";if(h!==null){i=[];j=M();while(j!==null){i.push(j);j=M()}if(i!==null){if(b.charCodeAt(e)===123){j="{";e++}else{j=null;f===0&&k('"{"')}if(j!==null){l=[];n=M();while(n!==null){l.push(n);n=M()}if(l!==null){n=m();n=n!==null?n:"";if(n!==null){o=[];p=M();while(p!==null){o.push(p);p=M()}if(o!==null){if(b.charCodeAt(e)===125){p="}";e++}else{p=null;f===0&&k('"}"')}if(p!==null){q=[];r=M();while(r!==null){q.push(r);r=M()}if(q!==null)a=[a,c,d,g,h,i,j,l,n,o,p,q];else{a=null;e=t}}else{a=null;e=t}}else{a=null;e=t}}else{a=null;e=t}}else{a=null;e=t}}else{a=null;e=t}}else{a=null;e=t}}else{a=null;e=t}}else{a=null;e=t}}else{a=null;e=t}}else{a=null;e=t}}else{a=null;e=t}a!==null&&(a=function(a,b,c,d){return{type:b,id:c,stmts:d}}(s,a[2],a[4],a[8]));a===null&&(e=s);return a}function m(){var a,c,d,g,h,i,j,l,m,o,p;m=e;o=e;a=n();if(a!==null){c=[];d=M();while(d!==null){c.push(d);d=M()}if(c!==null){if(b.charCodeAt(e)===59){d=";";e++}else{d=null;f===0&&k('";"')}d=d!==null?d:"";if(d!==null){g=[];p=e;h=[];i=M();while(i!==null){h.push(i);i=M()}if(h!==null){i=n();if(i!==null){j=[];l=M();while(l!==null){j.push(l);l=M()}if(j!==null){if(b.charCodeAt(e)===59){l=";";e++}else{l=null;f===0&&k('";"')}l=l!==null?l:"";if(l!==null)h=[h,i,j,l];else{h=null;e=p}}else{h=null;e=p}}else{h=null;e=p}}else{h=null;e=p}while(h!==null){g.push(h);p=e;h=[];i=M();while(i!==null){h.push(i);i=M()}if(h!==null){i=n();if(i!==null){j=[];l=M();while(l!==null){j.push(l);l=M()}if(j!==null){if(b.charCodeAt(e)===59){l=";";e++}else{l=null;f===0&&k('";"')}l=l!==null?l:"";if(l!==null)h=[h,i,j,l];else{h=null;e=p}}else{h=null;e=p}}else{h=null;e=p}}else{h=null;e=p}}if(g!==null)a=[a,c,d,g];else{a=null;e=o}}else{a=null;e=o}}else{a=null;e=o}}else{a=null;e=o}a!==null&&(a=function(a,b,c){var d=[b];for(var e=0;e<c.length;++e)d.push(c[e][1]);return d}(m,a[0],a[3]));a===null&&(e=m);return a}function n(){var a;a=o();if(a===null){a=r();if(a===null){a=s();if(a===null){a=p();a===null&&(a=q())}}}return a}function o(){var a,b,c,d,f;d=e;f=e;a=F();if(a===null){a=D();a===null&&(a=E())}if(a!==null){b=[];c=M();while(c!==null){b.push(c);c=M()}if(b!==null){c=t();if(c!==null)a=[a,b,c];else{a=null;e=f}}else{a=null;e=f}}else{a=null;e=f}a!==null&&(a=function(a,b,c){return{type:"attr",attrType:b,attrs:c||{}}}(d,a[0],a[2]));a===null&&(e=d);return a}function p(){var a,c,d,g,h,i,j;i=e;j=e;a=C();if(a!==null){c=[];d=M();while(d!==null){c.push(d);d=M()}if(c!==null){if(b.charCodeAt(e)===61){d="=";e++}else{d=null;f===0&&k('"="')}if(d!==null){g=[];h=M();while(h!==null){g.push(h);h=M()}if(g!==null){h=C();if(h!==null)a=[a,c,d,g,h];else{a=null;e=j}}else{a=null;e=j}}else{a=null;e=j}}else{a=null;e=j}}else{a=null;e=j}a!==null&&(a=function(a,b,c){var d={};d[b]=c;return{type:"inlineAttr",attrs:d}}(i,a[0],a[4]));a===null&&(e=i);return a}function q(){var a,b,c,d,f;d=e;f=e;a=z();if(a!==null){b=[];c=M();while(c!==null){b.push(c);c=M()}if(b!==null){c=t();c=c!==null?c:"";if(c!==null)a=[a,b,c];else{a=null;e=f}}else{a=null;e=f}}else{a=null;e=f}a!==null&&(a=function(a,b,c){return{type:"node",id:b,attrs:c||{}}}(d,a[0],a[2]));a===null&&(e=d);return a}function r(){var a,b,c,d,f,g,h;g=e;h=e;a=y();if(a!==null){b=[];c=M();while(c!==null){b.push(c);c=M()}if(b!==null){c=w();if(c!==null){d=[];f=M();while(f!==null){d.push(f);f=M()}if(d!==null){f=t();f=f!==null?f:"";if(f!==null)a=[a,b,c,d,f];else{a=null;e=h}}else{a=null;e=h}}else{a=null;e=h}}else{a=null;e=h}}else{a=null;e=h}a!==null&&(a=function(a,b,c,d){var e=[b];for(var f=0;f<c.length;++f)e.push(c[f]);return{type:"edge",elems:e,attrs:d||{}}}(g,a[0],a[2],a[4]));a===null&&(e=g);return a}function s(){var a,c,d,g,h,i,j,l,n,o;j=e;l=e;n=e;a=H();if(a!==null){c=[];d=M();while(d!==null){c.push(d);d=M()}if(c!==null){o=e;d=C();if(d!==null){g=[];h=M();while(h!==null){g.push(h);h=M()}if(g!==null)d=[d,g];else{d=null;e=o}}else{d=null;e=o}d=d!==null?d:"";if(d!==null)a=[a,c,d];else{a=null;e=n}}else{a=null;e=n}}else{a=null;e=n}a=a!==null?a:"";if(a!==null){if(b.charCodeAt(e)===123){c="{";e++}else{c=null;f===0&&k('"{"')}if(c!==null){d=[];g=M();while(g!==null){d.push(g);g=M()}if(d!==null){g=m();if(g!==null){h=[];i=M();while(i!==null){h.push(i);i=M()}if(h!==null){if(b.charCodeAt(e)===125){i="}";e++}else{i=null;f===0&&k('"}"')}if(i!==null)a=[a,c,d,g,h,i];else{a=null;e=l}}else{a=null;e=l}}else{a=null;e=l}}else{a=null;e=l}}else{a=null;e=l}}else{a=null;e=l}a!==null&&(a=function(a,b,c){b=b[2]||[];return{type:"subgraph",id:b[0],stmts:c}}(j,a[0],a[3]));a===null&&(e=j);return a}function t(){var a,b,c,d,f,g,h;f=e;g=e;a=u();if(a!==null){b=[];h=e;c=[];d=M();while(d!==null){c.push(d);d=M()}if(c!==null){d=u();if(d!==null)c=[c,d];else{c=null;e=h}}else{c=null;e=h}while(c!==null){b.push(c);h=e;c=[];d=M();while(d!==null){c.push(d);d=M()}if(c!==null){d=u();if(d!==null)c=[c,d];else{c=null;e=h}}else{c=null;e=h}}if(b!==null)a=[a,b];else{a=null;e=g}}else{a=null;e=g}a!==null&&(a=function(a,b,c){var d=b;for(var e=0;e<c.length;++e)d=Q(d,c[e][1]);return d}(f,a[0],a[1]));a===null&&(e=f);return a}function u(){var a,c,d,g,h,i,j;i=e;j=e;if(b.charCodeAt(e)===91){a="[";e++}else{a=null;f===0&&k('"["')}if(a!==null){c=[];d=M();while(d!==null){c.push(d);d=M()}if(c!==null){d=v();d=d!==null?d:"";if(d!==null){g=[];h=M();while(h!==null){g.push(h);h=M()}if(g!==null){if(b.charCodeAt(e)===93){h="]";e++}else{h=null;f===0&&k('"]"')}if(h!==null)a=[a,c,d,g,h];else{a=null;e=j}}else{a=null;e=j}}else{a=null;e=j}}else{a=null;e=j}}else{a=null;e=j}a!==null&&(a=function(a,b){return b}(i,a[2]));a===null&&(e=i);return a}function v(){var a,c,d,g,h,i,j,l,m;j=e;l=e;a=x();if(a!==null){c=[];m=e;d=[];g=M();while(g!==null){d.push(g);g=M()}if(d!==null){if(b.charCodeAt(e)===44){g=",";e++}else{g=null;f===0&&k('","')}g=g!==null?g:"";if(g!==null){h=[];i=M();while(i!==null){h.push(i);i=M()}if(h!==null){i=x();if(i!==null)d=[d,g,h,i];else{d=null;e=m}}else{d=null;e=m}}else{d=null;e=m}}else{d=null;e=m}while(d!==null){c.push(d);m=e;d=[];g=M();while(g!==null){d.push(g);g=M()}if(d!==null){if(b.charCodeAt(e)===44){g=",";e++}else{g=null;f===0&&k('","')}g=g!==null?g:"";if(g!==null){h=[];i=M();while(i!==null){h.push(i);i=M()}if(h!==null){i=x();if(i!==null)d=[d,g,h,i];else{d=null;e=m}}else{d=null;e=m}}else{d=null;e=m}}else{d=null;e=m}}if(c!==null)a=[a,c];else{a=null;e=l}}else{a=null;e=l}a!==null&&(a=function(a,b,c){var d=b;for(var e=0;e<c.length;++e)d=Q(d,c[e][3]);return d}(j,a[0],a[1]));a===null&&(e=j);return a}function w(){var a,c,d,g,h,i,j,l;i=e;j=e;l=e;if(b.substr(e,2)==="--"){a="--";e+=2}else{a=null;f===0&&k('"--"')}if(a!==null){c=function(a){return P}(e)?null:"";if(c!==null)a=[a,c];else{a=null;e=l}}else{a=null;e=l}if(a===null){l=e;if(b.substr(e,2)==="->"){a="->";e+=2}else{a=null;f===0&&k('"->"')}if(a!==null){c=function(a){return P}(e)?"":null;if(c!==null)a=[a,c];else{a=null;e=l}}else{a=null;e=l}}if(a!==null){c=[];d=M();while(d!==null){c.push(d);d=M()}if(c!==null){d=y();if(d!==null){g=[];h=M();while(h!==null){g.push(h);h=M()}if(g!==null){h=w();h=h!==null?h:"";if(h!==null)a=[a,c,d,g,h];else{a=null;e=j}}else{a=null;e=j}}else{a=null;e=j}}else{a=null;e=j}}else{a=null;e=j}a!==null&&(a=function(a,b,c){var d=[b];for(var e=0;e<c.length;++e)d.push(c[e]);return d}(i,a[2],a[4]));a===null&&(e=i);return a}function x(){var a,c,d,g,h,i,j,l;i=e;j=e;a=C();if(a!==null){l=e;c=[];d=M();while(d!==null){c.push(d);d=M()}if(c!==null){if(b.charCodeAt(e)===61){d="=";e++}else{d=null;f===0&&k('"="')}if(d!==null){g=[];h=M();while(h!==null){g.push(h);h=M()}if(g!==null){h=C();if(h!==null)c=[c,d,g,h];else{c=null;e=l}}else{c=null;e=l}}else{c=null;e=l}}else{c=null;e=l}c=c!==null?c:"";if(c!==null)a=[a,c];else{a=null;e=j}}else{a=null;e=j}a!==null&&(a=function(a,b,c){var d={};d[b]=c[3];return d}(i,a[0],a[1]));a===null&&(e=i);return a}function y(){var a,b;a=s();if(a===null){b=e;a=z();a!==null&&(a=function(a,b){return{type:"node",id:b,attrs:{}}}(b,a));a===null&&(e=b)}return a}function z(){var a,b,c,d,f;d=e;f=e;a=C();if(a!==null){b=[];c=M();while(c!==null){b.push(c);c=M()}if(b!==null){c=A();c=c!==null?c:"";if(c!==null)a=[a,b,c];else{a=null;e=f}}else{a=null;e=f}}else{a=null;e=f}a!==null&&(a=function(a,b){return b}(d,a[0]));a===null&&(e=d);return a}function A(){var a,c,d,g,h,i,j,l,m;l=e;if(b.charCodeAt(e)===58){a=":";e++}else{a=null;f===0&&k('":"')}if(a!==null){c=[];d=M();while(d!==null){c.push(d);d=M()}if(c!==null){d=C();if(d!==null){g=[];h=M();while(h!==null){g.push(h);h=M()}if(g!==null){m=e;if(b.charCodeAt(e)===58){h=":";e++}else{h=null;f===0&&k('":"')}if(h!==null){i=[];j=M();while(j!==null){i.push(j);j=M()}if(i!==null){j=B();if(j!==null)h=[h,i,j];else{h=null;e=m}}else{h=null;e=m}}else{h=null;e=m}h=h!==null?h:"";if(h!==null)a=[a,c,d,g,h];else{a=null;e=l}}else{a=null;e=l}}else{a=null;e=l}}else{a=null;e=l}}else{a=null;e=l}return a}function B(){var a;if(b.charCodeAt(e)===110){a="n";e++}else{a=null;f===0&&k('"n"')}if(a===null){if(b.substr(e,2)==="ne"){a="ne";e+=2}else{a=null;f===0&&k('"ne"')}if(a===null){if(b.charCodeAt(e)===101){a="e";e++}else{a=null;f===0&&k('"e"')}if(a===null){if(b.substr(e,2)==="se"){a="se";e+=2}else{a=null;f===0&&k('"se"')}if(a===null){if(b.charCodeAt(e)===115){a="s";e++}else{a=null;f===0&&k('"s"')}if(a===null){if(b.substr(e,2)==="sw"){a="sw";e+=2}else{a=null;f===0&&k('"sw"')}if(a===null){if(b.charCodeAt(e)===119){a="w";e++}else{a=null;f===0&&k('"w"')}if(a===null){if(b.substr(e,2)==="nw"){a="nw";e+=2}else{a=null;f===0&&k('"nw"')}if(a===null){if(b.charCodeAt(e)===99){a="c";e++}else{a=null;f===0&&k('"c"')}if(a===null)if(b.charCodeAt(e)===95){a="_";e++}else{a=null;f===0&&k('"_"')}}}}}}}}}return a}function C(){var a,c,d,g,h,i,j,l,m;f++;i=e;j=e;if(/^[a-zA-Z\u0200-\u0377_]/.test(b.charAt(e))){a=b.charAt(e);e++}else{a=null;f===0&&k("[a-zA-Z\\u0200-\\u0377_]")}if(a!==null){c=[];if(/^[a-zA-Z\u0200-\u0377_0-9]/.test(b.charAt(e))){d=b.charAt(e);e++}else{d=null;f===0&&k("[a-zA-Z\\u0200-\\u0377_0-9]")}while(d!==null){c.push(d);if(/^[a-zA-Z\u0200-\u0377_0-9]/.test(b.charAt(e))){d=b.charAt(e);e++}else{d=null;f===0&&k("[a-zA-Z\\u0200-\\u0377_0-9]")}}if(c!==null)a=[a,c];else{a=null;e=j}}else{a=null;e=j}a!==null&&(a=function(a,b,c){return b+c.join("")}(i,a[0],a[1]));a===null&&(e=i);if(a===null){i=e;j=e;if(b.charCodeAt(e)===45){a="-";e++}else{a=null;f===0&&k('"-"')}a=a!==null?a:"";if(a!==null){if(b.charCodeAt(e)===46){c=".";e++}else{c=null;f===0&&k('"."')}if(c!==null){if(/^[0-9]/.test(b.charAt(e))){g=b.charAt(e);e++}else{g=null;f===0&&k("[0-9]")}if(g!==null){d=[];while(g!==null){d.push(g);if(/^[0-9]/.test(b.charAt(e))){g=b.charAt(e);e++}else{g=null;f===0&&k("[0-9]")}}}else d=null;if(d!==null)a=[a,c,d];else{a=null;e=j}}else{a=null;e=j}}else{a=null;e=j}a!==null&&(a=function(a,b,c,d){return b+c+d.join("")}(i,a[0],a[1],a[2]));a===null&&(e=i);if(a===null){i=e;j=e;if(b.charCodeAt(e)===45){a="-";e++}else{a=null;f===0&&k('"-"')}a=a!==null?a:"";if(a!==null){if(/^[0-9]/.test(b.charAt(e))){d=b.charAt(e);e++}else{d=null;f===0&&k("[0-9]")}if(d!==null){c=[];while(d!==null){c.push(d);if(/^[0-9]/.test(b.charAt(e))){d=b.charAt(e);e++}else{d=null;f===0&&k("[0-9]")}}}else c=null;if(c!==null){l=e;if(b.charCodeAt(e)===46){d=".";e++}else{d=null;f===0&&k('"."')}if(d!==null){g=[];if(/^[0-9]/.test(b.charAt(e))){h=b.charAt(e);e++}else{h=null;f===0&&k("[0-9]")}while(h!==null){g.push(h);if(/^[0-9]/.test(b.charAt(e))){h=b.charAt(e);e++}else{h=null;f===0&&k("[0-9]")}}if(g!==null)d=[d,g];else{d=null;e=l}}else{d=null;e=l}d=d!==null?d:"";if(d!==null)a=[a,c,d];else{a=null;e=j}}else{a=null;e=j}}else{a=null;e=j}a!==null&&(a=function(a,b,c,d){return b+c.join("")+(d[0]||"")+(d[1]||[]).join("")}(i,a[0],a[1],a[2]));a===null&&(e=i);if(a===null){i=e;j=e;if(b.charCodeAt(e)===34){a='"';e++}else{a=null;f===0&&k('"\\""')}if(a!==null){c=[];l=e;if(b.substr(e,2)==='\\"'){d='\\"';e+=2}else{d=null;f===0&&k('"\\\\\\""')}d!==null&&(d=function(a){return'"'}(l));d===null&&(e=l);if(d===null){l=e;m=e;if(b.charCodeAt(e)===92){d="\\";e++}else{d=null;f===0&&k('"\\\\"')}if(d!==null){if(/^[^"]/.test(b.charAt(e))){g=b.charAt(e);e++}else{g=null;f===0&&k('[^"]')}if(g!==null)d=[d,g];else{d=null;e=m}}else{d=null;e=m}d!==null&&(d=function(a,b){return"\\"+b}(l,d[1]));d===null&&(e=l);if(d===null)if(/^[^"]/.test(b.charAt(e))){d=b.charAt(e);e++}else{d=null;f===0&&k('[^"]')}}while(d!==null){c.push(d);l=e;if(b.substr(e,2)==='\\"'){d='\\"';e+=2}else{d=null;f===0&&k('"\\\\\\""')}d!==null&&(d=function(a){return'"'}(l));d===null&&(e=l);if(d===null){l=e;m=e;if(b.charCodeAt(e)===92){d="\\";e++}else{d=null;f===0&&k('"\\\\"')}if(d!==null){if(/^[^"]/.test(b.charAt(e))){g=b.charAt(e);e++}else{g=null;f===0&&k('[^"]')}if(g!==null)d=[d,g];else{d=null;e=m}}else{d=null;e=m}d!==null&&(d=function(a,b){return"\\"+b}(l,d[1]));d===null&&(e=l);if(d===null)if(/^[^"]/.test(b.charAt(e))){d=b.charAt(e);e++}else{d=null;f===0&&k('[^"]')}}}if(c!==null){if(b.charCodeAt(e)===34){d='"';e++}else{d=null;f===0&&k('"\\""')}if(d!==null)a=[a,c,d];else{a=null;e=j}}else{a=null;e=j}}else{a=null;e=j}a!==null&&(a=function(a,b){return b.join("")}(i,a[1]));a===null&&(e=i)}}}f--;f===0&&a===null&&k("identifier");return a}function D(){var a,c;c=e;if(b.substr(e,4).toLowerCase()==="node"){a=b.substr(e,4);e+=4}else{a=null;f===0&&k('"node"')}a!==null&&(a=function(a,b){return b.toLowerCase()}(c,a));a===null&&(e=c);return a}function E(){var a,c;c=e;if(b.substr(e,4).toLowerCase()==="edge"){a=b.substr(e,4);e+=4}else{a=null;f===0&&k('"edge"')}a!==null&&(a=function(a,b){return b.toLowerCase()}(c,a));a===null&&(e=c);return a}function F(){var a,c;c=e;if(b.substr(e,5).toLowerCase()==="graph"){a=b.substr(e,5);e+=5}else{a=null;f===0&&k('"graph"')}a!==null&&(a=function(a,b){return b
.toLowerCase()}(c,a));a===null&&(e=c);return a}function G(){var a,c;c=e;if(b.substr(e,7).toLowerCase()==="digraph"){a=b.substr(e,7);e+=7}else{a=null;f===0&&k('"digraph"')}a!==null&&(a=function(a,b){return b.toLowerCase()}(c,a));a===null&&(e=c);return a}function H(){var a,c;c=e;if(b.substr(e,8).toLowerCase()==="subgraph"){a=b.substr(e,8);e+=8}else{a=null;f===0&&k('"subgraph"')}a!==null&&(a=function(a,b){return b.toLowerCase()}(c,a));a===null&&(e=c);return a}function I(){var a,c;c=e;if(b.substr(e,6).toLowerCase()==="strict"){a=b.substr(e,6);e+=6}else{a=null;f===0&&k('"strict"')}a!==null&&(a=function(a,b){return b.toLowerCase()}(c,a));a===null&&(e=c);return a}function J(){var a,b;a=F();if(a===null){b=e;a=G();a!==null&&(a=function(a,b){P=b==="digraph";return b}(b,a));a===null&&(e=b)}return a}function K(){var a,c;f++;if(/^[ \t\r\n]/.test(b.charAt(e))){c=b.charAt(e);e++}else{c=null;f===0&&k("[ \\t\\r\\n]")}if(c!==null){a=[];while(c!==null){a.push(c);if(/^[ \t\r\n]/.test(b.charAt(e))){c=b.charAt(e);e++}else{c=null;f===0&&k("[ \\t\\r\\n]")}}}else a=null;f--;f===0&&a===null&&k("whitespace");return a}function L(){var a,c,d,g,h,i,j;f++;h=e;if(b.substr(e,2)==="//"){a="//";e+=2}else{a=null;f===0&&k('"//"')}if(a!==null){c=[];if(/^[^\n]/.test(b.charAt(e))){d=b.charAt(e);e++}else{d=null;f===0&&k("[^\\n]")}while(d!==null){c.push(d);if(/^[^\n]/.test(b.charAt(e))){d=b.charAt(e);e++}else{d=null;f===0&&k("[^\\n]")}}if(c!==null)a=[a,c];else{a=null;e=h}}else{a=null;e=h}if(a===null){h=e;if(b.substr(e,2)==="/*"){a="/*";e+=2}else{a=null;f===0&&k('"/*"')}if(a!==null){c=[];i=e;j=e;f++;if(b.substr(e,2)==="*/"){d="*/";e+=2}else{d=null;f===0&&k('"*/"')}f--;if(d===null)d="";else{d=null;e=j}if(d!==null){if(b.length>e){g=b.charAt(e);e++}else{g=null;f===0&&k("any character")}if(g!==null)d=[d,g];else{d=null;e=i}}else{d=null;e=i}while(d!==null){c.push(d);i=e;j=e;f++;if(b.substr(e,2)==="*/"){d="*/";e+=2}else{d=null;f===0&&k('"*/"')}f--;if(d===null)d="";else{d=null;e=j}if(d!==null){if(b.length>e){g=b.charAt(e);e++}else{g=null;f===0&&k("any character")}if(g!==null)d=[d,g];else{d=null;e=i}}else{d=null;e=i}}if(c!==null){if(b.substr(e,2)==="*/"){d="*/";e+=2}else{d=null;f===0&&k('"*/"')}if(d!==null)a=[a,c,d];else{a=null;e=h}}else{a=null;e=h}}else{a=null;e=h}}f--;f===0&&a===null&&k("comment");return a}function M(){var a;a=K();a===null&&(a=L());return a}function N(a){a.sort();var b=null,c=[];for(var d=0;d<a.length;d++)if(a[d]!==b){c.push(a[d]);b=a[d]}return c}function O(){var a=1,c=1,d=!1;for(var f=0;f<Math.max(e,g);f++){var h=b.charAt(f);if(h==="\n"){d||a++;c=1;d=!1}else if(h==="\r"||h==="\u2028"||h==="\u2029"){a++;c=1;d=!0}else{c++;d=!1}}return{line:a,column:c}}function Q(a,b){var c={};for(var d in a)c[d]=a[d];for(var d in b)c[d]=b[d];return c}var d={start:l,stmtList:m,stmt:n,attrStmt:o,inlineAttrStmt:p,nodeStmt:q,edgeStmt:r,subgraphStmt:s,attrList:t,attrListBlock:u,aList:v,edgeRHS:w,idDef:x,nodeIdOrSubgraph:y,nodeId:z,port:A,compassPt:B,id:C,node:D,edge:E,graph:F,digraph:G,subgraph:H,strict:I,graphType:J,whitespace:K,comment:L,_:M};if(c!==undefined){if(d[c]===undefined)throw new Error("Invalid rule name: "+a(c)+".")}else c="start";var e=0,f=0,g=0,h=[],P,R=d[c]();if(R===null||e!==b.length){var S=Math.max(e,g),T=S<b.length?b.charAt(S):null,U=O();throw new this.SyntaxError(N(h),T,S,U.line,U.column)}return R},toSource:function(){return this._source}};b.SyntaxError=function(b,c,d,e,f){function g(b,c){var d,e;switch(b.length){case 0:d="end of input";break;case 1:d=b[0];break;default:d=b.slice(0,b.length-1).join(", ")+" or "+b[b.length-1]}e=c?a(c):"end of input";return"Expected "+d+" but "+e+" found."}this.name="SyntaxError";this.expected=b;this.found=c;this.message=g(b,c);this.offset=d;this.line=e;this.column=f};b.SyntaxError.prototype=Error.prototype;return b}()})();
