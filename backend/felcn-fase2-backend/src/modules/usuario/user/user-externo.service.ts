import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
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
    this.userApiUrl = this.configService.get<string>('USER_API_URL')!;
  }

  /* Helpers */
  private buildAuthHeader(token: string) {
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  private async patchRequest(
    url: string,
    token: string,
    body: any = {},
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(url, body, {
          headers: {
            Authorization: this.buildAuthHeader(token),
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  /* Métodos públicos */
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

  async actualizarUsuarioExterno(
    idUsuario: number,
    dto: any,
    token: string,
  ) {
    return this.patchRequest(
      `${this.userApiUrl}/api/usuarios/${idUsuario}`,
      token,
      dto,
    );
  }

  async activarUsuarioExterno(
    idUsuario: number,
    token: string,
  ): Promise<void> {
    const data = await this.patchRequest(
      `${this.userApiUrl}/api/usuarios/${idUsuario}/activacion`,
      token,
    );

    if (!data?.finalizado) {
      throw new BadRequestException(
        'Servicio externo no confirmó la activación',
      );
    }
  }

  async desactivarUsuarioExterno(
    idUsuario: number,
    token: string,
  ): Promise<void> {
    const data = await this.patchRequest(
      `${this.userApiUrl}/api/usuarios/${idUsuario}/inactivacion`,
      token,
    );

    if (!data?.finalizado) {
      throw new BadRequestException(
        'Servicio externo no confirmó la inactivación',
      );
    }
  }

  /* Manejo centralizado de errores */
  private handleAxiosError(error: any): never {
    if (error.response) {
      throw new HttpException(
        error.response.data,
        error.response.status || 500,
      );
    }

    if (error.request) {
      throw new HttpException(
        'No se pudo conectar con el servicio USER',
        503,
      );
    }

    throw new HttpException(
      error.message || 'Error inesperado en comunicación con USER',
      500,
    );
  }
}