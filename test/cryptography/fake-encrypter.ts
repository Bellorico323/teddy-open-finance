import type { Encrypter } from "@/domain/criptography/encrypter"

export class FakeEncrypter implements Encrypter {
	async encrypt(payload: Record<string, unknown>): Promise<string> {
		return JSON.stringify(payload)
	}
}
