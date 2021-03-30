export interface Peep
{	// Information //
	id: number;		// Which peep is this?			//
	code: string;	// Internal peep code 			//
	name: string;	// Display name for this peep	//

	// Attributes //
	str: number;	// Strength - how effective this peep is at collection 	//
	dex: number;	// Dexterity- how quickly this peep finishes tasks		//
	int: number;	// Intellect- how quickly this peep learns new ideas	//
	span: number;	// Wingspan - how big this bird is in cm				//

	// Actions //
	task: string;	// What is this peep doing?							//
	dur: number;	// Time remaining on current task 					//
	carry: number;	// Current number of units this peep is carrying	//
}