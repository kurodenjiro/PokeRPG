var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
}
var Hash = function() {
	this.h = { };
};
Hash.__name__ = true;
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,__class__: Hash
}
var HxOverrides = function() { }
HxOverrides.__name__ = true;
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = true;
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,__class__: IntIter
}
var Lambda = function() { }
Lambda.__name__ = true;
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,__class__: List
}
var Reflect = function() { }
Reflect.__name__ = true;
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = function() { }
Std.__name__ = true;
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
}
var StringTools = function() { }
StringTools.__name__ = true;
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var haxe = haxe || {}
if(!haxe.io) haxe.io = {}
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = true;
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.prototype = {
	getData: function() {
		return this.b;
	}
	,toHex: function() {
		var s = new StringBuf();
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0, _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g1 = 0, _g = this.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.b[i];
			s.b += String.fromCharCode(chars[c >> 4]);
			s.b += String.fromCharCode(chars[c & 15]);
		}
		return s.b;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len = this.length < other.length?this.length:other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,get: function(pos) {
		return this.b[pos];
	}
	,__class__: haxe.io.Bytes
}
haxe.io.Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
if(!haxe.macro) haxe.macro = {}
haxe.macro.Context = function() { }
haxe.macro.Context.__name__ = true;
haxe.macro.Constant = { __ename__ : true, __constructs__ : ["CInt","CFloat","CString","CIdent","CRegexp","CType"] }
haxe.macro.Constant.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CIdent = function(s) { var $x = ["CIdent",3,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CRegexp = function(r,opt) { var $x = ["CRegexp",4,r,opt]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CType = function(s) { var $x = ["CType",5,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Binop = { __ename__ : true, __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval"] }
haxe.macro.Binop.OpAdd = ["OpAdd",0];
haxe.macro.Binop.OpAdd.toString = $estr;
haxe.macro.Binop.OpAdd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMult = ["OpMult",1];
haxe.macro.Binop.OpMult.toString = $estr;
haxe.macro.Binop.OpMult.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpDiv = ["OpDiv",2];
haxe.macro.Binop.OpDiv.toString = $estr;
haxe.macro.Binop.OpDiv.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpSub = ["OpSub",3];
haxe.macro.Binop.OpSub.toString = $estr;
haxe.macro.Binop.OpSub.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssign = ["OpAssign",4];
haxe.macro.Binop.OpAssign.toString = $estr;
haxe.macro.Binop.OpAssign.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpEq = ["OpEq",5];
haxe.macro.Binop.OpEq.toString = $estr;
haxe.macro.Binop.OpEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpNotEq = ["OpNotEq",6];
haxe.macro.Binop.OpNotEq.toString = $estr;
haxe.macro.Binop.OpNotEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGt = ["OpGt",7];
haxe.macro.Binop.OpGt.toString = $estr;
haxe.macro.Binop.OpGt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGte = ["OpGte",8];
haxe.macro.Binop.OpGte.toString = $estr;
haxe.macro.Binop.OpGte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLt = ["OpLt",9];
haxe.macro.Binop.OpLt.toString = $estr;
haxe.macro.Binop.OpLt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLte = ["OpLte",10];
haxe.macro.Binop.OpLte.toString = $estr;
haxe.macro.Binop.OpLte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAnd = ["OpAnd",11];
haxe.macro.Binop.OpAnd.toString = $estr;
haxe.macro.Binop.OpAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpOr = ["OpOr",12];
haxe.macro.Binop.OpOr.toString = $estr;
haxe.macro.Binop.OpOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpXor = ["OpXor",13];
haxe.macro.Binop.OpXor.toString = $estr;
haxe.macro.Binop.OpXor.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolAnd = ["OpBoolAnd",14];
haxe.macro.Binop.OpBoolAnd.toString = $estr;
haxe.macro.Binop.OpBoolAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolOr = ["OpBoolOr",15];
haxe.macro.Binop.OpBoolOr.toString = $estr;
haxe.macro.Binop.OpBoolOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShl = ["OpShl",16];
haxe.macro.Binop.OpShl.toString = $estr;
haxe.macro.Binop.OpShl.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShr = ["OpShr",17];
haxe.macro.Binop.OpShr.toString = $estr;
haxe.macro.Binop.OpShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpUShr = ["OpUShr",18];
haxe.macro.Binop.OpUShr.toString = $estr;
haxe.macro.Binop.OpUShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMod = ["OpMod",19];
haxe.macro.Binop.OpMod.toString = $estr;
haxe.macro.Binop.OpMod.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssignOp = function(op) { var $x = ["OpAssignOp",20,op]; $x.__enum__ = haxe.macro.Binop; $x.toString = $estr; return $x; }
haxe.macro.Binop.OpInterval = ["OpInterval",21];
haxe.macro.Binop.OpInterval.toString = $estr;
haxe.macro.Binop.OpInterval.__enum__ = haxe.macro.Binop;
haxe.macro.Unop = { __ename__ : true, __constructs__ : ["OpIncrement","OpDecrement","OpNot","OpNeg","OpNegBits"] }
haxe.macro.Unop.OpIncrement = ["OpIncrement",0];
haxe.macro.Unop.OpIncrement.toString = $estr;
haxe.macro.Unop.OpIncrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpDecrement = ["OpDecrement",1];
haxe.macro.Unop.OpDecrement.toString = $estr;
haxe.macro.Unop.OpDecrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNot = ["OpNot",2];
haxe.macro.Unop.OpNot.toString = $estr;
haxe.macro.Unop.OpNot.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNeg = ["OpNeg",3];
haxe.macro.Unop.OpNeg.toString = $estr;
haxe.macro.Unop.OpNeg.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNegBits = ["OpNegBits",4];
haxe.macro.Unop.OpNegBits.toString = $estr;
haxe.macro.Unop.OpNegBits.__enum__ = haxe.macro.Unop;
haxe.macro.ExprDef = { __ename__ : true, __constructs__ : ["EConst","EArray","EBinop","EField","EParenthesis","EObjectDecl","EArrayDecl","ECall","ENew","EUnop","EVars","EFunction","EBlock","EFor","EIn","EIf","EWhile","ESwitch","ETry","EReturn","EBreak","EContinue","EUntyped","EThrow","ECast","EDisplay","EDisplayNew","ETernary","ECheckType","EType"] }
haxe.macro.ExprDef.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EArray = function(e1,e2) { var $x = ["EArray",1,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBinop = function(op,e1,e2) { var $x = ["EBinop",2,op,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EField = function(e,field) { var $x = ["EField",3,e,field]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EParenthesis = function(e) { var $x = ["EParenthesis",4,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EObjectDecl = function(fields) { var $x = ["EObjectDecl",5,fields]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EArrayDecl = function(values) { var $x = ["EArrayDecl",6,values]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECall = function(e,params) { var $x = ["ECall",7,e,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ENew = function(t,params) { var $x = ["ENew",8,t,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EUnop = function(op,postFix,e) { var $x = ["EUnop",9,op,postFix,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EVars = function(vars) { var $x = ["EVars",10,vars]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EFunction = function(name,f) { var $x = ["EFunction",11,name,f]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBlock = function(exprs) { var $x = ["EBlock",12,exprs]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EFor = function(it,expr) { var $x = ["EFor",13,it,expr]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EIn = function(e1,e2) { var $x = ["EIn",14,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EIf = function(econd,eif,eelse) { var $x = ["EIf",15,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EWhile = function(econd,e,normalWhile) { var $x = ["EWhile",16,econd,e,normalWhile]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ESwitch = function(e,cases,edef) { var $x = ["ESwitch",17,e,cases,edef]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ETry = function(e,catches) { var $x = ["ETry",18,e,catches]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EReturn = function(e) { var $x = ["EReturn",19,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBreak = ["EBreak",20];
haxe.macro.ExprDef.EBreak.toString = $estr;
haxe.macro.ExprDef.EBreak.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EContinue = ["EContinue",21];
haxe.macro.ExprDef.EContinue.toString = $estr;
haxe.macro.ExprDef.EContinue.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EUntyped = function(e) { var $x = ["EUntyped",22,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EThrow = function(e) { var $x = ["EThrow",23,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECast = function(e,t) { var $x = ["ECast",24,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EDisplay = function(e,isCall) { var $x = ["EDisplay",25,e,isCall]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EDisplayNew = function(t) { var $x = ["EDisplayNew",26,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ETernary = function(econd,eif,eelse) { var $x = ["ETernary",27,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECheckType = function(e,t) { var $x = ["ECheckType",28,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EType = function(e,field) { var $x = ["EType",29,e,field]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ComplexType = { __ename__ : true, __constructs__ : ["TPath","TFunction","TAnonymous","TParent","TExtend","TOptional"] }
haxe.macro.ComplexType.TPath = function(p) { var $x = ["TPath",0,p]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TFunction = function(args,ret) { var $x = ["TFunction",1,args,ret]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TAnonymous = function(fields) { var $x = ["TAnonymous",2,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TParent = function(t) { var $x = ["TParent",3,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TExtend = function(p,fields) { var $x = ["TExtend",4,p,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TOptional = function(t) { var $x = ["TOptional",5,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.TypeParam = { __ename__ : true, __constructs__ : ["TPType","TPExpr"] }
haxe.macro.TypeParam.TPType = function(t) { var $x = ["TPType",0,t]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; }
haxe.macro.TypeParam.TPExpr = function(e) { var $x = ["TPExpr",1,e]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; }
haxe.macro.Access = { __ename__ : true, __constructs__ : ["APublic","APrivate","AStatic","AOverride","ADynamic","AInline"] }
haxe.macro.Access.APublic = ["APublic",0];
haxe.macro.Access.APublic.toString = $estr;
haxe.macro.Access.APublic.__enum__ = haxe.macro.Access;
haxe.macro.Access.APrivate = ["APrivate",1];
haxe.macro.Access.APrivate.toString = $estr;
haxe.macro.Access.APrivate.__enum__ = haxe.macro.Access;
haxe.macro.Access.AStatic = ["AStatic",2];
haxe.macro.Access.AStatic.toString = $estr;
haxe.macro.Access.AStatic.__enum__ = haxe.macro.Access;
haxe.macro.Access.AOverride = ["AOverride",3];
haxe.macro.Access.AOverride.toString = $estr;
haxe.macro.Access.AOverride.__enum__ = haxe.macro.Access;
haxe.macro.Access.ADynamic = ["ADynamic",4];
haxe.macro.Access.ADynamic.toString = $estr;
haxe.macro.Access.ADynamic.__enum__ = haxe.macro.Access;
haxe.macro.Access.AInline = ["AInline",5];
haxe.macro.Access.AInline.toString = $estr;
haxe.macro.Access.AInline.__enum__ = haxe.macro.Access;
haxe.macro.FieldType = { __ename__ : true, __constructs__ : ["FVar","FFun","FProp"] }
haxe.macro.FieldType.FVar = function(t,e) { var $x = ["FVar",0,t,e]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.FieldType.FFun = function(f) { var $x = ["FFun",1,f]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.FieldType.FProp = function(get,set,t,e) { var $x = ["FProp",2,get,set,t,e]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.TypeDefKind = { __ename__ : true, __constructs__ : ["TDEnum","TDStructure","TDClass"] }
haxe.macro.TypeDefKind.TDEnum = ["TDEnum",0];
haxe.macro.TypeDefKind.TDEnum.toString = $estr;
haxe.macro.TypeDefKind.TDEnum.__enum__ = haxe.macro.TypeDefKind;
haxe.macro.TypeDefKind.TDStructure = ["TDStructure",1];
haxe.macro.TypeDefKind.TDStructure.toString = $estr;
haxe.macro.TypeDefKind.TDStructure.__enum__ = haxe.macro.TypeDefKind;
haxe.macro.TypeDefKind.TDClass = function(extend,implement,isInterface) { var $x = ["TDClass",2,extend,implement,isInterface]; $x.__enum__ = haxe.macro.TypeDefKind; $x.toString = $estr; return $x; }
haxe.macro.Error = function(m,p) {
	this.message = m;
	this.pos = p;
};
haxe.macro.Error.__name__ = true;
haxe.macro.Error.prototype = {
	__class__: haxe.macro.Error
}
haxe.macro.Type = { __ename__ : true, __constructs__ : ["TMono","TEnum","TInst","TType","TFun","TAnonymous","TDynamic","TLazy"] }
haxe.macro.Type.TMono = function(t) { var $x = ["TMono",0,t]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TEnum = function(t,params) { var $x = ["TEnum",1,t,params]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TInst = function(t,params) { var $x = ["TInst",2,t,params]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TType = function(t,params) { var $x = ["TType",3,t,params]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TFun = function(args,ret) { var $x = ["TFun",4,args,ret]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TAnonymous = function(a) { var $x = ["TAnonymous",5,a]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TDynamic = function(t) { var $x = ["TDynamic",6,t]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TLazy = function(f) { var $x = ["TLazy",7,f]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.ClassKind = { __ename__ : true, __constructs__ : ["KNormal","KTypeParameter","KExtension","KExpr","KGeneric","KGenericInstance","KMacroType"] }
haxe.macro.ClassKind.KNormal = ["KNormal",0];
haxe.macro.ClassKind.KNormal.toString = $estr;
haxe.macro.ClassKind.KNormal.__enum__ = haxe.macro.ClassKind;
haxe.macro.ClassKind.KTypeParameter = ["KTypeParameter",1];
haxe.macro.ClassKind.KTypeParameter.toString = $estr;
haxe.macro.ClassKind.KTypeParameter.__enum__ = haxe.macro.ClassKind;
haxe.macro.ClassKind.KExtension = function(cl,params) { var $x = ["KExtension",2,cl,params]; $x.__enum__ = haxe.macro.ClassKind; $x.toString = $estr; return $x; }
haxe.macro.ClassKind.KExpr = function(expr) { var $x = ["KExpr",3,expr]; $x.__enum__ = haxe.macro.ClassKind; $x.toString = $estr; return $x; }
haxe.macro.ClassKind.KGeneric = ["KGeneric",4];
haxe.macro.ClassKind.KGeneric.toString = $estr;
haxe.macro.ClassKind.KGeneric.__enum__ = haxe.macro.ClassKind;
haxe.macro.ClassKind.KGenericInstance = function(cl,params) { var $x = ["KGenericInstance",5,cl,params]; $x.__enum__ = haxe.macro.ClassKind; $x.toString = $estr; return $x; }
haxe.macro.ClassKind.KMacroType = ["KMacroType",6];
haxe.macro.ClassKind.KMacroType.toString = $estr;
haxe.macro.ClassKind.KMacroType.__enum__ = haxe.macro.ClassKind;
haxe.macro.FieldKind = { __ename__ : true, __constructs__ : ["FVar","FMethod"] }
haxe.macro.FieldKind.FVar = function(read,write) { var $x = ["FVar",0,read,write]; $x.__enum__ = haxe.macro.FieldKind; $x.toString = $estr; return $x; }
haxe.macro.FieldKind.FMethod = function(k) { var $x = ["FMethod",1,k]; $x.__enum__ = haxe.macro.FieldKind; $x.toString = $estr; return $x; }
haxe.macro.VarAccess = { __ename__ : true, __constructs__ : ["AccNormal","AccNo","AccNever","AccResolve","AccCall","AccInline","AccRequire"] }
haxe.macro.VarAccess.AccNormal = ["AccNormal",0];
haxe.macro.VarAccess.AccNormal.toString = $estr;
haxe.macro.VarAccess.AccNormal.__enum__ = haxe.macro.VarAccess;
haxe.macro.VarAccess.AccNo = ["AccNo",1];
haxe.macro.VarAccess.AccNo.toString = $estr;
haxe.macro.VarAccess.AccNo.__enum__ = haxe.macro.VarAccess;
haxe.macro.VarAccess.AccNever = ["AccNever",2];
haxe.macro.VarAccess.AccNever.toString = $estr;
haxe.macro.VarAccess.AccNever.__enum__ = haxe.macro.VarAccess;
haxe.macro.VarAccess.AccResolve = ["AccResolve",3];
haxe.macro.VarAccess.AccResolve.toString = $estr;
haxe.macro.VarAccess.AccResolve.__enum__ = haxe.macro.VarAccess;
haxe.macro.VarAccess.AccCall = function(m) { var $x = ["AccCall",4,m]; $x.__enum__ = haxe.macro.VarAccess; $x.toString = $estr; return $x; }
haxe.macro.VarAccess.AccInline = ["AccInline",5];
haxe.macro.VarAccess.AccInline.toString = $estr;
haxe.macro.VarAccess.AccInline.__enum__ = haxe.macro.VarAccess;
haxe.macro.VarAccess.AccRequire = function(r) { var $x = ["AccRequire",6,r]; $x.__enum__ = haxe.macro.VarAccess; $x.toString = $estr; return $x; }
haxe.macro.MethodKind = { __ename__ : true, __constructs__ : ["MethNormal","MethInline","MethDynamic","MethMacro"] }
haxe.macro.MethodKind.MethNormal = ["MethNormal",0];
haxe.macro.MethodKind.MethNormal.toString = $estr;
haxe.macro.MethodKind.MethNormal.__enum__ = haxe.macro.MethodKind;
haxe.macro.MethodKind.MethInline = ["MethInline",1];
haxe.macro.MethodKind.MethInline.toString = $estr;
haxe.macro.MethodKind.MethInline.__enum__ = haxe.macro.MethodKind;
haxe.macro.MethodKind.MethDynamic = ["MethDynamic",2];
haxe.macro.MethodKind.MethDynamic.toString = $estr;
haxe.macro.MethodKind.MethDynamic.__enum__ = haxe.macro.MethodKind;
haxe.macro.MethodKind.MethMacro = ["MethMacro",3];
haxe.macro.MethodKind.MethMacro.toString = $estr;
haxe.macro.MethodKind.MethMacro.__enum__ = haxe.macro.MethodKind;
var js = js || {}
js.Boot = function() { }
js.Boot.__name__ = true;
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = function() { }
js.Lib.__name__ = true;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
js.NodeC = function() { }
js.NodeC.__name__ = true;
js.Node = function() { }
js.Node.__name__ = true;
js.Node.newSocket = function(options) {
	return new js.Node.net.Socket(options);
}
var pokerpgserver = pokerpgserver || {}
pokerpgserver.Battle = function() {
	this.players = [];
	this.runAttempts = 0;
	this.results = [];
	this.ended = false;
	this.actionQueue = [];
	this.isTrainerBattle = true;
};
pokerpgserver.Battle.__name__ = true;
pokerpgserver.Battle.prototype = {
	isOpponent: function(p1,p2) {
		return true;
	}
	,getPlayerOfClient: function(client) {
		var _g = 0, _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.client == client) return p;
		}
		return null;
	}
	,getActionPriority: function(action) {
		if(action == null) return 0;
		var $e = (action);
		switch( $e[1] ) {
		case 0:
			return 6;
		case 1:
			var target = $e[3], move = $e[2];
			var p = pokerpgserver.GameData.movesData[move].priority;
			if(p == null) return 0;
			return p;
		default:
			return 0;
		}
	}
	,sortActions: function(a,b) {
		var ap = this.getActionPriority(a.action);
		var bp = this.getActionPriority(b.action);
		if(ap > bp) return -1; else if(bp > ap) return 1;
		if(a.pokemon.speed * pokerpgserver.Battle.powerMultipler[a.pokemon.battleStats.speedPower] >= b.pokemon.speed * pokerpgserver.Battle.powerMultipler[b.pokemon.battleStats.speedPower]) return -1; else return 1;
	}
	,addPlayer: function(client,pokemonList) {
		var pok = pokemonList[0];
		var _g = 0;
		while(_g < pokemonList.length) {
			var p = pokemonList[_g];
			++_g;
			if(p.hp <= 0) continue;
			pok = p;
			break;
		}
		var _g = 0;
		while(_g < pokemonList.length) {
			var p = pokemonList[_g];
			++_g;
			p.resetBattleStats();
		}
		if(client != null) {
			client.character.battle = this;
			client.character.retransmit = true;
		}
		var bp = { id : this.players.length, team : -1, client : client, pokemon : pok, pokemonList : pokemonList, pendingAction : true, action : null, fOnBattleAction : null, fOnBattleLearnMove : null};
		this.players.push(bp);
		return bp;
	}
	,calculateDamage: function(pokemon,enemyPokemon,data) {
		var isMoveSpecial = !!data.special;
		var attackerAtk;
		var defenderDef;
		if(isMoveSpecial) {
			attackerAtk = pokemon.spAtk * pokerpgserver.Battle.powerMultipler[pokemon.battleStats.spAtkPower];
			defenderDef = enemyPokemon.spDef * pokerpgserver.Battle.powerMultipler[enemyPokemon.battleStats.spDefPower];
		} else {
			attackerAtk = pokemon.atk * pokerpgserver.Battle.powerMultipler[pokemon.battleStats.atkPower];
			defenderDef = enemyPokemon.def * pokerpgserver.Battle.powerMultipler[enemyPokemon.battleStats.defPower];
		}
		if(pokemon.status == 5) attackerAtk /= 2;
		var damage = (2 * pokemon.level + 10) / 250 * (attackerAtk / defenderDef) * data.power + 2;
		var modifier = 1.0;
		if(data.type == pokerpgserver.GameData.pokemonData[pokemon.id].type1 || data.type == pokerpgserver.GameData.pokemonData[pokemon.id].type2) modifier *= 1.5;
		var typeEffectiveness = 1.0;
		typeEffectiveness *= pokerpgserver.GameData.getTypeEffectiveness(data.type,pokerpgserver.GameData.pokemonData[enemyPokemon.id].type1);
		typeEffectiveness *= pokerpgserver.GameData.getTypeEffectiveness(data.type,pokerpgserver.GameData.pokemonData[enemyPokemon.id].type2);
		modifier *= typeEffectiveness;
		var criticalChance = [0,0.065,0.125,0.25,0.333,0.5];
		var criticalStage = 1;
		if(data.highCritical) criticalStage += 2;
		if(criticalStage > 5) criticalStage = 5;
		var isCritical = Math.random() < criticalChance[criticalStage];
		if(isCritical) modifier *= 2;
		modifier *= 1.0 - Math.random() * 0.15;
		return { damage : Math.ceil(damage * modifier), isCritical : isCritical, effect : typeEffectiveness};
	}
	,processMove: function(player,enemy,move) {
		var moveData = pokerpgserver.GameData.movesData[move];
		if(moveData.moveType == "buff") moveData = pokerpgserver.GameData.movesData.tackle;
		if(moveData.accuracy != -1) {
			if(Math.random() >= moveData.accuracy * (pokerpgserver.Battle.accuracyMultipler[player.pokemon.battleStats.accuracy] / pokerpgserver.Battle.accuracyMultipler[enemy.pokemon.battleStats.evasion])) {
				this.pushResult(new pokerpgserver.BattleActionResult(player,"moveMiss",move));
				return;
			}
		}
		switch(moveData.moveType) {
		case "simple":
			var obj = this.calculateDamage(player.pokemon,enemy.pokemon,moveData);
			enemy.pokemon.hp -= obj.damage;
			if(enemy.pokemon.hp < 0) enemy.pokemon.hp = 0;
			this.pushResult(new pokerpgserver.BattleActionResult(player,"moveAttack",{ move : move, resultHp : enemy.pokemon.hp, isCritical : obj.isCritical, effec : obj.effect}));
			if(enemy.pokemon.hp > 0) {
				if(moveData.applyStatus != null) {
					if(Math.random() < (moveData.applyStatusChance == null?1.0:moveData.applyStatusChance)) {
						enemy.pokemon.status = moveData.applyStatus;
						this.pushResult(new pokerpgserver.BattleActionResult(player,"applyStatus",moveData.applyStatus));
					}
				}
				if(moveData.debuffStat != null) {
					if(Math.random() < (moveData.debuffChance == null?1.0:moveData.debuffChance)) {
						var _g = 0, _g1 = moveData.debuffStat.split(",");
						while(_g < _g1.length) {
							var s = _g1[_g];
							++_g;
							enemy.pokemon.buffBattleStat(s,-moveData.debuffAmount);
							this.pushResult(new pokerpgserver.BattleActionResult(player,"debuff",{ stat : s}));
						}
					}
				}
			}
			return;
		case "debuff":
			var _g = 0, _g1 = moveData.debuffStat.split(",");
			while(_g < _g1.length) {
				var s = _g1[_g];
				++_g;
				enemy.pokemon.buffBattleStat(s,-moveData.debuffAmount);
			}
			this.pushResult(new pokerpgserver.BattleActionResult(player,"moveDebuff",{ stat : moveData.debuffStat, move : move}));
			break;
		case "applyStatus":
			enemy.pokemon.status = moveData.applyStatus;
			this.pushResult(new pokerpgserver.BattleActionResult(player,"moveAttack",{ move : moveData.name, resultHp : enemy.pokemon.hp, isCritical : false, effec : 1}));
			this.pushResult(new pokerpgserver.BattleActionResult(player,"applyStatus",moveData.applyStatus));
			return;
		}
	}
	,processPlayerTurn: function(p) {
		var $e = (p.action);
		switch( $e[1] ) {
		case 0:
			var chance = p.pokemon.speed * 32 / (this.players[1].pokemon.speed / 4) + 30 * ++this.runAttempts;
			var success = Math.floor(Math.random() * 256) < chance;
			if(this.battleType == pokerpgserver.Battle.BATTLE_VERSUS) success = false;
			if(success) {
				this.win(p.team,false);
				this.finishBattleFor(p);
				this.destroy();
				this.pushResult(new pokerpgserver.BattleActionResult(p,"flee"));
				this.flushResults();
			} else this.pushResult(new pokerpgserver.BattleActionResult(p,"fleeFail"));
			break;
		case 1:
			var targets = $e[3], move = $e[2];
			var _g = 0;
			while(_g < targets.length) {
				var i = targets[_g];
				++_g;
				this.processMove(p,i,move);
			}
			break;
		case 3:
			break;
		case 2:
			this.processMove(p,this.players[Math.floor((p.id + this.players.length / 2) % this.players.length)],"struggle");
			break;
		}
	}
	,getRandomPlayerFromTeam: function(t) {
		return this.players[Math.floor(t * Math.floor(this.players.length / 2) + Math.floor(this.players.length / 2) * Math.random())];
	}
	,getPlayerEnemyTeam: function(p) {
		return p.team == 0?1:0;
	}
	,checkWin: function() {
		if(this.ended) return;
		var deadTeams = [true,true];
		var _g = 0, _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(!deadTeams[p.team]) continue;
			var _g2 = 0, _g3 = p.pokemonList;
			while(_g2 < _g3.length) {
				var pok = _g3[_g2];
				++_g2;
				if(pok.hp > 0) {
					deadTeams[p.team] = false;
					break;
				}
			}
		}
		if(deadTeams[0]) {
			if(deadTeams[1]) this.win(-1); else this.win(1);
		} else if(deadTeams[1]) this.win(0); else {
		}
	}
	,getPlayersFromTeam: function(t) {
		return this.players.slice(Math.floor(t * (this.players.length / 2)),Math.floor(this.players.length / 2));
	}
	,checkFainted: function() {
		var _g = 0, _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.pokemon == null) continue;
			if(p.pokemon.hp > 0) continue;
			var exp = p.pokemon.calculateExpGain(this.isTrainerBattle);
			var killers = this.getPlayersFromTeam(p.team == 0?1:0);
			exp = Math.ceil(exp / killers.length);
			if(this.battleType == pokerpgserver.Battle.BATTLE_VERSUS) exp = 0;
			this.pushResult(new pokerpgserver.BattleActionResult(p,"pokemonDefeated",exp));
			var _g2 = 0;
			while(_g2 < killers.length) {
				var killer = killers[_g2];
				++_g2;
				killer.pokemon.experience += exp;
				while(killer.pokemon.level < 100 && killer.pokemon.experience >= killer.pokemon.experienceNeeded) {
					killer.pokemon.experience -= killer.pokemon.experienceNeeded;
					var lvlup = killer.pokemon.levelUp();
					this.pushResult(new pokerpgserver.BattleActionResult(killer,"pokemonLevelup",killer.pokemon.generateNetworkObject(true),true));
					if(lvlup.movesLearned.length > 0) this.pushResult(new pokerpgserver.BattleActionResult(killer,"pokemonLearnedMove",lvlup.movesLearned));
				}
				if(killer.pokemon.battleStats.learnableMoves.length > 0) this.pushResult(new pokerpgserver.BattleActionResult(killer,"pokemonLearnMoves",killer.pokemon.battleStats.learnableMoves,true));
			}
		}
	}
	,runQueue: function() {
		if(this.ended) return;
		var p;
		while(this.actionQueue.length > 0) {
			p = this.actionQueue.shift();
			this.processPlayerTurn(p);
			this.checkFainted();
			this.checkWin();
			if(this.ended) {
				this.flushResults();
				return;
			}
		}
	}
	,processTurn: function() {
		if(this.actionQueue.length > 0) {
			this.runQueue();
			this.flushResults();
			this.initTurn();
		}
		if(!this.isTurnReady()) return;
		var turnOrder = this.players.slice();
		turnOrder.sort($bind(this,this.sortActions));
		var _g = 0;
		while(_g < turnOrder.length) {
			var p = turnOrder[_g];
			++_g;
			this.actionQueue.push(p);
		}
		this.runQueue();
		this.flushResults();
		this.initTurn();
	}
	,finishBattleFor: function(player) {
		var _g = this;
		if(player.client == null) return;
		var client = player.client;
		var $char = client.character;
		var socket = client.socket;
		var func = function(data) {
			$char.battle = null;
			$char.retransmit = true;
			if(player.team != _g.winnerTeam) {
				$char.moveToSpawn();
				$char.restorePokemon();
			}
			socket.emit("battleFinish",{ pokemon : $char.generatePokemonNetworkObject()});
			pokerpgserver.MasterConnector.saveCharacter(client.username,$char.generateCharacterSave());
		};
		if(client.disconnected) func(); else socket.once("battleFinished",func);
	}
	,playerSurrendered: function(player) {
		this.win(player.team == 0?1:0,true);
	}
	,onBattleLearnMove: function(player,data) {
		if(player.pokemon == null) return;
		if(!js.Boot.__instanceof(data.slot,Int)) return;
		if(!js.Boot.__instanceof(data.move,String)) return;
		var move = data.move;
		var slot = data.slot;
		if(slot < 0 || slot >= 4) return;
		if(!Lambda.has(player.pokemon.battleStats.learnableMoves,move)) return;
		HxOverrides.remove(player.pokemon.battleStats.learnableMoves,move);
		player.pokemon.learnMove(slot,move);
	}
	,onBattleAction: function(player,data) {
		if(!player.pendingAction) return;
		if(player.pokemon == null || player.pokemon.hp <= 0) {
			if(data.type != "switchPokemon") return;
			return;
		}
		if(player.pokemon == null) return;
		switch(data.type) {
		case "move":
			if(!js.Boot.__instanceof(data.move,Int)) return;
			var move = Math.floor(Math.abs(data.move) % 4);
			if(player.pokemon.movesPP[move] > 0) player.action = pokerpgserver.BattleAction.TMove(player.pokemon.moves[move],[this.players[Math.floor((player.team == 0?1:0) * Math.floor(this.players.length / 2) + Math.floor(this.players.length / 2) * Math.random())]]); else player.action = pokerpgserver.BattleAction.TStruggle;
			break;
		case "run":
			player.action = pokerpgserver.BattleAction.TRun;
			break;
		default:
			return;
		}
		player.pendingAction = false;
		this.processTurn();
	}
	,calculateAIAction: function(player) {
		var moves = player.pokemon.getUsableMoves();
		if(moves.length == 0) player.action = pokerpgserver.BattleAction.TStruggle; else player.action = pokerpgserver.BattleAction.TMove(pokerpgserver.exts.ArrayExt.random(moves),[this.players[Math.floor((player.team == 0?1:0) * Math.floor(this.players.length / 2) + Math.floor(this.players.length / 2) * Math.random())]]);
	}
	,isTurnReady: function() {
		if(this.ended) return false;
		var _g = 0, _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.pendingAction) return false;
		}
		return true;
	}
	,initTurn: function() {
		if(this.ended) return;
		if(this.actionQueue.length > 0) {
			this.runQueue();
			this.flushResults();
		}
		var _g = 0, _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.client != null) p.pendingAction = true; else {
				p.pendingAction = false;
				this.calculateAIAction(p);
			}
		}
	}
	,flushResults: function() {
		if(this.results.length == 0) return;
		var _g = 0, _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.client == null) continue;
			var res = [];
			var _g2 = 0, _g3 = this.results;
			while(_g2 < _g3.length) {
				var r = _g3[_g2];
				++_g2;
				var obj = r.generateNetworkObject(p);
				if(obj != null) res.push(obj);
			}
			p.client.socket.emit("battleTurn",{ results : res});
		}
		this.results.length = 0;
	}
	,pushResult: function(res) {
		if(res == null) return;
		if(js.Boot.__instanceof(res,Array)) {
			var _g = 0, _g1 = js.Boot.__cast(res , Array);
			while(_g < _g1.length) {
				var e = _g1[_g];
				++_g;
				this.pushResult(e);
			}
			return;
		}
		this.results.push(res);
	}
	,win: function(team,transmit) {
		if(transmit == null) transmit = true;
		this.winnerTeam = team;
		this.ended = true;
		if(transmit) {
			this.pushResult(new pokerpgserver.BattleActionResult(null,"win",this.winnerTeam));
			var _g = 0, _g1 = this.players;
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				this.finishBattleFor(p);
			}
		}
	}
	,destroy: function() {
		this.ended = true;
		var _g = 0, _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.client == null) continue;
			p.client.socket.removeListener("battleAction",p.fOnBattleAction);
			p.client.socket.removeListener("battleLearnMove",p.fOnBattleLearnMove);
			p.client.character.battle == null;
		}
	}
	,init: function() {
		var _g2 = this;
		var _g = 0, _g1 = this.players;
		while(_g < _g1.length) {
			var p = [_g1[_g]];
			++_g;
			p[0].team = p[0].id < Math.floor(this.players.length / 2)?0:1;
			if(p[0].client == null) continue;
			p[0].client.socket.emit("battleInit",{ type : this.battleType, x : p[0].client.character.x, y : p[0].client.character.y, id : p[0].id, team : p[0].team, info : { players : Lambda.array(Lambda.map(this.players,(function(p) {
				return function(otherPlayer) {
					return { username : otherPlayer.client != null?otherPlayer.client.username:"", pokemon : otherPlayer.pokemon.generateNetworkObject(otherPlayer == p[0]), type : otherPlayer.client != null?otherPlayer.client.character.type:""};
				};
			})(p)))}});
			p[0].client.socket.on("battleAction",p[0].fOnBattleAction = (function(p) {
				return function(data) {
					_g2.onBattleAction(p[0],data);
				};
			})(p));
			p[0].client.socket.on("battleLearnMove",p[0].fOnBattleLearnMove = (function(p) {
				return function(data) {
					_g2.onBattleLearnMove(p[0],data);
				};
			})(p));
		}
		this.initTurn();
	}
	,__class__: pokerpgserver.Battle
}
pokerpgserver.BattleAction = { __ename__ : true, __constructs__ : ["TRun","TMove","TStruggle","TSwitchPokemon"] }
pokerpgserver.BattleAction.TRun = ["TRun",0];
pokerpgserver.BattleAction.TRun.toString = $estr;
pokerpgserver.BattleAction.TRun.__enum__ = pokerpgserver.BattleAction;
pokerpgserver.BattleAction.TMove = function(move,targets) { var $x = ["TMove",1,move,targets]; $x.__enum__ = pokerpgserver.BattleAction; $x.toString = $estr; return $x; }
pokerpgserver.BattleAction.TStruggle = ["TStruggle",2];
pokerpgserver.BattleAction.TStruggle.toString = $estr;
pokerpgserver.BattleAction.TStruggle.__enum__ = pokerpgserver.BattleAction;
pokerpgserver.BattleAction.TSwitchPokemon = ["TSwitchPokemon",3];
pokerpgserver.BattleAction.TSwitchPokemon.toString = $estr;
pokerpgserver.BattleAction.TSwitchPokemon.__enum__ = pokerpgserver.BattleAction;
pokerpgserver.BattleActionResult = function(player,type,value,broadcastOnlyToPlayer) {
	if(broadcastOnlyToPlayer == null) broadcastOnlyToPlayer = false;
	this.player = player;
	this.type = type;
	this.value = value;
	this.broadcastOnlyToPlayer = broadcastOnlyToPlayer;
};
pokerpgserver.BattleActionResult.__name__ = true;
pokerpgserver.BattleActionResult.prototype = {
	generateNetworkObject: function(p) {
		if(this.broadcastOnlyToPlayer && this.player != p) return null;
		return { player : this.player != null?this.player.id:null, type : this.type, value : Reflect.isFunction(this.value)?this.value(this,p):this.value};
	}
	,__class__: pokerpgserver.BattleActionResult
}
pokerpgserver.BattleVersusPlayer = function(client,client2) {
	pokerpgserver.Battle.call(this);
	this.isTrainerBattle = false;
	this.battleType = pokerpgserver.Battle.BATTLE_VERSUS;
	this.addPlayer(client,client.character.pokemon);
	this.addPlayer(client2,client2.character.pokemon);
};
pokerpgserver.BattleVersusPlayer.__name__ = true;
pokerpgserver.BattleVersusPlayer.__super__ = pokerpgserver.Battle;
pokerpgserver.BattleVersusPlayer.prototype = $extend(pokerpgserver.Battle.prototype,{
	initTurn: function() {
		pokerpgserver.Battle.prototype.initTurn.call(this);
	}
	,destroy: function() {
		pokerpgserver.Battle.prototype.destroy.call(this);
	}
	,__class__: pokerpgserver.BattleVersusPlayer
});
pokerpgserver.BattleWild = function(client,wildPokemon) {
	pokerpgserver.Battle.call(this);
	this.isTrainerBattle = false;
	this.battleType = pokerpgserver.Battle.BATTLE_WILD;
	this.addPlayer(client,client.character.pokemon);
	this.addPlayer(null,[wildPokemon]);
};
pokerpgserver.BattleWild.__name__ = true;
pokerpgserver.BattleWild.__super__ = pokerpgserver.Battle;
pokerpgserver.BattleWild.prototype = $extend(pokerpgserver.Battle.prototype,{
	initTurn: function() {
		pokerpgserver.Battle.prototype.initTurn.call(this);
	}
	,destroy: function() {
		pokerpgserver.Battle.prototype.destroy.call(this);
	}
	,__class__: pokerpgserver.BattleWild
});
pokerpgserver.Client = function(socket) {
	this.socket = socket;
	this.disconnected = false;
	socket.on("login",$bind(this,this.msg_login));
};
pokerpgserver.Client.__name__ = true;
pokerpgserver.Client.prototype = {
	e_newGame: function(data) {
		if(!this.newAccount) return;
		if(!(js.Boot.__instanceof(data.starter,String) && js.Boot.__instanceof(data.character,String))) return;
		if(Lambda.indexOf(pokerpgserver.ServerConst.pokemonStarters,data.starter) == -1 || Lambda.indexOf(pokerpgserver.ServerConst.characterSprites,data.character) == -1) return;
		this.newAccount = false;
		this.initCharacter({ map : "pallet_hero_home_2f", x : 1, y : 3, direction : 0, charType : data.character, money : 0, playerVars : { }, respawnLocation : { mapName : "pallet_hero_home_2f", x : 1, y : 3, direction : 0}, pokemon : [new pokerpgserver.Pokemon().createWild(data.starter,5).generateSave()]});
	}
	,onDisconnect: function(data) {
		if(this.disconnected) return;
		this.disconnected = true;
		pokerpgserver.MasterConnector.disconnectUser(this.username);
	}
	,kick: function() {
		if(this.character != null) this.character.disconnect(); else {
			this.socket.disconnect();
			this.onDisconnect();
		}
	}
	,msg_login: function(data) {
		var _g = this;
		if(!(js.Boot.__instanceof(data.username,String) && js.Boot.__instanceof(data.password,String))) {
			this.socket.emit("loginFail","invalidData");
			return;
		}
		if(pokerpgserver.GameServer.clients.length > 200) {
			console.log("Refusing client, server is full");
			this.socket.emit("loginFail","serverFull");
			return;
		}
		pokerpgserver.MasterConnector.loginUser(data.username,data.password,function(result,username) {
			if(result != "success") {
				_g.socket.emit("loginFail",result);
				return;
			}
			_g.username = username;
			_g.accountLevel = pokerpgserver.GameData.adminsData[username] == null?0:pokerpgserver.GameData.adminsData[username].level;
			_g.socket.on("disconnect",$bind(_g,_g.onDisconnect));
			pokerpgserver.MasterConnector.loadCharacter(username,function(success,save) {
				if(!success) {
					_g.socket.emit("loginFail","internalError");
					return;
				}
				if(save == null) {
					_g.newAccount = true;
					_g.socket.emit("newGame",{ username : username, starters : pokerpgserver.ServerConst.pokemonStarters, characters : pokerpgserver.ServerConst.characterSprites});
					_g.socket.on("newGame",$bind(_g,_g.e_newGame));
				} else {
					_g.socket.emit("startGame",{ username : username});
					_g.socket.on("startGame",function(data1) {
						_g.initCharacter(save);
					});
				}
			});
		});
	}
	,initCharacter: function(save) {
		this.character = new pokerpgserver.ClientCharacter(this,save);
		var x = 0;
		if(js.Boot.__instanceof(x,Int)) return;
	}
	,__class__: pokerpgserver.Client
}
pokerpgserver.ClientCharacter = function(client,save) {
	var _g = this;
	this.client = client;
	this.speedHackChecks = [];
	this.lastMessage = 0;
	this.surfing = false;
	this.usingBike = false;
	this.inBattle = false;
	this.retransmit = true;
	this.money = save.money;
	this.pokemon = [];
	var _g1 = 0, _g11 = save.pokemon;
	while(_g1 < _g11.length) {
		var psave = _g11[_g1];
		++_g1;
		this.pokemon.push(new pokerpgserver.Pokemon().loadFromSave(psave));
	}
	this.playerVars = save.playerVars;
	this.type = save.charType;
	this.respawnLocation = save.respawnLocation;
	client.socket.emit("setInfo",{ pokemon : this.generatePokemonNetworkObject(), accountLevel : client.accountLevel});
	this.warp(save.map,save.x,save.y,save.direction);
	client.socket.on("disconnect",$bind(this,this.e_disconnect));
	client.socket.on("walk",$bind(this,this.e_walk));
	client.socket.on("useLedge",$bind(this,this.e_useLedge));
	client.socket.on("turn",$bind(this,this.e_turn));
	client.socket.on("sendMessage",$bind(this,this.e_sendMessage));
	client.socket.on("useWarp",$bind(this,this.e_useWarp));
	client.socket.on("unstuck",$bind(this,this.e_unstuck));
	client.socket.on("requestPvpBattle",$bind(this,this.e_requestPvpBattle));
	client.socket.on("requestPvpBattleAccept",$bind(this,this.e_requestPvpBattleAccept));
	if(client.accountLevel >= 30) client.socket.on("kickPlayer",function(data) {
		pokerpgserver.GameServer.kickPlayer(data.username);
	});
	if(client.accountLevel >= 70) {
		client.socket.on("adminSetPokemon",function(data) {
			if(pokerpgserver.GameData.pokemonData[data.id] == null) return;
			_g.pokemon[0].id = data.id;
			_g.retransmit = true;
		});
		client.socket.on("adminSetLevel",function(data) {
			if(data.level == null) return;
			var n = Std.parseInt(data.level);
			if(n != n) return;
			if(n < 2) return;
			if(n > n) return;
			_g.pokemon[0].level = n;
			_g.pokemon[0].experience = 0;
			_g.pokemon[0].calculateStats();
			_g.retransmit = true;
		});
		client.socket.on("adminTestLevelup",function(data) {
			_g.pokemon[0].experience = _g.pokemon[0].experienceNeeded - 1;
		});
		client.socket.on("adminTeleport",function(data) {
			_g.warp(data.map,data.x,data.y,data.dir || 0);
		});
		client.socket.on("adminAddPokemon",function(data) {
			var selectedId = data.id;
			_g.pokemon.push(new pokerpgserver.Pokemon().createWild(selectedId,5));
			pokerpgserver.MasterConnector.saveCharacter(client.username,_g.generateCharacterSave());
			client.socket.emit("setInfo",{ pokemon : _g.generatePokemonNetworkObject(), accountLevel : client.accountLevel});
		});
		client.socket.on("adminPlayersCount",function(data) {
		});
		client.socket.on("adminTestWild",function(data) {
			var enemy = data.id;
			var level = Std.parseInt(data.level);
			_g.battle = new pokerpgserver.BattleWild(client,new pokerpgserver.Pokemon().createWild(enemy,level));
			_g.battle.init();
		});
	}
};
pokerpgserver.ClientCharacter.__name__ = true;
pokerpgserver.ClientCharacter.filterChatText = function(str) {
	if(pokerpgserver.ClientCharacter.chatFilterRegex == null) pokerpgserver.ClientCharacter.chatFilterRegex = new EReg("[^\\u0020-\\u007F\\u0080-\\u00FF]","");
	return pokerpgserver.ClientCharacter.chatFilterRegex.replace(str,"");
}
pokerpgserver.ClientCharacter.prototype = {
	e_useWarp: function(data) {
		var warp = this.mapInstance.map.warps.get(data.name);
		if(warp == null) return;
		if(Math.abs(warp.x - this.x) + Math.abs(warp.y - this.y) > 1) return;
		this.mapInstance.warpsUsed.push({ username : this.client.username, warpName : data.name, x : this.x, y : this.y, direction : this.direction});
		this.warpToLocation(warp.destination);
	}
	,e_requestPvpBattleAccept: function(data) {
		if(this.battle != null) return;
		var requestedFirstPlayer = pokerpgserver.GameServer.getCharByUsername(Std.string(this.requestedPvpUsername));
		if(requestedFirstPlayer == null) return;
		if(requestedFirstPlayer.character == null) return;
		if(requestedFirstPlayer.character.battle != null) return;
		if(requestedFirstPlayer.character.requestedPvpUsername != this.requestedPvpUsername) return;
		this.requestedPvpBattle = false;
		this.requestedPvpUsername = null;
		requestedFirstPlayer.character.requestedPvpBattle = false;
		requestedFirstPlayer.character.requestedPvpUsername = null;
		this.battle = new pokerpgserver.BattleVersusPlayer(requestedFirstPlayer,this.client);
		requestedFirstPlayer.character.battle = this.battle;
		requestedFirstPlayer.character.battle.init();
	}
	,e_requestPvpBattle: function(data) {
		if(Std.string(data.username) == null) return;
		if(this.battle != null) return;
		var requestedPlayer = pokerpgserver.GameServer.getCharByUsername(Std.string(data.username));
		if(requestedPlayer == null) return;
		if(requestedPlayer.character == null) return;
		if(requestedPlayer.character.battle != null) return;
		this.requestedPvpBattle = true;
		this.requestedPvpUsername = this.client.username;
		requestedPlayer.character.requestedPvpBattle = true;
		requestedPlayer.character.requestedPvpUsername = this.client.username;
		this.client.socket["volatile"].emit("requestPvpBattleConfirm",{ });
		requestedPlayer.socket["volatile"].emit("requestPvpBattle",{ requestUsername : this.client.username});
	}
	,e_switchPokemon: function(data) {
		var n = data.id;
		var tmpPokemon = this.pokemon[0];
		this.pokemon[0] = this.pokemon[n];
		this.pokemon[n] = tmpPokemon;
		pokerpgserver.MasterConnector.saveCharacter(this.client.username,this.generateCharacterSave());
		this.client.socket.emit("setInfo",{ pokemon : this.generatePokemonNetworkObject(), accountLevel : this.client.accountLevel});
	}
	,e_unstuck: function(data) {
		this.warp("pallet",84,149,0);
	}
	,e_sendMessage: function(data) {
		if(!js.Boot.__instanceof(data.str,String)) return;
		var t = new Date().getTime();
		if(t - this.lastMessage < 100) return;
		var str = (function($this) {
			var $r;
			if(pokerpgserver.ClientCharacter.chatFilterRegex == null) pokerpgserver.ClientCharacter.chatFilterRegex = new EReg("[^\\u0020-\\u007F\\u0080-\\u00FF]","");
			$r = pokerpgserver.ClientCharacter.chatFilterRegex.replace(data.str.substr(0,128),"");
			return $r;
		}(this));
		if(str.length == 0) return;
		this.mapInstance.messages.push({ username : this.client.username, str : str, x : this.x, y : this.y});
		this.lastMessage = t;
	}
	,e_turn: function(data) {
		if(this.battle != null) return;
		if(!js.Boot.__instanceof(data.dir,Int)) return;
		this.direction = Math.floor(Math.abs(data.dir) % 4);
		this.retransmit = true;
	}
	,e_useLedge: function(data) {
		if(this.battle != null) return;
		if(!(js.Boot.__instanceof(data.x,Int) && js.Boot.__instanceof(data.y,Int))) return;
		if(data.x < 0 || data.x >= this.mapInstance.map.width) return;
		if(data.y < 0 || data.y >= this.mapInstance.map.height) return;
		var destSolid = this.mapInstance.map.solidData[data.x][data.y];
		if(destSolid == null) return;
		switch(destSolid) {
		case 3:
			if(this.x != data.x || this.y + 1 != data.y) {
				this.sendInvalidMove();
				return;
			}
			this.direction = 0;
			this.y += 2;
			this.lastY = this.y;
			this.retransmit = true;
			break;
		case 4:
			if(this.x - 1 != data.x || this.y != data.y) {
				this.sendInvalidMove();
				return;
			}
			this.direction = 1;
			this.x -= 2;
			this.lastX = this.x;
			this.retransmit = true;
			break;
		case 5:
			if(this.x != data.x || this.y - 1 != data.y) {
				this.sendInvalidMove();
				return;
			}
			this.direction = 2;
			this.y -= 2;
			this.lastY = this.y;
			this.retransmit = true;
			break;
		case 6:
			if(this.x + 1 != data.x || this.y != data.y) {
				this.sendInvalidMove();
				return;
			}
			this.direction = 3;
			this.x += 2;
			this.lastX = this.x;
			this.retransmit = true;
			break;
		}
	}
	,e_walk: function(data) {
		if(this.battle != null) return;
		if(!(js.Boot.__instanceof(data.x,Int) && js.Boot.__instanceof(data.y,Int) && js.Boot.__instanceof(data.dir,Int))) return;
		if(data.x < 0 || data.x >= this.mapInstance.map.width) return;
		if(data.y < 0 || data.y >= this.mapInstance.map.height) return;
		var destSolid = this.mapInstance.map.solidData[data.x][data.y];
		if(destSolid == null) return;
		var invalidMove = false;
		this.direction = Math.floor(Math.abs(data.dir) % 4);
		if(!(this.surfing?destSolid == 2:destSolid == 0 || destSolid == 7)) invalidMove = true; else if(this.x - 1 == data.x && this.y == data.y) {
			this.lastX = this.x;
			this.lastY = this.y;
			this.x -= 1;
			this.direction = 1;
			this.onWalk();
		} else if(this.x + 1 == data.x && this.y == data.y) {
			this.lastX = this.x;
			this.lastY = this.y;
			this.x += 1;
			this.direction = 3;
			this.onWalk();
		} else if(this.x == data.x && this.y - 1 == data.y) {
			this.lastX = this.x;
			this.lastY = this.y;
			this.y -= 1;
			this.direction = 2;
			this.onWalk();
		} else if(this.x == data.x && this.y + 1 == data.y) {
			this.lastX = this.x;
			this.lastY = this.y;
			this.y += 1;
			this.direction = 0;
			this.onWalk();
		} else invalidMove = true;
		if(invalidMove) this.sendInvalidMove();
	}
	,canWalkOnTileType: function(type) {
		return this.surfing?type == 2:type == 0 || type == 7;
	}
	,checkEncounters: function(encounters) {
		if(Math.random() > 1 / 18.5) return false;
		var chance = 0.0;
		var n = Math.random();
		var _g = 0;
		while(_g < encounters.length) {
			var encounter = encounters[_g];
			++_g;
			if(n >= (chance += encounter.chance)) continue;
			var level = pokerpgserver.Utils.randInt(encounter.min_level,encounter.max_level);
			var enemy = encounter.id;
			this.battle = new pokerpgserver.BattleWild(this.client,new pokerpgserver.Pokemon().createWild(enemy,level));
			this.battle.init();
			return true;
		}
		return false;
	}
	,onWalk: function() {
		if(this.battle != null) return;
		var destSolid = this.mapInstance.map.solidData[this.x][this.y];
		this.retransmit = true;
		if(this.speedHackChecks.length >= 12) this.speedHackChecks.shift();
		this.speedHackChecks.push(new Date().getTime());
		if(this.speedHackChecks.length >= 12) {
			var avgWalkTime = 0.0;
			var _g = 1;
			while(_g < 12) {
				var i = _g++;
				avgWalkTime += this.speedHackChecks[i] - this.speedHackChecks[i - 1];
			}
			avgWalkTime /= 11;
			if(avgWalkTime < 50) {
				console.log("Speed hack detected, kicking client " + this.client.username);
				this.disconnect();
				return;
			}
		}
		var encounterAreas = this.mapInstance.map.getEncounterAreasAt(this.x,this.y);
		var _g = 0;
		while(_g < encounterAreas.length) {
			var area = encounterAreas[_g];
			++_g;
			if(this.checkEncounters(area.encounters)) return;
		}
		if(destSolid == 7 && this.mapInstance.map.grassEncounters != null) {
			if(this.checkEncounters(this.mapInstance.map.grassEncounters)) return;
		}
	}
	,sendInvalidMove: function() {
		this.lastAckMove = Math.floor(new Date().getTime() * 1000 + Math.random() * 1000);
		this.client.socket.emit("invalidMove",{ ack : this.lastAckMove, x : this.x, y : this.y});
	}
	,moveToSpawn: function() {
		this.warpToLocation(this.respawnLocation);
	}
	,restorePokemon: function() {
		var _g = 0, _g1 = this.pokemon;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.restore();
		}
	}
	,warpToLocation: function(loc) {
		this.warp(loc.mapName,loc.x,loc.y,loc.direction);
	}
	,warp: function(map,x,y,dir) {
		if(dir == null) dir = 0;
		this.x = x;
		this.y = y;
		this.direction = dir;
		this.putInMap(map);
		this.lastX = x;
		this.lastY = y;
		this.retransmit = true;
		this.client.socket.emit("loadMap",{ mapid : map, chars : this.mapInstance.generateFullCharNetworkObject()});
	}
	,putInMap: function(str) {
		var map = pokerpgserver.GameData.maps[str];
		if(map == null) return;
		if(this.mapInstance != null) this.mapInstance.removeChar(this);
		var $it0 = map.instances.iterator();
		while( $it0.hasNext() ) {
			var i = $it0.next();
			if(map.playersPerInstance > 0 && i.chars.length >= map.playersPerInstance) continue;
			i.addChar(this);
			this.mapInstance = i;
			return;
		}
		this.mapInstance = map.createInstance();
		this.mapInstance.addChar(this);
	}
	,generatePokemonNetworkObject: function() {
		var arr = [];
		var _g = 0, _g1 = this.pokemon;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			arr.push(i.generateNetworkObject(true));
		}
		return arr;
	}
	,generateNetworkObject: function() {
		return { username : this.client.username, inBattle : this.battle != null, x : this.x, y : this.y, lastX : this.lastX, lastY : this.lastY, type : this.type, direction : this.direction, follower : this.pokemon[0].id, folShiny : this.pokemon[0].shiny};
	}
	,generateCharacterSave: function() {
		return { map : this.mapInstance.map.id, x : this.x, y : this.y, direction : this.direction, charType : this.type, pokemon : Lambda.array(Lambda.map(this.pokemon,function(p) {
			return p.generateSave();
		})), respawnLocation : this.respawnLocation, money : this.money, playerVars : this.playerVars};
	}
	,e_disconnect: function(data) {
		this.onDisconnect();
	}
	,onDisconnect: function() {
		if(this.disconnected) return;
		this.disconnected = true;
		if(this.battle != null) this.battle.playerSurrendered(this.battle.getPlayerOfClient(this.client));
		pokerpgserver.MasterConnector.saveCharacter(this.client.username,this.generateCharacterSave());
		this.mapInstance.removeChar(this);
		this.client.onDisconnect();
	}
	,disconnect: function() {
		this.onDisconnect();
		this.client.socket.disconnect();
	}
	,__class__: pokerpgserver.ClientCharacter
}
pokerpgserver.GameConst = function() { }
pokerpgserver.GameConst.__name__ = true;
pokerpgserver.GameData = function() { }
pokerpgserver.GameData.__name__ = true;
pokerpgserver.GameData.init = function() {
	var sStart;
	sStart = new Date().getTime();
	pokerpgserver.GameData.pokemonData = pokerpgserver.Utils.recursiveFreeze(js.Node.parse(new EReg("//[^\n\r]*","gm").replace(js.Node.fs.readFileSync("data/pokemon.json","utf8"),"")));
	console.log("Loaded pokemon in " + (new Date().getTime() - sStart) + " ms");
	pokerpgserver.GameData.movesData = pokerpgserver.Utils.recursiveFreeze(js.Node.parse(new EReg("//[^\n\r]*","gm").replace(js.Node.fs.readFileSync("data/moves.json","utf8"),"")));
	pokerpgserver.GameData.typeData = pokerpgserver.Utils.recursiveFreeze(js.Node.parse(js.Node.fs.readFileSync("data/types.json","utf8")));
	pokerpgserver.GameData.adminsData = pokerpgserver.Utils.recursiveFreeze(js.Node.parse(js.Node.fs.readFileSync("data/admins.json","utf8")));
	pokerpgserver.GameData.experienceRequired = pokerpgserver.Utils.recursiveFreeze(js.Node.parse(js.Node.fs.readFileSync("data/experienceRequired.json","utf8")).experienceRequired);
	pokerpgserver.GameData.maps = { };
	pokerpgserver.GameData.mapsInstaces = [];
	var _g = 0, _g1 = pokerpgserver.GameConst.LOAD_MAPS;
	while(_g < _g1.length) {
		var id = _g1[_g];
		++_g;
		pokerpgserver.GameData.maps[id] = new pokerpgserver.Map(id);
	}
}
pokerpgserver.GameData.getAdminLevel = function(username) {
	return pokerpgserver.GameData.adminsData[username] == null?0:pokerpgserver.GameData.adminsData[username].level;
}
pokerpgserver.GameData.getPokemonData = function(id) {
	return pokerpgserver.GameData.pokemonData[id];
}
pokerpgserver.GameData.getMoveData = function(move) {
	return pokerpgserver.GameData.movesData[move];
}
pokerpgserver.GameData.getExperienceRequired = function(curve,level) {
	return pokerpgserver.GameData.experienceRequired[level][pokerpgserver.GameData.curveIdToInt(curve)];
}
pokerpgserver.GameData.curveIdToInt = function(curve) {
	switch(curve) {
	case "erratic":
		return 0;
	case "fast":
		return 1;
	case "mediumFast":
		return 2;
	case "mediumSlow":
		return 3;
	case "slow":
		return 4;
	case "fluctuating":
		return 5;
	}
	throw "Invalid curve id: " + curve;
}
pokerpgserver.GameData.getMap = function(id) {
	return pokerpgserver.GameData.maps[id];
}
pokerpgserver.GameData.getTypeEffectiveness = function(type,other) {
	if(type == null || other == null) return 1.0;
	if(pokerpgserver.GameData.typeData[type][other] == null) return 1.0;
	return pokerpgserver.GameData.typeData[type][other];
}
pokerpgserver.GameServer = function() { }
pokerpgserver.GameServer.__name__ = true;
pokerpgserver.GameServer.start = function() {
	pokerpgserver.GameServer.clients = [];
	var io = js.Node.require("socket.io").listen(2828).set("log level",2);
	io.configure("development",function() {
		io.enable("browser client minification");
		io.set("transports",["websocket"]);
	});
	io.sockets.on("connection",function(socket) {
		pokerpgserver.GameServer.clients.push(new pokerpgserver.Client(socket));
	});
	js.Node.setInterval(pokerpgserver.GameServer.sendUpdates,250);
}
pokerpgserver.GameServer.kickPlayer = function(username) {
	var _g = 0, _g1 = pokerpgserver.GameServer.clients;
	while(_g < _g1.length) {
		var c = _g1[_g];
		++_g;
		if(c.username == username) c.kick();
	}
}
pokerpgserver.GameServer.getCharByUsername = function(username) {
	var _g = 0, _g1 = pokerpgserver.GameServer.clients;
	while(_g < _g1.length) {
		var c = _g1[_g];
		++_g;
		if(pokerpgserver.Utils.equalsStrings(c.username,username)) return c;
	}
	return null;
}
pokerpgserver.GameServer.sendUpdates = function() {
	var _g = 0, _g1 = pokerpgserver.GameData.mapsInstaces;
	while(_g < _g1.length) {
		var ins = _g1[_g];
		++_g;
		if(ins.chars.length == 0) continue;
		var d = ins.generateNetworkObjectData();
		var _g2 = 0, _g3 = ins.chars;
		while(_g2 < _g3.length) {
			var c = _g3[_g2];
			++_g2;
			c.client.socket["volatile"].emit("update",d);
		}
	}
}
pokerpgserver.GameServer.getClientCount = function() {
	return pokerpgserver.GameServer.clients.length;
}
pokerpgserver.MacroUtils = function() { }
pokerpgserver.MacroUtils.__name__ = true;
pokerpgserver.Main = function() { }
pokerpgserver.Main.__name__ = true;
pokerpgserver.Main.main = function() {
	pokerpgserver.GameData.init();
	pokerpgserver.MasterConnector.connect(pokerpgserver.GameServer.start);
}
pokerpgserver.Main.log = function(obj) {
	console.log(obj);
}
pokerpgserver.Main.warn = function(obj) {
	console.warn(obj);
}
pokerpgserver.Main.error = function(obj) {
	console.error(obj);
}
pokerpgserver.Map = function(id) {
	this.id = id;
	this.numInstances = 0;
	js.Node.process.stdout.write("Loading: " + id + "...");
	var sStart = new Date().getTime();
	this.encounterAreas = [];
	this.warps = new Hash();
	this.points = new Hash();
	this.instances = new Hash();
	this.data = js.Node.parse(js.Node.fs.readFileSync("../site/resources/maps/" + id + ".json","utf8"));
	this.width = this.data.width;
	this.height = this.data.height;
	if(this.data.properties.players_per_instance == null) this.playersPerInstance = 0; else this.playersPerInstance = Std.parseInt(this.data.properties.players_per_instance);
	if(this.data.properties.grass_encounters != null) this.grassEncounters = js.Node.parse("{\"tmp\":[" + this.data.properties.grass_encounters + "]}").tmp;
	var _g = 0, _g1 = this.data.layers;
	while(_g < _g1.length) {
		var layer = _g1[_g];
		++_g;
		if(layer.type == "tilelayer") {
			if(layer.properties == null || layer.properties.data_layer != "1") continue;
			var j = 0;
			var twidth = this.data.width;
			var theight = this.data.height;
			this.solidData = new Array(twidth);
			var _g2 = 0;
			while(_g2 < twidth) {
				var x = _g2++;
				this.solidData[x] = new Array(theight);
				var _g3 = 0;
				while(_g3 < theight) {
					var y = _g3++;
					this.solidData[x][y] = 0;
				}
			}
			var _g2 = 0;
			while(_g2 < theight) {
				var y = _g2++;
				var _g3 = 0;
				while(_g3 < twidth) {
					var x = _g3++;
					var tileid = layer.data[j];
					if(tileid == null || tileid == 0) {
						++j;
						continue;
					}
					var tileset = this.getTilesetOfTile(tileid);
					if(tileset == null) "Tileset is null";
					var curTilesetTileid = tileid - tileset.firstgid;
					if(tileset.tileproperties[curTilesetTileid] != null) {
						if(tileset.tileproperties[curTilesetTileid].solid == "1") this.solidData[x][y] = 1; else if(tileset.tileproperties[curTilesetTileid].water == "1") this.solidData[x][y] = 2; else if(tileset.tileproperties[curTilesetTileid].grass == "1") this.solidData[x][y] = 7; else if(tileset.tileproperties[curTilesetTileid].ledge == "1") {
							this.solidData[x][y] = 3;
							if(tileset.tileproperties[curTilesetTileid].ledge_dir == "1") this.solidData[x][y] = 4; else if(tileset.tileproperties[curTilesetTileid].ledge_dir == "2") this.solidData[x][y] = 5; else if(tileset.tileproperties[curTilesetTileid].ledge_dir == "3") this.solidData[x][y] = 6;
						}
					}
					++j;
				}
			}
		} else if(layer.type == "objectgroup") {
			var _g2 = 0, _g3 = layer.objects;
			while(_g2 < _g3.length) {
				var obj = _g3[_g2];
				++_g2;
				var x1 = Math.round(obj.x / this.data.tilewidth);
				var y1 = Math.round(obj.y / this.data.tileheight);
				var x2 = Math.round((obj.x + obj.width) / this.data.tilewidth);
				var y2 = Math.round((obj.y + obj.height) / this.data.tileheight);
				switch(obj.type) {
				case "tall_grass":
					var encounters = js.Node.parse("{\"tmp\":[" + Std.string(obj.properties.encounters) + "]}").tmp;
					this.encounterAreas.push({ x1 : x1, y1 : y1, x2 : x2, y2 : y2, encounters : encounters});
					break;
				case "warp":
					this.warps.set(obj.name,{ x : x1, y : y1, type : obj.properties.type, destination : js.Node.parse(obj.properties.destination)});
					break;
				case "point":
					this.points.set(obj.name,{ mapName : id, x : x1, y : y1, direction : obj.properties.direction == null?0:obj.properties.direction});
					break;
				}
			}
		}
	}
	if(this.solidData == null) console.warn("Couldn't find data layer!");
	var sEnd = new Date().getTime();
	js.Node.process.stdout.write(" (" + (sEnd - sStart) + " ms)\n");
};
pokerpgserver.Map.__name__ = true;
pokerpgserver.Map.prototype = {
	getWarp: function(name) {
		return this.warps.get(name);
	}
	,getTilesetOfTile: function(n) {
		var i = this.data.tilesets.length;
		while(i-- > 0) if(n >= this.data.tilesets[i].firstgid) return this.data.tilesets[i];
		return null;
	}
	,createInstance: function() {
		var id;
		do id = pokerpgserver.Utils.createRandomString(6); while(this.instances.exists(id));
		var i = new pokerpgserver.MapInstance(this,id);
		this.instances.set(id,i);
		return i;
	}
	,getEncounterAreasAt: function(x,y) {
		var arr = [];
		var _g = 0, _g1 = this.encounterAreas;
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			if(x >= e.x1 && y >= e.y1 && x < e.x2 && y < e.y2) arr.push(e);
		}
		return arr;
	}
	,__class__: pokerpgserver.Map
}
pokerpgserver.MapInstance = function(map,id) {
	this.map = map;
	this.chars = [];
	this.messages = [];
	this.cremoved = [];
	this.warpsUsed = [];
	++map.numInstances;
	pokerpgserver.GameData.mapsInstaces.push(this);
};
pokerpgserver.MapInstance.__name__ = true;
pokerpgserver.MapInstance.prototype = {
	generateNetworkObjectData: function() {
		var obj = { map : this.map.id};
		var charArr = [];
		var _g = 0, _g1 = this.chars;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.retransmit) {
				c.retransmit = false;
				charArr.push(c.generateNetworkObject());
			}
		}
		if(charArr.length > 0) obj.chars = charArr;
		if(this.messages.length > 0) obj.messages = this.messages;
		if(this.warpsUsed.length > 0) obj.warpsUsed = this.warpsUsed;
		if(this.cremoved.length > 0) obj.cremoved = this.cremoved;
		var data = js.Node.stringify(obj);
		this.messages.length = 0;
		this.warpsUsed.length = 0;
		this.cremoved.length = 0;
		this.networkObjectData = data;
		return data;
	}
	,generateFullCharNetworkObject: function() {
		var arr = [];
		var _g = 0, _g1 = this.chars;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			arr.push(c.generateNetworkObject());
		}
		return arr;
	}
	,getCharCount: function() {
		return this.chars.length;
	}
	,removeChar: function($char) {
		HxOverrides.remove(this.chars,$char);
		if(this.chars.length == 0 && this.map.numInstances > 1) this.destroy();
		this.cremoved.push($char.client.username);
	}
	,addChar: function($char) {
		this.chars.push($char);
		HxOverrides.remove(this.cremoved,$char.client.username);
	}
	,destroy: function() {
		this.map.instances.remove(this.id);
		--this.map.numInstances;
		HxOverrides.remove(pokerpgserver.GameData.mapsInstaces,this);
	}
	,__class__: pokerpgserver.MapInstance
}
pokerpgserver.MasterConnector = function() { }
pokerpgserver.MasterConnector.__name__ = true;
pokerpgserver.MasterConnector.connect = function(func) {
	pokerpgserver.MasterConnector.loggedInUsers = [];
	pokerpgserver.MasterConnector.savingUsers = [];
	pokerpgserver.MasterConnector.mongodb = js.Node.require("mongodb");
	var tmongodb = pokerpgserver.MasterConnector.mongodb;
	pokerpgserver.MasterConnector.dbserver = new tmongodb.Server('127.0.0.1', 27017, { } );
	var tdbserver = pokerpgserver.MasterConnector.dbserver;
	new tmongodb.Db('pokerpg', tdbserver, {}).open(function(error,client) {
		if(error) throw error;
		var tdbclient = pokerpgserver.MasterConnector.dbclient = client;
		pokerpgserver.MasterConnector.dbclient.createCollection("accounts",function() {
			pokerpgserver.MasterConnector.dbaccounts = new tmongodb.Collection(tdbclient, 'accounts');
			pokerpgserver.MasterConnector.dbaccounts.ensureIndex({ username : 1},{ unique : true},function() {
			});
			pokerpgserver.MasterConnector.dbaccounts.ensureIndex({ lcusername : 1},{ unique : true},function() {
			});
			pokerpgserver.MasterConnector.dbclient.createCollection("characters",function() {
				pokerpgserver.MasterConnector.dbchars = new tmongodb.Collection(tdbclient, 'characters');
				pokerpgserver.MasterConnector.dbchars.ensureIndex({ username : 1},{ unique : true},function() {
				});
				func();
			});
		});
	},{ strict : true});
}
pokerpgserver.MasterConnector.isUser = function(username,func) {
	func(Lambda.indexOf(pokerpgserver.MasterConnector.savingUsers,username) != -1);
}
pokerpgserver.MasterConnector.loginUser = function(username,password,func) {
	var _g1 = 0, _g = pokerpgserver.MasterConnector.loggedInUsers.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(pokerpgserver.Utils.equalsStrings(pokerpgserver.MasterConnector.loggedInUsers[i],username)) {
			func("loggedInAlready",null);
			return;
		}
	}
	var _g1 = 0, _g = pokerpgserver.MasterConnector.savingUsers.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(pokerpgserver.Utils.equalsStrings(pokerpgserver.MasterConnector.savingUsers[i],username)) {
			func("loggedInAlready",null);
			return;
		}
	}
	pokerpgserver.MasterConnector.dbaccounts.find({ lcusername : username.toLowerCase()},{ limit : 1}).toArray(function(err,docs) {
		if(err || docs.length == 0) {
			func("wrongUsername",null);
			return;
		}
		var username1 = docs[0].username;
		var hashedpass = docs[0].password;
		var salt = docs[0].salt;
		if(pokerpgserver.Utils.sha512(password,salt) == hashedpass) pokerpgserver.MasterConnector.loggedInUsers.push(username1);
		func(pokerpgserver.Utils.sha512(password,salt) == hashedpass?"success":"wrong_password",docs[0].username);
	});
}
pokerpgserver.MasterConnector.disconnectUser = function(username) {
	HxOverrides.remove(pokerpgserver.MasterConnector.loggedInUsers,username);
}
pokerpgserver.MasterConnector.loadCharacter = function(username,func) {
	pokerpgserver.MasterConnector.dbchars.find({ username : username},{ limit : 1}).toArray(function(err,docs) {
		if(err) {
			js.Node.console.warn("Error while trying to load client char: " + Std.string(err.message));
			func(false,null);
			return;
		}
		if(docs.length > 0) func(true,docs[0]); else func(true,null);
	});
}
pokerpgserver.MasterConnector.saveCharacter = function(username,data) {
	if(Lambda.indexOf(pokerpgserver.MasterConnector.savingUsers,username) != -1) return;
	pokerpgserver.MasterConnector.savingUsers.push(username);
	pokerpgserver.MasterConnector.dbchars.update({ username : username},{$set:data},{ safe : true, upsert : true},function(err) {
		HxOverrides.remove(pokerpgserver.MasterConnector.savingUsers,username);
		if(err != null) console.warn("Error while saving client character: " + err.message);
	});
}
pokerpgserver.Pokemon = function() {
	this.resetBattleStats();
};
pokerpgserver.Pokemon.__name__ = true;
pokerpgserver.Pokemon.prototype = {
	increaseLevel: function() {
		this.level = this.level + 1;
	}
	,levelUp: function() {
		var oldMaxHp = this.maxHp;
		this.increaseLevel();
		this.calculateStats();
		if(this.hp > 0) this.hp += this.maxHp - oldMaxHp;
		var data = pokerpgserver.GameData.pokemonData[this.id];
		if(data.evolveLevel != null && this.level >= data.evolveLevel) {
			this.id = data.evolveTo;
			data = pokerpgserver.GameData.pokemonData[this.id];
		}
		var learnset = data.learnset;
		var movesLearned = [];
		var _g = 0;
		while(_g < learnset.length) {
			var m = learnset[_g];
			++_g;
			if(pokerpgserver.GameData.movesData[m.move] == null) {
				console.warn("Move \"" + m.move + "\" doesn't exist for " + pokerpgserver.GameData.pokemonData[this.id].name);
				continue;
			}
			if(m.level == -1 && Lambda.indexOf(this.moves,m.move) == -1) {
			} else if(m.level != this.level) continue;
			var learnedMove = false;
			var _g1 = 0;
			while(_g1 < 4) {
				var i = _g1++;
				if(this.moves[i] == null) {
					this.learnMove(i,m.move);
					movesLearned.push(m.move);
					learnedMove = true;
					break;
				}
			}
			if(!learnedMove) this.battleStats.learnableMoves.push(m.move);
		}
		return { movesLearned : movesLearned};
	}
	,addEV: function(data) {
		var total = this.evHp + this.evAtk + this.evDef + this.evSpAtk + this.evSpDef + this.evSpeed;
		var tmp;
		if(total >= 510) return;
		var _g = 0, _g1 = [["hp","evHp"],["atk","evAtk"],["def","evDef"],["spAtk","evSpAtk"],["spDef","evSpDef"],["speed","evSpeed"]];
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			if(data[i[0]] != null && data[i[0]] > 0) {
				tmp = data[i[0]];
				if(total + tmp > 510) tmp = 510 - total;
				this[data[i[1]]] += data[i[0]];
				total += tmp;
				if(total >= 510) return;
			}
		}
	}
	,buffBattleStat: function(stat,value) {
		switch(stat) {
		case "atk":
			this.battleStats.atkPower = pokerpgserver.Utils.clamp(this.battleStats.atkPower + value,-6,6);
			break;
		case "def":
			this.battleStats.defPower = pokerpgserver.Utils.clamp(this.battleStats.defPower + value,-6,6);
			break;
		case "spAtk":
			this.battleStats.spAtkPower = pokerpgserver.Utils.clamp(this.battleStats.spAtkPower + value,-6,6);
			break;
		case "spDef":
			this.battleStats.spDefPower = pokerpgserver.Utils.clamp(this.battleStats.spDefPower + value,-6,6);
			break;
		case "speed":
			this.battleStats.speedPower = pokerpgserver.Utils.clamp(this.battleStats.speedPower + value,-6,6);
			break;
		case "accuracy":
			this.battleStats.accuracy = pokerpgserver.Utils.clamp(this.battleStats.accuracy + value,-6,6);
			break;
		case "evasion":
			this.battleStats.evasion = pokerpgserver.Utils.clamp(this.battleStats.evasion + value,-6,6);
			break;
		}
	}
	,calculateExpGain: function(isTrainer) {
		return Math.ceil((isTrainer?1.5:1) * pokerpgserver.GameData.pokemonData[this.id].baseExp * this.level / 7);
	}
	,generateNetworkObject: function(isOwner) {
		if(isOwner) return { id : this.id, level : this.level, hp : this.hp, maxHp : this.maxHp, unique : this.unique, shiny : this.shiny, gender : this.gender, nickname : this.nickname, status : this.status, experience : this.experience, experienceNeeded : this.experienceNeeded, atk : this.atk, def : this.def, spAtk : this.spAtk, spDef : this.spDef, speed : this.speed, ability : this.ability, nature : this.nature, moves : this.moves, movesPP : this.movesPP, movesMaxPP : this.movesMaxPP, training : Math.floor((this.evHp + this.evAtk + this.evDef + this.evSpAtk + this.evSpDef + this.evSpeed) / 510 * 100) / 100, virus : this.virus}; else return { id : this.id, level : this.level, hp : this.hp, maxHp : this.maxHp, unique : this.unique, shiny : this.shiny, gender : this.gender, nickname : this.nickname, status : this.status};
	}
	,getUsableMoves: function() {
		var arr = [];
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			if(this.moves[i] == null) continue;
			if(this.movesPP[i] <= 0) continue;
			arr.push(this.moves[i]);
		}
		return arr;
	}
	,restore: function() {
		this.hp = this.maxHp;
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			this.movesPP[i] = this.movesMaxPP[i];
		}
	}
	,getCharacteristic: function() {
		return 0;
	}
	,calculateStats: function() {
		var _g = this;
		var calculateSingleStat = function(base,iv,ev) {
			return (iv + 2 * base + ev / 4) * _g.level / 100 + 5;
		};
		this.maxHp = Math.floor((this.ivHp + 2 * pokerpgserver.GameData.pokemonData[this.id].baseStats.hp + this.evHp / 4 + 100) * this.level / 100 + 10);
		if(this.hp > this.maxHp) this.hp = this.maxHp;
		var tatk = calculateSingleStat(pokerpgserver.GameData.pokemonData[this.id].baseStats.atk,this.ivAtk,this.evAtk);
		var tdef = calculateSingleStat(pokerpgserver.GameData.pokemonData[this.id].baseStats.def,this.ivDef,this.evDef);
		var tspAtk = calculateSingleStat(pokerpgserver.GameData.pokemonData[this.id].baseStats.spAtk,this.ivSpAtk,this.evSpAtk);
		var tspDef = calculateSingleStat(pokerpgserver.GameData.pokemonData[this.id].baseStats.spDef,this.ivSpDef,this.evSpDef);
		var tspeed = calculateSingleStat(pokerpgserver.GameData.pokemonData[this.id].baseStats.speed,this.ivSpeed,this.evSpeed);
		switch(this.nature) {
		case 1:
			tatk *= 1.1;
			tdef *= 0.9;
			break;
		case 2:
			tatk *= 1.1;
			tspAtk *= 0.9;
			break;
		case 3:
			tatk *= 1.1;
			tspDef *= 0.9;
			break;
		case 4:
			tatk *= 1.1;
			tspeed *= 0.9;
			break;
		case 5:
			tdef *= 1.1;
			tatk *= 0.9;
			break;
		case 6:
			tdef *= 1.1;
			tspAtk *= 0.9;
			break;
		case 7:
			tdef *= 1.1;
			tspDef *= 0.9;
			break;
		case 8:
			tdef *= 1.1;
			tspeed *= 0.9;
			break;
		case 9:
			tspAtk *= 1.1;
			tatk *= 0.9;
			break;
		case 10:
			tspAtk *= 1.1;
			tdef *= 0.9;
			break;
		case 11:
			tspAtk *= 1.1;
			tspDef *= 0.9;
			break;
		case 12:
			tspAtk *= 1.1;
			tspeed *= 0.9;
			break;
		case 13:
			tspDef *= 1.1;
			tatk *= 0.9;
			break;
		case 14:
			tspDef *= 1.1;
			tdef *= 0.9;
			break;
		case 15:
			tspDef *= 1.1;
			tspAtk *= 0.9;
			break;
		case 16:
			tspDef *= 1.1;
			tspeed *= 0.9;
			break;
		case 17:
			tspeed *= 1.1;
			tatk *= 0.9;
			break;
		case 18:
			tspeed *= 1.1;
			tdef *= 0.9;
			break;
		case 19:
			tspeed *= 1.1;
			tspAtk *= 0.9;
			break;
		case 20:
			tspeed *= 1.1;
			tspDef *= 0.9;
			break;
		}
		this.atk = Math.floor(tatk);
		this.def = Math.floor(tdef);
		this.spAtk = Math.floor(tspAtk);
		this.spDef = Math.floor(tspDef);
		this.speed = Math.floor(tspeed);
		if(this.level >= 100) this.experienceNeeded = 0; else this.experienceNeeded = pokerpgserver.GameData.experienceRequired[this.level][pokerpgserver.GameData.curveIdToInt(pokerpgserver.GameData.pokemonData[this.id].experienceCurve)];
		this.characteristic = this.getCharacteristic();
	}
	,learnMove: function(slot,move) {
		if(slot < 0 || slot >= 4) return;
		this.moves[slot] = move;
		this.movesMaxPP[slot] = this.movesPP[slot] = pokerpgserver.GameData.movesData[move].pp;
	}
	,getAbility: function() {
		return this.ability == 0?"":pokerpgserver.GameData.pokemonData[this.id]["ability" + this.ability];
	}
	,calculateCatch: function(ballType,ballValue) {
		var chance = (3 * this.maxHp - 2 * this.hp) * pokerpgserver.GameData.pokemonData[this.id].catchRate;
		switch(ballType) {
		case 0:
			chance *= ballValue;
			break;
		case 1:
			chance += ballValue;
			break;
		}
		chance /= 3 * this.maxHp;
		switch(this.status) {
		case 1:case 2:
			chance *= 2;
			break;
		case 3:case 4:case 5:
			chance *= 1.5;
			break;
		}
		return chance;
	}
	,generateSave: function() {
		var sav = { };
		var _g = 0, _g1 = pokerpgserver.Pokemon.pokemonSaveFields;
		while(_g < _g1.length) {
			var field = _g1[_g];
			++_g;
			sav[field] = this[field];
		}
		return sav;
	}
	,createWild: function(id_,level_) {
		this.id = id_;
		this.level = level_;
		this.unique = pokerpgserver.Utils.createRandomString(16);
		if(pokerpgserver.GameData.pokemonData[this.id].genderRatio != -1) this.gender = Math.random() < pokerpgserver.GameData.pokemonData[this.id].genderRatio?1:2; else this.gender = 0;
		this.nature = 1 + Math.floor(25 * Math.random());
		this.happiness = 0;
		if(pokerpgserver.GameData.pokemonData[this.id].ability2 != null) this.ability = 1 + Math.floor(2 * Math.random()); else if(pokerpgserver.GameData.pokemonData[this.id].ability1 != null) this.ability = 1; else this.ability = 0;
		this.experience = 0;
		this.hp = this.atk = this.def = this.spAtk = this.spDef = this.speed = 0;
		this.evHp = this.evAtk = this.evDef = this.evSpAtk = this.evSpDef = this.evSpeed = 0;
		this.ivHp = Math.floor(32 * Math.random());
		this.ivAtk = Math.floor(32 * Math.random());
		this.ivDef = Math.floor(32 * Math.random());
		this.ivSpAtk = Math.floor(32 * Math.random());
		this.ivSpDef = Math.floor(32 * Math.random());
		this.ivSpeed = Math.floor(32 * Math.random());
		this.status = 0;
		this.virus = 0;
		this.shiny = 0.0001220703125 > Math.random();
		this.moves = [null,null,null,null];
		this.movesPP = [0,0,0,0];
		this.movesMaxPP = [0,0,0,0];
		var j = 0;
		var _g = 0, _g1 = pokerpgserver.GameData.pokemonData[this.id].learnset;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			if(pokerpgserver.GameData.movesData[i.move] == null) {
				console.warn("Move \"" + i.move + "\" doesn't exist for \"" + pokerpgserver.GameData.pokemonData[this.id].name + "\"");
				continue;
			}
			if(i.level > this.level) continue;
			this.learnMove(j,i.move);
			j = (j + 1) % 4;
		}
		this.calculateStats();
		this.hp = this.maxHp;
		if(this.moves[0] == null) this.learnMove(0,"tackle");
		return this;
	}
	,loadFromSave: function(sav) {
		var _g = 0, _g1 = pokerpgserver.Pokemon.pokemonSaveFields;
		while(_g < _g1.length) {
			var field = _g1[_g];
			++_g;
			this[field] = sav[field];
		}
		this.calculateStats();
		return this;
	}
	,resetBattleStats: function() {
		this.battleStats = { learnableMoves : [], atkPower : 0, defPower : 0, spAtkPower : 0, spDefPower : 0, speedPower : 0, accuracy : 0, evasion : 0};
	}
	,__class__: pokerpgserver.Pokemon
}
pokerpgserver.ServerConst = function() { }
pokerpgserver.ServerConst.__name__ = true;
pokerpgserver.Utils = function() { }
pokerpgserver.Utils.__name__ = true;
pokerpgserver.Utils.createRandomString = function(len) {
	var i = len;
	var str = "";
	while(i-- > 0) str += pokerpgserver.exts.StringExt.getRandomChar("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
	return str;
}
pokerpgserver.Utils.equalsStrings = function(a,b) {
	a = Std.string(a);
	b = Std.string(b);
	return a.toLowerCase() == b.toLowerCase();
}
pokerpgserver.Utils.randInt = function(min,max) {
	return min + Math.floor((max - min + 1) * Math.random());
}
pokerpgserver.Utils.recursiveFreeze = function(obj) {
	var rec = pokerpgserver.Utils.recursiveFreeze;
	for(var i in obj)if(typeof obj[i] == 'object')rec(obj[i]);Object.freeze(obj);;
	return obj;
}
pokerpgserver.Utils.sha512 = function(pass,salt) {
	var hasher = js.Node.crypto.createHash("sha512");
	if(salt == null) hasher.update(pass); else hasher.update(pass + "#" + salt);
	return hasher.digest("base64");
}
pokerpgserver.Utils.clamp = function(n,min,max) {
	return n < min?min:n > max?max:n;
}
if(!pokerpgserver.exts) pokerpgserver.exts = {}
pokerpgserver.exts.ArrayExt = function() { }
pokerpgserver.exts.ArrayExt.__name__ = true;
pokerpgserver.exts.ArrayExt.random = function(arr) {
	return arr[Math.floor(arr.length * Math.random())];
}
pokerpgserver.exts.StringExt = function() { }
pokerpgserver.exts.StringExt.__name__ = true;
pokerpgserver.exts.StringExt.getRandomChar = function(str) {
	return str.charAt(Math.floor(str.length * Math.random()));
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
js.Node.__filename = __filename;
js.Node.__dirname = __dirname;
js.Node.setTimeout = setTimeout;
js.Node.clearTimeout = clearTimeout;
js.Node.setInterval = setInterval;
js.Node.clearInterval = clearInterval;
js.Node.global = global;
js.Node.process = process;
js.Node.require = require;
js.Node.console = console;
js.Node.module = module;
js.Node.stringify = JSON.stringify;
js.Node.parse = JSON.parse;
js.Node.util = js.Node.require("util");
js.Node.fs = js.Node.require("fs");
js.Node.net = js.Node.require("net");
js.Node.http = js.Node.require("http");
js.Node.https = js.Node.require("https");
js.Node.path = js.Node.require("path");
js.Node.url = js.Node.require("url");
js.Node.os = js.Node.require("os");
js.Node.crypto = js.Node.require("crypto");
js.Node.dns = js.Node.require("dns");
js.Node.queryString = js.Node.require("querystring");
js.Node.assert = js.Node.require("assert");
js.Node.childProcess = js.Node.require("child_process");
js.Node.vm = js.Node.require("vm");
js.Node.tls = js.Node.require("tls");
js.Node.dgram = js.Node.require("dgram");
js.Node.assert = js.Node.require("assert");
js.Node.repl = js.Node.require("repl");
js.Node.cluster = js.Node.require("cluster");
js.NodeC.UTF8 = "utf8";
js.NodeC.ASCII = "ascii";
js.NodeC.BINARY = "binary";
js.NodeC.BASE64 = "base64";
js.NodeC.HEX = "hex";
js.NodeC.EVENT_EVENTEMITTER_NEWLISTENER = "newListener";
js.NodeC.EVENT_EVENTEMITTER_ERROR = "error";
js.NodeC.EVENT_STREAM_DATA = "data";
js.NodeC.EVENT_STREAM_END = "end";
js.NodeC.EVENT_STREAM_ERROR = "error";
js.NodeC.EVENT_STREAM_CLOSE = "close";
js.NodeC.EVENT_STREAM_DRAIN = "drain";
js.NodeC.EVENT_STREAM_CONNECT = "connect";
js.NodeC.EVENT_STREAM_SECURE = "secure";
js.NodeC.EVENT_STREAM_TIMEOUT = "timeout";
js.NodeC.EVENT_STREAM_PIPE = "pipe";
js.NodeC.EVENT_PROCESS_EXIT = "exit";
js.NodeC.EVENT_PROCESS_UNCAUGHTEXCEPTION = "uncaughtException";
js.NodeC.EVENT_PROCESS_SIGINT = "SIGINT";
js.NodeC.EVENT_PROCESS_SIGUSR1 = "SIGUSR1";
js.NodeC.EVENT_CHILDPROCESS_EXIT = "exit";
js.NodeC.EVENT_HTTPSERVER_REQUEST = "request";
js.NodeC.EVENT_HTTPSERVER_CONNECTION = "connection";
js.NodeC.EVENT_HTTPSERVER_CLOSE = "close";
js.NodeC.EVENT_HTTPSERVER_UPGRADE = "upgrade";
js.NodeC.EVENT_HTTPSERVER_CLIENTERROR = "clientError";
js.NodeC.EVENT_HTTPSERVERREQUEST_DATA = "data";
js.NodeC.EVENT_HTTPSERVERREQUEST_END = "end";
js.NodeC.EVENT_CLIENTREQUEST_RESPONSE = "response";
js.NodeC.EVENT_CLIENTRESPONSE_DATA = "data";
js.NodeC.EVENT_CLIENTRESPONSE_END = "end";
js.NodeC.EVENT_NETSERVER_CONNECTION = "connection";
js.NodeC.EVENT_NETSERVER_CLOSE = "close";
js.NodeC.FILE_READ = "r";
js.NodeC.FILE_READ_APPEND = "r+";
js.NodeC.FILE_WRITE = "w";
js.NodeC.FILE_WRITE_APPEND = "a+";
js.NodeC.FILE_READWRITE = "a";
js.NodeC.FILE_READWRITE_APPEND = "a+";
pokerpgserver.Battle.BATTLE_WILD = 0;
pokerpgserver.Battle.BATTLE_TRAINER = 1;
pokerpgserver.Battle.BATTLE_VERSUS = 2;
pokerpgserver.Battle.powerMultipler = {"-6": 2/8,"-5": 2/7,"-4": 2/6,"-3": 2/5,"-2": 2/4,"-1": 2/3,"0": 1,"1": 1.5,"2": 2,"3": 2.5,"4": 3,"5": 3.5,"6": 4}
pokerpgserver.Battle.accuracyMultipler = {"-6": 3/9,"-5": 3/8,"-4": 3/7,"-3": 3/6,"-2": 3/5,"-1": 3/4,"0": 1,"1": 4/3,"2": 5/3,"3": 2,"4": 7/3,"5": 8/3,"6": 3,}
pokerpgserver.ClientCharacter.SPEED_HACK_N = 12;
pokerpgserver.ClientCharacter.SPEED_RUN_HACK_N = 32;
pokerpgserver.GameConst.SPEED_HACK_N = 12;
pokerpgserver.GameConst.DIR_DOWN = 0;
pokerpgserver.GameConst.DIR_LEFT = 1;
pokerpgserver.GameConst.DIR_UP = 2;
pokerpgserver.GameConst.DIR_RIGHT = 3;
pokerpgserver.GameConst.LOAD_MAPS = ["pallet","pallet_hero_home_1f","pallet_hero_home_2f","pallet_oaklab","pallet_rival_home","viridianforest","station01","poke_center01","mart01","station02","viridian_house_1","pewter","station03"];
pokerpgserver.Map.SD_NONE = 0;
pokerpgserver.Map.SD_SOLID = 1;
pokerpgserver.Map.SD_WATER = 2;
pokerpgserver.Map.SD_LEDGE_DOWN = 3;
pokerpgserver.Map.SD_LEDGE_LEFT = 4;
pokerpgserver.Map.SD_LEDGE_UP = 5;
pokerpgserver.Map.SD_LEDGE_RIGHT = 6;
pokerpgserver.Map.SD_GRASS = 7;
pokerpgserver.Map.LAYER_TILELAYER = "tilelayer";
pokerpgserver.Map.LAYER_OBJECTGROUP = "objectgroup";
pokerpgserver.Pokemon.MAX_LEVEL = 100;
pokerpgserver.Pokemon.MAX_MOVES = 4;
pokerpgserver.Pokemon.STATUS_NONE = 0;
pokerpgserver.Pokemon.STATUS_SLEEP = 1;
pokerpgserver.Pokemon.STATUS_FREEZE = 2;
pokerpgserver.Pokemon.STATUS_PARALYZE = 3;
pokerpgserver.Pokemon.STATUS_POISON = 4;
pokerpgserver.Pokemon.STATUS_BURN = 5;
pokerpgserver.Pokemon.GENDER_UNKNOWN = 0;
pokerpgserver.Pokemon.GENDER_MALE = 1;
pokerpgserver.Pokemon.GENDER_FEMALE = 2;
pokerpgserver.Pokemon.VIRUS_NONE = 0;
pokerpgserver.Pokemon.VIRUS_POKERUS = 1;
pokerpgserver.Pokemon.NATURE_NONE = 0;
pokerpgserver.Pokemon.BALL_MULT = 0;
pokerpgserver.Pokemon.BALL_ADD = 1;
pokerpgserver.Pokemon.NATURE_ATK_DEF = 1;
pokerpgserver.Pokemon.NATURE_ATK_SPATK = 2;
pokerpgserver.Pokemon.NATURE_ATK_SPDEF = 3;
pokerpgserver.Pokemon.NATURE_ATK_SPEED = 4;
pokerpgserver.Pokemon.NATURE_DEF_ATK = 5;
pokerpgserver.Pokemon.NATURE_DEF_SPATK = 6;
pokerpgserver.Pokemon.NATURE_DEF_SPDEF = 7;
pokerpgserver.Pokemon.NATURE_DEF_SPEED = 8;
pokerpgserver.Pokemon.NATURE_SPATK_ATK = 9;
pokerpgserver.Pokemon.NATURE_SPATK_DEF = 10;
pokerpgserver.Pokemon.NATURE_SPATK_SPDEF = 11;
pokerpgserver.Pokemon.NATURE_SPATK_SPEED = 12;
pokerpgserver.Pokemon.NATURE_SPDEF_ATK = 13;
pokerpgserver.Pokemon.NATURE_SPDEF_DEF = 14;
pokerpgserver.Pokemon.NATURE_SPDEF_SPATK = 15;
pokerpgserver.Pokemon.NATURE_SPDEF_SPEED = 16;
pokerpgserver.Pokemon.NATURE_SPEED_ATK = 17;
pokerpgserver.Pokemon.NATURE_SPEED_DEF = 18;
pokerpgserver.Pokemon.NATURE_SPEED_SPATK = 19;
pokerpgserver.Pokemon.NATURE_SPEED_SPDEF = 20;
pokerpgserver.Pokemon.NATURE_NONE_ATK = 21;
pokerpgserver.Pokemon.NATURE_NONE_DEF = 22;
pokerpgserver.Pokemon.NATURE_NONE_SPATK = 23;
pokerpgserver.Pokemon.NATURE_NONE_SPDEF = 24;
pokerpgserver.Pokemon.NATURE_NONE_SPEED = 25;
pokerpgserver.Pokemon.MAX_EV = 510;
pokerpgserver.Pokemon.MAX_INDIVIDUAL_EV = 255;
pokerpgserver.Pokemon.pokemonSaveFields = ["id","ot","level","unique","gender","ability","experience","hapiness","nature","status","virus","shiny","moves","movesPP","movesMaxPP","hp","evHp","evAtk","evDef","evSpAtk","evSpDef","evSpeed","ivHp","ivAtk","ivDef","ivSpAtk","ivSpDef","ivSpeed"];
pokerpgserver.ServerConst.MAX_CLIENTS = 200;
pokerpgserver.ServerConst.pokemonStarters = ["1","4","7","10","13","16","25","29","32","37","41","43","46","54","60","66","69","74","86","92","102","109","116","131","133"];
pokerpgserver.ServerConst.characterSprites = ["tr000","tr001","tr002","tr003"];
pokerpgserver.Main.main();
