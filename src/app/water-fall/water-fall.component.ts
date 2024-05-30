import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-water-fall',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './water-fall.component.html',
  styleUrl: './water-fall.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush //使用onpush 策略减少不必要的变化检测
})
export class WaterFallComponent  {
  @Input()
  images: string[] = [];

}

