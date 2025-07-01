import { Express } from 'express';
import registerWakeUp from './wakeup';

export default function registerControllers(app: Express) {
  registerWakeUp(app);
}
