import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsuarioExternoService {
  constructor(private readonly httpService: HttpService) {}

  async crearUsuarioExterno(dto: any, token: string) {
   console.log('TOKEN RECIBIDO:', token);
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'http://localhost:3000/api/usuarios',
          dto,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException(
        error?.response?.data || 'Error al crear usuario externo',
      );
    }
  }
}