// =============== //
// === IMPORTS === //
// =============== //
// External //
import { Component, OnInit, ɵɵsetComponentScope } from '@angular/core';
import { ThisReceiver } from '@angular/compiler';
import { CookieService, CookieOptions } from 'ngx-cookie';

// Internal //
import { Peep } from '../peep';
import { Task } from '../task';
import { Resource } from '../resource';

import { BANK_TASK, BANK_RESOURCE, COSTS_HOUSING, COSTS_CAPACITY, COSTS_UPGRADE, BANK_PEEP } from '../bank';

import { PeepService } from '../peep.service';
import { TaskService } from '../task.service';
import { ResourceService } from '../resource.service';
import { PlayerService } from '../player.service';

import { PeepComponent } from '../peep/peep.component';
import { TaskComponent } from '../task/task.component';
import { ResourceComponent } from '../resource/resource.component';

// ============================ //
// === COMPONENT DEFINITION === //
// ============================ //
@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit 
{	// ---
	// --- Parameters --- //
	Peeps: PeepComponent[] = [];

	// -- Methods -- //
	constructor(
		private cookieService: CookieService,
		public peepService: PeepService,
		public taskService: TaskService,
		public resourceService: ResourceService,
		public playerService: PlayerService
	) { }
	ngOnInit(): void 
	{ // Add a new peep and start the game loop //
		if(!this.Load())  // New game! //
		{	// Make a new peep //
			let newPeep = new PeepComponent(this.taskService);
			newPeep.peep = this.peepService.Make_Egg();
			this.Peeps.push(newPeep);
		}

		setInterval( () => this.Update(), 2000/24 );
		setInterval( () => this.Save(), 10000 );
	}

	// Information //
	PeepsInTask(task: string): number
	{ return this.peepService.PeepsByTask(Object.values(BANK_TASK).find(t => t.code === task) as Task).length; }
	ResAvailable(res: Resource): boolean
	{ return this.resourceService.TasksOf(res).some(t => this.playerService.Unlocked(t)); }
	ResPosition(res: Resource): number
	{	// Determine how many resources are present //
		let resAvail = [];
		for(let r of Object.values(BANK_RESOURCE))
			if(this.ResAvailable(r)) resAvail.push(r);

		// Find and return the index of this resource //
		return resAvail.indexOf(res);
	}

	// Interaction //
	AddPeep(): void
	{	// Check if there's resources and if there is housing available //
		if(!this.resourceService.CanBuy(this.peepService.PeepCost)) return;
		if(this.peepService.Peeps.length === this.peepService.Capacity) return;

		// Spend the associated resources //
		this.resourceService.Spend(this.peepService.PeepCost);

		// Update the peep creation cost //
		let peeps = this.peepService.Peeps.length;
		this.peepService.PeepCost[0] = Math.floor(10 + (Math.sqrt(peeps) * (peeps - 1)) / 2);
		
		// Make the peep //
		let newPeep = new PeepComponent(this.taskService);
		newPeep.peep = this.peepService.Make_Egg();
		this.Peeps.push(newPeep);
	}
	AddHouse(): void
	{	// Check if there's resources and if there's upgrades available //
		if(!this.resourceService.CanBuy(this.peepService.UpgradeCosts)) return;
		if(!this.peepService.CanUpgrade()) return;

		// Increase the upgrade marker //
		let upgLv = this.peepService.Upgrades;
		this.peepService.Upgrades++;

		// Increase the housing capacity //
		let upgDelta = 10 + 5 * (upgLv + 1);
		this.peepService.Capacity += upgDelta;

		// Spend the associated resources //
		this.resourceService.Spend(this.peepService.UpgradeCosts);

		// Update the upgrade costs //
		this.peepService.UpgradeCosts = [0, 0, 0, 0, 0];
		this.peepService.UpgradeCosts[1] = COSTS_HOUSING[this.peepService.Upgrades][0];
		this.peepService.UpgradeCosts[4] = COSTS_HOUSING[this.peepService.Upgrades][1];
	}

	// Game Loop //
	Update(): void
	{	// ----------------------- //
		// --- Once per day... --- //
		if(this.playerService.Clock % 24 === 0)
		{	// Compile the current upkeep and consume it //
			let upkeep = [];
			for(let r of this.resourceService.Resources)
				upkeep.push(this.resourceService.Upkeep(r));
				
			this.resourceService.Spend(upkeep);
		}

		// --------------------------- //
		// --- Every clock tick... --- //
		// The peeps produce //
		for(let peep of this.peepService.Peeps)
		{	// Get the current task //
			let peepTask = Object.values(BANK_TASK).find(t => t.code === peep.task) as Task;
			if(!this.playerService.Unlocked(peepTask)) continue;

			// Change behavior based on the current task and the state of the peep //
			if(peepTask === BANK_TASK.EGG)
			{	// Bring it one step closer to hatching //
				peep.dur--;

				// Check if this causes the egg to hatch //
				if(peep.dur === 0)
				{	// Make this chick into a peep //
					let newChick = this.peepService.Make_Chick(peep);

					// Insert the new peep into the PeepComponents //
					let newChick_ = this.peepService.Peeps.filter(p => p.id === newChick.id)[0];
					let newIdx = this.peepService.Peeps.indexOf(newChick_);
					this.Peeps[newIdx].peep = newChick;
				}
			}
			else if(peepTask === BANK_TASK.CHICK)
			{	// Peeps mature at different rates //
				peep.dur = Math.max(0, peep.dur - peep.int);

				// Check if this causes the peep to mature //
				if(peep.dur === 0)
				{	// Make this chick into a peep //
					let newPeep = this.peepService.Make_Peep(peep);

					// Insert the new peep into the PeepComponents //
					let newPeep_ = this.peepService.Peeps.filter(p => p.id === newPeep.id)[0];
					let newIdx = this.peepService.Peeps.indexOf(newPeep_);
					this.Peeps[newIdx].peep = newPeep;
				}
			}
			else if(peepTask === BANK_TASK.IDLE)
			{	// Song production between idle peeps //
				let songUnits = this.taskService.Units.get(BANK_TASK.SONG) as number;
				let skillUnits = this.resourceService.TotalUnits.get(BANK_RESOURCE.SKILL) as number;
				let skillCap = this.resourceService.Capacity.get(BANK_RESOURCE.SKILL) as number;

				// Roll for the song effect //
				let idlePeeps = this.peepService.PeepsByTask(BANK_TASK.IDLE).length;
				let songChance = (BANK_TASK.SONG.dur * Math.sqrt(songUnits)) * Math.random();
				if((songChance < idlePeeps - 1) && (skillUnits < skillCap))
				{	// Add a song unit //
					this.taskService.Units.set(BANK_TASK.SONG, songUnits + BANK_TASK.INSTINCT.yield);
					this.resourceService.Update_Amounts();
				}
			}
			else if(peep.dur !== -1)
			{	// Currently producing resources //
				peep.dur = Math.max(0, peep.dur - peep.dex);

				// Check if this causes the peep to finish //
				if(peep.dur === 0)
				{	// Acquire goods according to task yield and peep strength //
					let upgLv = this.taskService.Upgrades.get(peepTask) as number;
					let bonusYield = this.taskService.BonusYield(peepTask);
					let bonusCarry = this.taskService.BonusCarry(peepTask);

					// Roll for effectiveness //
					let cargo = (peepTask.yield + bonusYield) + Math.ceil(peep.str * Math.random());
					peep.carry = Math.min((4 + bonusCarry) * peep.str, peep.carry + cargo);

					// Check if this puts us at the carry capacity //
					if(peep.carry === (4 + bonusCarry) * peep.str)
					{	// Begin emptying //
						peep.dur = -1;
					}
					else
					{	// Reset the duration //
						let bonusDuration = this.taskService.BonusDuration(peepTask);
						let tempDuration = peepTask.dur + 2 * peepTask.var * (Math.random() - 0.5);
						peep.dur = Math.ceil(tempDuration * bonusDuration);
					}

					// Adjust the PeepComponent's cargo to suit //
					/*	// - Currently not working //
					let idx = this.peepService.Peeps.indexOf(peep);
					this.Peeps[idx].peep = peep;
					this.Peeps[idx].Update();
					*/
				}
			}
			else if((peep.carry > 0) && (peep.dur === -1))
			{	// Unload current cargo one each clock cycle if able //
				let thisResource = Object.values(BANK_RESOURCE).find(r => r.code == peepTask.res) as Resource;
				let totalUnits = this.resourceService.TotalUnits.get(thisResource) as number;
				let totalCapacity = this.resourceService.Capacity.get(thisResource) as number;

				if(totalUnits < totalCapacity)
				{
					let taskUnits = this.taskService.Units.get(peepTask) as number;
					this.taskService.Units.set(peepTask, taskUnits + 1);
					peep.carry--;

					// Reset the timer if we are finished unloading //
					if(peep.carry === 0)
					{
						let bonusDuration = this.taskService.BonusDuration(peepTask);
						let tempDuration = peepTask.dur + 2 * peepTask.var * (Math.random() - 0.5);
						peep.dur = Math.floor(tempDuration * bonusDuration);
					}

					// Update the resource amounts //
					this.resourceService.Update_Amounts();

					// Adjust the PeepComponent's cargo to suit //
					/*	// - Currently not working //
					let idx = this.peepService.Peeps.indexOf(peep);
					this.Peeps[idx].peep = peep;
					this.Peeps[idx].Update();
					*/
				}
			}

			// Instinct production //
			if(peepTask !== BANK_TASK.EGG)
			{	// Instinct production is capped at 10 times the number of peeps present //
				let instUnits = this.taskService.Units.get(BANK_TASK.INSTINCT) as number;
				let skillUnits = this.resourceService.TotalUnits.get(BANK_RESOURCE.SKILL) as number;
				let skillCap = this.resourceService.Capacity.get(BANK_RESOURCE.SKILL) as number;

				// Chicks produce instinct *notoriously* fast //
				let instTimer = BANK_TASK.INSTINCT.dur + 2 * BANK_TASK.INSTINCT.var * (Math.random() - 0.5);
				if(peepTask === BANK_TASK.CHICK) instTimer = Math.sqrt(instTimer);

				// Roll for instinct //
				if((Math.random() < 1 / instTimer) &&
					(instUnits < 10 * this.peepService.Peeps.length) &&
					(skillUnits < skillCap))
				{	// Add an instinct unit //
					this.taskService.Units.set(BANK_TASK.INSTINCT, instUnits + BANK_TASK.INSTINCT.yield);
					this.resourceService.Update_Amounts();
				}
			}
		}

		// Make the peeps move //
		this.peepService.Update();

		// Update the resource display just in case //
		this.resourceService.Update_Amounts();

		// Update the clock //
		this.playerService.Clock++;
	}

	// I/O //
	WipeSave(): void
	{	// Prompt the user to make sure that they want to wipe their save /
		var retVal = confirm("Are you sure you want to erase your save data?")
		if(retVal)
		{
			localStorage.clear();
			location.reload();
		}
	}
	Load(): boolean
	{	// Load all items from localStorage //
		let peeps = localStorage.getItem("Peep_List");
		let upgHouse = localStorage.getItem("Peep_Upgrades");

		let units = localStorage.getItem("Task_Units");
		let upgProd = localStorage.getItem("Task_Upgrades");

		let upgCap = localStorage.getItem("Res_Upgrades");

		let stats = localStorage.getItem("Player_Stats");	// [Clock, PeepDist]

		// Make sure that each item is present in storage //
		if((stats === null) || (peeps === null) || (units === null) ||
			(upgHouse === null) || (upgProd === null) || (upgCap === null))
		{	// Something isn't there or got corrupted. Prompt the user //
			alert("Some save data could not be found or is corrupted. Starting a new game.");

			// Initialize each service //
			this.peepService.Init();
			this.taskService.Init();
			this.resourceService.Init();

			// Kick back //
			return false;
		}

		// We can then proceed to parse the objects as strings //
		stats = stats as string;
		peeps = peeps as string;
		units = units as string;
		upgHouse = upgHouse as string;
		upgProd = upgProd as string;
		upgCap = upgCap as string;

		// Parse peepService items //
		this.peepService.Upgrades = parseInt(upgHouse);
		let peeps_split = peeps.split('|').slice(0, -1);
		for(let p = 0; p < peeps_split.length; p++)
		{ // Parse out the peep object //
			let peep = JSON.parse(peeps_split[p]) as Peep;
			this.peepService.Peeps.push(peep);

			// Add a peep component //
			let newPeep = new PeepComponent(this.taskService);
			newPeep.peep = peep;
			this.Peeps.push(newPeep);
		}
		this.peepService.Init();

		// Parse taskService items //
		let units_split = units.split(' ').slice(0, -1);
		let upgProd_split = upgProd.split(' ').slice(0, -1);
		for(let task of Object.values(BANK_TASK))
		{	// Get some values beforehand //
			let tidx = Object.values(BANK_TASK).indexOf(task);
			let upgLv = parseInt(upgProd_split[tidx]);

			// Set the units //
			this.taskService.Units.set(task, parseInt(units_split[tidx]));

			// Set the upgrade marker //
			this.taskService.Upgrades.set(task, upgLv);
		}
		this.taskService.Init();

		// Parse resourceService items //
		let upgCap_split = upgCap.split(' ').slice(0, -1);
		for(let res of Object.values(BANK_RESOURCE))
		{	// Get some values beforehand //
			let ridx = Object.values(BANK_RESOURCE).indexOf(res);
			let upgLv = parseInt(upgCap_split[ridx]);

			// Set the upgrade marker //
			this.resourceService.Upgrades.set(res, upgLv);
		}
		this.resourceService.Init();
		

		// Parse player stats //
		let stats_split = stats.split(' ');
		this.playerService.Clock = parseInt(stats_split[0]);
		this.peepService.PeepDist = parseInt(stats_split[1]);

		// Everything worked out fine! //
		console.log("Game loaded successfully!");
		return true;
	}
	Save(): void
	{	// Save peepService items //
		localStorage.setItem("Peep_Upgrades", '' + this.peepService.Upgrades);

		let peepStr = "";
		for(let peep of this.peepService.Peeps)
			peepStr += JSON.stringify(peep) + "|";
		localStorage.setItem("Peep_List", peepStr);

		// Save taskService items //
		let unitsStr = "";
		let upgProdStr = "";
		for(let task of Object.values(BANK_TASK))
		{
			unitsStr += (this.taskService.Units.get(task) as number) + " ";
			upgProdStr += (this.taskService.Upgrades.get(task) as number) + " ";
		}
		localStorage.setItem("Task_Units", unitsStr);
		localStorage.setItem("Task_Upgrades", upgProdStr);

		// Save resourceService items //
		let upgCapStr = "";
		for(let res of Object.values(BANK_RESOURCE))
			upgCapStr += (this.resourceService.Upgrades.get(res) as number) + " ";
		localStorage.setItem("Res_Upgrades", upgCapStr)

		// Save playerService items //
		localStorage.setItem("Player_Stats", this.playerService.Clock + ' ' + this.peepService.PeepDist);

		// Write to console //
		console.log("Game saved successfully!");
	}
}
