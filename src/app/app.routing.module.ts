import {RouterModule, Routes} from '@angular/router';

import {NgModule} from '@angular/core';
import {NameComponent} from './name.component';

const routes: Routes = [
  {path: ':name', component: NameComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
