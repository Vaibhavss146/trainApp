import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, pipe, throwError } from 'rxjs';
import { allTraions, UserLogin, UserRegistration } from '../user';

@Injectable({
  providedIn: 'root'
})
export class TrainService {
baseUrl = "http://localhost:3000/";
private isAuthenticated = false; 
loginDetails = new BehaviorSubject<any>('')
selectedTraindetails = new BehaviorSubject<any>('')
passengerDetailsforPyamnet = new BehaviorSubject<any>('')
httpHeader:HttpHeaders = new HttpHeaders().set('content-type','application/json');

  constructor(private http:HttpClient) { }

  handleError(error:HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      console.log("Client side error",error.error.message)
    }else{
      console.log("Server Side Error",error.message)
    }
    return throwError("We are unable to fetch your request,please try after some time")
  }

  postRegistrationData(endPoint:any, requestbody:UserRegistration){
  let url = this.baseUrl + endPoint;
  return this.http.post(url,requestbody,{'headers':this.httpHeader}).pipe(catchError(this.handleError));
  }

   checkifExist(email:any):Observable<any>{
 return this.http.get<UserRegistration[]>(this.baseUrl + 'registraionData').pipe(
 map(registraionData => registraionData.find(data => data.email === email))
 )
  }

  userLogin(requestbody:UserLogin):Observable<any>{
   return this.http.get<any[]>(this.baseUrl + 'registraionData').pipe(
    map(registraionData => registraionData.find(data => data.email === requestbody.email && data.password === requestbody.password),
    this.isAuthenticated = true
  )
   )
  }

  alltrains(endPoint:any):Observable<any>{
    let url = this.baseUrl + endPoint
    return this.http.get<allTraions[]>(url,{'headers':this.httpHeader}).pipe(catchError(this.handleError))
  }

  isLoggedin(){
    return this.isAuthenticated
  }

  submitpassengerDetails(endPoint:any,requestbody:UserRegistration){
    let url = this.baseUrl + endPoint;
    return this.http.post(url,requestbody,{'headers':this.httpHeader}).pipe(catchError(this.handleError));
  }

  generateOTP(){
    const otp = Math.floor(1000 + Math.random() * 9000);
     return otp.toString(); 
  }

  sendOtp(mobileNumber: string, otp: string): Observable<any> {
    const otpDetails = {
      mobileNumber: mobileNumber,
      otp: otp
    };
    return this.http.post(this.baseUrl + 'otp', otpDetails);
  }
  verifyOtp(mobileNumber: string, otp: string): Observable<any> {
    return this.http.get(`${this.baseUrl + 'otp'}?mobileNumber=${mobileNumber}&otp=${otp}`);
  }
}
