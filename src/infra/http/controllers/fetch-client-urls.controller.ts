import { FetchClientUrlsUseCase } from "@/domain/use-cases/fetch-client-urls"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { UserPayload } from "@/infra/auth/jwt-strategy"
import { BadRequestException, Controller, Get, Query } from "@nestjs/common"
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"
import { UrlPresenter } from "../presenters/url-presenter"

const pageQueryParamSchema = z
	.string()
	.optional()
	.default("1")
	.transform(Number)
	.pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller("/urls")
@ApiTags("url")
export class FetchClientUrlsController {
	constructor(
		private fetchClientUrls: FetchClientUrlsUseCase,
		private urlPresenter: UrlPresenter,
	) {}

	@Get()
	@ApiBearerAuth()
	@ApiBearerAuth("access-token")
	@ApiOperation({ summary: "Fetch urls from user" })
	@ApiResponse({
		status: 200,
		description: "Successfully fetched URLs",
		schema: {
			type: "object",
			properties: {
				urls: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: {
								type: "string",
								example: "123e4567-e89b-12d3-a456-426614174000",
							},
							originalUrl: { type: "string", example: "https://example.com" },
							shortCode: { type: "string", example: "abc123" },
							clickCount: { type: "number", example: 0 },
							createdAt: {
								type: "string",
								format: "date-time",
								example: "2025-03-10T12:34:56.789Z",
							},
							updatedAt: {
								type: "string",
								format: "date-time",
								example: "2025-03-10T12:34:56.789Z",
							},
							clientId: { type: "string", nullable: true, example: "user-123" },
						},
					},
				},
			},
		},
	})
	@ApiResponse({
		status: 400,
		description: "Invalid input data",
	})
	async handle(
		@CurrentUser() user: UserPayload,
		@Query("page", queryValidationPipe) page: PageQueryParamSchema,
	) {
		const result = await this.fetchClientUrls.execute({
			clientId: user.sub,
			page,
		})
		if (result.isLeft()) {
			throw new BadRequestException()
		}

		const { urls } = result.value

		return { urls: urls.map((url) => this.urlPresenter.toHTTP(url)) }
	}
}
