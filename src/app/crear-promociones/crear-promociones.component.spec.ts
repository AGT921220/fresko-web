import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPromocionesComponent } from './crear-promociones.component';

describe('CrearPromocionesComponent', () => {
  let component: CrearPromocionesComponent;
  let fixture: ComponentFixture<CrearPromocionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearPromocionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPromocionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
