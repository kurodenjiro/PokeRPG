package pokerpgserver.exts;

/**
 * ...
 * @author Beetle
 */

class ArrayExt {
	static public function random<A>(arr:Array<A>):A {
		return arr[Math.floor(arr.length * Math.random())];
	}
}