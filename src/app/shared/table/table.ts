import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  @Input() columns: string[] = [];  
  @Input() fields: string[] = [];   
  @Input() data: any[] = [];      
}
