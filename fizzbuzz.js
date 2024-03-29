// constants
const Keywords = {
  EMPTY: '',
  RULES: 'Rules',
  INCREMENT: 'Inc',
  START: 'Start',
  END: 'End'
};
const Delimiters = {
  INPUT: ' ',
  LINE: '\n'
};
const InputDelimiterDuplicateRegex = new RegExp(`${Delimiters.INPUT}${Delimiters.INPUT}+`, 'g');
const ConditionProcessMethod = {
  RULES: (output, key, value) => output[key].push(ruleToCondition(value)),
  INCREMENT: (output, key, value) => output[key] = +value[0],
  START: (output, key, value) => output[key] = +value[0],
  END: (output, key, value) => output[key] = +value[0],
};
const ConditionOutputSequence = [Keywords.RULES, Keywords.INCREMENT, Keywords.START, Keywords.END];
const DefaultGenerators = {
  RULES: () => [],
  INCREMENT: () => 1,
  START: () => 1,
  END: () => 100
};

// helpers
const GetKeywordsKey = value => Object.keys(Keywords).find(key => Keywords[key] === value);

// for args
const filterDoubleSpace = input => input.replace(InputDelimiterDuplicateRegex, Delimiters.INPUT);
const argLineToInput = arg => filterDoubleSpace(arg.trim()).split(Delimiters.INPUT);
const getRules = args => args.split(Delimiters.LINE).map(argLineToInput).filter(input => input.length === 2).sort((a, b) => a[0] - b[0]);

// for fizzbuzz
const divisibleByN = (number, n) => number % n === 0;
const ruleToCondition = rule => number => divisibleByN(number, +rule[0]) ? rule[1] : Keywords.EMPTY;
const toOutputValue = (output, i) => output || `${i}`;

// args to fizzbuzz
const getOutputKeyword = keyword => {
  const index = ConditionOutputSequence.indexOf(keyword);
  return index === -1 ? Keywords.RULES : keyword;
};
const getFizzBuzzArguments = rules => rules.reduce((outputObj, rule) => {
  const keywordKey = GetKeywordsKey(getOutputKeyword(rule[1]));
  ConditionProcessMethod[keywordKey](outputObj, keywordKey, rule);
  return outputObj;
}, ConditionOutputSequence.reduce((obj, keyword) => {
  const keywordKey = GetKeywordsKey(keyword);
  obj[keywordKey] = DefaultGenerators[keywordKey]();
  return obj;
}, {}));

const getFizzBuzzRange = (min, max, step) => {
  const diff = max - min;
  const diffIsNegative = diff < 0;
  const stepIsNegative = step < 0;
  
  // XOR, if either is different
  if (diffIsNegative !== stepIsNegative) {
    throw new Error('Invalid range given!');
  }

  const length = diff / step + 1;
  return Array.from({ length }, (_, i) => i * step + min);
};

// main function
const fizzBuzz = (args, print) => {
  const rules = getRules(args);
  const fbArgs = getFizzBuzzArguments(rules);

  getFizzBuzzRange(fbArgs.START, fbArgs.END, fbArgs.INCREMENT).forEach(i => {
    const output = fbArgs.RULES.reduce((text, condition) => text + condition(i), '');
    print(toOutputValue(output, i));
  });
};

// testing
const testFizzBuzzArgsList = [
  `
    3 Fizz
    5 Buzz
    1 ${Keywords.INCREMENT}
    1 ${Keywords.START}
    100 ${Keywords.END}
  `,
  `
    100 ${Keywords.END}
    11 Bizz
    7 Fuzz
    13 Biff
    1 ${Keywords.START}
    5 Buzz
    3 ${Keywords.INCREMENT}
    3 Fizz
  `,
  `
    1365 ${Keywords.END}
    11 Bizz
    7 Fuzz
    13 Biff
    1001 ${Keywords.START}
    5 Buzz
    4 ${Keywords.INCREMENT}
    3 Fizz
  `,
  `
    11 Bizz
    7 Fuzz
    4058 ${Keywords.START}
    -32 ${Keywords.INCREMENT}
    1205 ${Keywords.END}
    13 Biff
    5 Buzz
    3 Fizz
  `,
];
testFizzBuzzArgsList.forEach(testFizzBuzzArgs => {
  console.log(`Argument: ${testFizzBuzzArgs}`);
  console.log('Result:');
  fizzBuzz(testFizzBuzzArgs, console.log);
  console.log('---------');
});
