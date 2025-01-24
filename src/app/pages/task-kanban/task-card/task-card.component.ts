import { Component, Input } from '@angular/core';

@Component({
  selector: 'kanban-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  standalone: true,
})
export class TaskCardComponent {
  @Input() title: string = '';
  @Input() priority: string = '';
  @Input() SP: number = 0;
  @Input() type: string = '';
  @Input() developer: string = '';
}
