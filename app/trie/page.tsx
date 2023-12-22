'use client'

class Node{
  value: string | null;
  nodes: Node[];

  constructor(value?: string){
    this.value = value ?? null;
    this.nodes = [];
  }

  addNode(value: string): Node{
    const node = new Node(value);
    this.nodes.push(node);
    return node;
  }

  addWord(iterator: Iterator<string>): void{
    const { value, done } = iterator.next();
    if(done) return;

    const node = this.addNode(value);
    return node.addWord(iterator);
  }

}

export default function Page() {
  const string = "christmas";

  const iterator = string[Symbol.iterator]()

  const root = new Node();

  root.addWord(iterator);

  console.log(root);

  return(<></>);
}