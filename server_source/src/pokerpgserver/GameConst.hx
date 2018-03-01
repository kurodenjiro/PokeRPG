package pokerpgserver;

/**
 * ...
 * @author Beetle
 */

class GameConst {
	static inline var SPEED_HACK_N:Int = 12;
	
	static inline public var DIR_DOWN:Int = 0;
	static inline public var DIR_LEFT:Int = 1;
	static inline public var DIR_UP:Int = 2;
	static inline public var DIR_RIGHT:Int = 3;
	
	static public var LOAD_MAPS = [
	
		// 1 Pallet Town - BEGIN
		'pallet',
		'pallet_hero_home_1f',
		'pallet_hero_home_2f',
		'pallet_oaklab',
		'pallet_rival_home',
		
		// 2 Viridian City
		'viridianforest',
		'station01', // to Viridian Forest
		'poke_center01',
		'mart01',
		'station02', // to Pewter, Digglet Cave
		'viridian_house_1',
		
		// 3 Pewter City
		'pewter',
		'station03', // From to Viridan Forest,
	];
}