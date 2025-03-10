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

const createUrlBodySchema = z.object({
	originalUrl: z.string(),
})

type CreateUrlBodySchema = z.infer<typeof createUrlBodySchema>
const bodyValidationPipe = new ZodValidationPipe(createUrlBodySchema)

@Controller("/urls")
@Public()
@ApiTags("url")
export class CreateUrlController {
	constructor(private createUrl: CreateUrlUseCase) {}

	@Post()
	@HttpCode(201)
	@ApiOperation({ summary: "Create a new url" })
	@ApiBody({
		description: "Payload to create a new url",
		schema: zodToOpenAPI(createUrlBodySchema),
	})
	@ApiResponse({
		status: 201,
		description: "Account created successfully",
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
	}
}
