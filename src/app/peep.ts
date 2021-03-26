export interface Peep
{	// Information //
	id: number;		// Which peep is this?			//
	code: string;	// Internal peep code 			//
	name: string;	// Display name for this peep	//

	// Actions //
	task: string;	// What is this peep doing?							//
	dur: number;	// Time remaining on current task 					//
	carry: number;	// Current number of units this peep is carrying	//

	// Attributes //
	str: number;	// Strength - how effective this peep is at collection 	//
	dex: number;	// Dexterity- how quickly this peep finishes tasks		//
}