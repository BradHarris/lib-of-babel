import React, {
  Component,
} from 'react';
import {BigNumber} from 'bignumber.js';

import './App.css';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz$*()0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const maxBase = ALPHABET.length;
const base = 30;
BigNumber.config({
  ALPHABET,
  POW_PRECISION: 1e+9,
  EXPONENTIAL_AT: 1e+9
})

const PAGE_SIZE = 32;
const maxCombinations = (new BigNumber(base)).exponentiatedBy(PAGE_SIZE);
console.log(maxCombinations.toString().length);

let directions = [
  {
    name: 'galaxy',
    total: 2000000000000
  },
  {
    name: 'star',
    total: 100000000000
  },
  {
    name: 'planet',
    total: 15
  },
  {
    name: 'country',
    total: 200
  },
  {
    name: 'city',
    total: 500
  },
  {
    name: 'street',
    total: 1000
  },
  {
    name: 'street direction',
    total: 2
  },
  {
    name: 'address',
    total: 1000
  },
  {
    name: 'floor',
    total: 50
  },
  {
    name: 'suite',
    total: 20
  },
  {
    name: 'shelf unit',
    total: 24
  },
  {
    name: 'shelf',
    total: 20
  },
  {
    name: 'book',
    total: 50
  },
  {
    name: 'page',
    total: 500
  },
];

const pagesInUniverse = directions.reduce(
  (result, direction) => result.multipliedBy(direction.total),
  new BigNumber(1)
);

const totalUniverses = maxCombinations.dividedToIntegerBy(pagesInUniverse);
directions.unshift({
  name: 'universe',
  total: totalUniverses
});

let current = maxCombinations;
directions.forEach((direction) => {
  direction.sectionSize = current.dividedToIntegerBy(direction.total);
  current = direction.sectionSize;
});

// let prevDivisor = null;
// directions.reverse().forEach((direction) => {
//   direction.divisor = new BigNumber(direction.total);
//   if (prevDivisor) {
//     direction.divisor = direction.divisor.multipliedBy(prevDivisor);
//   }
//   // direction.divisor = prevDivisor.dividedToIntegerBy(direction.total);
//   prevDivisor = direction.divisor;
//   direction.size = direction.divisor.toString();
// }, new BigNumber(1));

console.table(
  directions.map((direction) => ({
    ...direction,
    total: direction.total.toString(),
    sectionSize: direction.sectionSize.toString()
  }))
);

const characterMapping = [
  {
    left: ' ',
    leftRegExp: / /g,
    right: '$',
    rightRegExp: /\$/g,
  },
  {
    left: '.',
    leftRegExp: /\./g,
    right: '*',
    rightRegExp: /\*/g,
  },
  {
    left: ',',
    leftRegExp: /,/g,
    right: '(',
    rightRegExp: /\(/g,
  },
  {
    left: '?',
    leftRegExp: /\?/g,
    right: ')',
    rightRegExp: /\)/g,
  },
];

const encode = (val) => {
  return characterMapping.reduce(
    (result, {leftRegExp, right}) => result.replace(leftRegExp, right),
    val
  );
};

const decode = (val) => {
  return characterMapping.reduce(
    (result, {left, rightRegExp}) => result.replace(rightRegExp, left),
    val
  );
};

// class Page {
//   constructor(buildingNum, roomNum, wall, shelf, bookNum, page) {
//     const num = new BigNumber(buildingNum);
//     const str = num.toString(base);
//     this.value = str.padEnd(PAGE_SIZE);
//   }

//   static fromString(str) {
//     const string = str.padEnd(PAGE_SIZE);
//     const num = new BigNumber(encode(string), base);
//     const binary = num.toString(2);
//     console.log(binary);
//     return new Page(str);
//   }

//   static fromLocation(buildingNum, roomNum, wall, shelf, bookNum, page) {

//   }
// }

const safeString = (val) => {
  return val
    .toLowerCase()
    .replace(/[^a-z0-9 ?,.]/g, '');
}

const defaultValue = 'hi, im brad and this is my test.';
class App extends Component {
  state = {
    value: defaultValue,
    num: new BigNumber(encode(defaultValue), base)
  }

  onChange = (e) => {
    const value = safeString(
      e.target.value.substring(0, PAGE_SIZE)
    );

    const encoded = encode(value).padEnd(PAGE_SIZE);
    const num = new BigNumber(encoded, base);

    let current = num;
    const direction = directions.map(({name, total, sectionSize}) => {
      const position = current.dividedToIntegerBy(sectionSize);
      current = current.modulo(sectionSize);
      return {
        name,
        position,
        p: position.toString(),
        total,
        sectionSize
      };
    });

    const doubleCheck = direction.reverse().reduce((result, {position, sectionSize}) => {
      const t = new BigNumber(position);
      const n = t.multipliedBy(sectionSize);
      return result.plus(n);
    }, new BigNumber(0));
    console.log(decode(doubleCheck.toString(base)));

    console.table(direction);

    this.setState({
      value,
      num
    });
  }

  decodeChanged = (e) => {
    const num = new BigNumber(e.target.value, maxBase);
    const backToString = decode(num.toString(base));

    this.setState({
      value: backToString,
      num
    });
  }

  render() {
    const {
      value,
      num
    } = this.state;

    const backToString = decode(num.toString(base));
    const hex = num.toString(maxBase);

    let current = num;
    return (
      <div className="App">
        <header className="App-header">
          <textarea
            value={value}
            onChange={this.onChange}
            cols={80}
            rows={20}
          />
          <div>{value.length}</div>
          <div>{encode(value)}</div>
          <button
            onClick={this.search}
          >
            Search
          </button>

          <input
            type='text'
            value={'test'}
            onChange={() => {}}
          />
          {
            // directions.map((direction) => (
            //   <input
            //     type='text'
            //     value={current}
            // ))
          }
          <textarea
            value={hex}
            onChange={this.decodeChanged}
            cols={80}
            rows={20}
          />
          <div>{hex.length}</div>

          <div>
            {backToString}
          </div>

        </header>
      </div>
    );
  }
}

export default App;
