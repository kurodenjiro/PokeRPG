package pokerpgserver;

import js.Lib;
import js.Node;
import pokerpgserver.Client;
import pokerpgserver.GameConst;

/**
 * ...
 * @author Beetle
 */

class Main {
	static function main() {
		GameData.init();
		
		MasterConnector.connect(GameServer.start);
	}
	
	static inline public function log(obj:Dynamic):Void {
		untyped console.log(obj);
	}
	
	static inline public function warn(obj:Dynamic):Void {
		untyped console.warn(obj);
	}
	
	static inline public function error(obj:Dynamic):Void {
		untyped console.error(obj);
	}
}