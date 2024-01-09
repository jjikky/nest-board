import { CreateBoardDto } from './dto/create-board.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { v1 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';

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

	async getAllBoards(): Promise<Board[]> {
		const boards = await this.boardRepository.find();
		return boards;
	}

	async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
		const { title, description } = createBoardDto;
		const board = this.boardRepository.create({
			title,
			description,
			status: BoardStatus.PUBLIC,
		});
		await this.boardRepository.save(board);
		return board;
	}

	async deleteBoard(id: number): Promise<void> {
		const result = await this.boardRepository.delete(id);

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
