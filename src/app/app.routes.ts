import { Routes } from '@angular/router';

import { TaskKanbanComponent } from '@/pages/task-kanban/task-kanban.component';
import { TaskTableComponent } from '@/pages/task-table/task-table.component';

export const routes: Routes = [
  { path: 'table', component: TaskTableComponent },
  { path: 'kanban', component: TaskKanbanComponent },
  { path: '', redirectTo: '/table', pathMatch: 'full' },
];
