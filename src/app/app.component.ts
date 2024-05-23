import {Component, OnInit, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ToDo} from "./interface";
import {FormsModule} from "@angular/forms";
import {AddTodoComponent} from "./add-todo/add-todo.component";
import {CommonModule} from "@angular/common";
import {UpdateTodoComponent} from "./update-todo/update-todo.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, FormsModule, AddTodoComponent,CommonModule, UpdateTodoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  @ViewChild(UpdateTodoComponent)
  updateTodoComponent: UpdateTodoComponent;
  title = 'todos';
  showAddForm: boolean = false;

  todos: ToDo[] = [];
  editIndex: number = -1;
  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get('todos').subscribe(
      res   => {

        if ((res as Array<ToDo>)?.length) {
          this.todos = res as Array<ToDo>;
        }
      }
    )
  }


  removeItem(i: number) {
     this.todos.splice(i, 1);
  }


  addEvent(todo: ToDo) {
    if(todo) {
      this.todos.push(todo);
    }
    this.showAddForm = false;
  }

  update(i: number) {
    this.editIndex = i;
    this.updateTodoComponent.isOpen = true;
    this.updateTodoComponent.title = this.todos[i].title;
  }

  saveUpdate(title: string) {
    if (title) {
      this.todos[this.editIndex].title = title;
    }
    this.updateTodoComponent.isOpen = false;
  }
}
