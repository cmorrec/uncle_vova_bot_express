import { TelegrafContext } from '@types';
import registerStart from './start';
import registerHelp from './help';

export default function registerCommandHandlers(bot: TelegrafContext) {
  registerStart(bot);
  registerHelp(bot);
}
