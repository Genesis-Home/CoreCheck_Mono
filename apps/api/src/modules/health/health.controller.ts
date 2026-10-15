import { Controller, Get } from '@nestjs/common';
import { APP_NAME } from '@corecheck/shared';

/** Liveness check for the hosting platform and for the apps to probe. */
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', app: APP_NAME };
  }
}
