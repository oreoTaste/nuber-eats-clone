import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class Logger extends ConsoleLogger {
  constructor() {
    super();
    this.setContext(Logger.name);
    this.log("Logger", "constructor");
  }
  log(message: any, method?: string): void {
    if(method) {
      super.log(message, `${this.context} > ${method}`);
    } else {
      super.log(message, `${this.context}`);

    }
  }
  warn(message: any, method?: string): void {
    if(method) {
      super.warn(message, `${this.context} > ${method}`);
    } else {
      super.warn(message, `${this.context}`);
    }
  }
  error(message: any, method?: string): void {
    if(method) {
      super.error(message, `${this.context} > ${method}`);
    } else {
      super.error(message, `${this.context}`);
    }
  }
  debug(message: any, method?: string): void {
    if(method) {
      super.debug(message, `${this.context} > ${method}`);
    } else {
      super.debug(message, `${this.context}`);
    }
  }
  verbose(message: any, method?: string): void {
    if(method) {
      super.verbose(message, `${this.context} > ${method}`);
    } else {
      super.verbose(message, `${this.context}`);
    }
  }
}