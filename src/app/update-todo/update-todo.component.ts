import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-update-todo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-todo.component.html',
  styleUrl: './update-todo.component.scss'
})
export class UpdateTodoComponent {
  title: string = ''
  isOpen: boolean = false;
  @Output()
  updateEvent = new EventEmitter<string>;
  save() {
    this.updateEvent.emit(this.title);
  }
}
