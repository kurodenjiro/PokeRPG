package pokerpg.entities;

import pokerpg.CCharacter;
import pokerpg.Game;
import pokerpg.particles.ShinyOverworld;
import pokerpg.Renderer;
import UserAgentContext;

/**
 * ...
 * @author Beetle
 */

class CFollower extends CPokemon {
	public var chr:CCharacter;
	public var forceTarget:Bool;
	public var createdTick:Int;
	
	private var lastFollower:String;
	
	public function new(chr:CCharacter) {
		super(chr.follower, chr.lastX, chr.lastY, Game.DIR_DOWN, chr.followerShiny);
		this.chr = chr;
		forceTarget = false;
		createdTick = Renderer.numRTicks;
		renderPriority = 10;
		canIdleJump = true;
	}
	
	override public function render(ctx:CanvasRenderingContext2D):Void {
		if(chr.follower != null){
			if (lastFollower != chr.follower) {
				
				
				var strId:String = '';
		
				if (chr.follower.length == 1) strId = '00';
				else if (chr.follower.length == 2) strId = '0';
			
				image = Game.curGame.getImage('resources/followers/' + strId + chr.follower + (chr.followerShiny ? 's' : '') + '_0.png');
			}
		}else if(image != null){
			image = null;
		}
		
		shiny = chr.followerShiny;
		
		lastFollower = chr.follower;
		
		if(chr.username == Game.username && !Game.curGame.drawPlayerFollower) return;
		if(x == chr.x && y == chr.y && !walking && !chr.walking) return;
		
		ctx.save();
		if(Renderer.numRTicks - createdTick < 10){
			ctx.globalAlpha = (Renderer.numRTicks - createdTick) / 10;
		}
		
		super.render(ctx);
		
		ctx.restore();
	}
	
	override public function tick():Void {
		targetX = chr.lastX;
		targetY = chr.lastY;
		
		if(!forceTarget && chr.walking && !chr.walkingHasMoved && chr.walkingPerc >= CCharacter.CHAR_MOVE_WAIT && !chr.willMoveIntoAWall()){
			targetX = chr.x;
			targetY = chr.y;
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
}