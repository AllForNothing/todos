import {Component, OnDestroy, OnInit} from '@angular/core';
import {WaterFallComponent} from "../water-fall/water-fall.component";
import {EXAMPLE_IMAGES} from "../interface";
import {ImageSearchComponent} from "../image-search/image-search.component";
import {debounceTime, distinctUntilChanged, finalize, Subject, Subscription, switchMap} from "rxjs";
import {ImageServiceService} from "../image-service.service";
import {CommonModule, KeyValuePipe} from "@angular/common";

@Component({
  selector: 'app-image-list',
  standalone: true,
  imports: [
    WaterFallComponent,
    ImageSearchComponent,
    KeyValuePipe,
    CommonModule
  ],
  templateUrl: './image-list.component.html',
  styleUrl: './image-list.component.scss'
})
export class ImageListComponent implements OnInit, OnDestroy{
  images: string[] = EXAMPLE_IMAGES;

  sub: Subscription;

  private _searchSubject = new Subject<string>()

  constructor(private imageService: ImageServiceService) {
  }
  handleInputEvent(inputValue: string) {
    this._searchSubject.next(inputValue);
  }

  currenTaskId: string; // 记录当前正在执行的taskId

  loading: boolean = false;// loading taskId

  get allTasks() { // 需求中并未描述拿到任务结果要干什么，这里旧简单地把所有任务展示在页面上
    return this.imageService.getAllTasks();
  }
  ngOnInit() {
    if (!this.sub) {
      this.sub = this._searchSubject.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(
          (input: string) => {
            //  发出请求以便得到taskId， loading 设置为 ture, 请求结束之后loading 设为 false
            this.loading = true;
            return this.imageService.startSearch(input).pipe(finalize(() => this.loading = false));
          }
        )
      ).subscribe(res => {
        // 拿到当前taskId, 保存在this.currenTaskId， 此时轮询已经开启
        this.currenTaskId = res;
      })
    }
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null!;
    }
  }

}
