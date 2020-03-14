import { Provider, config, inject, Binding, Getter, CoreBindings } from '@loopback/core';
import { ElogService } from '../services';
import { ElogOptions, Logger, TokenRepository } from '../types';
import { ApplicationWithRepositories } from '@loopback/repository';

export class ElogProvider implements Provider<Logger> {
  constructor(
    @config.getter() private getElogConfig: Getter<ElogOptions>,
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: ApplicationWithRepositories
  ) { }

  @inject.binding()
  private binding: Binding<unknown>;

  async value() {
    const options = await this.getElogConfig();
    const tokenRepo: any = await this.app.getRepository<TokenRepository>(options.tokenRepo)
    if (options == null) {
      throw new Error(
        `Elog is not configured. Please configure ${this.binding.key}.`,
      );
    }
    return new ElogService(options, tokenRepo)
  }
}
