//Token的类型
enum TokenKind { Keyword, Identifier, StringLiteral, Seperator, Operator, EOF};

// 代表一个Token的数据结构
interface Token {
  kind: TokenKind;
  text: string;
}

// 一个Token数组，代表了下面这段程序做完词法分析后的结果：
/*
//一个函数的声明，这个函数很简单，只打印"Hello World!"
function sayHello(){
    println("Hello World!");
}
//调用刚才声明的函数
sayHello();
*/
let tokenArray: Token[] = [
  { kind: TokenKind.Keyword, text: 'function' },
  { kind: TokenKind.Identifier, text: 'sayHello' },
  { kind: TokenKind.Seperator, text: '(' },
  { kind: TokenKind.Seperator, text: ')' },
  { kind: TokenKind.Seperator, text: '{' },
  { kind: TokenKind.Identifier, text: 'println' },
  { kind: TokenKind.Seperator, text: '(' },
  { kind: TokenKind.StringLiteral, text: 'Hello World!' },
  { kind: TokenKind.Seperator, text: ')' },
  { kind: TokenKind.Seperator, text: ';' },
  { kind: TokenKind.Seperator, text: '}' },
  { kind: TokenKind.Identifier, text: 'sayHello' },
  { kind: TokenKind.Seperator, text: '(' },
  { kind: TokenKind.Seperator, text: ')' },
  { kind: TokenKind.Seperator, text: ';' },
  { kind: TokenKind.EOF, text: '' }
];

class Tokenizer {
  private readonly tokens: Token[];
  private pos: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  next(): Token {
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos++]
    } else {
      return this.tokens[this.pos]
    }
  }

  position(): number {
    return this.pos
  }

  traceBack(newPos: number): void {
    this.pos = newPos
  }
}

abstract class AstNode {
  //打印对象信息，prefix是前面填充的字符串，通常用于缩进显示
  public abstract dump(prefix: string): void;
}

abstract class Statement extends AstNode {
  static isStatementNode(node: any): node is Statement {
    if (!node) {
      return false;
    } else {
      return true;
    }
  }
}

class Prog extends AstNode {
  stmts: Statement[]; //程序中可以包含多个语句
  constructor(stmts: Statement[]) {
    super();
    this.stmts = stmts;
  }

  public dump(prefix: string): void {
    console.log(prefix + "Prog");
    this.stmts.forEach(x => x.dump(prefix + "\t"));
  }
}

class FunctionDecl extends Statement {
  name: string;
  body: FunctionBody

  constructor(name: string, body: FunctionBody) {
    super();
    this.name = name;
    this.body = body;
  }

  public dump(prefix: string): void {
    console.log(prefix + "FunctionDecl " + this.name);
    this.body.dump(prefix + "\t");
  }
}

class FunctionBody extends AstNode {
  stmts: FunctionCall[];

  constructor(stmts: FunctionCall[]) {
    super();
    this.stmts = stmts;
  }

  static isFunctionBodyNode(node: any): node is FunctionBody {
    if (!node) {
      return false;
    }
    if (Object.getPrototypeOf(node) == FunctionBody.prototype) {
      return true;
    } else {
      return false;
    }
  }

  public dump(prefix: string): void {
    console.log(prefix + "FunctionBody");
    this.stmts.forEach(x => x.dump(prefix + "\t"));
  }

}

class FunctionCall extends AstNode {
  name: string;
  parameters: string[];
  definition: FunctionDecl | null = null

  constructor(name: string, parameters: string[]) {
    super();
    this.name = name;
    this.parameters = parameters
  }

  static isFunctionCallNode(node: any): node is FunctionCall {
    if (!node) {
      return false
    }
    if (Object.getPrototypeOf(node) === FunctionCall.prototype) {
      return true
    } else {
      return false
    }
  }

  public dump(prefix: string): void {
    console.log(prefix + "FunctionCall " + this.name + (this.definition != null ? ", resolved" : ", not resolved"));
    this.parameters.forEach(x => console.log(prefix + "\t" + "Parameter: " + x));
  }
}

