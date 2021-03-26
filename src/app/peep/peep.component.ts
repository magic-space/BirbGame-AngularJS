// === IMPORTS === //
// External //
import { Component, OnInit, Input } from '@angular/core';

// Internal //
import { Peep } from '../peep';
import { PEEPMAP } from '../bank';

// === COMPONENT DEFINITION === //
@Component({
  selector: 'app-peep',
  templateUrl: './peep.component.html',
  styleUrls: ['./peep.component.css']
})
export class PeepComponent implements OnInit
{ // -- Parameters -- //
  @Input() peep:Peep = PEEPMAP.get("Egg") as Peep; // Egg default //

  // -- Methods -- //
  constructor() { }
  ngOnInit(): void { }
}
