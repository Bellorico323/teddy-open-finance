import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { RedirectUrlUseCase } from "@/domain/use-cases/redirect-url"
import { Public } from "@/infra/auth/public"
import {
	BadRequestException,
	Controller,
	Get,
	NotFoundException,
	Param,
	Redirect,
} from "@nestjs/common"
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger"

@Controller("/urls/redirect/:shortCode")
@Public()
@ApiTags("url")
export class RedirectUrlController {
	constructor(private redirectUrl: RedirectUrlUseCase) {}

	@Get()
	@Redirect()
	@ApiBearerAuth("access-token")
	@ApiOperation({ summary: "Redirect to the original URL based on short code" })
	@ApiParam({
		name: "shortCode",
		description: "Shortened URL identifier",
		required: true,
		type: "string",
		example: "abc123",
	})
	@ApiResponse({
		status: 302,
		description: "Temporary redirection to the original URL",
		headers: {
			Location: {
				description: "The original URL",
				schema: { type: "string", example: "https://example.com" },
			},
		},
	})
	@ApiResponse({
		status: 404,
		description: "Shortened URL not found",
	})
	@ApiResponse({
		status: 400,
		description: "Invalid input data",
	})
	async handle(@Param("shortCode") shortCode: string) {
		const result = await this.redirectUrl.execute({
			shortCode,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}

		const { originalUrl } = result.value

		return {
			url: originalUrl,
			statusCode: 302,
		}
	}
}
