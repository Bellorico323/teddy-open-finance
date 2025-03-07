import { Encrypter } from "@/domain/criptography/encrypter"
import { HashComparer } from "@/domain/criptography/hash-comparer"
import { HashGenerator } from "@/domain/criptography/hash-generator"
import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { BcryptHasher } from "./bcrypt-hasher"
import { JwtEncrypter } from "./jwt-encrypter"

@Module({
	imports: [JwtModule],
	providers: [
		{ provide: Encrypter, useClass: JwtEncrypter },
		{ provide: HashComparer, useClass: BcryptHasher },
		{ provide: HashGenerator, useClass: BcryptHasher },
	],
	exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
