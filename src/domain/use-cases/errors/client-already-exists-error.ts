import type { UseCaseError } from "@/core/errors/use-case-error"

export class ClientAlreadyExistsError extends Error implements UseCaseError {
	constructor(identifier: string) {
		super(`Client "${identifier}" address already exists`)
	}
}
