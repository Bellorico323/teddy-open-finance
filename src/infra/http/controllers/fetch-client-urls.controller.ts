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
	constructor(private fetchClientUrls: FetchClientUrlsUseCase) {}

	@Get()
	@ApiBearerAuth()
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
						type: "string",
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

		const urls = result.value.urls

		return { urls: urls.map(UrlPresenter.toHTTP) }
	}
}
