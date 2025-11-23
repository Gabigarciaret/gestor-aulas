import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivarUsuario } from './reactivar-usuario';

describe('ReactivarUsuario', () => {
  let component: ReactivarUsuario;
  let fixture: ComponentFixture<ReactivarUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactivarUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactivarUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
