import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		private jwtService: JwtService,
	) {}

	async signUp(authCredentialDto: AuthCredentialsDto): Promise<void> {
		return this.userRepository.createUser(authCredentialDto);
	}

	async signIn(authCredentialDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
		const { username, password } = authCredentialDto;
		const user = await this.userRepository.findOne({ username });

		if (user && (await bcrypt.compare(password, user.password))) {
			// 유저 토큰 생성 ( Secret + Payload )
			const payload = { username };
			const accessToken = await this.jwtService.sign(payload);

			return { accessToken };
		} else {
			throw new UnauthorizedException('login failed');
		}
	}
}
