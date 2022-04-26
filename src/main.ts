import { Container } from 'inversify';
import { App } from './app';
import { appBindings } from './app.binding';
import { TYPES } from './types';

async function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  await app.init();

  return {
    appContainer,
    app,
  };
}

export const boot = bootstrap();
