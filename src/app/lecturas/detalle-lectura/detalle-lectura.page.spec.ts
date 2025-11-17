import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleLecturaPage } from './detalle-lectura.page';

describe('DetalleLecturaPage', () => {
  let component: DetalleLecturaPage;
  let fixture: ComponentFixture<DetalleLecturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleLecturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
