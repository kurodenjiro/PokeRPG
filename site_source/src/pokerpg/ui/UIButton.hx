package pokerpg.ui;
import pokerpg.Main;
import pokerpg.UI;
import UserAgentContext;

/**
 * ...
 * @author Beetle
 */

class UIButton extends UIInput{
	public var drawIdle:CanvasRenderingContext2D->Void;
	public var drawHover:CanvasRenderingContext2D->Void;
	public var drawDown:CanvasRenderingContext2D->Void;
	public var drawDisabled:CanvasRenderingContext2D->Void;
	
	public var onSubmit:Void->Void;
	public var instantSubmit:Bool;
	
	public var width:Int;
	public var height:Int;
	
	private var mouseWasDown:Bool;
	private var keyWasDown:Bool;
	
	public function new(x:Int, y:Int, width:Int, height:Int) {
		super(x, y);
		this.width = width;
		this.height = height;
		
		mouseWasDown = false;
		keyWasDown = false;
		instantSubmit = false;
	}
	
	override public function tick():Void {
		if (disabled) return;
		if (isUnderMouse()) {
			UI.setCursor('pointer');
		}
	}
	
	public function submit():Void {
		if (onSubmit != null) {
			onSubmit();
		}
		
		mouseWasDown = false;
		keyWasDown = false;
	}
	
	override public function render(ctx:CanvasRenderingContext2D):Void {
		if (disabled) {
			mouseWasDown = false;
			keyWasDown = false;
			drawDisabled(ctx);
			return;
		}
		
		if (selected) {
			if ((UI.mouseDown && isUnderMouse()) || UI.isKeyDown(13) || UI.isKeyDown(32)) {
				drawDown(ctx);
			}else {
				drawHover(ctx);
				
				if ((mouseWasDown && isUnderMouse()) || keyWasDown) {
					if(!keyWasDown) blur();
					submit();
				}
			}
		}else {
			if (isUnderMouse()) {
				drawHover(ctx);
			}else {
				drawIdle(ctx);
			}
		}
		
		mouseWasDown = UI.mouseDown;
		keyWasDown = UI.isKeyDown(13) || UI.isKeyDown(32);
	}
	
	override public function isUnderMouse():Bool {
		return UI.mouseX >= x && UI.mouseY >= y && UI.mouseX < x + width && UI.mouseY < y + height;
	}
}