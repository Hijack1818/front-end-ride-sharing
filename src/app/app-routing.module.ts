import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserViewComponent } from './user-view/user-view.component';
import { DriverViewComponent } from './driver-view/driver-view.component';

const routes: Routes = [
  { path: 'user', component: UserViewComponent },
  { path: 'driver', component: DriverViewComponent },
  { path: '', redirectTo: '/user', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

