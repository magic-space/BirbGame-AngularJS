// === IMPORTS === //
// External //
import { Injectable } from '@angular/core';

// Internal //
import { Peep } from './peep';
import { Task } from './task';
import { PEEPBANK, PEEPMAP, TASKBANK, TASKMAP } from './bank';

// === SERVICE DEFINITION === //
@Injectable({
  providedIn: 'root'
})
export class PeepService 
{ // -- Parameters -- //
  Peeps : Peep[] = [];
  Upgrades : Map<string, number> = new Map<string, number> ([
    ["Seeds", 0], ["Bugs", 0], ["Fruit", 0], ["Fish", 0], ["Spices", 0],
    ["Wood", 0], ["Clay", 0], ["Rocks", 0], ["Steel", 0],
    ["Coal", 0], ["Iron", 0], ["Steel", 0], ["Gems", 0],
    ["Instinct", 0], ["Song", 0], ["Books", 0], ["Maps", 0]
  ]);

  // -- Methods -- //
  constructor(){ }

  // Accessors //
  GetPeepsByTask(task: string): Peep[]
  { // Return the list of peeps that are currently performing this task //
    let foundPeeps = this.Peeps.filter(p => p.task === task)
    return foundPeeps;
  }
  
  // Mutators //
  AddPeep(): Peep
  { // Get the default egg properties //
    let eggTask = TASKMAP.get('Egg') as Task;

    // Pick a random hatch time //
    let hatchTime = Math.floor(eggTask.dur + 2 * eggTask.var * (Math.random() - 0.5));

    // Create the new peep as an egg //
    let id = 0;
    if(this.Peeps.length) // Make sure there's a peep in there first //
      id = this.Peeps[this.Peeps.length - 1].id + 1; // ID can just be one more than the last peep in the list //

    let egg = Object.assign({}, PEEPMAP.get('egg') as Peep); // Default egg //
    egg.id = id;          // Set ID             //
    egg.dur = hatchTime;  // Set time to hatch  //

    // Append the egg into the list and return it //
    this.Peeps.push(egg);
    return egg;
  }
  HatchPeep(egg:Peep): void
  { // Randomly determine the species for this peep //
    let species = Math.floor((PEEPBANK.length - 1) * Math.random()) + 1;  // Avoid the "Egg" //

    // Make the new peep, but keep the same id //
    let peep = Object.assign({}, PEEPBANK[species] as Peep);
    peep.id = egg.id;   // Set ID //

    // Inject the egg into the peep list //
    this.Peeps[this.Peeps.findIndex(p => p.id === egg.id)] = peep;
  }

  SetPeepTask(task:string): void
  { // Sets the first available idle peep to this task //
    let idlePeeps = this.GetPeepsByTask('Idle');
    if(idlePeeps.length)
    { // Assign the task to the first peep available //
      let idx = this.Peeps.indexOf(idlePeeps[0])
      this.Peeps[idx].task = task;

      // Reset the carry capacity //
      this.Peeps[idx].carry = 0;

      // Set up a new task duration //
      let thisTask = TASKMAP.get(task) as Task;
      this.Peeps[idx].dur = thisTask.dur + Math.floor(2 * thisTask.var * (Math.random() - 0.5));
    }
  }
  SetPeepIdle(task:string): void
  { // Sets the first working peep in the given task to idle //
    let taskPeeps = this.GetPeepsByTask(task);
    if(taskPeeps.length)
    { // Remove the task from the first peep available //
      let idx = this.Peeps.indexOf(taskPeeps[0])
      this.Peeps[idx].task = 'Idle';

      // Reset the carry capacity and duration //
      this.Peeps[idx].carry = 0;
      this.Peeps[idx].dur = 0;
    }
  }

  // Updaters //
  Update(): void
  { // Iterate through each peep in the list //
    this.Update_Production();
    this.Update_Movement();
  }
  Update_Production(): void
  { // Asks each peep to produce based on current task //
    for(let p of this.Peeps)
    { // Check what task this peep is performing //
      if(p.task === "Egg")
      { // Bring it one tick closer to hatching //
        p.dur--;

        // Check if this causes the egg to hatch //
        if(p.dur === 0) this.HatchPeep(p);
      }
      else if(p.task === "Idle")
      { /* Idle peeps chat with other idle peeps and have the time to think */ }
      else if(p.dur !== -1)
      { // This peep is working on something //
        p.dur = Math.max(0, p.dur - p.dex); // Reduce duration by the dexterity of the peep //

        // Check if we have completed work on this task //
        if(p.dur === 0)
        { // Acquire goods according to yield and strength //
          let thisTask = TASKMAP.get(p.task) as Task;
          let upgLv = this.Upgrades.get(p.task) as number;
          p.carry += (thisTask.yield + upgLv) + Math.ceil(p.str * Math.random());

          // Make sure we don't go over capacity //
          if(p.carry * thisTask.wgt > 4 * p.str)
            p.carry = Math.ceil(4 * p.str / thisTask.wgt);

          // Reset the duration //
          p.dur = thisTask.dur + Math.floor(2*thisTask.var*(Math.random() - 0.5));
        }
      }
      // Else, this peep is dumping their contents into the storage //
    }
  }
  Update_Movement(): void
  { // Get each peep's icon and move accordingly //
    for(let p of this.Peeps)
    { // Get the peep's icon //
      let peepIcons = document.getElementsByName(p.id.toString());
      if(!peepIcons.length) continue;
      let peepIcon = peepIcons[0];
      
      // Get its position and orientation //
      let x = (peepIcon.style.left ? parseFloat(peepIcon.style.left.split('%')[0]) : 50*Math.random() + 25);
      let y = (peepIcon.style.top ? parseFloat(peepIcon.style.top.split('%')[0]) : 50*Math.random() + 25);
      let sx = parseFloat(peepIcon.style.transform.split('(')[0].split(')')[0]);
      
      // Get the velocity //
      let vx = 2 * Math.tan(Math.PI/2 * (Math.random() - 0.5))**5;
      let vy = 2 * Math.tan(Math.PI/2 * (Math.random() - 0.5))**5;

      // -- Make the peep move, but only sometimes -- //
      if(Math.random() < 0.05 * p.dex && p.task !== "Egg")
      {
        if(Math.abs(vx) > 0.05) sx = (vx > 0 ? +1 : -1);

        if(vy > 0.05)       peepIcon.className = 'peep front';
        else if(vy < -0.05) peepIcon.className = 'peep back';
        else                peepIcon.className = 'peep side';

        if((5 < x + vx) && (x + vx < 95))
          peepIcon.style.left = (x + vx) + '%';
        if((5 < y + vy) && (y + vy < 90))
          peepIcon.style.top = (y + vy) + '%';
        peepIcon.style.transform = 'scaleX(' + sx + ')';
      }
    }
  }

  

}
