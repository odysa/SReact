interface Token {
  type: "begin" | "end" | "text" | "eof";
  tag: string;
  props: {}[];
}

class Lexer {
  private text: string;
  private pos: number;
  constructor(text: string) {
    this.text = text;
    this.pos = 0;
  }
  /**
   *
   */
  lex() {
    let text = "";
    let token: Token;
    while (true) {
      let ch = this.read();
      switch (ch) {
        case "<":
          if (this.lookAhead() === "/") {
            token = this.parseStartTag();
          } else {
            token = this.parseEndTag();
          }
          break;
        case "\n":
          break;
        case " ":
          if (text != "") text += ch;
          break;
        case undefined:
          if (this.pos > this.text.length)
            token = {
              type: "eof",
              tag: "",
              props: [],
            };
          break;
        default:
          text += ch;
          token = this.getText(text);
          break;
      }
      this.text = this.text.slice(this.pos);
      this.pos = 0;
      return token;
    }
  }

  /**
   * find next valid char
   */
  private lookAhead(): string {
    let str = this.text[this.pos];
    let p = this.pos;
    while (str === " " || str == "\n") {
      str = this.text[++p];
    }
    return str;
  }
  /**
   * get next valid char
   */
  private read(): string {
    return this.text[this.pos++];
  }
  /**
   *
   */
  private parseStartTag(): Token {
    let index = this.text.indexOf(">");
    if (index === -1) throw new Error("Missing tag: >");
    //
    let words = this.text.slice(this.pos, index);
    let tag = "";
    //get type of HTML
    // words = "<div>" type = div
    if (words.includes(" ")) {
      // tag has props
      tag = words
        .split(" ")
        .filter((ch) => ch != "")[0]
        .slice(1);
    } else {
      tag = words.split(">")[0].slice(1);
    }
    // skip type
    this.pos += tag.length;
    let props = this.getProps();
    return {
      type: "begin",
      tag,
      props,
    };
  }
  /**
   *
   */
  private parseEndTag(): Token {
    this.read();
    let index = this.text.indexOf(">");
    if (index === -1) throw new Error("Missing tag: >");
    let words = this.text.slice(this.pos, index);
    let tag = words.split(">").filter((ch) => ch != "")[0];
    this.pos = index + 1;
    return {
      type: "end",
      tag,
      props: [],
    };
  }
  /**
   *
   */
  private getProps(): {}[] {
    let index = this.text.indexOf(">");
    if (index === -1) throw new Error("Missing tag: >");
    // get valid text
    let words = this.text.slice(this.pos, index);
    // get props
    if (words == " ") return [];
    let propsStr = words.split(" ").filter((ch) => ch !== "");
    let props = propsStr.map((item) => {
      let res = {};
      let pair = item.split("=");
      if (pair.length < 2) throw new Error(`invalid props ${item}`);
      res[pair[0].trim()] = this.removeQuotes(pair[1].trim());
      return res;
    });
    // move to next valid char
    this.pos += words.length;
    return props;
  }
  /**
   *
   * @param text
   */
  private getText(text: string): Token {
    let res = text.trim();
    if (this.lookAhead() === "<") {
      // if this text is contained in a pair of tag
      return {
        type: "text",
        tag: res,
        props: [],
      };
    }
    return null;
  }
  /**
   *
   * @param str
   */
  private removeQuotes(str: string): string {
    let last = str.length - 1;
    let front = str[0] === '"' && str[last] === '"';
    let end = str[0] === "'" && str[last] === "'";
    if (end || front) return str.slice(1, last);
    throw new Error(`${str} miss match!!`);
  }
}

export { Lexer, Token };
