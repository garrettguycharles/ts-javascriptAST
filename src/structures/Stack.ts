export class Stack<T> {
    stack: T[] = [];

    push(t: T): void {
        this.stack.push(t);
    }

    pop(): T | undefined {
        return this.stack.pop();
    }

    peek(): T | undefined {
        if (this.stack.length < 1) {
            return undefined;
        }

        return this.stack[this.stack.length - 1];
    }

    size(): number {
        return this.stack.length;
    }
}