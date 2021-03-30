// === IMPORTS === //
// Internal //
import { Peep } from './peep';
import { Task } from './task';
import { Resource } from './resource';

// === DEFINITIONS === //
// Data Banks (Enums) //
export const BANK_PEEP = {
	// code, name, str, dex, span	<-- Peep specific stats
	// task, dur, carry, id			<-- Mutable parameters

	// Special states //
	EGG: {	// Hatching a new peep //
		code: "egg", name: "Egg", str: 0, dex: 0, int: 0, span: 0,
		task: "Egg", dur: 0, carry: 0, id: 0
	},
	CHICK: {	// Maturing a new peep //
		code: "chick", name: "Chick", str: 1, dex: 1, int: 0, span: 0,
		task: "Chick", dur: 0, carry: 0, id: 0
	},
	VOID: {	// Easter egg //
		code: "void", name: "Void", str: 9, dex: 9, int: 9, span: 0,
		task: "Idle", dur: 0, carry: 0, id: 0
	},

	// Citizens //
	BLACK_CRESTED_TITMOUSE: {
		code: "blackCrestedTitmouse", name: "Black Crested Titmouse", str: 3, dex: 3, int: 3, span: 24,
		task: "Idle", dur: 0, carry: 0, id: 0
	},
	BLUE_TIT: {
		code: "blueTit", name: "Blue Tit", str: 2, dex: 3, int: 3, span: 18,
		task: "Idle", dur: 0, carry: 0, id: 0
	},
	EUROPEAN_ROBIN: {
		code: "europeanRobin", name: "European Robin", str: 2, dex: 3, int: 3, span: 20,
		task: "Idle", dur: 0, carry: 0, id: 0
	},
	GOLDEN_CRESTED_KINGLET: {
		code: "goldenCrestedKinglet", name: "Golden Crested Kinglet", str: 2, dex: 3, int: 3, span: 16,
		task: "Idle", dur: 0, carry: 0, id: 0
	},
	HOUSE_SPARROW: {
		code: "houseSparrow", name: "House Sparrow", str: 3, dex: 3, int: 3, span: 22,
		task: "Idle", dur: 0, carry: 0, id: 0
	},
	HOUSE_WREN: {
		code: "houseWren", name: "House Wren", str: 3, dex: 3, int: 3, span: 22,
		task: "Idle", dur: 0, carry: 0, id: 0
	},
}
export const BANK_RESOURCE = {	// Enumerable for each resource available //
	FOOD:	{ code: "Food",		desc: "Resources for consumption; necessary for sustaining your Peeps." },
	NEST:	{ code: "Nest",		desc: "Resources for construction; necessary for housing and containment." },
	ORE:	{ code: "Ore",		desc: "Resources for production; necessary for tools and maintaining equipment." },
	ALCHEMY:{ code: "Alchemy",	desc: "You're not sure what this is really, but you get the feeling it will be useful later." },	// Not implemented yet //
	SKILL:	{ code: "Skill",	desc: "Resources for advancement; necessary for technology." },
}
export const BANK_TASK = {
	// code, res, tier, desc				<-- Task information and relationship
	// dur, var, yield, val, wgt, upkeep	<-- Task production specifics

	// --- Produces nothing --- //
	EGG: {	// Egg state //
		code: "Egg", res: "None", tier: 0, desc: "Shh, they need peace and quiet...",
		dur: 60, var: 30, yield: 0, val: 0, wgt: 0, upkeep: 0
	},
	CHICK: {	// Chick state //
		code: "Chick", res: "None", tier: 0, desc: "Growing up to be big and strong!",
		dur: 1440, var: 720, yield: 0, val: 0, wgt: 0, upkeep: 0
	},
	IDLE: {	// Idle state //
		code: "Idle", res: "None", tier: 0, desc: "Just chirpin' around, looking for something to do.",
		dur: 1, var: 0, yield: 0, val: 0, wgt: 0, upkeep: 0
	},

	// --- Produces Food --- //
	SEEDS: {
		code: "Seeds", res: "Food", tier: 1, desc: "A staple. Not worth much, but fundamental for healthy living.",
		dur: 60, var: 10, yield: 4, val: 1, wgt: 1, upkeep: 1
	},
	BUGS: {
		code: "Bugs", res: "Food", tier: 2, desc: "Squishy and slimy, yet satisfying! Takes a bit to catch them all.",
		dur: 240, var: 45, yield: 2, val: 12, wgt: 1, upkeep: 3
	},
	FRUIT: {
		code: "Fruit", res: "Food", tier: 3, desc: "Sweet and juicy, the perfect snack that doesn't bite back.",
		dur: 90, var: 20, yield: 3, val: 4, wgt: 1, upkeep: 2
	},
	FISH: {
		code: "Fish", res: "Food", tier: 4, desc: "Can grow to enormous sizes, fit for those who can capture them.",
		dur: 400, var: 80, yield: 1, val: 40, wgt: 8, upkeep: 5
	},
	SPICES: {
		code: "Spices", res: "Food", tier: 5, desc: "Rare to come by, so it is valuable even if not very filling.",
		dur: 1500, var: 0, yield: 1, val: 1, wgt: 1, upkeep: 1
	},

	// --- Produces Nest --- //
	WOOD: {
		code: "Wood", res: "Nest", tier: 1, desc: "Single-talonedly the best material to build a nest with.",
		dur: 90, var: 20, yield: 4, val: 1, wgt: 2, upkeep: 2
	},
	MOSS: {	// No assets yet //
		code: "Moss", res: "Nest", tier: 2, desc: "Soft and warm, perfect for the young ones.",
		dur: 150, var: 60, yield: 6, val: 2, wgt: 1, upkeep: 1
	},
	CLAY: {
		code: "Clay", res: "Nest", tier: 3, desc: "Malleable enough to adapt to any situation. Make sure you bake it!",
		dur: 240, var: 75, yield: 6, val: 8, wgt: 4, upkeep: 3
	},
	ROCKS: {
		code: "Rocks", res: "Nest", tier: 4, desc: "The most durable material, but heavy and hard to handle.",
		dur: 180, var: 90, yield: 2, val: 12, wgt: 6, upkeep: 5
	},
	GLASS: {
		code: "Glass", res: "Nest", tier: 5, desc: "Transparent and fragile, but incredibly beautiful.",
		dur: 1500, var: 0, yield: 1, val: 1, wgt: 1, upkeep: 1
	},

	// --- Produces Ore --- //
	FLINT: {
		code: "Flint", res: "Ore", tier: 1, desc: "A soft rock that's capable of sparking.",
		dur: 75, var: 45, yield: 1, val: 2, wgt: 3, upkeep: 2
	},
	COPPER: {
		code: "Copper", res: "Ore", tier: 2, desc: "A soft, malleable metal that is more workable than stone.",
		dur: 180, var: 30, yield: 1, val: 8, wgt: 5, upkeep: 3
	},
	IRON: {
		code: "Iron", res: "Ore", tier: 3, desc: "A sturdy, shiny metal useful for making tools.",
		dur: 360, var: 60, yield: 1, val: 24, wgt: 8, upkeep: 5
	},
	STEEL: {
		code: "Steel", res: "Ore", tier: 4, desc: "Refining iron has its benefits, making an incredibly strong metal.",
		dur: 900, var: 90, yield: 1, val: 80, wgt: 12, upkeep: 8
	},
	OBSIDIAN: {	// No assets yet //
		code: "Obsidian", res: "Ore", tier: 5, desc: "A material that keeps getting sharper the more it breaks.",
		dur: 1500, var: 0, yield: 1, val: 1, wgt: 1, upkeep: 1
	},

	// --- Produces Alchemy --- //
	SALT: {
		code: "Salt", res: "Alchemy", tier: 1, desc: "A great preserver, but make sure not to eat it!",
		dur: 120, var: 40, yield: 3, val: 1, wgt: 1, upkeep: 2
	},
	COAL: {
		code: "Coal", res: "Alchemy", tier: 2, desc: "A dark rock that can bring warmth and light when kindled.",
		dur: 320, var: 60, yield: 3, val: 3, wgt: 3, upkeep: 3
	},
	SULFUR: {
		code: "Sulfur", res: "Alchemy", tier: 3, desc: "Smells awful, but has incredible power locked within.",
		dur: 675, var: 75, yield: 3, val: 10, wgt: 3, upkeep: 5
	},
	OIL: {
		code: "Oil", res: "Alchemy", tier: 4, desc: "A sticky substance that is highly flammable, and potentially refinable.",
		dur: 1080, var: 90, yield: 3, val: 20, wgt: 1, upkeep: 8
	},
	GEMS: {
		code: "Gems", res: "Alchemy", tier: 5, desc: "Shiny, colorful, rare, and worth a lot in trades for some reason.",
		dur: 1500, var: 0, yield: 1, val: 1, wgt: 1, upkeep: 1
	},

	// --- Produces Skill --- //
	INSTINCT: {	// Not actually workable //
		code: "Instinct", res: "Skill", tier: 1, desc: "Knowledge that comes to you naturally. Total is limited by roll call.",
		dur: 90, var: 10, yield: 1, val: 1, wgt: 1, upkeep: 0
	},
	SONG: {	// Not actually workable //
		code: "Song", res: "Skill", tier: 2, desc: "Idle chriping with friends can lead to great scientific advancements.",
		dur: 150, var: 15, yield: 1, val: 2, wgt: 1, upkeep: 0
	},
	BOOKS: {
		code: "Books", res: "Skill", tier: 3, desc: "Reading is the best way to consistently share and preserve knowledge.",
		dur: 600, var: 90, yield: 3, val: 10, wgt: 3, upkeep: 1
	},
	MAPS: {
		code: "Maps", res: "Skill", tier: 4, desc: "You may not know where you're going, but you surely know where you've been.",
		dur: 900, var: 90, yield: 1, val: 30, wgt: 1, upkeep: 3
	},
	ARTS: {	// No assets yet //
		code: "Arts", res: "Skill", tier: 5, desc: "A labour of love, but has little practical value. A display of prosperity, surely.",
		dur: 1500, var: 0, yield: 1, val: 1, wgt: 1, upkeep: 1
	},	
}

