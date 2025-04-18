import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import { ShortCode } from "./value-objects/short-code"

export interface UrlProps {
	originalUrl: string
	shortCode: ShortCode
	clickCount: number
	createdAt: Date
	updatedAt?: Date | null
	deletedAt?: Date | null
	clientId?: UniqueEntityID | null
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

	get updatedAt() {
		return this.props.updatedAt
	}

	get deletedAt() {
		return this.props.deletedAt
	}

	get shortCode() {
		return this.props.shortCode
	}

	get clientId() {
		return this.props.clientId
	}

	get clickCount() {
		return this.props.clickCount
	}

	countClick() {
		this.props.clickCount = this.props.clickCount + 1

		this.touch()
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	delete() {
		this.props.deletedAt = new Date()

		this.touch()
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
