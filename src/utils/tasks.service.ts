import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ReservationService } from '../reservation/reservation.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly logger: Logger,
    private readonly reservationService: ReservationService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_6PM)
  handleCron() {
    this.reservationService.checkReservationTime();
    this.logger.debug('Called when the current second is 60');
  }
}
