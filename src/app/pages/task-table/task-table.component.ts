import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule],
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css'],
})
export class TaskTableComponent {
  displayedColumns: string[] = [
    'task',
    'developer',
    'status',
    'priority',
    'type',
    'date',
    'estimatedSP',
    'actualSP',
    'action',
  ];
  dataSource = [
    {
      task: 'New Task',
      developer: '',
      status: '',
      priority: '',
      type: '',
      date: '',
      estimatedSP: '0 SP',
      actualSP: '0 SP',
    },
    {
      task: 'New task',
      developer: '',
      status: 'Working for review',
      priority: 'Medium',
      type: 'Feature Extracted',
      date: '',
      estimatedSP: '0 SP',
      actualSP: '0 SP',
    },
    {
      task: 'New Task',
      developer: '',
      status: 'In Progress',
      priority: 'Base Effort',
      type: 'Feature Extracted',
      date: '',
      estimatedSP: '',
      actualSP: '',
    },
    {
      task: 'Conventional Feature',
      developer: '',
      status: 'Ready to start',
      priority: 'High',
      type: 'Offset',
      date: '',
      estimatedSP: '2 SP',
      actualSP: '15 SP',
    },
  ];
}
