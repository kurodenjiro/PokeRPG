package pokerpgserver;

import pokerpgserver.Pokemon;

/**
 * ...
 * @author Beetle
 */

class BattleWild extends Battle {
	public function new(client:Client, wildPokemon:Pokemon) {
		super();
		isTrainerBattle = false;
		battleType = Battle.BATTLE_WILD;
		addPlayer(client, client.character.pokemon);
		addPlayer(null, [wildPokemon]);
	}
	
	override public function destroy():Void {
		super.destroy();
	}
	
	override public function initTurn():Void {
		super.initTurn();
	}
}