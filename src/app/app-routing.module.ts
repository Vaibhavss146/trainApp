import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './user/home/home.component';
import { PageNotFoundComponent } from './user/page-not-found/page-not-found.component';
import { TicketBookingComponent } from './user/ticket-booking/ticket-booking.component';
import { LoginComponent } from './user/login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'home',component:HomeComponent,canActivate: [AuthGuard]},
  {path:'ticket_booking',component:TicketBookingComponent,canActivate: [AuthGuard]},
  {path:'**',component:PageNotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
