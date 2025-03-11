import { CreateUrlUseCase } from "@/domain/use-cases/create-url"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { UserPayload } from "@/infra/auth/jwt-strategy"
import { Public } from "@/infra/auth/public"
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
} from "@nestjs/common"
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { zodToOpenAPI } from "nestjs-zod"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"
import { UrlPresenter } from "../presenters/url-presenter"

const createUrlBodySchema = z.object({
	originalUrl: z.string(),
})

type CreateUrlBodySchema = z.infer<typeof createUrlBodySchema>
const bodyValidationPipe = new ZodValidationPipe(createUrlBodySchema)

@Controller("/urls")
@Public()
@ApiTags("url")
export class CreateUrlController {
	constructor(
		private createUrl: CreateUrlUseCase,
		private urlPresenter: UrlPresenter,
	) {}

	@Post()
	@HttpCode(201)
	@ApiOperation({ summary: "Create a new url" })
	@ApiBody({
		description: "Payload to create a new url",
		schema: zodToOpenAPI(createUrlBodySchema),
	})
	@ApiResponse({
		status: 201,
		description: "URL created successfully",
		schema: {
			type: "object",
			properties: {
				url: {
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
	})

	@ApiResponse({
		status: 400,
		description: "Invalid input data",
	})
	async handle(
		@Body(bodyValidationPipe) body: CreateUrlBodySchema,
		@CurrentUser() user?: UserPayload,
	) {
		const { originalUrl } = body

		const result = await this.createUrl.execute({
			originalUrl,
			clientId: user?.sub ?? null,
		})
		if (result.isLeft()) {
			throw new BadRequestException()
		}

		const { url } = result.value

		return {
			url: this.urlPresenter.toHTTP(url),
		}
	}
}
