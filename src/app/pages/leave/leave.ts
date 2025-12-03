import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { EmployeeService } from '../../services/employee';
import { Table } from '../../shared/table/table';

@Component({
  selector: 'app-leave',
  imports: [ReactiveFormsModule, CommonModule, Table],
  templateUrl: './leave.html',
  styleUrl: './leave.css',
})
export class Leave implements OnInit {
  isModalOpen = false;
  userRole: string = ""

  employeeService = inject(EmployeeService)

  leaveList: any[] = []
  leaveListForApproval: any[] = []
  currentTab: string = "all-leaves"

  // Table configuration for all leaves
  leaveColumns = ['Leave ID', 'Employee', 'Leave Type', 'From Date', 'To Date', 'No. of Days', 'Status'];
  leaveFields = ['leaveId', 'employeeName', 'leaveType', 'startDate', 'endDate', 'noOfDays', 'leaveStatus'];

  // Table configuration for pending approval
  approvalColumns = ['Leave ID', 'Employee', 'Leave Type', 'From Date', 'To Date', 'No. of Days', 'Reason'];
  approvalFields = ['leaveId', 'employeeName', 'leaveType', 'startDate', 'endDate', 'noOfDays', 'details'];



  leaveForm: FormGroup = new FormGroup({
    leaveId: new FormControl(0),
    employeeId: new FormControl(0),
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    noOfDays: new FormControl(0),
    leaveType: new FormControl(''),
    details: new FormControl(''),
    isApproved: new FormControl(false),
    approvedDate: new FormControl(null)
  })

  openModal() {
    this.isModalOpen = true;
    this.resetForm();
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }



  resetForm() {
    const currentEmployeeId = this.leaveForm.get('employeeId')?.value;
    this.leaveForm.reset({
      leaveId: 0,
      employeeId: currentEmployeeId || 0,
      fromDate: '',
      toDate: '',
      noOfDays: 0,
      leaveType: '',
      details: '',
      isApproved: false,
      approvedDate: null
    });
  }

  ngOnInit(): void {
    this.loadLeaves();
    this.loadLeavesForApproval();
    const userData = localStorage.getItem("leaveUser")
    if (userData) {
      const parsedData = JSON.parse(userData)
      this.userRole = parsedData.role
    }
  }

  calculateDays() {
    const fromDate = this.leaveForm.get('fromDate')?.value;
    const toDate = this.leaveForm.get('toDate')?.value;

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      if (to >= from) {
        const diffTime = Math.abs(to.getTime() - from.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        this.leaveForm.patchValue({ noOfDays: diffDays });
      } else {
        this.leaveForm.patchValue({ noOfDays: 0 });
      }
    }
  }

  constructor() {
    const loggedData = localStorage.getItem("leaveUser")
    console.log("Raw localStorage data:", loggedData);
    if (loggedData != null) {
      const loggedParsedData = JSON.parse(loggedData)
      console.log("Parsed user data:", loggedParsedData);
      console.log("Employee ID:", loggedParsedData.id || loggedParsedData.employeeId);
      const empId = loggedParsedData.id || loggedParsedData.employeeId;
      this.leaveForm.controls['employeeId'].setValue(empId)
    }
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;

    // Load appropriate data based on tab
    if (tabName === 'pending-approval') {
      this.loadLeavesForApproval();
    } else if (tabName === 'all-leaves') {
      this.loadLeaves();
    }
  }

  loadLeaves() {
    const empId = this.leaveForm.controls['employeeId'].value
    this.employeeService.getAllLeavesByEmpId(empId).subscribe({
      next: (res: any) => {
        this.leaveList = res.data.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        console.log(this.leaveList)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  loadLeavesForApproval() {
    this.employeeService.getAllLeaves().subscribe({
      next: (res: any) => {
        this.leaveListForApproval = res.data.filter((m: any) => m.isApproved == null).sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  submitLeave() {
    const formValue = this.leaveForm.value

    this.employeeService.onAddLeave(formValue).subscribe({
      next: () => {
        alert("Leave submitted successfully")
        this.loadLeaves()
        this.closeModal()


      },
      error: (err) => {
        console.log(err)
      }
    })


  }
  approveLeave(id: number) {
    this.employeeService.approveLeave(id).subscribe({
      next: () => {
        this.loadLeavesForApproval()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  rejectLeave(id: number) {
    this.employeeService.rejectLeave(id).subscribe({
      next: () => {
        this.loadLeavesForApproval()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}