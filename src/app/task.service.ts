// =============== //
// === IMPORTS === //
// =============== //
// External //
import { Injectable } from '@angular/core';

// Internal //
import { Task } from './task';

import { BANK_TASK, BANK_RESOURCE, COSTS_UPGRADE } from './bank';

// ========================== //
// === SERVICE DEFINITION === //
// ========================== //
@Injectable({ providedIn: 'root' })
export class TaskService 
{	// ------------------ //
	// --- Parameters --- //
	Tasks: Task[] = Object.values(BANK_TASK);

	Units: Map<Task, number> = new Map<Task, number>();
	Upgrades: Map<Task, number> = new Map<Task, number>();
	UpgradeCosts: Map<Task, number[]> = new Map<Task, number[]>();

	// --------------- //
	// --- Methods --- //
	constructor()
	{	// Parameter Definitions //
		for(let t of Object.values(BANK_TASK))
		{
			this.Units.set(t, 0);
			this.Upgrades.set(t, 0);
			this.UpgradeCosts.set(t, [0, 0, 0, 0, 0]);
		}
	}
	Init()
	{
		for(let task of Object.values(BANK_TASK))
		{	// Quality of life subsitution //
			let upgLv = this.Upgrades.get(task) as number;

			// Set the upgrade costs //
			let costs = [0, 0, 0, 0, 0];
			costs[2] = (COSTS_UPGRADE.get(task) as number[][])[upgLv][0];
			costs[4] = (COSTS_UPGRADE.get(task) as number[][])[upgLv][1];
			this.UpgradeCosts.set(task, costs)
		}
	}

	// Informative //
	UpgradeNum(task: Task): number { return this.Upgrades.get(task) as number; }
	UpgradeCost(task: Task): number[] { return this.UpgradeCosts.get(task) as number[]; }

	BonusDurationDelta(task: Task): number
	{	// Shorthand for getting the duration difference between upgrades //
		let current = Math.ceil(task.dur * this.BonusDuration(task, this.UpgradeNum(task)));
		let next = Math.ceil(task.dur * this.BonusDuration(task, this.UpgradeNum(task) + 1));
		return (next - current);
	}
	BonusDuration(task: Task, upgLv: number = this.UpgradeNum(task)): number
	{	// Duration bonuses are gained every upgrade, but with diminishing returns //
		let bonus = 1;
		for(let u = 1; u <= upgLv; u++)
			bonus *= Math.pow(1 - u / (u + 1), 1 / ((2 + u / 10) * (u + 1)));
		return bonus;
	}
	BonusYield(task: Task): number
	{	// Yield bonuses are gained every second upgrade //
		return Math.floor(this.UpgradeNum(task) / 2);
	}
	BonusCarry(task: Task): number
	{	// Carry bonuses are gained every third upgrade //
		return Math.floor(this.UpgradeNum(task) / 3);
	}

	Supply(task: Task): number { return this.Units.get(task) as number; }
	CanUpgrade(task: Task): boolean
	{
		let numUpg = this.Upgrades.get(task) as number;
		let upgCostMap = COSTS_UPGRADE.get(task) as number[][];

		if(numUpg < upgCostMap.length)	return !(upgCostMap[numUpg].every(c => c === 0))
		else							return false;
	}
}