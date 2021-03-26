// === IMPORTS === //
// External //
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Internal //
import { PeepComponent } from './peep/peep.component';
import { PlayerComponent } from './player/player.component';

// === ///
const routes: Routes = [
  {path: '', component: PlayerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
