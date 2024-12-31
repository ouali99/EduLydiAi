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

    export const genertsteNotesAIModel = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              {text: "Generate exam material detail content for eachh chapter, make sur to includes all topic point in the content, make sur to give content in HTML format (Do not add HTMLK, Head, Body, title tag), The chaptere:\n{\n      \"chapter_title\": \"Introduction to Java\",\n      \"summary\": \"This chapter introduces Java, its applications, and setting up your programming environment. We'll cover installing the JDK, setting up a suitable IDE (like Eclipse or IntelliJ), and compiling and running your first Java program.\",\n      \"topics\": [\n        \"What is Java?\",\n        \"Why learn Java?\",\n        \"Installing the JDK\",\n        \"Choosing an IDE (Eclipse, IntelliJ)\",\n        \"The structure of a Java program\",\n        \"Compiling and running Java code\"\n      ]\n    },"},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "```html\n<h3>Introduction to Java</h3>\n<p>This chapter introduces Java, its applications, and setting up your programming environment.  We'll cover installing the JDK, setting up a suitable IDE (like Eclipse or IntelliJ), and compiling and running your first Java program.</p>\n\n<h4>What is Java?</h4>\n<p>Explain Java's nature as a high-level, object-oriented, platform-independent programming language. Discuss its features: robustness, security, platform independence (\"write once, run anywhere\"), and its use in various applications.</p>\n\n<h4>Why learn Java?</h4>\n<p>Discuss the reasons to learn Java.  Include points such as its widespread use in enterprise applications, Android development, big data technologies, and its strong community support and abundant learning resources.  Highlight career opportunities associated with Java proficiency.</p>\n\n<h4>Installing the JDK (Java Development Kit)</h4>\n<p>Provide step-by-step instructions for downloading and installing the appropriate JDK version for your operating system (Windows, macOS, Linux). Include screenshots where helpful. Mention setting the JAVA_HOME environment variable and verifying the installation by checking the Java version in the command prompt/terminal.</p>\n\n<h4>Choosing an IDE (Integrated Development Environment): Eclipse and IntelliJ</h4>\n<p>Compare and contrast Eclipse and IntelliJ IDEA (community edition). Discuss their features, advantages, and disadvantages. Provide links to download pages for both IDEs.  Offer brief instructions on setting up a new Java project in each IDE.</p>\n\n<h4>The Structure of a Java Program</h4>\n<p>Explain the basic structure of a Java program, including the <code>public class</code> declaration, the <code>main</code> method,  <code>System.out.println()</code> for output, and the use of comments (<code>//</code> and <code>/* ... */</code>).  Show examples of a simple \"Hello, World!\" program.</p>\n\n<h4>Compiling and Running Java Code</h4>\n<p>Explain the compilation process using the Java compiler (<code>javac</code>).  Describe how to compile a Java source file (<code>.java</code>) into a bytecode file (<code>.class</code>). Explain the role of the Java Virtual Machine (JVM) in running the bytecode. Provide step-by-step instructions for compiling and running a Java program from the command line and within the chosen IDE.</p>\n```\n"},
            ],
          },
        ],
      });
  
    // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    // console.log(result.response.text());
  