export interface UsuarioCreateDto {
    apellido:string;
    nombre: string;
    password:string;
    rol: 'ADMIN' | 'PROFESOR';
    email:string;
}