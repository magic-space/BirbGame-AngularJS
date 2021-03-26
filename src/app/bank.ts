// === IMPORTS === //
// Internal //
import { Peep } from './peep';
import { Task } from './task';

// === DEFINITIONS === //
// Data Banks //
export const PEEPBANK: Peep[] = 
[
	{id:0, dur:0, carry:0, str:1, dex:1, task:"Egg", code:"egg", name:"egg" },

	{id:0, dur:0, carry:0, str:4, dex:2,  task:"Idle", code:"blackCrestedTitmouse", name:"Black Crested Titmouse" },
	{id:0, dur:0, carry:0, str:3, dex:4,  task:"Idle", code:"blueTit", name:"Blue Tit" },
	{id:0, dur:0, carry:0, str:3, dex:3,  task:"Idle", code:"europeanRobin", name:"European Robin" },
	{id:0, dur:0, carry:0, str:2, dex:4,  task:"Idle", code:"goldenCrestedKinglet", name:"Golden Crested Kinglet" },
	{id:0, dur:0, carry:0, str:3, dex:2,  task:"Idle", code:"houseSparrow", name:"House Sparrow" },
	{id:0, dur:0, carry:0, str:3, dex:4,  task:"Idle", code:"houseWren", name:"House Wren" },
]
export const TASKBANK: Task[] =
[
	{ dur:30, var:15, yield:0, val:0, wgt:0, upkeep:0, code:"Egg", group:"None", name:"Hatching",
		desc:"" },
	{ dur:1, var:0, yield:0, val:0, wgt:0, upkeep:0, code:"Idle", group:"None", name:"Idling",
		desc:"" },

	{ dur:30, 	var:10,	yield:1, val:1, wgt:1, upkeep:1, code:"Seeds", group:"Food", name:"Farming",
		desc:"A staple. Not worth much, but fundamental for healthy living." }, 
	{ dur:240, 	var:45,	yield:2, val:6, wgt:2, upkeep:3, code:"Bugs", group:"Food", name:"Catching",
		desc:"Squishy and slimy, yet satisfying! Takes a bit to catch them all."  },
	{ dur:90,	var:20,	yield:4, val:3, wgt:2, upkeep:1, code:"Fruit", group:"Food", name:"Picking",
		desc:"Sweet and juicy, the perfect snack that doesn't bite back."  },
	{ dur:400, 	var:80,	yield:1, val:40, wgt:8, upkeep:5, code:"Fish", group:"Food", name:"Fishing",
		desc:"Can grow to enormous sizes, fit for those who can capture them."  },
	{ dur:1500, var:0, 	yield:10, val:1, wgt:1, upkeep:1, code:"Spices", group:"Food", name:"Spicing",
		desc:"Rare to come by, so it is valuable even if not very filling."  }, 

	{ dur:50, 	var:10,	yield:1, val:1, wgt:3, upkeep:2, code:"Wood", group:"Nest", name:"Building",
		desc:"Single-talonedly the best material to build a nest with." },
	{ dur:360, 	var:30,	yield:4, val:3, wgt:4, upkeep:3, code:"Clay", group:"Nest", name:"Building",
		desc:"Malleable enough to adapt to any situation. Make sure you bake it!"  },
	{ dur:180, 	var:20,	yield:2, val:6, wgt:6, upkeep:5, code:"Rocks", group:"Nest", name:"Building",
		desc:"The most durable material, but heavy and hard to handle."  },
	{ dur:1500,	var:0,	yield:10, val:1, wgt:3, upkeep:1, code:"Glass", group:"Nest", name:"Building",
		desc:"Transparent and fragile, but incredibly beautiful."  }, 

	{ dur:75, 	var:25,	yield:1, val:1, wgt:4, upkeep:3, code:"Coal", group:"Ore", name:"Mining",
		desc:"A dark rock that can bring warmth and light."  },
	{ dur:300, 	var:60,	yield:1, val:9, wgt:8, upkeep:5, code:"Iron", group:"Ore", name:"Mining",
		desc:"A sturdy, shiny metal useful for making tools."  },
	{ dur:750, 	var:90,	yield:1, val:50, wgt:12, upkeep:8, code:"Steel", group:"Ore", name:"Smelting",
		desc:"Refining Iron has its benefits."  },
	{ dur:1500,	var:0,	yield:10, val:1, wgt:1, upkeep:3, code:"Gems", group:"Ore", name:"Mining",
		desc:"Shiny, rare, and worth a lot in trade."  },

	{ dur:45, 	var:30,	yield:1, val:1, wgt:1, upkeep:0, code:"Instinct", group:"Skill", name:"Thinking",
		desc:"Knowledge that comes to you naturally. Total is limited by roll call."  }, 
	{ dur:90, 	var:60,	yield:1, val:1, wgt:1, upkeep:0, code:"Song", group:"Skill", name:"Singing",
		desc:"Idle chriping with friends can lead to great scientific advancements."  },
	{ dur:320, 	var:80,	yield:1, val:20, wgt:3, upkeep:1, code:"Books", group:"Skill", name:"Writing",
		desc:"Reading is the best way to consistently share and preserve knowledge."  },
	{ dur:900, 	var:90,	yield:1, val:50, wgt:2, upkeep:2, code:"Maps", group:"Skill", name:"Exploring",
		desc:"You may not know where you're going, but you surely know where you've been."  }
]

