package pokerpgserver;

/**
 * ...
 * @author Beetle
 */

class BattleVersusPlayer extends Battle {
	public function new(client:Client, client2:Client) {
		super();
		isTrainerBattle = false;
		battleType = Battle.BATTLE_VERSUS;
		addPlayer(client, client.character.pokemon);
		addPlayer(client2, client2.character.pokemon);
	}
	
	override public function destroy():Void {
		super.destroy();
	}
	
	override public function initTurn():Void {
		super.initTurn();
	}
}