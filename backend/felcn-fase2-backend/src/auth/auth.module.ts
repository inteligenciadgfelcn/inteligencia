import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt-strategy.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule],
  providers: [JwtStrategy],
  exports: [],
})
export class AuthModule {}
