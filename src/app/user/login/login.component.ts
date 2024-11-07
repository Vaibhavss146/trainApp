import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserLogin, UserRegistration } from 'src/app/user';
import { TrainService } from '../train.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: UserLogin = {
    email: '',
    password: ''
  };
  registrationForm!: FormGroup;
  registrationData!: UserRegistration;
  loginData: any;

  constructor(private fb:FormBuilder, private trainservice:TrainService,private router:Router){};

  ngOnInit() {
    this.initialiseForm();
  }

  initialiseForm(){
    this.registrationForm = this.fb.group({
      'fullName':['',[Validators.required]],
      'mobileNumber':['',[Validators.required,Validators.maxLength(10),Validators.minLength(10)]],
      'adharnumber':['',[Validators.required,Validators.maxLength(12),Validators.minLength(12)]],
      'email':['',[Validators.required,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      'password':['',[Validators.required]],
      'conPassword' :['',[Validators.required]],
      'address':['',[Validators.required]],
      'state':['',[Validators.required]],
      'city':['',[Validators.required]],
      'district':['',[Validators.required]],
    })
  }
  get form(){
    return this.registrationForm.controls;
  }


  submitRegistrationData(){
    let formData = this.registrationForm.value;
    this.trainservice.checkifExist(formData.email).subscribe((res:any)=>{
      if(res){
        alert("User already exist, Please login!!.")
      }else{
        this.trainservice.postRegistrationData('registraionData',formData).subscribe((response:any)=>{
          this.registrationData = response;
          console.log("registrationData res",this.registrationData);
          alert('User registered successfully');
          this.router.navigate(['/login'])
          let ref = document.getElementById('cancel');
          ref?.click();
          this.registrationForm.reset()
        })
      }
    })
  }

  onSubmit(data:UserLogin){
    this.trainservice.userLogin(data).subscribe((res:any)=>{
      if(data.email === res.email){
        this.loginData = res;
        this.trainservice.loginDetails.next(this.loginData)
        console.log("loginData res",this.loginData)
        alert('Login successful');
        this.router.navigate(['/home']);
      } else {
        alert('Login failed! Please check your credentials.');
      }
    })
}
}
