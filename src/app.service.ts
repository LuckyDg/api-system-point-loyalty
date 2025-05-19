import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { config } from "./config/config";

@Injectable()
export class AppService {
  constructor(
   @Inject(config.KEY) private configService: ConfigType<typeof config>) {}
  
   getHealth(): string {
    console.log(this.configService.database);
    return `Hello World! ${this.configService.database.host}`;
   }
}

