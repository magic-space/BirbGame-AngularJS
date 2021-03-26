export interface Task
{	// Information and Relationships //
	code: string;	// Internal task code 				//
	name: string;	// Display name for this task		//
	group: string;	// Resource this task produces for 	//
	desc: string; 	// Description of task 				//
	//tier: number;

	// Production Rate //
	dur: number;	// How long does the task take on average?		//
	var: number;	// How much variability in duration is there?	//
	yield: number;	// How many units are produced?					//
	val: number;	// How much resources is one unit worth?		//
	wgt: number;	// How heavy is one unit to carry?				//

	// Consumption Rate //
	upkeep: number;	// How much food per day does working this cost?	//
}