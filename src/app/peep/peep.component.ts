// =============== //
// === IMPORTS === //
// =============== //
// External //
import { Component, OnInit, Input } from '@angular/core';

// Internal //
import { Peep } from '../peep';
import { Task } from '../task';
import { Resource } from '../resource';

import { BANK_PEEP, BANK_RESOURCE, BANK_TASK } from '../bank';

import { TaskService } from '../task.service';

// ============================ //
// === COMPONENT DEFINITION === //
// ============================ //
@Component({
	selector: 'app-peep',
	templateUrl: './peep.component.html',
	styleUrls: ['./peep.component.css']
})
export class PeepComponent implements OnInit
{	// ------------------ //
	// --- Parameters --- //
	@Input() peep: Peep = BANK_PEEP.EGG as Peep;

	// --------------- //
	// --- Methods --- //
	constructor(private taskService: TaskService) { }
	ngOnInit(): void { }
}