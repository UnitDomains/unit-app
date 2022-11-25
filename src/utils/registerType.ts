export enum RegisterProcessState {
  NotStart, //Before 'Request to register'
  Step1, //'Request to register'
  Step2, //'Request to register'
  Step3Begin, //'Complete Registration' Beginning
  Step3Pending, //'Complete Registration'
  End, //domain name was registered

  Unknown,
}

export enum RegisterProcessResult {
  NotStart,
  Processing,
  Success,

  Unknown,
}
