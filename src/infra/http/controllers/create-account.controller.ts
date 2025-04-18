import { ClientAlreadyExistsError } from "@/domain/use-cases/errors/client-already-exists-error"
import { RegisterClientUseCase } from "@/domain/use-cases/register-client"
import { Public } from "@/infra/auth/public"
import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	Post,
	UsePipes,
} from "@nestjs/common"
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { zodToOpenAPI } from "nestjs-zod"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"

const createAccountBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller("/accounts")
@Public()
@ApiTags("auth")
export class CreateAccountController {
	constructor(private registerClient: RegisterClientUseCase) {}

	@Post()
	@HttpCode(201)
	@ApiOperation({ summary: "Create a new account" })
	@ApiBody({
		description: "Payload to create a new account",
		schema: zodToOpenAPI(createAccountBodySchema),
	})
	@ApiResponse({
		status: 201,
		description: "Account created successfully",
	})
	@ApiResponse({
		status: 400,
		description: "Invalid input data",
	})
	@ApiResponse({
		status: 409,
		description: "Client already exists",
	})
	@UsePipes(new ZodValidationPipe(createAccountBodySchema))
	async handle(@Body() body: CreateAccountBodySchema) {
		const { name, email, password } = body

		const result = await this.registerClient.execute({
			name,
			email,
			password,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case ClientAlreadyExistsError:
					throw new ConflictException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}
	}
}
