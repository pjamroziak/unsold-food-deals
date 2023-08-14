import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './tgtg-client.module-definition';
import { TooGoodToGoClient } from './tgtg.client';
import { HttpProvider } from './providers/http.provider';
import { AuthService } from './services/auth.service';
import { ItemsService } from './services/items.service';
import { ItemsProxyService } from './services/proxy.service';
import { strategies } from './strategies';

@Module({
  providers: [
    TooGoodToGoClient,
    HttpProvider,
    AuthService,
    ItemsService,
    ItemsProxyService,
    ...strategies,
  ],
  exports: [TooGoodToGoClient],
})
export class TooGoToGoClientModule extends ConfigurableModuleClass {}
