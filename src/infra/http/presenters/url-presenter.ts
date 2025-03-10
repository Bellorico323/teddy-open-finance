import { Url } from "@/domain/entities/url"
import { EnvService } from "@/infra/env/env.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class UrlPresenter {
	constructor(private envService: EnvService) {}

	private baseUrl = this.envService.get("API_URL")

	toHTTP(url: Url) {
		return {
			id: url.id.toString(),
			originalUrl: url.originalUrl,
			shortUrl: `${this.baseUrl}/${url.shortCode.value}`,
			clickCount: url.clickCount,
			createdAt: url.createdAt,
			updatedAt: url.updatedAt,
			clientId: url.clientId,
		}
	}
}
