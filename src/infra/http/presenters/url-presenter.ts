import { Url } from "@/domain/entities/url"
import { EnvService } from "@/infra/env/env.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class UrlPresenter {
	constructor(private envService: EnvService) {}

	toHTTP(url: Url) {
		const baseUrl = this.envService.get("API_URL")
		return {
			id: url.id.toString(),
			originalUrl: url.originalUrl,
			shortUrl: `${baseUrl}/${url.shortCode.value}`,
			clickCount: url.clickCount,
			createdAt: url.createdAt,
			updatedAt: url.updatedAt,
			clientId: url.clientId?.toString(),
		}
	}
}
