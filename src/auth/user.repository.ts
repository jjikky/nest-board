import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
	async createUser(authCredentialDto: AuthCredentialsDto): Promise<void> {
		const { username, password } = authCredentialDto;
		const user = this.create({ username, password });
		await this.save(user);
	}
}
