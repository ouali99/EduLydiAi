const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  

    export const courseOutlineIAModel = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Generate a study material for python for Exam and level of difficulty  will be Easy with the summery of course, list of Chapters along with summery for each chapter, Topic list in each chapter, All results in  JSON format"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"course_title\": \"Easy Python for Beginners\",\n  \"difficulty\": \"Easy\",\n  \"summary\": \"This course provides a gentle introduction to Python programming.  It covers fundamental concepts and basic syntax, suitable for beginners with little to no prior programming experience.  The focus is on understanding core principles rather than advanced techniques.\",\n  \"chapters\": [\n    {\n      \"chapter_title\": \"Introduction to Python\",\n      \"summary\": \"This chapter introduces Python, its applications, and setting up your programming environment. We'll cover installing Python and using a suitable IDE or code editor.\",\n      \"topics\": [\n        \"What is Python?\",\n        \"Why learn Python?\",\n        \"Installing Python\",\n        \"Choosing an IDE/Code Editor (e.g., VS Code, Thonny)\",\n        \"Running your first Python program\",\n        \"Basic program structure\"\n      ]\n    },\n    {\n      \"chapter_title\": \"Data Types and Variables\",\n      \"summary\": \"This chapter explores fundamental data types in Python, including integers, floats, strings, and booleans. We'll learn how to declare variables and perform basic operations.\",\n      \"topics\": [\n        \"Integers\",\n        \"Floating-point numbers\",\n        \"Strings (text)\",\n        \"Booleans (True/False)\",\n        \"Variables and assignment\",\n        \"Type conversion\",\n        \"Basic arithmetic operations (+, -, *, /, //, %, **)\"\n      ]\n    },\n    {\n      \"chapter_title\": \"Operators and Expressions\",\n      \"summary\": \"This chapter delves deeper into operators, including arithmetic, comparison, logical, and assignment operators. We'll learn how to build expressions and evaluate their results.\",\n      \"topics\": [\n        \"Arithmetic operators\",\n        \"Comparison operators (==, !=, >, <, >=, <=)\",\n        \"Logical operators (and, or, not)\",\n        \"Assignment operators (=, +=, -=, *=, /=)\",\n        \"Operator precedence\",\n        \"Building expressions\"\n      ]\n    },\n    {\n      \"chapter_title\": \"Control Flow: Conditional Statements\",\n      \"summary\": \"This chapter introduces conditional statements (if, elif, else) to control the flow of execution based on certain conditions.\",\n      \"topics\": [\n        \"if statements\",\n        \"if-else statements\",\n        \"if-elif-else statements\",\n        \"Nested conditional statements\",\n        \"Boolean expressions in conditionals\"\n      ]\n    },\n    {\n      \"chapter_title\": \"Control Flow: Loops\",\n      \"summary\": \"This chapter covers loops (for and while loops) to repeat blocks of code. We'll learn how to iterate over sequences and control loop execution.\",\n      \"topics\": [\n        \"for loops\",\n        \"while loops\",\n        \"Loop control statements (break, continue)\",\n        \"Iterating through strings and lists\",\n        \"Nested loops\"\n      ]\n    },\n    {\n      \"chapter_title\": \"Data Structures: Lists and Tuples\",\n      \"summary\": \"This chapter introduces lists and tuples – ordered collections of items. We will learn how to create, access, and manipulate these data structures.\",\n      \"topics\": [\n        \"Lists: creation, access, modification\",\n        \"List methods (append, insert, remove, pop)\",\n        \"Tuples: creation, access\",\n        \"Differences between lists and tuples\",\n        \"List slicing\"\n      ]\n    },\n    {\n      \"chapter_title\": \"Functions\",\n      \"summary\": \"This chapter introduces functions – reusable blocks of code that perform specific tasks. We will learn how to define and call functions, and pass arguments.\",\n      \"topics\": [\n        \"Defining functions\",\n        \"Calling functions\",\n        \"Function arguments\",\n        \"Return values\",\n        \"Function scope\"\n      ]\n    }\n  ]\n}\n```\n"},
          ],
        },
      ],
    });
  
    // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    // console.log(result.response.text());
  