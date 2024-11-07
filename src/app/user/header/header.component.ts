import { Component, OnInit } from '@angular/core';
import { TrainService } from '../train.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
fullName: any;
showuserName :boolean = false;
hideuserName :boolean = true;
constructor(private trainservice:TrainService){}

ngOnInit(): void {
this.trainservice.loginDetails.subscribe((res:any)=>{
this.fullName = res.fullName;
if(res.fullName){
  this.showuserName = true;
  this.hideuserName = false
}else{
  this.showuserName = false;
  this.hideuserName = true
}
})
}
}