import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginModel } from '../../model/Employee.model';
import { EmployeeService } from '../../services/employee';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginObj:LoginModel = new LoginModel();

  employeeService=inject(EmployeeService)   
  router=inject(Router)
  
  onLogin(){
    this.employeeService.onLogin(this.loginObj).subscribe({
      next:(res:any)=>{
        console.log(res)
        if(res.result){
          alert("Login Success")
          localStorage.setItem("leaveUser",JSON.stringify(res.data))
          this.router.navigateByUrl("/employees")
          
        }else{
          alert(res.message)
        }
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
}