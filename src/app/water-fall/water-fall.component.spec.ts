import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterFallComponent } from './water-fall.component';

describe('WaterFallComponent', () => {
  let component: WaterFallComponent;
  let fixture: ComponentFixture<WaterFallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterFallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WaterFallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
