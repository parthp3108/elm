import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee';
import { APIResponseModel, EmployeeList, EmployeeModel } from '../../model/Employee.model';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-employee',
  imports: [AsyncPipe,FormsModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee implements OnInit {

  employeeService = inject(EmployeeService)
  employeeList: EmployeeList[] = []
  isModalOpen: boolean = false;
  userRole:string=""

employeeObj:EmployeeModel=new EmployeeModel();

  deptList$:Observable<any[]>=new Observable<any[]>
  roleList$:Observable<any[]>=new Observable<any[]>
  ngOnInit(): void {
    this.getAllEmployee()
    this.deptList$=this.employeeService.getDept()
    this.roleList$=this.employeeService.getRole()

    const userData=localStorage.getItem("leaveUser")
    if(userData){
      this.userRole=JSON.parse(userData).role
      console.log(this.userRole);
      
    }

  }
  getAllEmployee() {
    this.employeeService.getAllEmployee().subscribe({
      next: (res: APIResponseModel) => {
        this.employeeList = res.data
        console.log(this.employeeList)


      },
      error: (message) => {
        console.log(message)

      }
    })

  }

onSaveEmployee(){
  this.employeeService.onSaveeNewEmployee(this.employeeObj).subscribe({
    next:(res:any)=>{
      if(res.result){
      this.closeModal()
        this.getAllEmployee()
     
        alert("Employee Added Successfully")
      }


    },
    error:(message)=>{
      console.log(message)
    }
  })
}

deleteEmp(id:any){
  this.employeeService.deleteEmp(id).subscribe({
    next:(res:any)=>{
      if(res.result){
        this.getAllEmployee()
        alert("Employee Deleted Successfully")
      }
    },
    error:(message)=>{
      console.log(message)
    }
  })

}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }




}
