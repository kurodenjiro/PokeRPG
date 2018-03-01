package pokerpgserver.exts;

/**
 * ...
 * @author Beetle
 */

class StringExt {
	static public function getRandomChar(str:String):String {
		return str.charAt(Math.floor(str.length * Math.random()));
	}
}