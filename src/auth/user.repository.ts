import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
	async createUser(authCredentialDto: AuthCredentialsDto): Promise<void> {
		const { username, password } = authCredentialDto;
		const user = this.create({ username, password });
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
