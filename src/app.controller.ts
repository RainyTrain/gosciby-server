import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class MainController {
  @Get()
  greet() {
    return [1, 2, 3, 4];
  }
}
