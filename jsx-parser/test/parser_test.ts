import {Parser} from '../parser'
const text = `
  <div touch="true">
    <p class="test-123">
      <span>12312312</span>
    </p>
  </div>
`;

function test_parser(){
  let parser = new Parser(text);
  console.log(parser.parse());
}
test_parser()