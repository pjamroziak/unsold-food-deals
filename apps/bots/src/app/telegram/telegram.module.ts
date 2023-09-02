import { Module } from '@nestjs/common';
import { SendMessageConsumerModule } from '../consumers/send-message/send-message.module';
import { CoreUpdate } from './updates/core.update';
import { SetCityWizard } from './wizards/setcity.wizard';
import { SetFiltersWizard } from './wizards/setfilters.wizard';

@Module({
  imports: [SendMessageConsumerModule],
  providers: [CoreUpdate, SetCityWizard, SetFiltersWizard],
})
export class TelegramBotModule {}
