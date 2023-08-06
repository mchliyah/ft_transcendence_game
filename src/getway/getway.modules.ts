import { Module } from "@nestjs/common";
import { Mygetway } from "./getway";

@Module ({
	providers: [Mygetway],
})

export class GetwayModule {}
