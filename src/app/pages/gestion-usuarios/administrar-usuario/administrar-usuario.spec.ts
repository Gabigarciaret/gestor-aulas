import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarUsuario } from './eliminar-usuario';

describe('EliminarUsuario', () => {
  let component: EliminarUsuario;
  let fixture: ComponentFixture<EliminarUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
