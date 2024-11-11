import { Component, OnInit, ViewChild } from '@angular/core';
import { TrainService } from '../train.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-ticket-booking',
  templateUrl: './ticket-booking.component.html',
  styleUrls: ['./ticket-booking.component.css']
})
export class TicketBookingComponent implements OnInit {
 alltrainDetails: any;
  filteredTrains: any[] = [];
  showfilteredTrainData :boolean = false;
  showpassengerdetailsForm :boolean = false; 
  showtablePassengerDetails :boolean = false;
  showAllbookingDetails :boolean = false;
  bookingId: any;
  total : number = 0;
  booking = {
    fullName: '',
    age: '',
    trainClass: '',
    arrivalStation: '',
    dateOfjourney: '',
    departureStation: '',
    totalFare: ''
  };
  moreBooking= {
    fullName: '',
    age: '',
    trainClass: '',
    arrivalStation: '',
    dateOfjourney: '',
    departureStation: '',
    totalFare: ''
  };
  minDate:string; 
  maxDate:string;
  selectedTrain: any;
  totalFare: any;
  calculatedFare: number = 0;
  bookingDetails: any;
  passengers: any[] = [];
  newPassenger: any = {};
  bookingData: any;
  valuesArray: any[] = [];
  newPassengers: any[] = [{}];
  moreBookingData: any;
  combinedBookingData: any;
  passengerDetails: any;
  allPassangerDataa: any;
 constructor(private trainservice:TrainService,private route:ActivatedRoute, private router:Router){
  const today = new Date();
      const nextMonth = new Date;
      nextMonth.setMonth(today.getMonth() + 1);
    this.minDate = today.toISOString().split('T')[0];
    this.maxDate = nextMonth.toISOString().split('T')[0];
 }

 ngOnInit() {
   this.getAlltrains();
 }

 async getAlltrains() {
  try {
    this.alltrainDetails = await this.trainservice.alltrains('GetAllTrains').subscribe((res:any)=>{
      this.alltrainDetails = res
      console.log("alltrain res", this.alltrainDetails);
    });
  } catch (error) {
    console.error("Error fetching all trains:", error);
    alert("Failed to load train data. Please try again.");
  }
}

 searchTrain(departure: string, arrival: string){
  this.filteredTrains = this.alltrainDetails.filter((train: any) =>
    train.departureStationName.toLowerCase() === (departure.toLowerCase()) &&
    train.arrivalStationName.toLowerCase() === (arrival.toLowerCase())
  ); 
  if (this.filteredTrains.length > 0) {
    this.showfilteredTrainData = true;
    this.showpassengerdetailsForm = false;
    this.showtablePassengerDetails = false;
    this.showAllbookingDetails = false;
    console.log('Filtered Trains:', this.filteredTrains);
    this.booking.departureStation = departure;
    this.booking.arrivalStation = arrival;
  } else {
    alert('No train found');
  }
 }

 bookTicket(id:any){
  this.showfilteredTrainData = false;
  this.showpassengerdetailsForm = true;
  this.showtablePassengerDetails = false;
  this.showAllbookingDetails = false;
  this.bookingId = id;
  this.selectTrainById();
}

selectTrainById(): void {
  if (this.bookingId) {
     this.selectedTrain = this.filteredTrains.find((train: any) => train.id === this.bookingId);
     console.log("selected train details", this.selectedTrain)
     this.trainservice.selectedTraindetails.next(this.selectedTrain)
    if (this.selectedTrain) {
      this.booking.departureStation = this.selectedTrain.departureStationName;
      this.booking.arrivalStation = this.selectedTrain.arrivalStationName;
      this.totalFare  = this.selectedTrain.totalFare; 
    } else {
      console.error('Train not found');
    }
  }
}

onClassChange() {
  switch (this.booking.trainClass) {
    case 'ac':
      this.calculatedFare = this.totalFare + 100;
      break;
    case 'First':
      this.calculatedFare = this.totalFare + 200;
      break;
    case 'Second':
      this.calculatedFare = this.totalFare + 300;
      break;
      case 'Tatkal':
      this.calculatedFare = this.totalFare + 600;
      break;
    default:
      this.calculatedFare = this.totalFare;
      break;
  }
      this.booking.totalFare = JSON.stringify(this.calculatedFare);
}

onChange(passenger: any) {
  switch (passenger.trainClass) {
    case 'ac':
      passenger.totalFare = this.totalFare + 100;
      break;
    case 'First':
      passenger.totalFare = this.totalFare + 200;
      break;
    case 'Second':
      passenger.totalFare = this.totalFare + 300;
      break;
    case 'Tatkal':
      passenger.totalFare = this.totalFare + 600;
      break;
    default:
      passenger.totalFare = this.totalFare;
      break;
  }
}


addPassenger(data:any){
  this.bookingData = Array.isArray(data) ? data : [data];
  this.showfilteredTrainData = false;
  this.showpassengerdetailsForm = false;
  this.showtablePassengerDetails = true;
  this.showAllbookingDetails = false;

}

onSubmit(data:any){
  this.trainservice.submitpassengerDetails('bookingDetails',data).subscribe((res:any)=>{
    this.passengerDetails = res;
    console.log("passengerDetails res",this.passengerDetails)
    this.trainservice.passengerDetailsforPyamnet.next(this.passengerDetails)
    this.router.navigate(['/paymentdetails'])
  })
  }
  
  addPassengers(data:any) {  
    this.showfilteredTrainData = false;
    this.showpassengerdetailsForm = false;
    this.showtablePassengerDetails = false;
    this.showAllbookingDetails = true;
    this.combinedBookingData = [...this.bookingData, ...this.newPassengers];
    this.calculateTotal();

  }
  
  addMoreFields() { 
    this.newPassengers.push({
    fullName: '',
    trainClass: '',
    age: null,
    departureStation: this.booking.departureStation,
    arrivalStation: this.booking.arrivalStation,
    totalFare: this.booking.totalFare
    });
    this.calculateTotal();
  }
  BackButton(){
    this.showfilteredTrainData = false;
    this.showpassengerdetailsForm = false;
    this.showtablePassengerDetails = true;
    this.showAllbookingDetails = false;
  }
  calculateTotal() {
    this.total = this.combinedBookingData.reduce((sum: number, currentItem: { totalFare: any; }) => {
      return sum + Number(currentItem.totalFare); 
    }, 0);
    // this.total = this.total = this.combinedBookingData.reduce((sum:number, currentItem: { totalFare: any; }) =>  sum + parseFloat(currentItem.totalFare), 0)
  }

  ProceedforPayment(){
    this.trainservice.submitpassengerDetails('bookingDetails',this.combinedBookingData).subscribe((res:any)=>{
     this.allPassangerDataa = res;
     console.log("allPassangerDataa details",this.allPassangerDataa)
  })
  }

  deletePassengerData(index:any){
    if (index >= 0 && index < this.combinedBookingData.length) {
      this.combinedBookingData.splice(index, 1);
    };
    this.calculateTotal();
  }


  BacktoBooking(){
    this.showfilteredTrainData = false;
    this.showpassengerdetailsForm = true;
    this.showtablePassengerDetails = false;
    this.showAllbookingDetails = false;
   }

}