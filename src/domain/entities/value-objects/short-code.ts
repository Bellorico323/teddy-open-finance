import { randomBytes } from "node:crypto"

export class ShortCode {
	public value: string

	private constructor(value: string) {
		this.value = value
	}

	static create(shortCode: string) {
		return new ShortCode(shortCode)
	}

	/**
	 * Generates a random short code consisting of 6 alphanumeric characters.
	 * The code is derived from a base64-encoded random byte sequence,
	 * ensuring uniqueness while removing non-alphanumeric characters.
	 *
	 * @returns {ShortCode} A new instance of ShortCode with a generated value.
	 */
	static generateShortCode() {
		return new ShortCode(
			randomBytes(4)
				.toString("base64")
				.replace(/[^a-zA-Z0-9]/g, "")
				.slice(0, 7),
		)
	}
}
