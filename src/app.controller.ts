import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response): void {
    const indexFile = path.resolve(__dirname, '../../public/index.html');
    res.sendFile(indexFile);
  }

  @Get('/style.css')
  getStyle(@Res() res: Response): void {
    const styleFile = path.resolve(__dirname, '../../public/style.css');
    res.sendFile(styleFile);
  }

  @Get('/game.js')
  getGameJS(@Res() res: Response): void {
    const gameJSFile = path.resolve(__dirname, '../public/game.js');
    res.sendFile(gameJSFile);
  }
}