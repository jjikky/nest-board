import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from '../board-status.enum';

export class BoardStatusValdationPipe implements PipeTransform {
	readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];

	transform(value: any, metadata: ArgumentMetadata) {
		value = value.toUpperCase();

		if (!this.isStatusValid(value)) {
			throw new BadRequestException(`${value} is not a valid board status`);
		}
		return value;
	}

	private isStatusValid(status: any) {
		const index = this.StatusOptions.indexOf(status);
		return index !== -1;
	}
}
