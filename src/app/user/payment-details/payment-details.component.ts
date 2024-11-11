import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainService } from '../train.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit{
  paymentDetailsForm!: FormGroup
  passengerDetails: any;
  totalFare: any;
  gstAmount:number = 0;
  totalamounttoPay: number = 0;
  amount : number = 0;
  showPaymentDetails :boolean = true;
  showotpdialogBox :boolean = false;
  showbookingDetails :boolean = false;
  otpError: string = '';
  enteredOtp: string = '';
  digitArray: string[] = ['', '', '', ''];
  attempts:number = 0;
  maxAttempts:number = 3;
  mobileNumber: any;
  receivedOTP: any;
  trainNumber: any;
  trainName: any;
  constructor(private fb:FormBuilder,private trainservice:TrainService, private router:Router){}

  ngOnInit() {
    this.initaliseForm();
    this.trainservice.passengerDetailsforPyamnet.subscribe((res:any)=>{
      this.passengerDetails = res;
      this.totalFare = this.passengerDetails.totalFare;
      this.passengerDetails = Array.isArray(res) ? res : [res]
    });
    this.trainservice.loginDetails.subscribe((res:any)=>{
      this.mobileNumber = res.mobileNumber
    });
    this.calculateGST();
    this.trainservice.selectedTraindetails.subscribe((res:any)=>{
      this.trainNumber = res.trainNo,
      this.trainName = res.trainName
    });
    
  }

  initaliseForm(){
    this.paymentDetailsForm = this.fb.group({
   "cardHolder":['',[Validators.required]],
   "expiryDateMM":['',[Validators.required,Validators.maxLength(2),Validators.minLength(2)]],
   "expiryDateYY":['',[Validators.required,Validators.maxLength(2),Validators.minLength(2)]],
   "cardHolderName":['',[Validators.required]],
   "cardCVV":['',[Validators.required]],
    })
  }
  get form(){
    return this.paymentDetailsForm.controls;
  }

  calculateGST(){
     this.gstAmount = ((this.totalFare) * 18 ) / 100;
     this.totalamounttoPay = JSON.parse (this.totalFare) + (this.gstAmount);
     this.amount = this.totalamounttoPay + 10
  }

  proccedForPayment(data:any){
    this.showPaymentDetails = false;
    this.showbookingDetails = false
    this.showotpdialogBox  = true;
    const generatedOtp = this.trainservice.generateOTP();
    this.trainservice.sendOtp(this.mobileNumber, JSON.parse(generatedOtp)).subscribe(
      (res:any) => {
        this.receivedOTP = res;
        console.log("received otp",this.receivedOTP)
      },
      (error) => {
        console.error("Failed to send OTP", error);
      }
    );
  }

  verifyOtp() {
    this.enteredOtp = this.digitArray.join('');
    this.trainservice.verifyOtp(this.mobileNumber, this.enteredOtp).subscribe(
      (response) => {
        if (response.length > 0) {
          this.otpError = '';
          this.otpError = 'OTP verified....Your payment is successfull.';
          this.showPaymentDetails = false;
          this.showbookingDetails = true
          this.showotpdialogBox  = false;
        } else {
          this.attempts++;
          this.otpError = `Invalid OTP! Attempt ${this.attempts} of ${this.maxAttempts}`;
          if (this.attempts >= this.maxAttempts) {
            alert('Payment failed!!! Maximum attempts reached');
            this.router.navigate(['/alltrains']) // Navigate to home page after 3 wrong attempts
          }
        }
      },
      (error) => {
        console.error("OTP verification failed", error);
      }
    );
  }
}
