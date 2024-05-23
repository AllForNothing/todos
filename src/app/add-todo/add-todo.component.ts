import {Component, EventEmitter, Output} from '@angular/core';
import {ToDo} from "../interface";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss'
})
export class AddTodoComponent {
  @Output()
  addEvent = new EventEmitter<ToDo>
  todo: ToDo = {
    userId: '',
    id: '',
    title: '',
    completed: false
  };

  handleOk() {
    this.todo.id =  Math.random().toString();
    this.addEvent.emit(this.todo);
  }

  cancel() {
    this.addEvent.emit(undefined);
  }
}
