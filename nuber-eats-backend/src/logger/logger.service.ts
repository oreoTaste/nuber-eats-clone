import { ConsoleLogger } from '@nestjs/common';

export class Logger extends ConsoleLogger {
  log(message: any, method?: string): void {
    if(method) {
      super.log(message, `${this.context} > ${method}`);
    } else {
      super.log(message, `${this.context}`);

    }
  }
}