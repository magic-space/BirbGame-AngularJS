// =============== //
// === IMPORTS === //
// =============== //
// External //
import { Component, OnInit, Input } from '@angular/core';

// Internal //
import { Task } from '../task';

import { BANK_TASK, COSTS_UPGRADE } from '../bank';

import { PeepService } from '../peep.service';
import { TaskService } from '../task.service';
import { ResourceService } from '../resource.service';

// ============================ //
// === COMPONENT DEFINITION === //
// ============================ //
@Component({
	selector: 'app-task',
	templateUrl: './task.component.html',
	styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit
{	// ------------------ //
	// --- Parameters --- //
	Resources = this.resourceService.Resources;

	@Input() Task: Task = BANK_TASK.EGG;
	@Input() Units: number = 0;

	// --------------- //
	// --- Methods --- //
	constructor(
		public peepService: PeepService,
		public taskService: TaskService,
		public resourceService: ResourceService
	) { }
	ngOnInit(): void { }

	// Mutators //
	HirePeep(task: Task): void { this.peepService.SetTask(task); }
	FirePeep(task: Task): void { this.peepService.SetIdle(task); }

	Upgrade(task: Task): void
	{	// Upgrades the production of a given task //
		let upgCost = this.taskService.UpgradeCosts.get(this.Task) as number[];
		if(!this.resourceService.CanBuy(upgCost)) return;
		if(!this.taskService.CanUpgrade(this.Task)) return;

		// Increase the productivity of this task //
		let thisTask = Object.values(BANK_TASK).find(t => t.code === this.Task.code) as Task;
		let taskDelta = this.taskService.BonusDurationDelta(this.Task);
		thisTask.var += Math.ceil(taskDelta * thisTask.var / thisTask.dur);
		thisTask.dur += taskDelta;

		// Increase the upgrade marker //
		let upgLv = this.taskService.Upgrades.get(this.Task) as number;
		this.taskService.Upgrades.set(this.Task, upgLv + 1);

		// Update the upgrade costs //
		let costs = [0, 0, 0, 0, 0];
		costs[2] = (COSTS_UPGRADE.get(task) as number[][])[upgLv][0];
		costs[4] = (COSTS_UPGRADE.get(task) as number[][])[upgLv][1];
		this.taskService.UpgradeCosts.set(task, costs)

		// Spend the associated resources //
		this.resourceService.Spend(upgCost);
	}
}