// Maps //
export const COSTS_HOUSING: number[][] = [
	// Housing upgrades use only [Nest, Skill] //
	// 10		25			45			
	[40, 20], [120, 50], [375, 160], [700, 300], [1600, 750], [2850, 1200]
];
export const COSTS_CAPACITY: Map<Resource, number[][]> = new Map<Resource, number[][]>([
	// Capacity upgrades use only [Nest, Skill] //
	// Current Capacity		100			250			450			700			1000		1350		1750
	[BANK_RESOURCE.FOOD,	[[35, 15],	[115, 70],	[275, 195],	[550, 450],	[800, 850]]],
	[BANK_RESOURCE.NEST,	[[50, 30],	[150, 95],	[320, 260],	[650, 580],	[1000, 880]]],
	[BANK_RESOURCE.ORE,		[[70, 40],	[195, 120],	[400, 300],	[700, 640],	[1200, 950]]],
	[BANK_RESOURCE.ALCHEMY,	[[100, 60],	[270, 160],	[550, 400],	[800, 800],	[1500, 1600]]],
	[BANK_RESOURCE.SKILL,	[[25, 20],	[100, 100],	[240, 320],	[500, 700],	[750, 1200]]]
]);
export const COSTS_UPGRADE: Map<Task, number[][]> = new Map<Task, number[][]>([
	// Task upgrades use only [Ore, Skill] //
	[BANK_TASK.EGG,		[[0, 0]]],	// No upgrades available //
	[BANK_TASK.CHICK,	[[0, 0]]],	// No upgrades available //
	[BANK_TASK.IDLE,	[[0, 0]]],	// No upgrades available //

	[BANK_TASK.SEEDS,	[[25, 10],		[100, 45],		[200, 95]]],
	[BANK_TASK.BUGS,	[[75, 30],		[190, 85],		[350, 160]]],
	[BANK_TASK.FRUIT,	[[180, 100],	[360, 210],		[700, 420]]],
	[BANK_TASK.FISH,	[[350, 250],	[720, 460],		[1200, 750]]],
	[BANK_TASK.SPICES,	[[0, 0]]],	// Not yet implemented //

	[BANK_TASK.WOOD,	[[35, 20],		[140, 65],		[280, 140]]],
	[BANK_TASK.MOSS,	[[65, 40],		[200, 105],		[380, 200]]],
	[BANK_TASK.CLAY,	[[105, 60],		[270, 150],		[500, 300]]],
	[BANK_TASK.ROCKS,	[[215, 160],	[450, 340],		[800, 700]]],
	[BANK_TASK.GLASS,	[[0, 0]]],	// Not yet implemented //

	[BANK_TASK.FLINT,	[[50, 30],		[175, 80],		[350, 200]]],
	[BANK_TASK.COPPER,	[[100, 60],		[270, 150],		[500, 290]]],
	[BANK_TASK.IRON,	[[150, 90],		[350, 190],		[730, 405]]],
	[BANK_TASK.STEEL,	[[320, 185],	[750, 450],		[1350, 900]]],
	[BANK_TASK.OBSIDIAN,[[0, 0]]],	// Not yet implemented //

	[BANK_TASK.SALT,	[[70, 45],		[210, 120],		[600, 405]]],
	[BANK_TASK.COAL,	[[145, 85],		[400, 205],		[960, 640]]],
	[BANK_TASK.SULFUR,	[[260, 110],	[620, 370],		[1300, 950]]],
	[BANK_TASK.OIL,		[[400, 260],	[950, 680],		[2000, 1400]]],
	[BANK_TASK.GEMS,	[[0, 0]]],	// Not yet implemented //

	[BANK_TASK.INSTINCT,[[0, 0]]],	// No upgrades available //
	[BANK_TASK.SONG,	[[0, 0]]],	// No upgrades available //
	[BANK_TASK.BOOKS,	[[150, 200],	[600, 900],		[1600, 2400]]],
	[BANK_TASK.MAPS,	[[250, 400],	[900, 1500],	[2500, 4000]]],
	[BANK_TASK.ARTS,	[[0, 0]]],	// Not yet implemented //
]);