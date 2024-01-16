import { CreateBoardDto } from './dto/create-board.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { v1 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
	constructor(
		@InjectRepository(BoardRepository)
		private boardRepository: BoardRepository,
	) {}

	async getBoardById(id: any): Promise<Board> {
		const found = await this.boardRepository.findOne(id);
		if (!found) {
			throw new NotFoundException(`Can't find board with id ${id}`);
		}
		return found;
	}

	async getAllBoards(user: User): Promise<Board[]> {
		// 로그인한 유저의 게시글만 불러오기
		const query = this.boardRepository.createQueryBuilder('board');
		query.where('board.userId = :userId', { userId: user.id });
		const boards = await query.getMany();
		return boards;
	}

	createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
		return this.boardRepository.createBoard(createBoardDto, user);
	}

	async deleteBoard(id: number, user: User): Promise<void> {
		const result = await this.boardRepository.delete({ id, user });

		if (result.affected === 0) {
			throw new NotFoundException(`can't find Board with id ${id}`);
		}
	}
	async updateBoardStatus(id: string, status: BoardStatus): Promise<Board> {
		const board = await this.getBoardById(id);
		board.status = status;
		await this.boardRepository.save(board);
		return board;
	}
}
