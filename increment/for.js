for (let xxx = 8; 
        xxx < 12; 
            xxx++) {
    /// xxx will be 8, 9, 10, 11
}

for (const value in array) {
    // value will get each array item per loop
}

for (const value of object) {
    // value gets each of the object's values in the object
    // === for (const value in Object.values(object))
} 

const y = 0;
let x = y++; // x gets 0
let z = ++y; // z gets 1

// c 00010101010...
// 0 c00010101010...
// c 000010101010...


while (value) {
    // happens over and over till value= false
    break;  // immediately exits the while
}

do {
    // same as above but runs at least 1 loop
    continue; // immediately loops from here
} while (value);

class Foo {
    constructor() {
        this.bar = 2;
    }

    bar() {
        return this.bar;
    }

    static getBar() {
        return 4;
    }

} // class foo

let f = new Foo();
console.log(f.bar); // = 2
console.log(Foo.getBar); // =4

var g = {};

g.foo = 4;

window.foo = 3;

if (x === 3) {

}


// optimization:

{ // good   
    let x = 4;
    let y = 5;
    let sum = x + y;
    let product = x * y;
}

{ // bad
    let sum = 4+5;
    let product = 4*5;
}
