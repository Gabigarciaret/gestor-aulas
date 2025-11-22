export interface Usuario {
    id:string;
    apellido:string;
    nombre: string;
    password:string;
    rol: 'ADMIN' | 'PROFESOR';
    email:string;
}