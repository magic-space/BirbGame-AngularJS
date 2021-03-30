// =============== //
// === IMPORTS === //
// =============== //
// External //
import { Injectable } from '@angular/core';

// Internal //
import { Peep } from './peep';
import { Task } from './task';
import { BANK_PEEP, BANK_TASK, COSTS_HOUSING } from './bank';

// ========================== //
// === SERVICE DEFINITION === //
// ========================== //
@Injectable({ providedIn: 'root' })
export class PeepService
{	// ------------------ //
	// --- Parameters --- //
	Peeps: Peep[] = [];
	PeepCost: number[] = [10, 0, 0, 0, 0]
	PeepDist: number = 0;

	Capacity: number = 10;	// Total number of Peeps allowed //

	Upgrades: number = 0;
	UpgradeCosts: number[] = [0, 0, 0, 0, 0];

	// --------------- //
	// --- Methods --- //
	constructor() { }
	Init()
	{	// Set peep capacity //
		this.Capacity = 10;
		for(let u = 0; u < this.Upgrades; u++)
			this.Capacity += 10 + 5 * (u + 1);

		// Set upgrade costs //
		this.UpgradeCosts = [0, 0, 0, 0, 0];
		this.UpgradeCosts[1] = COSTS_HOUSING[this.Upgrades][0];
		this.UpgradeCosts[4] = COSTS_HOUSING[this.Upgrades][1];
	}

	// Mutators //
	Make_Egg(): Peep
	{	// Pick a random hatch time //
		let hatchTime = Math.floor(BANK_TASK.EGG.dur + 2 * BANK_TASK.EGG.var * (Math.random() - 0.5));

		// Create the new peep as an egg //
		let id = 0;
		if(this.Peeps.length) // Make sure there's a peep in there first //
			id = this.Peeps[this.Peeps.length - 1].id + 1; // ID can just be one more than the last peep in the list //

		let egg = Object.assign({}, BANK_PEEP.EGG); // Default egg properties //
		egg.id = id;          // Set ID             //
		egg.dur = hatchTime;  // Set time to hatch  //

		// Append the egg into the list and return it //
		this.Peeps.push(egg);
		return egg;

	}
	Make_Chick(egg: Peep): Peep
	{	// Randomly determine the species for this peep //
		let species = Math.floor((Object.keys(BANK_PEEP).length - 2) * Math.random()) + 2;  // Avoid the "Egg" and "Chick" //
		for(let roll = 0; roll < 4; roll++)
		{	// Re-roll the peep if it landed on the Void birb //
			if(species === 2)	species = Math.floor((Object.keys(BANK_PEEP).length - 2) * Math.random()) + 2;
			else				continue;
		}

		// Pick a random maturity time //
		let matureTime = Math.floor(BANK_TASK.CHICK.dur + 2 * BANK_TASK.CHICK.var * (Math.random() - 0.5));

		// Make the new peep, but keep the same id //
		let peep = Object.assign({}, Object.values(BANK_PEEP)[species] as Peep);
		let chick = Object.assign({}, BANK_PEEP.CHICK);

		chick.id = egg.id;   // Set ID //
		chick.str = peep.str; // Pass the stats to the chick //
		chick.dex = peep.dex;
		chick.int = peep.int;
		chick.span = peep.span / 2;	// They're a little smaller :) //
		chick.name = peep.code; // So we can retrieve it later //
		chick.dur = matureTime;

		// Inject the egg into the peep list //
		this.Peeps[this.Peeps.findIndex(p => p.id === egg.id)] = chick;
		return chick;
	}
	Make_Peep(chick: Peep): Peep
	{	// Pull the species from the chick //
		let speciesCode = chick.name;

		// Make the new peep, but keep the same id //
		let peep = Object.assign({}, Object.values(BANK_PEEP).find(p => p.code == speciesCode) as Peep);
		peep.id = chick.id;   // Set ID //

		// Inject the chick into the peep list //
		this.Peeps[this.Peeps.findIndex(p => p.id === chick.id)] = peep;
		return peep;
	}

	SetTask(task: Task): void
	{	// Sets the first available idle peep to this task //
		let idlePeeps = this.PeepsByTask(BANK_TASK.IDLE);
		if(idlePeeps.length)
		{ // Assign the task to the first peep available //
			let idx = this.Peeps.indexOf(idlePeeps[0])
			this.Peeps[idx].task = task.code;

			// Reset the carry capacity //
			this.Peeps[idx].carry = 0;

			// Set up a new task duration //
			this.Peeps[idx].dur = task.dur + Math.floor(2 * task.var * (Math.random() - 0.5));
		}
	}
	SetIdle(task: Task): void
	{	// Sets the first working peep in the given task to idle //
		let taskPeeps = this.PeepsByTask(task);
		if(taskPeeps.length)
		{ // Remove the task from the first peep available //
			let idx = this.Peeps.indexOf(taskPeeps[0])
			this.Peeps[idx].task = BANK_TASK.IDLE.code;

			// Reset the carry capacity and duration //
			this.Peeps[idx].carry = 0;
			this.Peeps[idx].dur = 0;
		}
	}

	// Accessors //
	PeepsByTask(task: Task): Peep[]
	{	// Return a list of peeps that are currently performing the given task //
		return this.Peeps.filter(p => p.task == task.code);
	}

	// Informative //
	CanUpgrade(): boolean
	{
		return this.Upgrades < COSTS_HOUSING.length;
	}
	UpgradeDelta(): number { return 10 * (this.Upgrades + 1); }

	// Game Loop //
	Update(): void
	{	// Get each peep's icon and move accordingly //
		for(let p of this.Peeps)
		{ // Get the peep's icon //
			let peepIcons = document.getElementsByName(p.id.toString());
			if(!peepIcons.length) continue;
			let peepIcon = peepIcons[0];

			// Set its position and orientation if we cannot get it //
			let x = 50 * Math.random() + 25;
			let y = 50 * Math.random() + 25;
			let sx = 1;

			if(peepIcon.style.left) x = parseFloat(peepIcon.style.left.split('%')[0]);
			if(peepIcon.style.top) y = parseFloat(peepIcon.style.top.split('%')[0]);
			if(peepIcon.style.transform) sx = parseFloat(peepIcon.style.transform.split('(')[0].split(')')[0]);

			// Get the velocity //
			let vx = (p.dex - 1) * Math.tan(Math.PI / 2 * (Math.random() - 0.5)) ** 5;
			let vy = (p.dex - 1) * Math.tan(Math.PI / 2 * (Math.random() - 0.5)) ** 5;

			// -- Make the peep move, but only sometimes -- //
			if(Math.random() < 0.05 * p.dex && p.task !== "Egg")
			{	// Set the x-scale to flip the peep if need be //
				if(Math.abs(vx) > 0.05) sx = (vx > 0 ? +1 : -1);

				// Pick a different orientation based on the y velocity //
				if(vy > 0.05) peepIcon.className = 'PEEP FRONT';
				else if(vy < -0.05) peepIcon.className = 'PEEP BACK';
				else peepIcon.className = 'PEEP SIDE';

				// Make sure that the peep is kept in bounds when moving //
				if((5 < x + vx) && (x + vx < 95)) peepIcon.style.left = (x + vx) + '%';
				if((5 < y + vy) && (y + vy < 90)) peepIcon.style.top = (y + vy) + '%';
				peepIcon.style.transform = 'scaleX(' + sx + ')';

				// Add this distance to the total peep distance travelled //
				this.PeepDist += Math.floor(Math.sqrt(vx * vx + vy * vy));
			}
		}
	}
}