import { AuthenticateClientUseCase } from "@/domain/use-cases/authenticate-client"
import { WrongCredentialsError } from "@/domain/use-cases/errors/wrong-credentials-error"
import { Public } from "@/infra/auth/public"
import {
	BadRequestException,
	Body,
	Controller,
	Post,
	UnauthorizedException,
	UsePipes,
} from "@nestjs/common"
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { zodToOpenAPI } from "nestjs-zod"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller("/sessions")
@Public()
@ApiTags("auth")
export class AuthenticateController {
	constructor(private authenticateClient: AuthenticateClientUseCase) {}

	@Post()
	@ApiOperation({ summary: "Authenticate an user" })
	@ApiBody({
		description: "Payload to authentica an user",
		schema: zodToOpenAPI(authenticateBodySchema),
	})
	@ApiResponse({
		status: 200,
		description: "Authenticated successfully",
	})
	@ApiResponse({
		status: 400,
		description: "Invalid input data",
	})
	@ApiResponse({
		status: 401,
		description: "Credentials are not valid",
	})
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() body: AuthenticateBodySchema) {
		const { email, password } = body

		const result = await this.authenticateClient.execute({
			email,
			password,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case WrongCredentialsError:
					throw new UnauthorizedException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}

		const { accessToken } = result.value

		return {
			access_token: accessToken,
		}
	}
}
