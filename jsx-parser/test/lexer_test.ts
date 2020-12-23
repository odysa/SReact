import { Lexer } from "../lexer";
const text = `
  <div touch="true">
    <p class="test-123">
      <span>12312312</span>
    </p>
  </div>
`;
function test_lex() {
  let lexer = new Lexer(text);
  let a;
  while (a = lexer.lex()){
    console.log(a);
    if(a.type==="eof") return;
  };
}
test_lex();
