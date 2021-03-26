// === IMPORTS === //
// External //
import { Component, OnInit, ɵɵsetComponentScope } from '@angular/core';
import { CookieService, CookieOptions } from 'ngx-cookie';

// Internal //
import { PeepComponent } from '../peep/peep.component';
import { PeepService } from '../peep.service';
import { Peep } from '../peep';
import { Task } from '../task';
import { TASKBANK, TASKMAP, UPGCOSTMAP } from '../bank';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit 
{
  [x: string]: any; // -- Methods -- //
  constructor(public peepService:PeepService, private cookieService:CookieService) { }
  ngOnInit(): void 
  { // Add a new peep and start the game loop //
    if(!this.Load())  // New game! //
      this.AddPeep();
    setInterval( () => this.Update(), 2000/24 );
    setInterval( () => this.Save(), 2000 );
  }

  // Interaction //
  AddPeep(): void
  { // Check if there's resources //
    if(this.ResAmount("Food") < this.Peep_Cost[0]) return; 

    // Check if there's housing available //
    if(this.Peeps.length >= this.Peep_Housing) return;

    // All good! Make the peep! //
    this.SpendResources_(this.Peep_Cost)
    let newPeep = new PeepComponent();
    newPeep.peep = this.peepService.AddPeep();
    this.Peeps.push(newPeep);
  }
  AddHouse(): void
  { // Check if there's resources //
    for(let r = 0; r < this.Resources.length; r++)
      if(this.ResAmount(this.Resources[r]) < (this.Upg_Costs.get("House") as number[])[r]) return;
    if((this.Upg_Costs.get("House") as number[]).every(c => c == 0)) return;
    
    // Increase the housing capacity //
    this.Upg_House ++;
    this.Peep_Housing += this.Upg_Change.get("House") as number;
    this.SpendResources_(this.Upg_Costs.get("House") as number[]);
    console.log(this.Upg_House);
  }
  Upgrade_Production(task:string): void 
  { // Check if there's resources //
    for(let r = 0; r < this.Resources.length; r++)
      if(this.ResAmount(this.Resources[r]) < (this.Upg_Costs.get(task) as number[])[r]) return; 
    if((this.Upg_Costs.get(task) as number[]).every(c => c == 0)) return;

    // Increase the production upgrade marker //
    this.Upg_Production.set(task, (this.Upg_Production.get(task) as number) + 1);

    // Spend the associated currency //
    this.SpendResources_(this.Upg_Costs.get(task) as number[]);
  }
  Upgrade_Capacity(res:string): void 
  { // Check if there's resources //
    for(let r = 0; r < this.Resources.length; r++)
      if(this.ResAmount(this.Resources[r]) < (this.Upg_Costs.get(res) as number[])[r]) return;
    if((this.Upg_Costs.get(res) as number[]).every(c => c == 0)) return;
    
    // Increase the capacity upgrade marker and the associated capacity //
    this.Res_Capacity.set(res, (this.Res_Capacity.get(res) as number) + (this.Upg_Change.get(res) as number));
    this.Upg_Capacity.set(res, (this.Upg_Capacity.get(res) as number) + 1);
    
    // Spend the associated currency //
    this.SpendResources_(this.Upg_Costs.get(res) as number[]);
  }

  HirePeep(task:string): void { this.peepService.SetPeepTask(task); }
  FirePeep(task:string): void { this.peepService.SetPeepIdle(task); }

  // Game Loop //
  Update(): void
  { // Compute the number of units in each resource group //
    let resBins = this.Update_ResAmts(true);

    // Update the peeps //
    this.peepService.Update();
    let upkeep_food = 0;
    for(let p = 0; p < this.Peeps.length; p++)
    { // For simplicity, copy the peep value for legibility //
      let thisPeep = this.Peeps[p].peep;
      let thisTask = TASKMAP.get(thisPeep.task) as Task;
      
      // Check if this peep is in the process of hatching // 
      if(thisTask.code === "Egg")
        this.Peeps[p].peep = this.peepService.Peeps[p];

      // Check if this peep is unloading their yield //
      else if((thisPeep.carry > 0) && (thisPeep.dur === -1))
      { // Slowly empty out this peep's yield if there's capacity (1 unit / tick) //
        if((resBins.get(thisTask.group) as number) < (this.Res_Capacity.get(thisTask.group) as number))
        { // Place one unit in the resource bin //
          this.Res_Units.set(thisTask.code, (this.Res_Units.get(thisTask.code) as number) + 1);
          thisPeep.carry--;

          // Update the bin //
          resBins = this.Update_ResAmts(true);
        }
        // Reset the duration timer if we are finished //
        if(thisPeep.carry === 0)
          thisPeep.dur = thisTask.dur + Math.floor(2*thisTask.var*(Math.random()-0.5));
      }
      // Check if this peep is at carrying capacity //
      else if(thisPeep.carry * thisTask.wgt >= 4 * thisPeep.str)
        thisPeep.dur = -1;  // Begin emptying //

      // Build the Food upkeep //
      upkeep_food += 1 + thisTask.upkeep;

      // Instinct Production //
      if(thisTask.code !== "Egg")
      { // Create 1 Instinct per duration up until 10 instinct per peep //
        let instTask = TASKMAP.get("Instinct") as Task;
        let instUnits = this.Res_Units.get("Instinct") as number;
        let instTimer = instTask.dur + Math.floor(2*instTask.var*(Math.random() - 0.5));  // Give it some variability //
        if( (this.Clock % instTimer === 0) && 
            (instUnits < 10 * this.peepService.Peeps.length) &&
            ((resBins.get(instTask.group) as number) < (this.Res_Capacity.get(instTask.group) as number)))
        { // Add an instinct unit //
          this.Res_Units.set(instTask.code, instUnits + 1);

          // Update the bin //
          resBins = this.Update_ResAmts(true);
        }
      }

      // Song Production //
      if(thisTask.code === "Idle")
      { // Each idle peep sings with each other idle peep //
        let idlePeeps = this.peepService.GetPeepsByTask("Idle").length;
        let songTask = TASKMAP.get("Song") as Task;
        let songUnits = this.Res_Units.get(songTask.code) as number;
        
        // Roll for song effect, add if less than the total number of idle peeps //
        if((songTask.dur * Math.random() * Math.sqrt(songUnits) < (idlePeeps - 1)) &&
          ((resBins.get(songTask.group) as number) < (this.Res_Capacity.get(songTask.group) as number)))
        { // Add an song unit //
          this.Res_Units.set(songTask.code, songUnits + 1);
          
          // Update the bin //
          resBins = this.Update_ResAmts(true);
        }
      }
    }

    // Maintain upkeeps once per day //
    this.Res_Upkeep.set("Food", upkeep_food - 1);

    let upkeep_nest = (this.Upg_House * (this.Upg_House + 1))/2;
    for(let c of this.Resources)
    {
      let upgLv = this.Upg_Capacity.get(c) as number;
      upkeep_nest += Math.ceil((upgLv * Math.sqrt(upgLv + 1))/2);
    }
    this.Res_Upkeep.set("Nest", upkeep_nest)

    let upkeep_ore = 0;
    for(let t of this.Upg_Production.keys())
    {
      let thisTask = TASKMAP.get(t) as Task;
      let upgLv = this.Upg_Production.get(t) as number;
      let taskNum = this.TasksInGroup(thisTask.group).indexOf(thisTask) + 1;
      upkeep_ore += Math.ceil(Math.sqrt(upgLv * taskNum));
    }
    this.Res_Upkeep.set("Ore", upkeep_ore)

    if(this.Clock % 24 === 0)
    { // Check which resources are required to upkeep //
      this.SpendResources(this.Res_Upkeep);

      // Update the unlocks //
      this.Update_Unlocks();
    }

    // Update the resource display //
    this.Res_Amount = this.Update_ResAmts();

    // Update the upgrades //
    this.Update_Upgrades();

    // Update Peep Cost //
    this.Peep_Cost[0] = 10 + Math.floor(Math.pow(this.Peeps.length, 1.1));

    // Adjust the clock //
    this.Clock++;
  }
  Update_ResAmts(bins:boolean = false): Map<string, number>
  { // Initialize empty bins //
    let resBins = new Map<string, number>([
      ["Food", 0], ["Nest", 0], ["Ore", 0], ["Skill", 0]]);
    this.Res_Storage.set("Food", 0);
    this.Res_Storage.set("Nest", 0);
    this.Res_Storage.set("Ore", 0);
    this.Res_Storage.set("Skill", 0);
    
    // Iterate through each task //
    for(let t = 0; t < this.Tasks.length; t++)
    { // Get the Task for this task //
      let task = TASKMAP.get(this.Tasks[t]) as Task;

      // Get how many units there currently are of this task's cargo //
      let taskUnits = this.Res_Units.get(task.code) as number;
      let resUnits = resBins.get(task.group) as number;
      let resStore = this.Res_Storage.get(task.group) as number;

      // Add what is observed to the appropriate bin (add values if necessary) //
      resBins.set(task.group, resUnits + taskUnits * (bins ? 1 : task.val));
      this.Res_Storage.set(task.group, resStore + taskUnits);
    }
    // Output //
    return resBins;
  }
  Update_Unlocks(): void
  { // Food Unlocks //
    this.Unlocks.set("Seeds", this.Clock > 24);   // Oh wait, we have to eat, don't we!? //
    this.Unlocks.set("Bugs", this.Clock > 900);   // Those bugs start looking tasty... maybe we could hunt them? //
    this.Unlocks.set("Fruit", this.Clock > 7200); // While out and about, there were some berries that looked delicious! //
    this.Unlocks.set("Fish", this.Clock > 24000); // Going even further, large animals appeared in the water... //
    this.Unlocks.set("Spices", false); // Not yet implemented //

    // Nest Unlocks //
    this.Unlocks.set("Wood", this.Peeps.length > 1);  // Enough to make a nest ;) //
    this.Unlocks.set("Clay", this.Upg_House > 2);     // We're going to need something sturdier... //
    this.Unlocks.set("Rocks", this.Upg_House > 4);    // The nest is getting really big now! //
    this.Unlocks.set("Glass", false);  // Not yet implemented //

    // Ore Unlocks //
    this.Unlocks.set("Coal", this.Peeps.length > 4);  // Enough to explore a bit further out //
    this.Unlocks.set("Iron", (this.Upg_Production.get("Coal") as number) > 2);  // Better tools //
    this.Unlocks.set("Steel", (this.Upg_Production.get("Iron") as number) > 2); // Even better tools! //
    this.Unlocks.set("Gems", false);  // Not yet implemented //

    // Skill Unlocks //
    this.Unlocks.set("Instinct", this.Clock > 0);       // I'm just doing what comes naturally //
    this.Unlocks.set("Song", this.Peeps.length > 1);    // Once there's someone to talk to //
    this.Unlocks.set("Books", this.Peeps.length > 19);  // It's getting hard to keep track of everything //
    this.Unlocks.set("Maps", this.Peeps.length > 99);   // It's getting too cramped in here //
  }
  Update_Upgrades(): void
  { // Adjust the housing costs //
    let upgCostList = UPGCOSTMAP.get("House") as number[][];
    let upgLv = this.Upg_House;
    let upgMax = (upgCostList[0].length === 0) || (upgLv >= upgCostList.length);
    let upgDelta = (upgLv + 1) * 10;
    
    if(upgMax)  this.Upg_Costs.set("House", [0,0,0,0]);  // No upgrade or Max upgrade //
    else        this.Upg_Costs.set("House", upgCostList[upgLv]); // Get this upgrade //
    this.Upg_Change.set("House", upgDelta);

    // Go through each resource - for capacity upgrades //
    for(let res of this.Resources)
    {
      upgCostList = UPGCOSTMAP.get(res) as number[][];
      upgLv = this.Upg_Capacity.get(res) as number;
      upgMax = (upgCostList[0].length === 0) || (upgLv >= upgCostList.length);
      upgDelta = (upgLv + 1) * 50 + 100;
      
      if(upgMax)  this.Upg_Costs.set(res, [0,0,0,0]);  // No upgrade or Max upgrade //
      else        this.Upg_Costs.set(res, upgCostList[upgLv]); // Get this upgrade //
      this.Upg_Change.set(res, upgDelta);
    }

    // Go through each task - for production upgrades //
    for(let task of this.Tasks)
    {
      upgCostList = UPGCOSTMAP.get(task) as number[][];
      upgLv = this.Upg_Production.get(task) as number;
      upgMax = (upgCostList[0].length === 0) || (upgLv >= upgCostList.length);
      
      if(upgMax)  this.Upg_Costs.set(task, [0,0,0,0]);  // No upgrade or Max upgrade //
      else        this.Upg_Costs.set(task, upgCostList[upgLv]); // Get this upgrade //
    }
  }

  SpendResources(cost:Map<string, number>)
  { // Spends the resources stated in `cost` //
    for(let res of cost.keys())
    { // Get the current debt upkeep //
      let debt = cost.get(res) as number;

      // Go through each resource in this resource group from lowest value to highest value //
      let taskGroup = TASKBANK.filter(t => t.group === res);
      taskGroup.sort(r => r.val).reverse();

      for(let t = 0; t < taskGroup.length; t++)
      { // Calculate how many units are required from this resource //
        let consume = Math.ceil(debt / taskGroup[t].val);
        let units = this.Res_Units.get(taskGroup[t].code) as number;
        
        // Subtract the consumption from the supply //
        if(units < consume) consume = units;
        
        // Consume that many units and move down to the next resource value //
        debt -= consume * taskGroup[t].val;
        this.Res_Units.set(taskGroup[t].code, units - consume);

        // Check if we need to continue //
        if(debt <= 0) break;
      }
    }
  }
  SpendResources_(cost:number[])
  { // Spends the resources stated in `cost` //
    for(let r = 0; r < cost.length; r++)
    { // Get the current debt upkeep //
      let debt = cost[r];

      // Go through each resource in this resource group from lowest value to highest value //
      let taskGroup = TASKBANK.filter(t => t.group === this.Resources[r]);
      taskGroup.sort(res => res.val).reverse();

      for(let t = 0; t < taskGroup.length; t++)
      { // Calculate how many units are required from this resource //
        let consume = Math.ceil(debt / taskGroup[t].val);
        let units = this.Res_Units.get(taskGroup[t].code) as number;
        
        // Subtract the consumption from the supply //
        if(units < consume) consume = units;
        
        // Consume that many units and move down to the next resource value //
        debt -= consume * taskGroup[t].val;

        if((taskGroup[t].code != "Books") && (taskGroup[t].code != "Maps"))
          this.Res_Units.set(taskGroup[t].code, units - consume);

        // Check if we need to continue //
        if(debt <= 0) break;
      }
    }
  }
  ResAmount(res:string): number { return this.Res_Amount.get(res) as number; }
  ResPercent(res:string): number 
  {
    let resStore = this.Res_Storage.get(res) as number;
    let resCap = this.Res_Capacity.get(res) as number;

    return Math.floor(resStore / resCap * 100);
  }
  TaskPercent(task:string): number
  {
    let thisTask = TASKMAP.get(task) as Task;
    let resUnits = this.Res_Units.get(task) as number;
    let resCap = this.Res_Capacity.get(thisTask.group) as number;

    return Math.floor(resUnits / resCap * 100);
  }
  TasksInGroup(group:string): Task[] { return TASKBANK.filter(t => t.group === group); }

  UpgProdQuery(task:string): number { return (this.Upg_Production.get(task) as number);}
  UpgCapQuery(res:string): number { return (this.Upg_Capacity.get(res) as number);}
  CostQuery(value:string): number[] { return (this.Upg_Costs.get(value) as number[]); }
  IsMaxUpgrade(value:string): boolean { return (this.CostQuery(value).every(c => c === 0));}

  // I/O //
  WipeSave(): void
  {
    localStorage.clear();
    location.reload();
  }
  Load(): boolean
  {
    // Get all cookies //
    let clock = localStorage.getItem("Clock");
    let upgHouseStr = localStorage.getItem("Upg_House");
    let upgCapStr = localStorage.getItem("Upg_Capacity");
    let upgProdStr = localStorage.getItem("Upg_Production");
    let resUnitStr = localStorage.getItem("Res_Units");
    let peepStr = localStorage.getItem("Peeps");

    // Check to see if any storage is not present //
    let cleanInit = (clock !== null) && (upgHouseStr !== null) && (upgCapStr !== null) &&
      (upgProdStr !== null) && (resUnitStr !== null) && (peepStr !== null);
    if(!cleanInit)
    { // Something got corrupted, make a new save. //
      console.log("Some save data could not be found or is corrupted - starting a new game.")
      return false;
    }
    
    // We can proceed //
    clock = clock as string;
    upgHouseStr = upgHouseStr as string;
    upgCapStr = upgCapStr as string;
    upgProdStr = upgProdStr as string;
    resUnitStr = resUnitStr as string;
    peepStr = peepStr as string;
  
    // Parse Clock and Housing upgrade cookies //
    this.Clock = parseInt(clock);
    this.Upg_House = parseInt(upgHouseStr);
    for(let i = 0; i < this.Upg_House; i++)
    {
      this.Update_Upgrades();
      this.Peep_Housing += this.Upg_Change.get("House") as number;
    }

    // Parse the upgrade capacity cookie //
    let upgCapStr_split= upgCapStr.split(' ').slice(0, -1);
    for(let r = 0; r < this.Resources.length; r++)
    {
      for(let i = 0; i < parseInt(upgCapStr_split[r]); i++)
      {
        this.Update_Upgrades();
        let thisCap = this.Res_Capacity.get(this.Resources[r]) as number;
        let capChange = this.Upg_Change.get(this.Resources[r]) as number;
        this.Res_Capacity.set(this.Resources[r], thisCap + capChange);
      }  
      this.Upg_Capacity.set(this.Resources[r], parseInt(upgCapStr_split[r]));    
    }

    // Parse the upgrade production and resource units cookies //
    let upgProdStr_split= upgProdStr.split(' ').slice(0, -1);
    let resUnitStr_split= resUnitStr.split(' ').slice(0, -1);
    for(let t = 0; t < this.Tasks.length; t++)
    {
      this.Upg_Production.set(this.Tasks[t], parseInt(upgProdStr_split[t]));
      this.Res_Units.set(this.Tasks[t], parseInt(resUnitStr_split[t]));
    }

    // Parse out the Peeps //
    let peepStr_split = peepStr.split('|').slice(0, -1);
    for(let p = 0; p < peepStr_split.length; p++)
    { // Parse out the peep object //
      let peep = JSON.parse(peepStr_split[p]) as Peep;
      this.peepService.Peeps.push(peep);

      // Add a peep component //
      let newPeep = new PeepComponent();
      newPeep.peep = peep;
      this.Peeps.push(newPeep);
    }

    // Output //
    console.log("Loaded save game successfully!");
    return true;
  }
  Save(): void
  {
    // Set Cookie Options //
    let cookieOptions = {'path':'', 'sameSite':"strict", 'expires':new Date(2099,12,31)} as CookieOptions;

    // Clock time //
    localStorage.setItem("Clock", '' + this.Clock);

    // Housing Upgrades //
    localStorage.setItem("Upg_House", '' + this.Upg_House);

    // Capacity Upgrades //
    let upgCapStr = "";
    for(let res of this.Resources)
      upgCapStr += (this.Upg_Capacity.get(res) as number) + " ";
    localStorage.setItem("Upg_Capacity", upgCapStr);

    // Production Upgrades & Resource Units //
    let upgProdStr = "";
    let resUnitStr = "";
    for(let task of this.Tasks)
    {
      upgProdStr += (this.Upg_Production.get(task) as number) + " ";
      resUnitStr += (this.Res_Units.get(task) as number) + " ";
    }
    localStorage.setItem("Upg_Production", upgProdStr);
    localStorage.setItem("Res_Units", resUnitStr);

    // Peeps present - TODO: Allow more peeps to be saved by simplifying the string //
    let peepStr = "";
    for(let peep of this.peepService.Peeps)
      peepStr += JSON.stringify(peep) + "|";
    localStorage.setItem("Peeps", peepStr);

    // Success! //
    console.log("Game saved successfully!");
  }

  // -- Parameters -- //
  // Saved Parameters //
  Clock:number = 0;

  Upg_House:number = 0;
  Upg_Capacity:Map<string, number> = new Map<string, number>([
    ["Food", 0], ["Nest", 0], ["Ore", 0], ["Skill", 0]]);
  Upg_Production:Map<string, number> = new Map<string, number>([
    ["Seeds", 0], ["Bugs", 0], ["Fruit", 0], ["Fish", 0], ["Spices", 0],
    ["Wood", 0], ["Clay", 0], ["Rocks", 0], ["Steel", 0],
    ["Coal", 0], ["Iron", 0], ["Steel", 0], ["Gems", 0],
    ["Instinct", 0], ["Song", 0], ["Books", 0], ["Maps", 0]
  ]);

  Res_Units:Map<string, number> = new Map<string, number>([
    ["Seeds", 20], ["Bugs", 0], ["Fruit", 0], ["Fish", 0], ["Spices", 0],
    ["Wood", 0], ["Clay", 0], ["Rocks", 0], ["Steel", 0],
    ["Coal", 0], ["Iron", 0], ["Steel", 0], ["Gems", 0],
    ["Instinct", 0], ["Song", 0], ["Books", 0], ["Maps", 0]
  ]);

  // Game Information //
  Unlocks:Map<string, boolean> = new Map<string, boolean>([
    ["Seeds", false], ["Bugs", false], ["Fruit", false], ["Fish", false], ["Spices", false],
    ["Wood", false], ["Clay", false], ["Rocks", false], ["Steel", false],
    ["Coal", false], ["Iron", false], ["Steel", false], ["Gems", false],
    ["Instinct", false], ["Song", false], ["Books", false], ["Maps", false]
  ]);

  // Upgrades //
  Upg_Change:Map<string, number> = new Map<string, number>([
    ["House", 0],

    ["Food", 0], ["Nest", 0], ["Ore", 0], ["Skill", 0],

    ["Seeds", 0], ["Bugs", 0], ["Fruit", 0], ["Fish", 0], ["Spices", 0],
    ["Wood", 0], ["Clay", 0], ["Rocks", 0], ["Steel", 0],
    ["Coal", 0], ["Iron", 0], ["Steel", 0], ["Gems", 0],
    ["Instinct", 0], ["Song", 0], ["Books", 0], ["Maps", 0]
  ]);
  Upg_Costs:Map<string, number[]> = new Map<string, number[]>([
    ["House", [0,0,0,0]],

    ["Food", [0,0,0,0]], ["Nest", [0,0,0,0]], ["Ore", [0,0,0,0]], ["Skill", [0,0,0,0]],

    ["Seeds", [0,0,0,0]], ["Bugs", [0,0,0,0]], ["Fruit", [0,0,0,0]], ["Fish", [0,0,0,0]], ["Spices", [0,0,0,0]],
    ["Wood", [0,0,0,0]], ["Clay", [0,0,0,0]], ["Rocks", [0,0,0,0]], ["Steel", [0,0,0,0]],
    ["Coal", [0,0,0,0]], ["Iron", [0,0,0,0]], ["Steel", [0,0,0,0]], ["Gems", [0,0,0,0]],
    ["Instinct", [0,0,0,0]], ["Song", [0,0,0,0]], ["Books", [0,0,0,0]], ["Maps", [0,0,0,0]]
  ]);

  // Peeps //
  Peeps:PeepComponent[] = [];
  Peep_Housing:number = 10;         // Capacity for peeps //
  Peep_Cost: number[] = [10,0,0,0];

  // Tasks //
  Tasks:string[] = [
    "Seeds", "Bugs", "Fruit", "Fish", "Spices",
    "Wood", "Clay", "Rocks", "Steel",
    "Coal", "Iron", "Steel", "Gems",
    "Instinct", "Song", "Books", "Maps"
  ];
  TaskColor:Map<string, string> = new Map<string, string>([
    ["Seeds", '#5EC9FF'], ["Bugs", '#6BC141'], ["Fruit", '#FFC666'], ["Fish", '#DB7093'], ["Spices", '#E529DF'],
    ["Wood", '#5EC9FF'], ["Clay", '#6BC141'], ["Rocks", '#FFC666'], ["Steel", '#E529DF'],
    ["Coal", '#5EC9FF'], ["Iron", '#6BC141'], ["Steel", '#FFC666'], ["Gems", '#E529DF'],
    ["Instinct", '#5EC9FF'], ["Song", '#6BC141'], ["Books", '#FFC666'], ["Maps", '#DB7093']
  ]);

  // Resources //
  Resources:string[] = ["Food", "Nest", "Ore", "Skill"];

  Res_Storage:Map<string, number> = new Map<string, number>([
    ["Food", 0], ["Nest", 0], ["Ore", 0], ["Skill", 0]])
  Res_Amount:Map<string, number> = new Map<string, number>([
    ["Food", 20], ["Nest", 0], ["Ore", 0], ["Skill", 0]]);
    
  Res_Capacity:Map<string, number> = new Map<string, number>([
    ["Food", 100], ["Nest", 100], ["Ore", 100], ["Skill", 100]])
  
  Res_Upkeep:Map<string, number> = new Map<string, number>([
    ["Food", 0], ["Nest", 0], ["Ore", 0], ["Skill", 0]]);
}
