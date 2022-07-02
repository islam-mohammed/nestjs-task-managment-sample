import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import CreatUserDto from './dto/create-user.dto';
import SignInDto from './dto/sign-in.dto';
import User from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private authRepository: Repository<User>,
    private jswService: JwtService,
  ) {}

  async createUser(createUserDto: CreatUserDto) {
    const password = await hash(createUserDto.password, 12);
    const user = this.authRepository.create({
      ...createUserDto,
      password,
      isActive: true,
    });
    try {
      await this.authRepository.save(user);
      const access_token = this.jswService.sign({ ...user });
      return { access_token };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email is already registered');
      } else {
        throw new InternalServerErrorException('Server error');
      }
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.authRepository.findOneBy({
      email: signInDto.email,
    });
    if (!user || !(await compare(signInDto.password, user.password)))
      throw new UnauthorizedException('Please check your login credentials');

    const access_token = this.jswService.sign({ ...user });
    return { access_token };
  }

  async getUserByEmail(userEmail: string) {
    const user = this.authRepository.findOneBy({ email: userEmail });
    return user;
  }
}
