import { Entity } from "@/core/entities/entity"
import type { UniqueEntityID } from "@/core/entities/unique-entity-id"
import type { Optional } from "@/core/types/optional"
import { ShortCode } from "./value-objects/short-url"

interface UrlProps {
	originalUrl: string
	shortCode: ShortCode
	clickCount: number
	createdAt: Date
	updatedAt?: Date | null
	deletedAt?: Date | null
	userId?: UniqueEntityID | null
}

export class Url extends Entity<UrlProps> {
	get originalUrl() {
		return this.props.originalUrl
	}

	set originalUrl(newUrl: string) {
		this.props.originalUrl = newUrl

		this.touch()
	}

	get createdAt() {
		return this.props.createdAt
	}

	get deletedAt() {
		return this.props.deletedAt
	}

	get shortCode() {
		return this.props.shortCode
	}

	get clickCount() {
		return this.props.clickCount
	}

	countClick() {
		this.props.clickCount = this.props.clickCount + 1

		this.touch()
	}

	touch() {
		this.props.updatedAt = new Date()
	}

	delete() {
		this.props.deletedAt = new Date()
	}

	static create(
		props: Optional<UrlProps, "createdAt" | "shortCode">,
		id?: UniqueEntityID,
	) {
		const url = new Url(
			{
				...props,
				shortCode: props.shortCode ?? ShortCode.generateShortCode(),
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		)

		return url
	}
}
