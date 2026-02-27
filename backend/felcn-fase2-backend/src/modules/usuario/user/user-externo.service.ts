import {
  Injectable,
  HttpException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsuarioExternoService {

  private readonly userApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userApiUrl =
      this.configService.get<string>('USER_API_URL')!;
  }

  private buildAuthHeader(token: string) {
    return token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`;
  }

  /* CREAR USUARIO */

  async crearUsuarioExterno(dto: any, token: string) {

    try {

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.userApiUrl}/api/usuarios`,
          dto,
          {
            headers: {
              Authorization: this.buildAuthHeader(token),
            },
          },
        ),
      );

      return response.data;

    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  /* ACTUALIZAR USUARIO */

  async actualizarUsuarioExterno(
    idUsuario: number,
    dto: any,
    token: string,
  ) {

    try {

      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.userApiUrl}/api/usuarios/${idUsuario}`,
          dto,
          {
            headers: {
              Authorization: this.buildAuthHeader(token),
            },
          },
        ),
      );

      return response.data;

    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  /* Manejo centralizado de errores */

 private handleAxiosError(error: any): never {

  if (error.response) {

    const status = error.response.status || 500;
    const data =
      error.response.data ||
      'Error recibido desde el servicio USER';

    throw new HttpException(data, status);
  }

  if (error.request) {
    throw new HttpException(
      'No se pudo conectar con el servicio USER',
      503,
    );
  }

  throw new HttpException(
    error.message || 'Error inesperado',
    500,
  );
}
}