export const UPGCOSTMAP:Map<string, number[][]> = new Map<string, number[][]>([
	// Costs are in [Food / Nest / Ore / Skill] //

	// -- Capacity Upgrades -- //
	["House", 	[[0,40,0,20], [0,120,0,50], [0,375,0,160], [0,700,0,300], [0,1600,0,750], [0,2850,0,1200]]],

	// 				100, 		  250, 		    450, 		  700,				1000
	["Food", 	[[0,35,0,15], [0,115,0,70], [0,275,0,195], [0,550,0,450], [0,800,0,850]]],
	["Nest", 	[[0,50,0,30], [0,150,0,95], [0,320,0,260], [0,650,0,580], [0,1000,0,880]]],
	["Ore", 	[[0,70,0,40], [0,195,0,120], [0,400,0,300], [0,700,0,640], [0,1200,0,950]]],
	["Skill", 	[[0,25,0,20], [0,100,0,100], [0,240,0,320], [0,500,0,700], [0,750,0,1200]]],

	// -- Production Upgrades -- //
	["Seeds",	[[0,0,25,10], [0,0,100,45], [0,0,200,95]]],
	["Bugs",	[[0,0,75,30], [0,0,190,85], [0,0,350,160]]],
	["Fruit",	[[0,0,180,100], [0,0,360,210], [0,0,700,420]]],
	["Fish",	[[0,0,350,250], [0,0,720,460], [0,0,1200,750]]],
	["Spices",	[[0,0,0,0]]],	// Not yet implemented //

	["Wood",	[[0,0,35,20], [0,0,140,65], [0,0,280,140]]],
	["Clay",	[[0,0,105,60], [0,0,270,150], [0,0,500,300]]],
	["Rocks",	[[0,0,215,160], [0,0,450,340], [0,0,800,700]]],
	["Glass",	[[0,0,0,0]]],	// Not yet implemented //

	["Coal",	[[0,0,50,35], [0,0,200,95], [0,0,420,215]]],
	["Iron",	[[0,0,150,90], [0,0,350,190], [0,0,730,405]]],
	["Steel",	[[0,0,320,185], [0,0,750,450], [0,0,1350,900]]],
	["Gems",	[[0,0,0,0]]],	// Not yet implemented //

	["Instinct",[[]]],	// No upgrades available //
	["Song",	[[]]],	// No upgrades available //
	["Books",	[[0,0,150,200], [0,0,600,900], [0,0,1600,2400]]],
	["Maps",	[[0,0,250,400], [0,0,900,1500], [0,0,2500,4000]]],
]) 

// Data Maps //
export const PEEPMAP: Map<string, Peep> = new Map<string, Peep>([
	[PEEPBANK[0].code, PEEPBANK[0]],	// Egg 						//
	[PEEPBANK[1].code, PEEPBANK[1]],	// Black Crested Titmouse 	//
	[PEEPBANK[2].code, PEEPBANK[2]],	// Blue Tit 				//
	[PEEPBANK[3].code, PEEPBANK[3]],	// European Robin 			//
	[PEEPBANK[4].code, PEEPBANK[4]],	// Golden Crested Kinglet 	//
	[PEEPBANK[5].code, PEEPBANK[5]],	// House Sparrow 			//
	[PEEPBANK[6].code, PEEPBANK[6]],	// House Wren 				//
])
export const TASKMAP: Map<string, Task> = new Map<string, Task>([
	[TASKBANK[0].code, TASKBANK[0]],	// Egg 		//
	[TASKBANK[1].code, TASKBANK[1]],	// Idle 	//

	[TASKBANK[2].code, TASKBANK[2]],	// Seeds 	//
	[TASKBANK[3].code, TASKBANK[3]],	// Bugs 	//
	[TASKBANK[4].code, TASKBANK[4]],	// Fruit 	//
	[TASKBANK[5].code, TASKBANK[5]],	// Fish 	//
	[TASKBANK[6].code, TASKBANK[6]],	// Spices 	//

	[TASKBANK[7].code, TASKBANK[7]],	// Wood 	//
	[TASKBANK[8].code, TASKBANK[8]],	// Clay 	//
	[TASKBANK[9].code, TASKBANK[9]],	// Rocks 	//
	[TASKBANK[10].code, TASKBANK[10]],	// Glass 	//

	[TASKBANK[11].code, TASKBANK[11]],	// Coal		//
	[TASKBANK[12].code, TASKBANK[12]],	// Iron		//
	[TASKBANK[13].code, TASKBANK[13]],	// Steel	//
	[TASKBANK[14].code, TASKBANK[14]],	// Gems		//

	[TASKBANK[15].code, TASKBANK[15]],	// Instinct	//
	[TASKBANK[16].code, TASKBANK[16]],	// Song		//
	[TASKBANK[17].code, TASKBANK[17]],	// Books	//
	[TASKBANK[18].code, TASKBANK[18]],	// Maps		//
])