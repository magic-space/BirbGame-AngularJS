// =============== //
// === IMPORTS === //
// =============== //
// External //
import { Component, OnInit, Input } from '@angular/core';

// Internal //
import { Task } from '../task';
import { Resource } from '../resource';

import { BANK_RESOURCE } from '../bank';

import { TaskService } from '../task.service';
import { ResourceService } from '../resource.service';

// ============================ //
// === COMPONENT DEFINITION === //
// ============================ //
@Component({
	selector: 'app-resource',
	templateUrl: './resource.component.html',
	styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit
{	// ------------------ //
	// --- Parameters --- //
	@Input() Res: Resource = BANK_RESOURCE.FOOD;
	@Input() Amount: number = 0;
	@Input() Capacity: number = 1;

	// --------------- //
	// --- Methods --- //
	constructor(
		public taskService: TaskService,
		public resourceService: ResourceService
	) { }
	ngOnInit(): void { }

	// Mutators //
	Upgrade(res: Resource): void
	{	// Upgrades the capacity of a given resource //
		let upgCost = this.resourceService.UpgradeCosts.get(this.Res) as number[];
		if(!this.resourceService.CanBuy(upgCost)) return;
		if(!this.resourceService.CanUpgrade(this.Res)) return;

		// Increase the upgrade marker //
		let upgLv = this.resourceService.Upgrades.get(this.Res) as number;
		this.resourceService.Upgrades.set(this.Res, upgLv + 1);

		// Increase the capacity of this resource //
		let thisRes = Object.values(BANK_RESOURCE).find(r => r.code === this.Res.code) as Resource;
		let thisCap = this.resourceService.Capacity.get(thisRes) as number;
		let upgDelta = 100 + 50 * (upgLv + 1);
		this.resourceService.Capacity.set(thisRes, thisCap + upgDelta);

		// Spend the associated resources //
		this.resourceService.Spend(upgCost);
	}

	// Informative //
	ResourcePercent(res: Resource): number
	{
		let taskGroup = this.resourceService.TasksOf(res);
		let resPercent = 0;
		for(let t of taskGroup)
			resPercent += this.TaskPercent(t);
		return Math.floor(resPercent);
	}
	TaskPercent(task: Task): number
	{
		let taskUnits = this.taskService.Units.get(task) as number;
		let thisCap = this.resourceService.Capacity.get(this.Res) as number;
		return (taskUnits / thisCap) * 100;
	}

	TaskColor(tier: number): string
	{
		switch(tier)
		{
			case 1: return "#5EC9FF";
			case 2: return "#6BC141";
			case 3: return "#FFC666";
			case 4: return "#DB7093";
			case 5: return "#E529DF";
			default: return "#000000";
		}
	}
}
