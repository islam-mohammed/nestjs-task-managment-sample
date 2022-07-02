import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import CreatUserDto from './dto/create-user.dto';
import SignInDto from './dto/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  signUp(@Body() createUserDto: CreatUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('/sign-in') signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
