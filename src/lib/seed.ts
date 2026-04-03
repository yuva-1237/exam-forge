import { users, categories, questions, isSeeded, markSeeded, generateId } from './db';
import { hashPassword } from './auth';
import type { User, Category, Question, Option } from '@/types';

function makeOptions(opts: [string, boolean][]): Option[] {
  return opts.map(([text, isCorrect]) => ({ id: generateId(), text, isCorrect }));
}

function q(categoryId: string, text: string, difficulty: 'easy' | 'medium' | 'hard', opts: [string, boolean][], neg = 0.25): Question {
  return { id: generateId(), categoryId, text, difficulty, negativeMarking: neg, options: makeOptions(opts) };
}

// Additional subjects
export const NEW_CATEGORIES = [
  { name: 'Figma', description: 'UI/UX design principles and tool mastery', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
  { name: 'C', description: 'Low-level programming and memory management', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg' },
  { name: 'C++', description: 'Object-oriented programming in C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg' },
  { name: 'TypeScript', description: 'Typed JavaScript, generics, and interfaces', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
  { name: 'HTML5', description: 'Web page structure, semantics, and multimedia', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
  { name: 'CSS3', description: 'Web styling, layouts, animations, and responsive design', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
  { name: 'Node.js', description: 'Server-side JavaScript and backend architecture', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
  { name: 'MongoDB', description: 'NoSQL document databases and scaling', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
  { name: 'PostgreSQL', description: 'Advanced relational database management', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
  { name: 'Docker', description: 'Containerization, images, and deployment', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
  { name: 'Git', description: 'Version control systems and repository management', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
  { name: 'Java', description: 'Object-oriented programming and JVM memory', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
  { name: 'Photoshop', description: 'Layer-based raster image editing and design', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-plain.svg' },
  { name: 'AWS', description: 'Cloud infrastructure and serverless computing', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { name: 'Vue.js', description: 'Reactive web interfaces and state management', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg' },
  { name: 'Linux', description: 'OS core, command-line usage, and scripting', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' }
];

export function generateNewSubjectQuestions(catId: string, name: string): Question[] {
  if (name === 'Figma') return [
    q(catId, 'What is Figma primarily used for?', 'easy', [['Database management', false], ['UI/UX design', true], ['Video editing', false], ['Backend server routing', false]]),
    q(catId, 'Is Figma a web-based or native-only application?', 'easy', [['Native only', false], ['Web-based with native wrappers', true], ['Mobile only', false], ['It relies on local rendering engines', false]]),
    q(catId, 'What feature allows real-time collaboration in Figma?', 'easy', [['Multiplayer', true], ['SyncMode', false], ['LiveShare', false], ['NetProject', false]]),
    q(catId, 'What is a "Component" in Figma?', 'medium', [['A color variable', false], ['A reusable design element', true], ['A page layout block', false], ['A plugin', false]]),
    q(catId, 'What does Auto Layout do?', 'medium', [['Animates screen transitions', false], ['Creates dynamic frames that adapt to content', true], ['Automatically exports images', false], ['Aligns text to grid automatically', false]]),
    q(catId, 'Which tool is used to draw custom vector shapes?', 'medium', [['Shape Builder', false], ['Pen Tool', true], ['Vector Brush', false], ['Node Modifier', false]]),
    q(catId, 'What are Figma Plugins used for?', 'easy', [['Exporting project to React natively', false], ['Extending functionality and automating tasks', true], ['Changing CSS globally', false], ['Hosting the final website', false]]),
    q(catId, 'How can you prototype a hover effect in Figma?', 'hard', [['Using Auto Layout variants', false], ['Interactive components / While Hovering', true], ['Using CSS code injection', false], ['It is impossible natively', false]]),
    q(catId, 'What is a Variant in Figma?', 'medium', [['An alternative project file', false], ['A specific state or version of a Component', true], ['A temporary slice', false], ['A color placeholder', false]]),
    q(catId, 'Can you inspect CSS code directly in Figma?', 'medium', [['No, plugins are needed', false], ['Yes, via Dev Mode / Inspect Panel', true], ['Yes, but only in paid plans', false], ['No, Figma is vector only', false]]),
  ];
  if (name === 'C') return [
    q(catId, 'Who invented the C programming language?', 'easy', [['Bjarne Stroustrup', false], ['Dennis Ritchie', true], ['Linus Torvalds', false], ['James Gosling', false]]),
    q(catId, 'What is the standard input/output library in C?', 'easy', [['stdlib.h', false], ['stdio.h', true], ['iostream', false], ['conio.h', false]]),
    q(catId, 'How do you declare a pointer variable?', 'medium', [['int ref ptr;', false], ['int *ptr;', true], ['pointer int ptr;', false], ['&int ptr;', false]]),
    q(catId, 'What does the malloc function do?', 'medium', [['Frees memory', false], ['Allocates dynamic memory', true], ['Copies memory arrays', false], ['Calculates variable size', false]]),
    q(catId, 'Which keyword is used to stop a loop immediately?', 'easy', [['continue', false], ['break', true], ['stop', false], ['exit', false]]),
    q(catId, 'What is the default return type of main() in standard C?', 'easy', [['void', false], ['int', true], ['float', false], ['char', false]]),
    q(catId, 'What does the sizeof operator return?', 'medium', [['Value of variable', false], ['Size of a variable or type in bytes', true], ['Memory address', false], ['Length of a string character count', false]]),
    q(catId, 'What is true about arrays in C?', 'medium', [['They can change size dynamically', false], ['They are contiguous blocks of memory', true], ['They check for out of bounds automatically', false], ['They hold multiple data types easily', false]]),
    q(catId, 'Can you define a function inside another function in standard C?', 'hard', [['Yes', false], ['No', true], ['Only if static', false], ['Only in header files', false]]),
    q(catId, 'What character marks the end of a string in C?', 'easy', [['\\n', false], ['\\0', true], ['EOF', false], ['None of the above', false]]),
  ];
  if (name === 'C++') return [
    q(catId, 'What is the primary paradigm added in C++ over C?', 'easy', [['Functional Programming', false], ['Object-Oriented Programming', true], ['Logic Programming', false], ['Procedural Programming', false]]),
    q(catId, 'Which library is used for console input/output in C++?', 'easy', [['stdio.h', false], ['iostream', true], ['console', false], ['system.io', false]]),
    q(catId, 'What is a constructor?', 'medium', [['A destructor wrapper', false], ['A special method called when an object is created', true], ['A static property', false], ['An external compiler flag', false]]),
    q(catId, 'Which keyword is used for dynamic memory allocation in C++?', 'medium', [['malloc', false], ['new', true], ['alloc', false], ['create', false]]),
    q(catId, 'What is the std namespace used for?', 'medium', [['Standardizing code style', false], ['Standard library functions and objects', true], ['Studying variables', false], ['Streamlining compiler output', false]]),
    q(catId, 'Does C++ support multiple inheritance?', 'hard', [['No', false], ['Yes', true], ['Only via interfaces', false], ['Only for structs', false]]),
    q(catId, 'What is a virtual function?', 'hard', [['A function that does not exist', false], ['A function that can be overridden in a derived class', true], ['A function without a body', false], ['A macro expansion', false]]),
    q(catId, 'What does encapsulation mean?', 'medium', [['Running code in a capsule', false], ['Hiding internal state and requiring interaction through methods', true], ['Merging two classes', false], ['Exposing all properties globally', false]]),
    q(catId, 'What is an STL vector?', 'hard', [['A physics mathematical structure', false], ['A dynamic array', true], ['A fixed-size array', false], ['A doubly linked list', false]]),
    q(catId, 'What is a template in C++?', 'hard', [['A starting boilerplate file', false], ['A blueprint for creating generic functions or classes', true], ['A predefined UI layout', false], ['A built-in class', false]]),
  ];
  if (name === 'TypeScript') return [
    q(catId, 'What is TypeScript?', 'easy', [['A new backend language', false], ['A typed superset of JavaScript', true], ['A database query language', false], ['A styling preprocessor', false]]),
    q(catId, 'How do you specify an optional parameter or property in TS?', 'easy', [['Add an exclamation mark (!)', false], ['Add a question mark (?)', true], ['Wrap in brackets []', false], ['Use the optional keyword', false]]),
    q(catId, 'What is an interface used for?', 'medium', [['Rendering UI', false], ['Defining the shape of an object', true], ['Importing modules', false], ['Creating database tables', false]]),
    q(catId, 'Which type can hold any value, effectively disabling type checking?', 'easy', [['unknown', false], ['any', true], ['object', false], ['void', false]]),
    q(catId, 'What is a major difference between interface and type?', 'hard', [['Interfaces cannot be merged', false], ['Types can define unions easily', true], ['Interfaces are slower', false], ['No difference at all', false]]),
    q(catId, 'What is the unknown type?', 'hard', [['Same as any', false], ['A type-safe counterpart of any', true], ['A type that throws errors when used', false], ['A deprecated feature', false]]),
    q(catId, 'Can TypeScript run directly in the browser?', 'medium', [['Yes, in modern browsers', false], ['No, it must be transpired to JavaScript', true], ['Only with WebAssembly', false], ['Only in Chrome', false]]),
    q(catId, 'How do you correctly type an array of strings?', 'easy', [['string{}', false], ['string[] or Array<string>', true], ['[string]', false], ['List<string>', false]]),
    q(catId, 'What are Generics?', 'medium', [['Brandless variables', false], ['A way to make components work over a variety of types rather than a single one', true], ['Functions without names', false], ['Automatically generated code', false]]),
    q(catId, 'What does the enum keyword do?', 'medium', [['Finds elements in arrays', false], ['Defines a set of named constants', true], ['Iterates over loops', false], ['Exports variables', false]]),
  ];
  if (name === 'HTML5') return [
    q(catId, 'What does HTML stand for?', 'easy', [['HyperText Markup Language', true], ['Hyperlinks and Text Markup Language', false], ['Home Tool Markup Language', false], ['Hyper Tool Markup Language', false]]),
    q(catId, 'What is the correct HTML element for inserting a line break?', 'easy', [['<lb>', false], ['<br>', true], ['<break>', false], ['<nl>', false]]),
    q(catId, 'Choose the correct HTML element to define important text?', 'easy', [['<strong>', true], ['<b>', false], ['<i>', false], ['<important>', false]]),
    q(catId, 'Which character is used to indicate an end tag?', 'easy', [['^', false], ['/', true], ['<', false], ['*', false]]),
    q(catId, 'How can you open a link in a new tab/browser window?', 'medium', [['<a href="url" target="new">', false], ['<a href="url" target="_blank">', true], ['<a href="url" new>', false], ['<a target="url">', false]]),
    q(catId, 'Which HTML attribute specifies an alternate text for an image?', 'easy', [['alt', true], ['title', false], ['src', false], ['longdesc', false]]),
    q(catId, 'What is the correct HTML for adding a background color?', 'medium', [['<body bg="yellow">', false], ['<body style="background-color:yellow;">', true], ['<background>yellow</background>', false], ['<body col="yellow">', false]]),
    q(catId, 'Choose the correct HTML element to define emphasized text?', 'easy', [['<i>', false], ['<em>', true], ['<italic>', false], ['<strong>', false]]),
    q(catId, 'Which HTML element is used to specify a footer for a document?', 'easy', [['<bottom>', false], ['<footer>', true], ['<section>', false], ['<end>', false]]),
    q(catId, 'In HTML, onblur and onfocus are?', 'medium', [['Event attributes', true], ['HTML elements', false], ['Style attributes', false], ['Media queries', false]]),
  ];
  if (name === 'CSS3') return [
    q(catId, 'What does CSS stand for?', 'easy', [['Computer Style Sheets', false], ['Cascading Style Sheets', true], ['Creative Style Sheets', false], ['Colorful Style Sheets', false]]),
    q(catId, 'Where in an HTML document is the correct place to refer to an external style sheet?', 'easy', [['At the end of the document', false], ['In the <head> section', true], ['In the <body> section', false], ['In the <footer> section', false]]),
    q(catId, 'Which HTML tag is used to define an internal style sheet?', 'easy', [['<css>', false], ['<style>', true], ['<script>', false], ['<link>', false]]),
    q(catId, 'Which HTML attribute is used to define inline styles?', 'easy', [['class', false], ['style', true], ['id', false], ['font', false]]),
    q(catId, 'Which property is used to change the background color?', 'easy', [['color', false], ['background-color', true], ['bgcolor', false], ['fill', false]]),
    q(catId, 'How do you add a background color for all <h1> elements?', 'medium', [['all.h1 {background-color:#FFF;}', false], ['h1 {background-color:#FFFFFF;}', true], ['h1.all {background-color:#FFF;}', false], ['<h1> {background-color:#FFF;}', false]]),
    q(catId, 'Which CSS property is used to change the text color?', 'easy', [['text-color', false], ['color', true], ['font-color', false], ['fgcolor', false]]),
    q(catId, 'Which CSS property controls the text size?', 'easy', [['font-style', false], ['font-size', true], ['text-size', false], ['text-style', false]]),
    q(catId, 'What is the correct CSS syntax for making all the <p> elements bold?', 'medium', [['p {text-size:bold;}', false], ['p {font-weight:bold;}', true], ['<p style="text-size:bold;">', false], ['p {font:bold;}', false]]),
    q(catId, 'How do you select an element with id "header"?', 'easy', [['*header', false], ['#header', true], ['.header', false], ['header', false]]),
  ];
  if (name === 'Node.js') return [
    q(catId, 'What is Node.js?', 'easy', [['A web browser', false], ['A JavaScript runtime built on Chromes V8 engine', true], ['A CSS framework', false], ['A database management system', false]]),
    q(catId, 'Which module is used to create a web server in Node?', 'easy', [['url', false], ['http', true], ['server', false], ['fs', false]]),
    q(catId, 'What does npm stand for?', 'easy', [['Node Program Maker', false], ['Node Package Manager', true], ['New Project Method', false], ['Network Profile Manager', false]]),
    q(catId, 'How do you import a module in CommonJS?', 'medium', [['import module', false], ['require("module")', true], ['load("module")', false], ['include module', false]]),
    q(catId, 'Is Node.js single-threaded or multi-threaded?', 'medium', [['Multi-threaded', false], ['Single-threaded', true], ['None', false], ['Depends on OS', false]]),
    q(catId, 'What is the package.json file?', 'easy', [['A list of servers', false], ['A manifest file for Node.js projects', true], ['A database backup', false], ['A configuration for Git', false]]),
    q(catId, 'Which framework is most commonly used with Node.js?', 'easy', [['Django', false], ['Express', true], ['Flask', false], ['Laravel', false]]),
    q(catId, 'How do you read a file asynchronously in Node?', 'hard', [['fs.readAsync()', false], ['fs.readFile()', true], ['fs.readFileSync()', false], ['fs.open()', false]]),
    q(catId, 'What is an event emitter in Node.js?', 'hard', [['A server endpoint', false], ['An object that emits named events', true], ['A database trigger', false], ['A logger utility', false]]),
    q(catId, 'What does the process object provide?', 'medium', [['Database connection strings', false], ['Information about the current Node process', true], ['UI rendering APIs', false], ['Network security tokens', false]]),
  ];
  if (name === 'MongoDB') return [
    q(catId, 'What type of database is MongoDB?', 'easy', [['Relational', false], ['NoSQL / Document-oriented', true], ['Graph', false], ['Key-Value', false]]),
    q(catId, 'How is data stored in MongoDB?', 'easy', [['Rows and columns', false], ['BSON / JSON-like documents', true], ['XML documents', false], ['Plain text files', false]]),
    q(catId, 'What is a Collection in MongoDB equivalent to in SQL?', 'medium', [['Database', false], ['Table', true], ['Row', false], ['Index', false]]),
    q(catId, 'What is a Document in MongoDB equivalent to in SQL?', 'medium', [['Column', false], ['Row', true], ['Table', false], ['Foreign Key', false]]),
    q(catId, 'Which command is used to insert a document?', 'easy', [['add()', false], ['insertOne() / insertMany()', true], ['push()', false], ['write()', false]]),
    q(catId, 'What does the _id field represent?', 'medium', [['Temporary ID', false], ['Primary key', true], ['Foreign key', false], ['Index count', false]]),
    q(catId, 'Which method is used to find documents?', 'easy', [['search()', false], ['find()', true], ['get()', false], ['query()', false]]),
    q(catId, 'What is Mongoose?', 'hard', [['A native MongoDB database app', false], ['An ODM library for MongoDB and Node.js', true], ['A MongoDB GUI', false], ['A backup tool', false]]),
    q(catId, 'Which operator is used for purely updating specific fields?', 'hard', [['$update', false], ['$set', true], ['$change', false], ['$modify', false]]),
    q(catId, 'How do you sort documents in MongoDB?', 'medium', [['order()', false], ['sort()', true], ['arrange()', false], ['filter()', false]]),
  ];
  if (name === 'PostgreSQL') return [
    q(catId, 'What type of database is PostgreSQL?', 'easy', [['NoSQL', false], ['Relational / RDBMS', true], ['In-memory', false], ['Document', false]]),
    q(catId, 'What language is used to query PostgreSQL?', 'easy', [['Java', false], ['SQL', true], ['Python', false], ['C++', false]]),
    q(catId, 'Which command is used to create a new database?', 'easy', [['MAKE DATABASE', false], ['CREATE DATABASE', true], ['NEW DB', false], ['INIT DATABASE', false]]),
    q(catId, 'What is the primary data type for UUIDs in Postgres?', 'medium', [['string', false], ['uuid', true], ['char(36)', false], ['unique_id', false]]),
    q(catId, 'How do you add a new column to a table?', 'medium', [['ADD COLUMN', false], ['ALTER TABLE ... ADD COLUMN', true], ['UPDATE TABLE ADD', false], ['INSERT COLUMN', false]]),
    q(catId, 'What is pgAdmin?', 'easy', [['A backup tool', false], ['A GUI administration tool for Postgres', true], ['A connection driver', false], ['A built-in user', false]]),
    q(catId, 'Which index type is the default in PostgreSQL?', 'hard', [['Hash', false], ['B-tree', true], ['GiST', false], ['GIN', false]]),
    q(catId, 'What is a JSONB column?', 'hard', [['A plain text JSON string', false], ['A column storing JSON data in binary format', true], ['A corrupted JSON element', false], ['A backup file format', false]]),
    q(catId, 'Which clause is used to filter grouped data?', 'hard', [['WHERE', false], ['HAVING', true], ['FILTER', false], ['LIMIT', false]]),
    q(catId, 'How do you delete a table?', 'easy', [['REMOVE TABLE', false], ['DROP TABLE', true], ['DELETE TABLE', false], ['TRUNCATE TABLE', false]]),
  ];
  if (name === 'Docker') return [
    q(catId, 'What is Docker?', 'easy', [['A cloud provider', false], ['A platform for developing, shipping, and running applications in containers', true], ['A virtual machine hypervisor', false], ['A version control tool', false]]),
    q(catId, 'What is a Docker Image?', 'medium', [['A running instance', false], ['A read-only template with instructions to create a container', true], ['A backup of the OS', false], ['A network port map', false]]),
    q(catId, 'What is a Docker Container?', 'easy', [['A physical server', false], ['A runnable instance of an image', true], ['A storage volume', false], ['A code repository', false]]),
    q(catId, 'Which file defines a Docker image?', 'easy', [['docker.json', false], ['Dockerfile', true], ['docker.yml', false], ['config.docker', false]]),
    q(catId, 'Command to list running containers?', 'medium', [['docker list', false], ['docker ps', true], ['docker ls', false], ['docker show', false]]),
    q(catId, 'What does Docker Compose do?', 'hard', [['Compresses images', false], ['Defines and runs multi-container applications', true], ['Pushes code to GitHub', false], ['Creates virtual networks automatically', false]]),
    q(catId, 'Command to build an image from a Dockerfile?', 'medium', [['docker create', false], ['docker build', true], ['docker make', false], ['docker init', false]]),
    q(catId, 'What is Docker Hub?', 'easy', [['A local GUI', false], ['A cloud-based registry service', true], ['A network router', false], ['A database', false]]),
    q(catId, 'Command to stop a running container?', 'easy', [['docker end', false], ['docker stop', true], ['docker killall', false], ['docker pause', false]]),
    q(catId, 'How do you map a port in Docker?', 'hard', [['-p or --publish', true], ['-m or --map', false], ['-n or --network', false], ['-port', false]]),
  ];
  if (name === 'Git') return [
    q(catId, 'What is Git?', 'easy', [['A web host', false], ['A distributed version control system', true], ['A text editor', false], ['A programming language', false]]),
    q(catId, 'Command to initialize a repository?', 'easy', [['git start', false], ['git init', true], ['git create', false], ['git new', false]]),
    q(catId, 'Command to add files to staging?', 'easy', [['git stage', false], ['git add', true], ['git push', false], ['git commit', false]]),
    q(catId, 'Command to save changes?', 'easy', [['git save', false], ['git commit', true], ['git store', false], ['git stash', false]]),
    q(catId, 'Command to check repository status?', 'easy', [['git log', false], ['git status', true], ['git show', false], ['git current', false]]),
    q(catId, 'Command to pull from remote?', 'medium', [['git fetch', false], ['git pull', true], ['git download', false], ['git sync', false]]),
    q(catId, 'Command to push to remote?', 'medium', [['git upload', false], ['git push', true], ['git send', false], ['git post', false]]),
    q(catId, 'Command to switch branches?', 'hard', [['git swap', false], ['git checkout / git switch', true], ['git jump', false], ['git move', false]]),
    q(catId, 'What does git clone do?', 'easy', [['Creates a backup branch', false], ['Copies an existing repository', true], ['Merges two repos', false], ['Deletes a repo', false]]),
    q(catId, 'What is a merge conflict?', 'hard', [['A server timeout', false], ['When Git cannot automatically resolve differences in code', true], ['A permission denied error', false], ['A syntax error in code', false]]),
  ];
  if (name === 'Java') return [
    q(catId, 'What is Java?', 'easy', [['A database engine', false], ['An Object-oriented programming language', true], ['A web browser wrapper', false], ['An operating system script', false]]),
    q(catId, 'Who invented Java?', 'easy', [['Linus Torvalds', false], ['James Gosling', true], ['Dennis Ritchie', false], ['Bjarne Stroustrup', false]]),
    q(catId, 'Which keyword is used to allocate memory for an object?', 'medium', [['alloc', false], ['new', true], ['malloc', false], ['create', false]]),
    q(catId, 'What is the root class of all classes in Java?', 'easy', [['Object', true], ['Root', false], ['Main', false], ['Super', false]]),
    q(catId, 'Which collection does not allow duplicate elements?', 'easy', [['List', false], ['Set', true], ['Array', false], ['Vector', false]]),
    q(catId, 'What is the default value of a boolean variable?', 'medium', [['true', false], ['false', true], ['null', false], ['undefined', false]]),
    q(catId, 'What does the final keyword indicate?', 'medium', [['It speeds up the program', false], ['The value cannot be modified', true], ['It is the last file to compile', false], ['It marks the end of code', false]]),
    q(catId, 'What is the size of an int in Java?', 'hard', [['16 bits', false], ['32 bits', true], ['64 bits', false], ['8 bits', false]]),
    q(catId, 'Which concept is used to hide inner implementation details?', 'easy', [['Inheritance', false], ['Encapsulation', true], ['Polymorphism', false], ['Compilation', false]]),
    q(catId, 'Is Java a compiled or interpreted language?', 'hard', [['Compiled only', false], ['Both compiled into bytecode and interpreted by JVM', true], ['Interpreted only', false], ['Neither', false]]),
  ];
  if (name === 'Photoshop') return [
    q(catId, 'What is Photoshop primarily used for?', 'easy', [['Video rendering', false], ['Raster image editing and design', true], ['Database management', false], ['Vector logo creation natively', false]]),
    q(catId, 'What are Layers in Photoshop?', 'easy', [['Different software versions', false], ['Transparent structural elements used to separate content', true], ['Color grading effects', false], ['Brushes', false]]),
    q(catId, 'Which tool is used to select areas of similar color quickly?', 'easy', [['Pen Tool', false], ['Magic Wand', true], ['Crop Tool', false], ['Type Tool', false]]),
    q(catId, 'What is the native project file format of Photoshop?', 'easy', [['.png', false], ['.psd', true], ['.pdf', false], ['.jpeg', false]]),
    q(catId, 'Which color mode is primarily used for commercial printing?', 'medium', [['RGB', false], ['CMYK', true], ['Grayscale', false], ['Index', false]]),
    q(catId, 'What does the Clone Stamp tool do?', 'medium', [['Duplicates the entire canvas', false], ['Paints with a sampled area of an image', true], ['Changes opacity to zero', false], ['Shrinks the image size', false]]),
    q(catId, 'What is a Layer Mask?', 'hard', [['A non-destructive way to hide parts of a layer', true], ['A password protection for a layer', false], ['An automatic shadow effect', false], ['A hidden text box', false]]),
    q(catId, 'What does adjusting the "Opacity" do?', 'easy', [['Blurs the image', false], ['Changes the transparency of a layer', true], ['Rotates the image', false], ['Increases the file size', false]]),
    q(catId, 'Which shortcut applies a Free Transform?', 'medium', [['Ctrl+T / Cmd+T', true], ['Ctrl+F / Cmd+F', false], ['Ctrl+Shift+T', false], ['Ctrl+N / Cmd+N', false]]),
    q(catId, 'What is the purpose of adjustment layers?', 'medium', [['They apply color and tonal adjustments non-destructively', true], ['They merge all layers into one', false], ['They save the file to a cloud', false], ['They cut out shapes', false]]),
  ];
  if (name === 'AWS') return [
    q(catId, 'What does AWS stand for?', 'easy', [['Automated Web Services', false], ['Amazon Web Services', true], ['Automated Web Storage', false], ['Advanced Web Server', false]]),
    q(catId, 'What is Amazon EC2?', 'easy', [['A managed database service', false], ['Virtual servers in the cloud', true], ['An email service', false], ['A machine learning tool', false]]),
    q(catId, 'What is Amazon S3 primarily used for?', 'easy', [['Object storage', true], ['Compute power', false], ['DNS routing', false], ['Deploying containers', false]]),
    q(catId, 'Which service is used for serverless compute in AWS?', 'medium', [['EC2', false], ['AWS Lambda', true], ['RDS', false], ['Elastic Beanstalk', false]]),
    q(catId, 'What is an IAM role?', 'medium', [['A billing tier', false], ['An identity with permission policies', true], ['A specific physical user', false], ['A network firewall rule', false]]),
    q(catId, 'Which database is a fast, NoSQL database service in AWS?', 'medium', [['RDS', false], ['DynamoDB', true], ['Aurora', false], ['Redshift', false]]),
    q(catId, 'What does RDS stand for?', 'easy', [['Random Data Server', false], ['Relational Database Service', true], ['Remote Database System', false], ['Regional Data Storage', false]]),
    q(catId, 'How does CloudFront improve performance?', 'hard', [['Provides faster hardware', false], ['It is a CDN caching content closer to users globally', true], ['Compresses images automatically', false], ['Ignores DNS queries', false]]),
    q(catId, 'What is Amazon VPC?', 'hard', [['A fast SSD storage layer', false], ['Virtual Private Cloud for isolated networking', true], ['Verification Process Code', false], ['Virtual Programming Cloud', false]]),
    q(catId, 'What is Route 53 used for?', 'medium', [['Mapping container instances', false], ['DNS web service routing', true], ['DDoS protection', false], ['Handling SSH keys', false]]),
  ];
  if (name === 'Vue.js') return [
    q(catId, 'What is Vue.js?', 'easy', [['A backend framework', false], ['A progressive JavaScript framework for building UIs', true], ['A cloud provider', false], ['A database management tool', false]]),
    q(catId, 'Who created Vue.js?', 'easy', [['Dan Abramov', false], ['Evan You', true], ['Jordan Walke', false], ['Rich Harris', false]]),
    q(catId, 'Which directive is used for two-way data binding?', 'medium', [['v-bind', false], ['v-model', true], ['v-on', false], ['v-text', false]]),
    q(catId, 'How do you conditionally render an element based on truthy state?', 'easy', [['v-show', false], ['v-if', true], ['v-display', false], ['v-check', false]]),
    q(catId, 'What does v-for do?', 'easy', [['Runs a background loop', false], ['Loops over an array or object to render a list of elements', true], ['Delays execution', false], ['Focuses an element', false]]),
    q(catId, 'Which lifecycle hook is called first?', 'medium', [['mounted', false], ['beforeCreate', true], ['created', false], ['beforeMount', false]]),
    q(catId, 'What is Vuex used for?', 'hard', [['Global CSS styling', false], ['State management pattern + library', true], ['Server-side rendering only', false], ['Form validation', false]]),
    q(catId, 'How do you listen to DOM events in Vue?', 'medium', [['onX', false], ['v-on or @', true], ['v-bind', false], ['listen:', false]]),
    q(catId, 'What is a computed property?', 'hard', [['A property that only accepts math inputs', false], ['A derived property that caches its result based on reactive dependencies', true], ['A hardcoded server value', false], ['An asynchronous data fetcher', false]]),
    q(catId, 'How do you bind a dynamic HTML attribute in template tags?', 'medium', [['bind()', false], ['v-bind or :', true], ['{{ attribute }}', false], ['v-attr', false]]),
  ];
  if (name === 'Linux') return [
    q(catId, 'What is the core of the Linux operating system called?', 'easy', [['Shell', false], ['Kernel', true], ['Bash', false], ['Terminal', false]]),
    q(catId, 'Who created Linux?', 'easy', [['Steve Jobs', false], ['Linus Torvalds', true], ['Bill Gates', false], ['Richard Stallman', false]]),
    q(catId, 'Command to list files in a directory?', 'easy', [['show', false], ['ls', true], ['list', false], ['dir', false]]),
    q(catId, 'Command to print the current working directory?', 'easy', [['cwd', false], ['pwd', true], ['loc', false], ['whereami', false]]),
    q(catId, 'Command to copy a file?', 'easy', [['copy', false], ['cp', true], ['c', false], ['move', false]]),
    q(catId, 'Which file typically contains user account details?', 'hard', [['/etc/passwd', true], ['/users.txt', false], ['/sys/accounts', false], ['/config/users', false]]),
    q(catId, 'Command to change file permissions?', 'medium', [['setperm', false], ['chmod', true], ['chown', false], ['chgrp', false]]),
    q(catId, 'Command to display the manual of another command?', 'medium', [['help', false], ['man', true], ['guide', false], ['doc', false]]),
    q(catId, 'Command to find files in a directory hierarchy?', 'hard', [['search', false], ['find', true], ['locate', false], ['trace', false]]),
    q(catId, 'What does the grep command do?', 'medium', [['Zips folders', false], ['Searches text inside files using patterns', true], ['Grants root access', false], ['Connects to a remote server', false]]),
  ];
  return [];
}

export function injectMissingSubjects() {
  const currentCats = categories.getAll();
  const currentNames = currentCats.map(c => c.name);

  for (const newCat of NEW_CATEGORIES) {
    if (!currentNames.includes(newCat.name)) {
      const catId = generateId();
      categories.add({ id: catId, name: newCat.name, description: newCat.description, icon: newCat.icon });
      const qs = generateNewSubjectQuestions(catId, newCat.name);
      qs.forEach(qItem => questions.add(qItem));
    }
  }
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
  const catJS: Category = { id: generateId(), name: 'JavaScript', description: 'Test your JavaScript fundamentals and advanced concepts', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' };
  const catPy: Category = { id: generateId(), name: 'Python', description: 'Python programming from basics to advanced', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' };
  const catReact: Category = { id: generateId(), name: 'React', description: 'React.js concepts, hooks, and best practices', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' };
  const catDB: Category = { id: generateId(), name: 'Database', description: 'SQL, NoSQL, and database design principles', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' };
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

  injectMissingSubjects();

  markSeeded();
}
