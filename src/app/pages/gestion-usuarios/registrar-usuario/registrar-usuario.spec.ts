import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarUsuario } from './registrar-usuario';

describe('RegistrarUsuario', () => {
  let component: RegistrarUsuario;
  let fixture: ComponentFixture<RegistrarUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
