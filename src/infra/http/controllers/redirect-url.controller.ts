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
	@ApiOperation({
		summary: "Redirect to the original URL based on short code",
		description:
			"**This route should be accessed from a browser! (callback url)**\n\n" +
			"This is a redirection route (HTTP 302). When accessed in a browser, the user will be automatically redirected to the original URL. \n\n" +
			"If called via an API client (Postman, cURL), the redirection may not work as expected." +
			"**Example Usage in React:**\n\n" +
			"```tsx\n" +
			'import { useEffect } from "react";\n\n' +
			"const RedirectComponent = () => {\n" +
			"  useEffect(() => {\n" +
			' 	window.open("http://localhost:3000/urls/redirect/21sda8", "_blank");\n' +
			"  }, []);\n\n" +
			"  return <p>Redirecting...</p>;\n" +
			"};\n" +
			"```",
	})
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
