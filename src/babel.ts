import { BigNumber } from 'bignumber.js';

const ALPHABET = '$abcdefghijklmnopqrstuvwxyz*()?_@#~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ[]{}<>;:' as const;
const MEGA_BASE = ALPHABET.length;
const BASE = 30;

BigNumber.config({
    ALPHABET,
    POW_PRECISION: 1e+9,
    EXPONENTIAL_AT: 1e+9,
    ROUNDING_MODE: BigNumber.ROUND_FLOOR,
    DECIMAL_PLACES: 300
})

const MAX_LENGTH = 280;
const maxCombinations = (new BigNumber(BASE)).exponentiatedBy(MAX_LENGTH);

interface Direction {
  name: string;
  total: BigNumber.Value
  sectionSize: BigNumber
  position: BigNumber
}
const directions: Direction[] = [
    {
        name: 'universe',
        total: 100_000_000_000_000,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    },
    {
        name: 'galaxy',
        total: 2_000_000_000_000,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    },
    {
        name: 'solar system',
        total: 100_000_000_000,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    },
    {
        name: 'planet',
        total: 20,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    },
    {
        name: 'country',
        total: 100,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    },
    {
        name: 'state',
        total: 50,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    },
    {
        name: 'city',
        total: 1_000,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    },
    {
        name: 'street',
        total: 10_000,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    },
    {
        name: 'building',
        total: 10_000,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    },
    {
        name: 'floor',
        total: 250,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    },
    {
        name: 'server room',
        total: 100,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    },
    {
        name: 'server rack',
        total: 100,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    },
    {
        name: 'server',
        total: 100,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    },
    {
        name: 'hard drive',
        total: 100,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    },
    {
        name: 'data row',
        total: 100 * 1024 * 1024 * 1024 * 1024,
        sectionSize: new BigNumber(1),
        position: new BigNumber(1),
    }
];

const totalInUniverse = directions.reduce(
    (result, direction) => result.multipliedBy(direction.total),
    new BigNumber(1)
);

const totalUniverses = maxCombinations.dividedBy(totalInUniverse);
directions.unshift({
    name: 'realities',
    total: totalUniverses,
    sectionSize: new BigNumber(1),
    position: new BigNumber(1),
});

console.log(JSON.stringify(directions));

let current = maxCombinations;
directions.forEach((direction) => {
    direction.sectionSize = current.dividedToIntegerBy(direction.total);
    current = direction.sectionSize;
});

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

const safeString = (val: string) => val.toLowerCase().replace(/[^a-z ?,.]/g, '');

// becomes consumable by BigNumber
export const encode = (val: string) => {
    return characterMapping.reduce(
        (result, { leftRegExp, right }) => result.replace(leftRegExp, right),
        safeString(val.substring(0, MAX_LENGTH))
    ).padEnd(MAX_LENGTH).split('').reverse().join('');
}

// becomes readable
export const decode = (val: string) => {
    return characterMapping.reduce(
        (result, { left, rightRegExp }) => result.replace(rightRegExp, left),
        val
    ).split('').reverse().join('');
}


const MAX_TWEET = '?'.repeat(MAX_LENGTH);
const LARGEST_NUM = new BigNumber(encode(MAX_TWEET), BASE)

export class Chirp {
    directions: Direction[] = [];
    readableText: string;
    num: BigNumber;

    static fromBase79(base79: string) {
        return new Chirp(new BigNumber(base79, MEGA_BASE));
    }

    static fromText(text: string) {
        return new Chirp(encode(text), BASE);
    }

    constructor(val: BigNumber.Value, base?: number) {
        this.num = new BigNumber(val, base);

        if (this.num.isGreaterThan(LARGEST_NUM)) {
          this.num = new BigNumber(LARGEST_NUM);
        }

        this.readableText = decode(this.num.toString(BASE));
        this.redoDirections();
    }

    redoDirections = () => {
        let currentNum: BigNumber = this.num;
        const direction = directions.map(({ name, total, sectionSize }) => {
            const position = currentNum.dividedToIntegerBy(sectionSize);
            currentNum = currentNum.modulo(sectionSize);

            return {
                name,
                position,
                total,
                sectionSize
            };
        });

        // const doubleCheck = direction.reverse().reduce((result, {position, sectionSize}) => {
        //     const n = (new BigNumber(position)).multipliedBy(sectionSize);

        //     return result.plus(n);
        // }, new BigNumber(0));

        // console.log(decode(doubleCheck.toString(base)));

        // console.table(direction);
        this.directions = direction;
    }

    changeDirection = (i: number, value: BigNumber.Value) => {
        let num = new BigNumber(value);
        num = num.minus(1);
        num = num.modulo(this.directions[i].sectionSize);
        this.directions[i].position = num;

        const doubleCheck = this.directions.slice().reverse().reduce((result, {position, sectionSize}) => {
            const n = (new BigNumber(position)).multipliedBy(sectionSize);

            return result.plus(n);
        }, new BigNumber(0));

        console.log(decode(doubleCheck.toString(BASE)));
        return new Chirp(doubleCheck);
    }

    getDirections = () => {
        return this.directions;
    }

    toText = () => {
        return decode(this.num.toString(BASE));
    }

    toBase79 = () => {
        return this.num.toString(MEGA_BASE);
    }
}
