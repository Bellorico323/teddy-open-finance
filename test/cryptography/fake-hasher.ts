import type { HashComparer } from "@/domain/criptography/hash-comparer"
import type { HashGenerator } from "@/domain/criptography/hash-generator"

export class FakeHasher implements HashGenerator, HashComparer {
	async hash(plain: string): Promise<string> {
		return plain.concat("-hashed")
	}

	async compare(plain: string, hash: string): Promise<boolean> {
		return plain.concat("-hashed") === hash
	}
}
