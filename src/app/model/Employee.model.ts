export class LoginModel{
    emailId:string;
    password:string;
    constructor(){
        this.emailId="";
        this.password="";
    }
}
export interface APIResponseModel{
  message:string;
  result:boolean;
  data:any;
}

export interface EmployeeList{

    employeeId: 333,
      employeeName: "Yash5",
      deptId: 177,
      deptName: "iausdsd",
    contactNo: "12345",
      emailId: "yash@gmail.com",
      role: "Admin Department Employee"
}


export class EmployeeModel {
  employeeId: number
  employeeName: string
  contactNo: string
  emailId: string
  deptId: string
  password: string
  gender: string
  role: string
  constructor(){
    this.employeeId=0;
    this.employeeName="";
    this.contactNo="";
    this.emailId="";
    this.deptId="";
    this.password="";
    this.gender="";
    this.role="";
  }
}
