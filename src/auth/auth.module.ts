import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [
		// 유저 인증을 위해 사용할 기본 strategy를 명시해 주기
		PassportModule.register({ defaultStrategy: 'jwt' }),
		// jwt 인증 부분 담당. 주로 sign()을 위한 부분
		JwtModule.register({
			secret: 'secret1234',
			signOptions: {
				expiresIn: 60 * 60,
			},
		}),
		TypeOrmModule.forFeature([UserRepository]),
	],
	controllers: [AuthController],
	// JwtStrategy를 이 모듈에서 사용할 수 있게 등록
	providers: [AuthService, JwtStrategy],
	// JwtStrategy, PassportModule를 다른 모듈에서 사용할 수 있게 등록
	exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
