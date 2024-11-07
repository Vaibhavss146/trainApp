import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TrainService } from './user/train.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private trainservice:TrainService,private router:Router){}

  canActivate():boolean{
    if(this.trainservice.isLoggedin()){
      return true;
    } else{
      this.router.navigate(['/login']);
      return false;
    }
  }
}
  
