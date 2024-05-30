import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  map,
  Observable,
  Subscriber,
} from "rxjs";
import {EXAMPLE_IMAGES} from "./interface";

@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  // 需求： 搜索查询（可写多个函数，但触发该过程只call其中一个即可）调用后端接口，需立即返回触发调用本身的结果的同时，
  //       亦返回后端请求的最终结果，该接口为异步过程，请求后将立即返回`taskid`，需根据`taskid`查询执行状态直至产生结果`result`


  private _tasks: {[key: string]: TaskResponse} = {} // 用于存储轮询任务
  constructor(
    private http: HttpClient
  ) {
  }

  getAllTasks() {
    return this._tasks;
  }

  /**
   * 该方法会根据用户的输入生成对应的taskId,  taskId  和  input值是一一对应的， 也就是每一次请求都会产生一个taskId
   * @param input
   */
  startSearch(input: string): Observable<string> {
    // 通过map 操作符， 我们实现了效果， 在拿到后端返回的taskId后, 我们就开启轮询
    return getTaskId(input).pipe(map(res => {
      if (res) {
        this.setJob(res);
      }
      return res;
    }));
  }

  /**
   * 开启轮询， 轮询间隔为 3秒
    * @param taskId
   */
   setJob(taskId: string) {
    queryTask(taskId).subscribe(
      res => {
        this._tasks[taskId] = res;
        if (this._tasks[taskId]?.state === TaskState.RUNNING) {
          setTimeout(() => {
            this.setJob(taskId);
          }, 3000)
        }
      }
    )
  }
}

//根据对新完善的需求的理解， 那就是存在两个后端 API 一个是根据用户输入的 input value 得到taskId, 这个接口的返回很快
// 另一个是根据taskId 查询一个结果，具体的结果取决于这个任务在后端的完成状态， 换句话说，在任务完成前，调用这个接口会返回任务还在running的状态，
// 只有在完成之后， 调用才能拿到最终结果， 因此前端需要轮询调用此接口
//  我在下面模拟了这个两个接口

/**
 * 访问这个接口50毫秒后拿到结果, taskId 和 input  一一对应， 所以干脆假设他们相等
 * @param input
 */
export function getTaskId(input: string) {
  console.log("发起请求：getTaskId")
  return new Observable<string>(
    subscriber => {
      setTimeout(() => {
        //每次请求成功都会创建后端请求
        setBackendTask(input);
        console.log("得到请求响应", input)
        subscriber.next(input);
        subscriber.complete();
      }, 50)
    }
  )
}



/**
 * 根据taskId 请求结果， 具体返回依据后端这个任务的运行状态： 1 运行中  返回  {state: 'running'} 2 完成 返回
 * {
 *   state: 'finished',
 *   date: [图片地址的数组]
 * }
 */
export function queryTask(taskId: string) {
  console.log("发起请求：queryTask")
  return new Observable<TaskResponse>(
    (subscriber: Subscriber<TaskResponse>) => {
      setTimeout(() => {
        if (taskStore[taskId] === TaskState.RUNNING) {
          console.log("得到请求响应", {
            state: TaskState.RUNNING
          })
          subscriber.next({
            state: TaskState.RUNNING
          });
        }
        if (taskStore[taskId] === TaskState.FINISHED) {
          console.log("得到请求响应",{
            state: TaskState.FINISHED,
            data: EXAMPLE_IMAGES
          })
          subscriber.next({
            state: TaskState.FINISHED,
            data: EXAMPLE_IMAGES
          })
        }
        subscriber.complete();
      }, 50)
    }
  )
}

// 模拟后端的任务仓库
const taskStore: {[key: string]: TaskState} = {

};

/**
 * 这个方法模拟后端执行任务， 每个任务耗时15秒
 * @param taskId
 */
function setBackendTask(taskId: string) {
  if (!taskStore[taskId]) {
    taskStore[taskId] = TaskState.RUNNING;
    setTimeout(() => {
      taskStore[taskId] = TaskState.FINISHED;
    }, 15000)
  }
}

enum TaskState {
  RUNNING='running',
  FINISHED='finished'
}


interface TaskResponse {
  state: TaskState,
  data?: string[]
}
