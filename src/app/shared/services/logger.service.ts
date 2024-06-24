import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message: string): void {
    const stackTrace = this.getStackTrace();
    console.log(
      `%c${stackTrace.filename}:${stackTrace.methodName}:${stackTrace.lineNumber} - ${message}`,
      'color: blue'
    );
  }

  error(message: string): void {
    const stackTrace = this.getStackTrace();
    console.error(
      `%c${stackTrace.filename}:${stackTrace.methodName}:${stackTrace.lineNumber} - ${message}`,
      'color: red'
    );
  }

  private getStackTrace(): {
    filename: string;
    methodName: string;
    lineNumber: number;
  } {
    const stack = new Error().stack?.split('\n');
    console.log(stack);
    if (!stack || stack.length < 4) {
      // If the stack trace is not available or does not contain expected information, return default values.
      return { filename: 'N/A', methodName: 'N/A', lineNumber: 0 };
    }

    const caller = stack[3].match(/\s\w+ \(/);
    if (!caller || caller.length < 1) {
      return { filename: 'N/A', methodName: 'N/A', lineNumber: 0 };
    }

    const callerInfo = caller[0].split(' ');
    if (callerInfo.length < 3) {
      return { filename: 'N/A', methodName: 'N/A', lineNumber: 0 };
    }

    const filename = callerInfo[1].slice(0, -1);
    const method = callerInfo[2].slice(0, -1);
    let lineNumber: number = 0;

    if (stack[3]) {
      const match = stack[3].match(/:\d+:\d+\)$/);
      if (match && match[0]) {
        lineNumber = parseInt(match[0].slice(1, -1), 10);
      }
    }

    return { filename, methodName: method, lineNumber };
  }
}
