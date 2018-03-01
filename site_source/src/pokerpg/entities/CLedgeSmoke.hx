package pokerpg.entities;
import pokerpg.GameObject;
import pokerpg.Main;
import pokerpg.Map;
import UserAgentContext;

/**
 * ...
 * @author Beetle
 */

class CLedgeSmoke extends GameObject{
	private var step:Int;
	public function new(x:Int, y:Int) {
		super(x, y);
		step = 0;
		renderPriority = -100;
	}
	
	override public function render(ctx:CanvasRenderingContext2D):Void {
		var map = Map.cur;
		ctx.drawImage(Game.getRes('miscSprites').obj, 96, Math.floor(step / 3) * 32, 32, 32, x * map.tilewidth + Renderer.getOffsetX(), y * map.tileheight + Renderer.getOffsetY(), 32, 32);
		
		++step;
		if (step >= 9) {
			destroy();
		}
	}
}