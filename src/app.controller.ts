import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth } from './auth/decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Auth(AuthType.None)
  getHello(): string {
    return this.appService.getHello();
  }
}
