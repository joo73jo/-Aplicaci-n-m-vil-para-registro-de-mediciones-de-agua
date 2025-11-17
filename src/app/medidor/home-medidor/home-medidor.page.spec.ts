import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeMedidorPage } from './home-medidor.page';

describe('HomeMedidorPage', () => {
  let component: HomeMedidorPage;
  let fixture: ComponentFixture<HomeMedidorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMedidorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
