import { users, categories, questions, isSeeded, markSeeded, generateId } from './db';
import { hashPassword } from './auth';
import type { User, Category, Question, Option } from '@/types';

function makeOptions(opts: [string, boolean][]): Option[] {
  return opts.map(([text, isCorrect]) => ({ id: generateId(), text, isCorrect }));
}

function q(categoryId: string, text: string, difficulty: 'easy' | 'medium' | 'hard', opts: [string, boolean][], neg = 0.25): Question {
  return { id: generateId(), categoryId, text, difficulty, negativeMarking: neg, options: makeOptions(opts) };
}

export async function seedDatabase() {
  if (isSeeded()) return;

  // Admin user
  const salt = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
  const hashedPw = await hashPassword('Admin123!', salt);
  const admin: User = {
    id: generateId(), email: 'admin@mcq.com', password: hashedPw, salt,
    name: 'Admin', role: 'admin', createdAt: new Date().toISOString(),
  };
  users.add(admin);

  // Categories
  const catJS: Category = { id: generateId(), name: 'JavaScript', description: 'Test your JavaScript fundamentals and advanced concepts', icon: '⚡' };
  const catPy: Category = { id: generateId(), name: 'Python', description: 'Python programming from basics to advanced', icon: '🐍' };
  const catReact: Category = { id: generateId(), name: 'React', description: 'React.js concepts, hooks, and best practices', icon: '⚛️' };
  const catDB: Category = { id: generateId(), name: 'Database', description: 'SQL, NoSQL, and database design principles', icon: '🗄️' };
  [catJS, catPy, catReact, catDB].forEach(c => categories.add(c));

  // JavaScript Questions
  const jsQs: Question[] = [
    q(catJS.id, 'What is the output of typeof null?', 'easy', [['undefined', false], ['null', false], ['object', true], ['number', false]]),
    q(catJS.id, 'Which method converts a JSON string to an object?', 'easy', [['JSON.stringify()', false], ['JSON.parse()', true], ['JSON.object()', false], ['JSON.convert()', false]]),
    q(catJS.id, 'What does === check?', 'easy', [['Value only', false], ['Type only', false], ['Value and type', true], ['Reference', false]]),
    q(catJS.id, 'What is a closure in JavaScript?', 'medium', [['A function with no parameters', false], ['A function that has access to its outer scope variables', true], ['A self-invoking function', false], ['An arrow function', false]]),
    q(catJS.id, 'What is the event loop in JavaScript?', 'medium', [['A loop that handles DOM events', false], ['A mechanism that handles async operations', true], ['A for-loop variant', false], ['A recursive function pattern', false]]),
    q(catJS.id, 'What does Promise.all() do?', 'medium', [['Resolves one promise', false], ['Resolves all promises in parallel', true], ['Rejects all promises', false], ['Chains promises sequentially', false]]),
    q(catJS.id, 'What is the difference between let and var?', 'easy', [['No difference', false], ['let is block-scoped, var is function-scoped', true], ['var is block-scoped, let is function-scoped', false], ['let cannot be reassigned', false]]),
    q(catJS.id, 'What is the prototype chain?', 'hard', [['A linked list of functions', false], ['A mechanism for inheritance in JS', true], ['A way to chain promises', false], ['A DOM traversal method', false]]),
    q(catJS.id, 'What does the "new" keyword do?', 'hard', [['Creates a new variable', false], ['Creates a new scope', false], ['Creates a new object and binds this', true], ['Creates a new function', false]]),
    q(catJS.id, 'What is a WeakMap?', 'hard', [['A Map with string keys only', false], ['A Map where keys are weakly referenced', true], ['A Map that auto-deletes entries', false], ['A smaller version of Map', false]]),
  ];

  // Python Questions
  const pyQs: Question[] = [
    q(catPy.id, 'What is the output of print(type([]))?', 'easy', [["<class 'array'>", false], ["<class 'list'>", true], ["<class 'tuple'>", false], ["<class 'set'>", false]]),
    q(catPy.id, 'Which keyword is used to define a function?', 'easy', [['function', false], ['func', false], ['def', true], ['define', false]]),
    q(catPy.id, 'What does len() do?', 'easy', [['Returns length of an object', true], ['Returns last element', false], ['Creates a range', false], ['Converts to list', false]]),
    q(catPy.id, 'What is a list comprehension?', 'medium', [['A way to compress lists', false], ['A concise way to create lists', true], ['A list sorting method', false], ['A list filtering function', false]]),
    q(catPy.id, 'What is a decorator in Python?', 'medium', [['A design pattern for classes', false], ['A function that modifies another function', true], ['A type of variable', false], ['A way to declare constants', false]]),
    q(catPy.id, 'What is the GIL?', 'hard', [['Global Import Lock', false], ['Global Interpreter Lock', true], ['General Input Layer', false], ['Generated Interface Link', false]]),
    q(catPy.id, 'What is the difference between a tuple and a list?', 'easy', [['Tuples are mutable, lists are immutable', false], ['Tuples are immutable, lists are mutable', true], ['No difference', false], ['Tuples can only store strings', false]]),
    q(catPy.id, 'What is *args used for?', 'medium', [['Keyword arguments', false], ['Variable-length positional arguments', true], ['Default arguments', false], ['Required arguments', false]]),
    q(catPy.id, 'What is a generator?', 'hard', [['A function that returns a list', false], ['A function that yields values lazily', true], ['A class constructor', false], ['A loop variant', false]]),
    q(catPy.id, 'What does __init__ do?', 'easy', [['Initializes a module', false], ['Constructor method for a class', true], ['Imports a package', false], ['Defines a constant', false]]),
  ];

  // React Questions
  const reactQs: Question[] = [
    q(catReact.id, 'What is JSX?', 'easy', [['A database query language', false], ['A syntax extension for JavaScript', true], ['A CSS framework', false], ['A testing library', false]]),
    q(catReact.id, 'What hook manages state in functional components?', 'easy', [['useEffect', false], ['useState', true], ['useRef', false], ['useMemo', false]]),
    q(catReact.id, 'What is the Virtual DOM?', 'medium', [['The actual browser DOM', false], ['A lightweight copy of the real DOM', true], ['A server-side rendering engine', false], ['A CSS rendering engine', false]]),
    q(catReact.id, 'When does useEffect run?', 'medium', [['Before render', false], ['After render', true], ['During render', false], ['Only on mount', false]]),
    q(catReact.id, 'What is the purpose of keys in React lists?', 'easy', [['Styling', false], ['Unique identification for reconciliation', true], ['Event handling', false], ['State management', false]]),
    q(catReact.id, 'What is React.memo?', 'medium', [['A state hook', false], ['A higher-order component for memoization', true], ['A routing solution', false], ['A form handler', false]]),
    q(catReact.id, 'What is the Context API used for?', 'medium', [['Routing', false], ['Prop drilling avoidance / global state', true], ['Animation', false], ['Testing', false]]),
    q(catReact.id, 'What is a custom hook?', 'medium', [['A built-in React feature', false], ['A reusable function using React hooks', true], ['A class method', false], ['A lifecycle method', false]]),
    q(catReact.id, 'What is Suspense in React?', 'hard', [['Error boundary', false], ['Lazy loading wrapper for async rendering', true], ['State manager', false], ['Router component', false]]),
    q(catReact.id, 'What is reconciliation?', 'hard', [['State update process', false], ["React's diffing algorithm for DOM updates", true], ['Component mounting', false], ['Event bubbling', false]]),
  ];

  // Database Questions
  const dbQs: Question[] = [
    q(catDB.id, 'What does SQL stand for?', 'easy', [['Structured Query Language', true], ['Simple Query Language', false], ['Standard Query Logic', false], ['Sorted Query List', false]]),
    q(catDB.id, 'What is a primary key?', 'easy', [['Any column', false], ['A unique identifier for a row', true], ['A foreign key reference', false], ['An index', false]]),
    q(catDB.id, 'What is normalization?', 'medium', [['Making data bigger', false], ['Organizing data to reduce redundancy', true], ['Encrypting data', false], ['Backing up data', false]]),
    q(catDB.id, 'What is an INNER JOIN?', 'medium', [['Returns all rows from both tables', false], ['Returns matching rows from both tables', true], ['Returns unmatched rows', false], ['Deletes matching rows', false]]),
    q(catDB.id, 'What is ACID in databases?', 'hard', [['A programming language', false], ['Atomicity, Consistency, Isolation, Durability', true], ['A NoSQL concept', false], ['A data type', false]]),
    q(catDB.id, 'What is an index?', 'easy', [['A backup copy', false], ['A data structure to speed up queries', true], ['A primary key', false], ['A view', false]]),
    q(catDB.id, 'What is a foreign key?', 'easy', [['A primary key in another table', false], ['A reference to a primary key in another table', true], ['A unique constraint', false], ['A check constraint', false]]),
    q(catDB.id, 'What is a stored procedure?', 'medium', [['A saved query', false], ['A precompiled set of SQL statements', true], ['A backup method', false], ['A table type', false]]),
    q(catDB.id, 'What is sharding?', 'hard', [['Splitting data across multiple databases', true], ['Encrypting data', false], ['Compressing tables', false], ['Creating views', false]]),
    q(catDB.id, 'What is CAP theorem?', 'hard', [['A programming paradigm', false], ['Consistency, Availability, Partition tolerance trade-off', true], ['A SQL function', false], ['A join type', false]]),
  ];

  [...jsQs, ...pyQs, ...reactQs, ...dbQs].forEach(qn => questions.add(qn));

  markSeeded();
}
