package pokerpg.entities;
import pokerpg.CCharacter;
import pokerpg.Game;
import pokerpg.Renderer;
import UserAgentContext;

/**
 * ...
 * @author Beetle
 */

class CWildPokemon extends CPokemon {
	private var createdTick:Int;
	private var chr:CCharacter;
	public function new(id:String, x:Int, y:Int, chr:CCharacter, shiny:Bool) {
		super(id, x, y, Game.DIR_DOWN, shiny);
		
		this.chr = chr;
		createdTick = Renderer.numRTicks;
	}
	
	override public function tick():Void {
		if (!chr.inBattle) {
			destroy();
			return;
		}
		
		super.tick();
		
		if(!walking){
			if(x < chr.x){
				direction = Game.DIR_RIGHT;
			}else if(x > chr.x){
				direction = Game.DIR_LEFT;
			}else if(y > chr.y){
				direction = Game.DIR_UP;
			}else{
				direction = Game.DIR_DOWN;
			}
		}
	}
	
	override public function render(ctx:CanvasRenderingContext2D):Void {
		if(chr.username == Game.username && !Game.curGame.drawPlayerChar) return;
		ctx.save();
		canDrawGrass = Renderer.numRTicks - createdTick < 5;
		if(Renderer.numRTicks - createdTick < 10){
			ctx.translate(0, -(Math.floor(-7 / 50 * (Renderer.numRTicks - createdTick) * (Renderer.numRTicks - createdTick) + 7 / 5 * (Renderer.numRTicks - createdTick)) * 8));
		}
		
		super.render(ctx);
		
		ctx.restore();
	}
}