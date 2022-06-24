import { compile } from 'vue-template-compiler';

import { AbstractParser } from './AbstractParser.js';
import { SlotParser } from './SlotParser.js';
import { CommentParser } from './CommentParser.js';

import { SlotEntry } from '../entity/SlotEntry.js';
import { EventEntry, EventArgumentGenerator } from '../entity/EventEntry.js';

import { JSDoc } from '../JSDoc.js';
import { Feature, Tag } from '../Enum.js';

const EVENT_EMIT_RE = /^\$emit\(['"](.+)['"]/;

export class MarkupTemplateParser extends AbstractParser {
  /**
   * @param {Parser} parser - The Parser object
   */
  constructor(root, data) {
    super(root);

    data.content = data.content?.trim() || '';
    this.source = data;
    this.features = root.features;
    this.nodes = [];
    this.options = {
      outputSourceRange: true,
      modules: {
        preTransformNode: (node) => this.parseNode(node),
      },
    };
  }

  getSiblingNode(node) {
    const reversedTokens = this.nodes.slice(0).reverse();
    const siblingNode = reversedTokens.find(({ level, parent }) => {
      return level === node.level && parent === node.parent;
    });

    if (siblingNode) {
      return siblingNode;
    }

    return reversedTokens.find(({ level }) => level < node.level);
  }

  findComment(node) {
    const token = this.getSiblingNode(node) || { end: 0 };
    const code = this.source.content.substring(token.end, node.start).trim();
    const lines = code.split(/\n/g).reverse();
    const parsedLines = [];

    for (const line of lines) {
      if (line.trim().endsWith('-->') && parsedLines.length) {
        break;
      }

      parsedLines.push(line);
    }

    const comment = parsedLines.reverse().join('\n');

    return CommentParser.format(comment) || '';
  }

  parseEntryComment(entry, node) {
    const commentText = this.findComment(node);
    const comment = CommentParser.parse(commentText);

    entry.visibility = comment.visibility;
    entry.description = comment.description || undefined;
    entry.keywords = comment.keywords;

    return comment;
  }

  parseSlot(node) {
    const name = node.attrsMap.name || node.attrsMap[':name'] || node.attrsMap['v-bind:name'];
    const entry = new SlotEntry(name);
    const comment = this.parseEntryComment(entry, node);
    const slots = SlotParser.extractSlotKeywords(comment.keywords);

    if (slots.length) {
      slots.forEach((slot) => this.emit(slot));
    } else {
      SlotParser.parseTemplateSlots(entry, node.attrsList, comment);
      this.emit(entry);
    }
  }

  parseEvents(node) {
    Object.values(node.attrsMap)
      .map((value) => EVENT_EMIT_RE.exec(value))
      .filter((result) => result !== null)
      .map((matches) => matches[1])
      .forEach((name) => {
        const entry = new EventEntry(name);
        const comment = this.parseEntryComment(entry, node);

        JSDoc.parseParams(this, comment.keywords, entry.arguments, EventArgumentGenerator);

        this.emit(entry);
      });
  }

  parseNode(node) {
    if (!node.level) {
      node.level = 1;
      node.childrenLength = node.children.length;

      if (node.parent) {
        node.level += node.parent.childrenLength;
        node.level += node.parent.level;
      }
    }

    if (node.tag === Tag.slot) {
      if (this.features.includes(Feature.slots)) {
        this.parseSlot(node);
      }
    } else if (this.features.includes(Feature.events)) {
      this.parseEvents(node);
    }

    this.nodes.push(node);
  }

  parse() {
    if (!this.features.includes(Feature.slots)
        && !this.features.includes(Feature.events)) {
      return;
    }

    compile(this.source.content, this.options);
  }
}
