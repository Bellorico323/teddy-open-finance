import { Url } from "@/domain/entities/url"

export class UrlPresenter {
	static toHTTP(url: Url) {
		return {
			id: url.id.toString(),
			originalUrl: url.originalUrl,
			shortCode: url.shortCode.value,
			clickCount: url.clickCount,
			createdAt: url.createdAt,
			updatedAt: url.updatedAt,
			clientId: url.clientId,
		}
	}
}
