package pokerpg.entities;
import pokerpg.CCharacter;
import pokerpg.Game;
import pokerpg.GameObject;
import pokerpg.Map;
import pokerpg.Renderer;
import UserAgentContext;

/**
 * ...
 * @author Beetle
 */

class CDoor extends CWarp {
	private var openStep:Int;
	private var typeDoor:String;
	
	public function new(name:String, _typeDoor:String, x:Int, y:Int) {
		super(name, x, y);
		
		renderPriority = 100;
		openStep = 0;
		typeDoor = _typeDoor;
	}
	
	public function open():Void {
		openStep = 1;
	}
	
	override public function canWarp(obj:CCharacter):Bool {
		return super.canWarp(obj);
	}
	
	override public function render(ctx:CanvasRenderingContext2D):Void {
		if (disable) openStep = 0;
		if (openStep > 30) openStep = 0;
		var curMap = Map.cur;
		
		var door_sX:Int = 2;
		
		switch (typeDoor) {
			case 'door': door_sX = 17;
			case 'labdoor': door_sX = 9;
			case 'slidedoor': door_sX = 11;
			case 'housedoor01': door_sX = 5;
		}
		
		ctx.drawImage(Game.getRes('doorSprites').obj, 32 * (door_sX-1), 32 * Math.min(Math.floor(openStep / 4), 3), 32, 32, x * curMap.tilewidth + Renderer.getOffsetX(), y * curMap.tileheight + Renderer.getOffsetY(), 32, 32);
		if(openStep > 0) ++openStep;
	}
}