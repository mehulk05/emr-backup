import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unreadSmsCount'
})
export class UnreadSmsCountPipe implements PipeTransform {
  transform(value: any): unknown {
    return (
      value?.auditLogs?.filter(
        (log: any) => log.direction === 'incoming' && !log.smsRead
      ).length || 0
    );
  }
}
