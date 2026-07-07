const mongoose = require('mongoose');
const Question = require('./models/question');
require('dotenv').config();

const questions = [
  {
    text: "What is an Array and what is the difference between an Array and an Object?",
    category: "technical",
    level: "beginner",
    modelAnswer: "An Array is a data structure that stores a collection of elements ordered by a numeric index. An Object stores data in key-value pairs. Arrays are used for similar lists, Objects are used for different data about the same thing."
  },
  {
    text: "Explain the concept of OOP and its main principles.",
    category: "technical",
    level: "intermediate",
    modelAnswer: "OOP is a programming paradigm based on classes and objects. Its principles are: Encapsulation (hiding data), Inheritance (reusing code), Polymorphism (multiple forms), and Abstraction (hiding complexity)."
  },
  {
    text: "What is the difference between SQL and NoSQL?",
    category: "technical",
    level: "intermediate",
    modelAnswer: "SQL is a relational database that stores data in tables. NoSQL stores data as documents or key-value pairs. SQL is better for structured data, NoSQL is better for large and unstructured data."
  },
  {
    text: "What is an API and how does it work?",
    category: "technical",
    level: "beginner",
    modelAnswer: "An API is an interface that allows two applications to communicate. It works through HTTP requests like GET, POST, PUT, and DELETE. The client sends a request and the server responds with data in JSON format."
  },
  {
    text: "What is Git and why do we use it?",
    category: "technical",
    level: "beginner",
    modelAnswer: "Git is a version control system that allows us to track changes in code and go back to any previous version. We use it to work in teams without overwriting each other's work."
  },
  {
    text: "Explain the concept of Recursion with an example.",
    category: "technical",
    level: "advanced",
    modelAnswer: "Recursion is when a function calls itself. Example: calculating Factorial - factorial(5) = 5 * factorial(4). There must be a base case to stop the recursion."
  },
  {
    text: "What is the difference between var, let, and const in JavaScript?",
    category: "technical",
    level: "beginner",
    modelAnswer: "var is old and has function scope and can be redeclared. let has block scope and its value can be changed. const has block scope and its value cannot be changed after declaration."
  },
  {
    text: "What is HTTP and what is the difference between GET and POST?",
    category: "technical",
    level: "beginner",
    modelAnswer: "HTTP is the protocol for transferring data on the internet. GET retrieves data from the server and sends data in the URL. POST sends data to the server in the body and is used to create new data."
  },
  {
    text: "Explain Async and Await in JavaScript.",
    category: "technical",
    level: "intermediate",
    modelAnswer: "Async and Await are ways to handle asynchronous operations. async is placed before a function to indicate it returns a Promise. await is used inside an async function to wait for a Promise result before continuing."
  },
  {
    text: "What is a Design Pattern and what are the most common types?",
    category: "technical",
    level: "advanced",
    modelAnswer: "A Design Pattern is a reusable solution to a common programming problem. Common types: Singleton ensures only one instance, Factory creates objects without specifying the class, Observer notifies other objects when changes occur."
  },
  {
    text: "How do you handle pressure and deadlines at work?",
    category: "personal",
    level: "beginner",
    modelAnswer: "I prioritize my tasks and break work into smaller tasks with specific time for each. I communicate with the team if there is a problem and ask for help if needed."
  },
  {
    text: "How do you handle criticism and negative feedback?",
    category: "personal",
    level: "beginner",
    modelAnswer: "I listen carefully and try to understand the other person's point of view. I see criticism as an opportunity for improvement, not a personal attack. I apply useful feedback in my work."
  },
  {
    text: "Tell me about yourself and your career goals.",
    category: "personal",
    level: "beginner",
    modelAnswer: "A good answer includes: an introduction about yourself and your field, your core skills, your achievements, and your short and long-term career goals."
  },
  {
    text: "What is the biggest challenge you faced in a project and how did you overcome it?",
    category: "personal",
    level: "intermediate",
    modelAnswer: "A good answer clearly describes the problem, the steps taken to solve it, and the final result. It should show your problem-solving thinking and ability."
  },
  {
    text: "How do you learn a new technology or skill?",
    category: "personal",
    level: "beginner",
    modelAnswer: "I start with the basics from documentation or courses. Then I apply on small projects. I use communities like Stack Overflow and GitHub to learn from others' experiences."
  },
  {
    text: "What are your strengths and weaknesses?",
    category: "personal",
    level: "beginner",
    modelAnswer: "A good answer mentions real strengths related to work. Weaknesses are mentioned with a plan to improve them to show self-awareness and growth."
  },
  {
    text: "How do you work in a team and what is your role?",
    category: "personal",
    level: "intermediate",
    modelAnswer: "I communicate clearly with team members and participate in meetings. I deliver my tasks on time and report any problems. I help colleagues when they need assistance."
  },
  {
    text: "Where do you see yourself in 5 years?",
    category: "personal",
    level: "intermediate",
    modelAnswer: "A good answer shows realistic ambition related to the field, like becoming a Senior Developer or Tech Lead, and explains the steps to achieve that goal."
  },
  {
    text: "How do you handle a disagreement with a colleague at work?",
    category: "personal",
    level: "intermediate",
    modelAnswer: "I try to understand their point of view first. I talk with them directly and calmly. If the disagreement is serious we involve the manager or team lead. The goal is always to reach a solution that benefits the work."
  },
  {
    text: "Why did you choose the programming field?",
    category: "personal",
    level: "beginner",
    modelAnswer: "A good answer shows genuine passion for the field and mentions an experience or moment that made you love programming. It explains how this aligns with your career goals."
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await Question.deleteMany({});
    await Question.insertMany(questions);
    console.log('✅ 20 Questions added successfully');
    process.exit();
  })
  .catch((err) => {
    console.log('❌ Error:', err);
    process.exit();
  });