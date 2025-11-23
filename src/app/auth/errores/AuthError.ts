export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }

  static CredencialesInvalidas(): AuthError {
    return new AuthError('La contraseña es incorrecta');
  }

  static UsuarioNoRegistrado(): AuthError {
    return new AuthError('El correo electrónico que ingresaste no está conectado a una cuenta');
  }

  static UsuarioEliminado(): AuthError {
    return new AuthError('El usuario registrado con este email ha sido eliminado');
  }
}