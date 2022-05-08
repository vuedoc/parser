import { AbstractDecorativeEntry } from './AbstractDecorativeEntry.js';

export class ModelEntry extends AbstractDecorativeEntry {
  // By default, v-model on a component uses `value` as the prop and `input` as the event
  constructor(prop = 'value', event = 'input') {
    super('model');

    this.prop = prop;
    this.event = event;
  }
}
