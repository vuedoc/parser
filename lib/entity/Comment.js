class Comment {
  constructor (block, text, start, end, loc) {
    this.block = block;
    this.text = text;
    this.start = start;
    this.end = end;
    this.loc = loc;
  }
}

module.exports.Comment = Comment;
