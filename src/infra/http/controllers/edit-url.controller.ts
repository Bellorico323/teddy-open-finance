import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { EditUrlUseCase } from "@/domain/use-cases/edit-url"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { UserPayload } from "@/infra/auth/jwt-strategy"
import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
} from "@nestjs/common"
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger"
import { zodToOpenAPI } from "nestjs-zod"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"

const editUrlBodySchema = z.object({
	originalUrl: z.string(),
})

type EditUrlBodySchema = z.infer<typeof editUrlBodySchema>
const bodyValidationPipe = new ZodValidationPipe(editUrlBodySchema)

@Controller("/urls/:id")
@ApiTags("url")
export class EditUrlController {
	constructor(private editUrl: EditUrlUseCase) {}

	@Patch()
	@HttpCode(204)
	@ApiBearerAuth("access-token")
	@ApiOperation({ summary: "Edit an existing URL" })
	@ApiParam({
		name: "id",
		description: "ID of the URL to be updated",
		required: true,
		type: "string",
	})
	@ApiBody({
		description: "Payload to update a URL",
		schema: zodToOpenAPI(editUrlBodySchema),
	})
	@ApiResponse({
		status: 204,
		description: "URL updated successfully",
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
		description: "Not allowed to edit this URL",
	})
	async handle(
		@Body(bodyValidationPipe) body: EditUrlBodySchema,
		@CurrentUser() user: UserPayload,
		@Param("id") urlId: string,
	) {
		const { originalUrl } = body
		const clientId = user.sub

		const result = await this.editUrl.execute({
			originalUrl,
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
