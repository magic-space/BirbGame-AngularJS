// =============== //
// === IMPORTS === //
// =============== //
// External //
import { Injectable } from '@angular/core';

// Internal //
import { Task } from './task';
import { Resource } from './resource';

import { BANK_RESOURCE, BANK_TASK, COSTS_CAPACITY } from './bank';

import { PeepService } from './peep.service';
import { TaskService } from './task.service';

// ========================== //
// === SERVICE DEFINITION === //
// ========================== //
@Injectable({
  providedIn: 'root'
})
export class ResourceService
{	// ------------------ //
	// --- Parameters --- //
	Resources: Resource[] = Object.values(BANK_RESOURCE);

	Amount: Map<Resource, number> = new Map<Resource, number>();
	TotalUnits: Map<Resource, number> = new Map<Resource, number>();
	Capacity: Map<Resource, number> = new Map<Resource, number>();

	Upgrades: Map<Resource, number> = new Map<Resource, number>();
	UpgradeCosts: Map<Resource, number[]> = new Map<Resource, number[]>();
	UpgradeDelta: Map<Resource, number> = new Map<Resource, number>();

	// --------------- //
	// --- Methods --- //
	constructor(
		private peepService: PeepService,
		private taskService: TaskService
	)
	{	// Parameter definitions //
		for(let r of Object.values(BANK_RESOURCE))
		{
			this.Upgrades.set(r, 0);
			this.UpgradeCosts.set(r, [0, 0, 0, 0, 0]);
			this.UpgradeDelta.set(r, 0);
		}

		// The amounts and units will get populated with the update function //
		this.Update_Capacity();
		this.Update_Amounts();
	}
	Init()
	{
		for(let res of Object.values(BANK_RESOURCE))
		{	// Quality of life substitution //
			let upgLv = this.Upgrades.get(res) as number;

			// Set the upgrade costs //
			let costs = [0, 0, 0, 0, 0];
			costs[1] = (COSTS_CAPACITY.get(res) as number[][])[upgLv][0];
			costs[4] = (COSTS_CAPACITY.get(res) as number[][])[upgLv][1];
			this.UpgradeCosts.set(res, costs)

			// Set the upgrade deltas //
			this.UpgradeDelta.set(res, 100 + 50 * (upgLv + 1));
		}
		// Update the capacity and amounts //
		this.Update_Capacity();
		this.Update_Amounts();
	}

	// Mutators //
	Spend(cost: number[]): void
	{	// Spends resources from lowest to highest tier //
		for(let r = 0; r < this.Resources.length; r++)
		{	// Get the debt for this resource //
			let debt = cost[r];

			// Go through each resource in this resource group from lowest to highest value //
			let taskGroup = Object.values(BANK_TASK).filter(t => t.res === this.Resources[r].code);
			taskGroup.sort(t => t.tier);
			if(taskGroup[0].tier > taskGroup[1].tier) taskGroup = taskGroup.reverse();

			// Spend it! //
			for(let t = 0; t < taskGroup.length; t++)
			{ // Calculate how many units are required from this resource //
				let consume = Math.ceil(debt / taskGroup[t].val);
				let units = this.taskService.Units.get(taskGroup[t]) as number;

				// Subtract the consumption from the supply //
				if(units < consume) consume = units;

				// Consume that many units and move down to the next resource value //
				debt -= consume * taskGroup[t].val;

				if((taskGroup[t].code != "Books") && (taskGroup[t].code != "Maps"))
					this.taskService.Units.set(taskGroup[t], units - consume);

				// Check if we need to continue //
				if(debt <= 0) break;
			}
		}

		// Update the resource amounts //
		this.Update_Amounts();
	}

	// Informative //
	UpgradeLv(res: string): number
	{ return (this.Upgrades.get(Object.values(BANK_RESOURCE).find(r => r.code == res) as Resource) as number) + 1; }
	UpgradeNum(res: Resource): number { return (this.Upgrades.get(res) as number) + 1; }
	
	UpgradeCost(res: Resource): number[] { return this.UpgradeCosts.get(res) as number[]; }
	ResAmt(res: Resource): number { return this.Amount.get(res) as number; }
	ResCap(res: Resource): number { return this.Capacity.get(res) as number; }
	TasksOf(res: Resource): Task[] { return this.taskService.Tasks.filter(t => t.res === res.code); }

	Upkeep(res: Resource): number
	{	// Calculates the resource upkeep for a specific Resource //
		let upkeep = 0;
		switch(res)
		{
			case BANK_RESOURCE.FOOD:
				// Based on number of peeps and what they're doing //
				for(let p of this.peepService.Peeps)
				{
					let peepTask = Object.values(BANK_TASK).find(t => t.code === p.task) as Task;
					upkeep += 1 + peepTask.upkeep;
				}
				upkeep--;	// First peep is free //
				break;
			case BANK_RESOURCE.NEST:
				// Based on housing and capacity increases //
				for(let r of this.Resources)
				{	
					let upgLv = this.Upgrades.get(r) as number;
					upkeep += Math.ceil((upgLv * Math.sqrt(upgLv + 1)) / 2);	
				}
				break;
			case BANK_RESOURCE.ORE:
				// Based on production upgrades //
				for(let t of this.taskService.Tasks)
				{
					let upgLv = this.taskService.Upgrades.get(t) as number;
					upkeep += Math.ceil(Math.sqrt(upgLv * t.tier));
				}
				break;
			default: break;
		}
		// There's no upkeep for Skill //
		return upkeep;
	}
	
	CanUpgrade(res: Resource): boolean
	{
		let numUpg = this.Upgrades.get(res) as number;
		let upgCostMap = COSTS_CAPACITY.get(res) as number[][];

		if(numUpg < upgCostMap.length)	return !(upgCostMap[numUpg].every(c => c === 0))
		else							return false;
	}
	CanBuy(cost: number[]): boolean
	{	// Determines if you have the resources to pay a cost //
		for(let r = 0; r < this.Resources.length; r++)
		{
			let thisAmt = this.Amount.get(this.Resources[r]) as number;
			if(thisAmt < cost[r]) return false;
		}
		return true;
	}

	// Game Loop //
	Update_Amounts(): void
	{	// Query each resource's tasks and aggregate the worth of each supply //
		for(let r of Object.values(BANK_RESOURCE))
		{	// Find the tasks associated with this resource //
			let taskGroup = Object.values(BANK_TASK).filter(t => t.res === r.code);

			// Add their weighted amounts together //
			let amount = 0;
			let supply = 0;
			for(let t of taskGroup)
			{
				let units = this.taskService.Units.get(t as Task) as number;
				let value = t.val;

				supply += units;
				amount += units * value;
			}

			// Set the value in the map to the summed value //
			this.TotalUnits.set(r, supply);
			this.Amount.set(r, amount);
		}
	}
	Update_Capacity(): void
	{	// Query each resource's tasks and aggregate the worth of each supply //
		for(let r of Object.values(BANK_RESOURCE))
		{	
			let upgLv = this.UpgradeNum(r);
			this.Capacity.set(r, 100 * (upgLv) + 50 * (upgLv * (upgLv - 1)) / 2);
		}
	}
}
