import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { DeleteUrlUseCase } from "@/domain/use-cases/delete-url"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { UserPayload } from "@/infra/auth/jwt-strategy"
import {
	BadRequestException,
	Controller,
	Delete,
	ForbiddenException,
	HttpCode,
	NotFoundException,
	Param,
} from "@nestjs/common"
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger"

@Controller("/urls/:id")
@ApiTags("url")
export class DeleteUrlController {
	constructor(private deleteUrl: DeleteUrlUseCase) {}

	@Delete()
	@HttpCode(204)
	@ApiBearerAuth("access-token")
	@ApiOperation({ summary: "Delete an existing URL" })
	@ApiParam({
		name: "id",
		description: "ID of the URL to be deleted",
		required: true,
		type: "string",
	})
	@ApiResponse({
		status: 204,
		description: "URL deleted successfully",
	})
	@ApiResponse({
		status: 400,
		description: "Invalid input data",
	})
	@ApiResponse({
		status: 404,
		description: "URL not found",
	})
	@ApiResponse({
		status: 403,
		description: "Not allowed to delete this URL",
	})
	async handle(@CurrentUser() user: UserPayload, @Param("id") urlId: string) {
		const clientId = user.sub

		const result = await this.deleteUrl.execute({
			clientId,
			urlId,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message)
				case NotAllowedError:
					throw new ForbiddenException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}
	}
}