class Parser {
  tokenizer: Tokenizer;

  constructor(tokenizer: Tokenizer) {
    this.tokenizer = tokenizer
  }

  parseProg(): Prog {
    let stmts: Statement[] = []
    let stmt: Statement | null | void = null
    while (true) {
      stmt = this.parseFunctionDecl();
      if (Statement.isStatementNode(stmt)) {
        stmts.push(stmt);
        continue;
      }
      //如果前一个尝试不成功，那么再尝试一下函数调用
      stmt = this.parseFunctionCall();
      if (Statement.isStatementNode(stmt)) {
        stmts.push(stmt);
        continue;
      }
      //如果都没成功，那就结束
      if (stmt == null) {
        break;
      }
    }
    return new Prog(stmts);
  }

  parseFunctionDecl(): FunctionDecl | null | void {
    let oldPos: number = this.tokenizer.position()
    let t: Token = this.tokenizer.next()
    if (t.kind === TokenKind.Keyword && t.text == "function") {
      t = this.tokenizer.next();
      if (t.kind == TokenKind.Identifier) {
        let t1 = this.tokenizer.next();
        if (t1.text == "(") {
          let t2 = this.tokenizer.next();
          if (t2.text == ")") {
            let functionBody = this.parseFunctionBody();
            if (FunctionBody.isFunctionBodyNode(functionBody)) {
              //如果解析成功，从这里返回
              return new FunctionDecl(t.text, functionBody);
            }
          } else {
            console.log("Expecting ')' in FunctionDecl, while we got a " + t.text);
            return;
          }
        } else {
          console.log("Expecting '(' in FunctionDecl, while we got a " + t.text);
          return;
        }
      }
    }

    //如果解析不成功，回溯，返回null。
    this.tokenizer.traceBack(oldPos);
    return null;
  }

  parseFunctionBody(): FunctionBody | null | void {
    let oldPos: number = this.tokenizer.position();
    let stmts: FunctionCall[] = [];
    let t: Token = this.tokenizer.next();
    if (t.text == "{") {
      let functionCall = this.parseFunctionCall();
      while (FunctionCall.isFunctionCallNode(functionCall)) {  //解析函数体
        stmts.push(functionCall);
        functionCall = this.parseFunctionCall();
      }
      t = this.tokenizer.next();
      if (t.text == "}") {
        return new FunctionBody(stmts);
      } else {
        console.log("Expecting '}' in FunctionBody, while we got a " + t.text);
        return;
      }
    } else {
      console.log("Expecting '{' in FunctionBody, while we got a " + t.text);
      return;
    }

    //如果解析不成功，回溯，返回null。
    this.tokenizer.traceBack(oldPos);
    return null;
  }

  parseFunctionCall(): FunctionCall | void | null {
    let oldPos: number = this.tokenizer.position();
    let params: string[] = [];
    let t: Token = this.tokenizer.next();
    if (t.kind == TokenKind.Identifier) {
      let t1: Token = this.tokenizer.next();
      if (t1.text == "(") {
        let t2: Token = this.tokenizer.next();
        while (t2.text != ")") {
          if (t2.kind == TokenKind.StringLiteral) {
            params.push(t2.text);
          } else {
            console.log("Expecting parameter in FunctionCall, while we got a " + t2.text);
            return;  //出错时，就不在错误处回溯了。
          }
          t2 = this.tokenizer.next();
          if (t2.text != ")") {
            if (t2.text == ",") {
              t2 = this.tokenizer.next();
            } else {
              console.log("Expecting a comma in FunctionCall, while we got a " + t2.text);
              return;
            }
          }
        }
        t2 = this.tokenizer.next();
        if (t2.text == ";") {
          return new FunctionCall(t.text, params);
        } else {
          console.log("Expecting a comma in FunctionCall, while we got a " + t2.text);
          return;
        }
      }
    }
    //如果解析不成功，回溯，返回null。
    this.tokenizer.traceBack(oldPos);
    return null;
  }
}

