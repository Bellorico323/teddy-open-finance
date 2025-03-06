import { randomBytes } from "node:crypto"

export class ShortCode {
	public value: string

	private constructor(value: string) {
		this.value = value
	}

	static create(shortCode: string) {
		return new ShortCode(shortCode)
	}

	static generateShortCode() {
		return new ShortCode(
			randomBytes(4)
				.toString("base64")
				.replace(/[^a-zA-Z0-9]/g, "")
				.slice(0, 6),
		)
	}
}
