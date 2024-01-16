import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
	async createUser(authCredentialDto: AuthCredentialsDto): Promise<void> {
		const { username, password } = authCredentialDto;

		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);
		const user = this.create({ username, password: hashedPassword });

		try {
			await this.save(user);
		} catch (err) {
			if (err.code === '23505') {
				throw new ConflictException('Existing username');
			} else {
				throw new InternalServerErrorException();
			}
		}
	}
}
