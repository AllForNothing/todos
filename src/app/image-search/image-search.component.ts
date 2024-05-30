import { Component, EventEmitter, Output,} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-image-search',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './image-search.component.html',
  styleUrl: './image-search.component.scss'
})
export class ImageSearchComponent {

  @Output()
  inputEvent = new EventEmitter<string>;

  inputValue: string = '';

  input() {
    this.inputEvent.emit(this.inputValue);
  }
}
