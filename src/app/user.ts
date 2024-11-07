export interface UserLogin {
    email:string;
    password:string;
}

export interface UserRegistration {
      fullName:string,
      mobileNumber: number,
      adharnumber: number,
      email: string,
      password: string,
      conPassword: string,
      address: string,
      state: string,
      city: string,
      district: string
}

export interface allTraions{
    trainId: number,
    trainNo: number,
    trainName: string,
    departureStationName:string,
    arrivalStationName: string,
    arrivalTime:string,
    departureTime: string,
    totalFare: number,
}