abstract class AstVisitor {
  visitProg(prog: Prog): any {
    let retVal: any
    for (let x of prog.stmts) {
      if (typeof (x as FunctionDecl).body === 'object') {
        retVal = this.visitFunctionDecl(x as FunctionDecl)
      } else {
        retVal = this.visitFunctionCall(x as FunctionCall)
      }
    }
    return retVal
  }

  visitFunctionDecl(functionDecl: FunctionDecl): any {
    return this.visitFunctionBody(functionDecl.body)
  }

  visitFunctionBody(functionBody: FunctionBody): any {
    let retVal: any
    for (let x of functionBody.stmts) {
      retVal = this.visitFunctionCall(x)
    }
    return retVal
  }

  visitFunctionCall(functionCall: FunctionCall): any {
    return undefined
  }
}


class RefResolver extends AstVisitor {
  prog: Prog | null = null

  visitProg(prog: Prog): any {
    this.prog = prog
    for (let x of prog.stmts) {
      let functionCall = x as FunctionCall
      if (typeof functionCall.parameters === 'object') {
        this.resolveFunctionCall(prog, functionCall)
      } else {
        this.visitFunctionDecl(x as FunctionDecl);
      }
    }
  }

  visitFunctionBody(functionBody: FunctionBody): any {
    if (this.prog != null) {
      for (let x of functionBody.stmts) {
        return this.resolveFunctionCall(this.prog, x);
      }
    }
  }

  resolveFunctionCall(prog: Prog, functionCall: FunctionCall) {
    let functionDec1 = this.findFunctionDecl(prog, functionCall.name)
    if (functionDec1 !== null) {
      functionCall.definition = functionDec1
    } else {
      if (functionCall.name !== 'println') {
        console.log("Error: cannot find definition of function " + functionCall.name);
      }
    }
  }

  private findFunctionDecl(prog: Prog, name: string): FunctionDecl | null {
    for (let x of prog.stmts) {
      let functionDec1 = x as FunctionDecl;
      if (typeof functionDec1.body === 'object' && functionDec1.name === name) {
        return functionDec1
      }

    }
    return null
  }
}

// 解释器

/**
 * 遍历AST，执行函数调用。
 */
class Intepretor extends AstVisitor {
  visitProg(prog: Prog): any {
    let retVal: any;
    for (let x of prog.stmts) {
      let functionCall = x as FunctionCall;
      if (typeof functionCall.parameters === 'object') {
        retVal = this.runFunction(functionCall);
      }
    }
    return retVal;
  }

  visitFunctionBody(functionBody: FunctionBody): any {
    let retVal: any;
    for (let x of functionBody.stmts) {
      retVal = this.runFunction(x);
    }
    ;
  }

  private runFunction(functionCall: FunctionCall) {
    if (functionCall.name == "println") { //内置函数
      if (functionCall.parameters.length > 0) {
        console.log(functionCall.parameters[0]);
      } else {
        console.log();
      }
      return 0;
    } else { //找到函数定义，继续遍历函数体
      if (functionCall.definition != null) {
        this.visitFunctionBody(functionCall.definition.body);
      }
    }
  }
}

// 主程序

function compileAndRun() {
//词法分析
  let tokenizer = new Tokenizer(tokenArray);
  console.log("\n程序所使用的Token:");
  for (let token of tokenArray){
    console.log(token);
  }
  //语法分析
  let prog:Prog = new Parser(tokenizer).parseProg();
  console.log("\n语法分析后的AST:");
  prog.dump("");

  //语义分析
  new RefResolver().visitProg(prog);
  console.log("\n语义分析后的AST，注意自定义函数的调用已被消解:");
  prog.dump("");

  //运行程序
  console.log("\n运行当前的程序:");
  let retVal = new Intepretor().visitProg(prog);
  console.log("程序返回值：" + retVal);
}
compileAndRun();
