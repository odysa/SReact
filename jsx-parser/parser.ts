import { Lexer } from "./lexer";

type JSX = {
  tag: string;
  props: {};
};

class Parser {
  private lexer: Lexer;
  private root: JSX;
  private currentJSX: JSX;
  // a stack of tags
  private stack: string[];
  constructor(text: string) {
    this.lexer = new Lexer(text);
    this.stack = [];
  }
  parse() {
    let token = this.lexer.lex();
    if (!token) return;
    const { tag, type } = token;
    const props = this.combineProps(token.props);
    if (type === "begin") this.parseBeginTag(tag, props);
    if (type === "end") this.parseEndTag(tag);
    if (type === "text") this.parseText(tag);
    return this.root;
  }
  parseBeginTag(tag: string, props: {}) {
    this.insertJSX(tag, props);
    this.stack.push(tag);
    this.parse();
  }
  parseEndTag(tag: string) {
    if (this.stack.length === 0) throw new Error(`Missing match tag:${tag}`);
    let top = this.stack.pop();
    if (top !== tag) throw new Error(`Missing match tag: ${tag}`);
    this.parse();
  }
  parseText(text: string) {
    this.currentJSX.props["text"] = text;
    this.parse();
  }
  insertJSX(tag: string, props: {}) {
    //if root jsx is not created
    if (!this.root) {
      this.root = {
        tag,
        props: { children: [], ...props },
      };
      this.currentJSX = this.root;
      return;
    }
    let children: JSX[];
    // stack contains how many unclosed tag
    for (let i = 0; i < this.stack.length; ++i) {
      if (!children) {
        children = this.getChildren(this.root);
      } else {
        children = this.getChildren(children[children.length - 1]);
      }
    }
    // if root exists and children do not exist, then multiple root exists
    if (!children) throw new Error("Must have only one root element");
    this.currentJSX = {
      tag,
      props: { children: [], ...props },
    };
    children.push(this.currentJSX);
    return;
  }
  private getChildren(jsx: JSX) {
    return jsx.props["children"];
  }
  private combineProps(props: {}[]) {
    const res = {};
    for (let i = 0; i < props.length; ++i) {
      Object.assign(res, props[i]);
    }
    return res;
  }
}

export { Parser };
