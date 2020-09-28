import { UserModel } from '@cotvisor-admin/models/user.model';

/**
 * Clase de la respuesta del servicio de logado
 *
 * @export
 * @class LoginResponse
 */
export class LoginResponse {
  private _token: string;
  private _user: UserModel;

  public get token(): string {
    return this._token;
  }
  public set token(value: string) {
    this._token = value;
  }
  public get user(): UserModel {
    return this._user;
  }
  public set user(value: UserModel) {
    this._user = value;
  }
}
