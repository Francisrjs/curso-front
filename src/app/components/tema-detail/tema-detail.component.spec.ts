import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemaDetailComponent } from './tema-detail.component';

describe('TemaDetailComponent', () => {
  let component: TemaDetailComponent;
  let fixture: ComponentFixture<TemaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemaDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
