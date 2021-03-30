// =============== //
// === IMPORTS === //
// =============== //
// External //
import { Injectable } from '@angular/core';

// Internal //
import { Task } from './task';
import { Resource } from './resource';

import { BANK_TASK, BANK_RESOURCE } from './bank';

import { PeepService } from './peep.service';
import { TaskService } from './task.service';
import { ResourceService } from './resource.service';

// ========================== //
// === SERVICE DEFINITION === //
// ========================== //
@Injectable({
  providedIn: 'root'
})
export class PlayerService
{	// ------------------ //
	// --- Parameters --- //
	Clock:number = 0;

	// --------------- //
	// --- Methods --- //
	constructor(
		public peepService: PeepService,
		public taskService: TaskService,
		public resourceService: ResourceService
	) { }

	// Informative //
	Unlocked(task: Task): boolean
	{	// Determines which tasks have been unlocked based on various criteria //
		switch(task.res)
		{
			case "Food":	return this.Unlock_Food(task);
			case "Nest":	return this.Unlock_Nest(task);
			case "Ore":		return this.Unlock_Ore(task);
			case "Alchemy": return this.Unlock_Alchemy(task);	// Not yet implemented //
			case "Skill":	return this.Unlock_Skill(task);
			default:		return true;
		}
	}

	Unlock_Food(task: Task): boolean
	{	// Food unlocks are based on total peep travel distance. Effectively, more food options are available the more you've explored //
		let dist = this.peepService.PeepDist;

		// Switch statement //
		switch(task)
		{
			case BANK_TASK.SEEDS:	return dist >= 10;		// Oh wait, we have to eat, don't we!?									//
			case BANK_TASK.BUGS:	return dist >= 100;		// Those bugs start looking tasty... maybe we could hunt them?			//
			case BANK_TASK.FRUIT:	return dist >= 1000;	// While out and about, there were some berries that looked delicious!	//
			case BANK_TASK.FISH:	return dist >= 10000;	// Going even further, large animals appeared in the water...			//
			case BANK_TASK.SPICES:	return dist >= 100000;	// We've travelled the world by now...									//
			default:				return false;
		}
	}
	Unlock_Nest(task: Task): boolean
	{	// Nest unlocks are based on the total number of capacity upgrades you've performed. //
		let peeps = this.peepService.Peeps.length;
		let capUpgrades = this.peepService.Upgrades;
		for(let res of this.resourceService.Resources)
			capUpgrades += this.resourceService.Upgrades.get(res) as number;

		// Switch statement //
		switch(task)
		{
			case BANK_TASK.WOOD:	return peeps >= 2;			// We need two peeps to make a family.						//
			case BANK_TASK.MOSS:	return capUpgrades >= 5;	// Versatility can be increased with softer materials.		//
			case BANK_TASK.CLAY:	return capUpgrades >= 15;	// The malleability will certainly come in handy!			//
			case BANK_TASK.ROCKS:	return capUpgrades >= 30;	// The stability of rocks cannot be matched.				//
			case BANK_TASK.GLASS:	return capUpgrades >= 50;	// We're so experienced we can build with fragile things	//
			default:				return false;
		}
	}
	Unlock_Ore(task: Task): boolean
	{	// Ore unlocks are based on the total number of production upgrades you've performed. //
		let peeps = this.peepService.Peeps.length;
		let prodUpgrades = 0;
		for(let task of this.taskService.Tasks)
			prodUpgrades += this.taskService.Upgrades.get(task) as number;

		// Switch statement //
		switch(task)
		{
			case BANK_TASK.FLINT:	return peeps >= 10;			// Someone found something we can make tools out of!				//
			case BANK_TASK.COPPER:	return prodUpgrades >= 10;	// This bends easily, but doesn't fracture like rocks...			//
			case BANK_TASK.IRON:	return prodUpgrades >= 20;	// A magnetic material more durable and stronger than copper!		//
			case BANK_TASK.STEEL:	return prodUpgrades >= 35;	// We refined the iron we had and it outperformed it's predecessor! //
			case BANK_TASK.OBSIDIAN:return prodUpgrades >= 90;	// The more we break it, the sharper it gets!						//
			default:				return false;
		}
	}
	Unlock_Alchemy(task: Task): boolean
	{	// Alchemy unlocks are based on overall game progress. //
		let unlocks = 0;
		let highunlocks = 0;
		for(let t of Object.values(BANK_TASK))
		{	// This doesn't count alchemy unlocks //
			if(t.res === "Alchemy") continue;

			if((this.Unlocked(t)) && (t.tier === 5))	highunlocks++;
			else if(this.Unlocked(t))					unlocks++;
		}

		// Switch statement //
		switch(task)
		{
			case BANK_TASK.SALT:	return unlocks === 20;		// We've discovered everything else!	//
			case BANK_TASK.COAL:	return highunlocks >= 1;	// One of four...						//
			case BANK_TASK.SULFUR:	return highunlocks >= 2;	// Two of four...						//
			case BANK_TASK.OIL:		return highunlocks >= 3;	// Three of four...						//
			case BANK_TASK.GEMS:	return highunlocks >= 4;	// Four of four!						//
			default:				return false;
		}
	}
	Unlock_Skill(task: Task): boolean
	{	// Skill unlocks are based on the total number of peeps present. //
		let peeps = this.peepService.Peeps.length;

		// Switch statement //
		switch(task)
		{
			case BANK_TASK.INSTINCT:return peeps >= 1;		// It'll always be there with you					//
			case BANK_TASK.SONG:	return peeps >= 2;		// Once there's someone else to talk to				//
			case BANK_TASK.BOOKS:	return peeps >= 40;		// It's getting hard to keep track of everything	//
			case BANK_TASK.MAPS:	return peeps >= 100;	// It's getting too cramped in here!				//
			case BANK_TASK.ARTS:	return peeps >= 200;	// Not yet implemented								//
			default:				return false;
		}
	}
}
