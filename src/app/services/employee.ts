import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APIResponseModel } from '../model/Employee.model';



@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) { }

  onLogin(obj: any) {
    return this.http.post("https://freeapi.miniprojectideas.com/api/EmployeeLeave/Login", obj)
  }
  getAllEmployee(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>("https://freeapi.miniprojectideas.com/api/EmployeeLeave/GetEmployees")
  }
 getAllLeaves(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>("https://freeapi.miniprojectideas.com/api/EmployeeLeave/GetAllLeaves")
  }
  approveLeave(id:number):Observable<APIResponseModel>{
  return this.http.get<APIResponseModel>("https://freeapi.miniprojectideas.com/api/EmployeeLeave/ApproveLeave?id="+id)
}

rejectLeave(id:number):Observable<APIResponseModel>{
  return this.http.get<APIResponseModel>("https://freeapi.miniprojectideas.com/api/EmployeeLeave/RejectLeave?id="+id)
}
  getDept() {
  return this.http.get("https://freeapi.miniprojectideas.com/api/EmployeeLeave/GetDepartments")
    .pipe(
      map((res: any) => res.data)
    );//pipe is used to extract the required data from the response(here we want res.data only)
}

getRole() {
  return this.http.get("https://freeapi.miniprojectideas.com/api/EmployeeLeave/GetAllRoles")
    .pipe(
      map((res:any)=>res.data)
    )
}

onSaveeNewEmployee(obj:any){
  return this.http.post("https://freeapi.miniprojectideas.com/api/EmployeeLeave/CreateEmployee",obj)

}

deleteEmp(id: number){
  return this.http.delete(
    "https://freeapi.miniprojectideas.com/api/EmployeeLeave/DeleteEmployee?id=" + id
  );
}

onAddLeave(obj:any){
  return this.http.post("https://freeapi.miniprojectideas.com/api/EmployeeLeave/AddLeave",obj)
}
 
getAllLeavesByEmpId (id:number): Observable<APIResponseModel> {
  return this.http.get<APIResponseModel>("https://freeapi.miniprojectideas.com/api/EmployeeLeave/GetAllLeavesByEmployeeId?id="+id)
  }

  getLeavesApprovalBySupervisor(id:number): Observable<APIResponseModel>{
    return this.http.get<APIResponseModel>("https://freeapi.miniprojectideas.com/api/EmployeeLeave/GetAllLeavesBySupervisor?id="+id)
  }



}

