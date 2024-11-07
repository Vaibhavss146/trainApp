import { Component, OnInit } from '@angular/core';
import { TrainService } from '../train.service';

@Component({
  selector: 'app-ticket-booking',
  templateUrl: './ticket-booking.component.html',
  styleUrls: ['./ticket-booking.component.css']
})
export class TicketBookingComponent implements OnInit {
 alltrainDetails: any;
  filteredTrains: any[] = [];
  showfilteredTrainData :boolean = false;
 constructor(private trainservice:TrainService){}

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
    console.log('Filtered Trains:', this.filteredTrains);
  } else {
    alert('No train found');
  }
 }
}
