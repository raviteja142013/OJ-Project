const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { S3Client, PutObjectCommand,GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const Problem = require("../models/problems_model");
const Submission = require('../models/submission_model');
const dotenv = require('dotenv');

dotenv.config();

// run problem
const runproblem_post = (req, res) => {
  const { code, language, input } = req.body;

  let fileExtension, compileCommand, runCommand, mainFileName;
  const tempDir = os.tmpdir();  // Moved inside the function

  if (language === "python") {
    fileExtension = ".py";
    mainFileName = "main.py";
    runCommand = `python ${path.join(tempDir, mainFileName)}`;
  } else if (language === "cpp") {
    fileExtension = ".cpp";
    mainFileName = "main.cpp";
    compileCommand = `g++ ${path.join(tempDir, mainFileName)} -o ${path.join(tempDir, "main.out")}`;
    runCommand = `${path.join(tempDir, "main.out")}`;
  } else if (language === "java") {
    fileExtension = ".java";
    mainFileName = "Main.java";
    compileCommand = `javac ${path.join(tempDir, mainFileName)}`;
    runCommand = `java -cp ${tempDir} Main`;
  } else {
    return res.status(400).json({ error: "Unsupported language" });
  }

  const tempCodeFilePath = path.join(tempDir, mainFileName);
  try {
    fs.writeFileSync(tempCodeFilePath, code);
  } catch (error) {
    return res.status(500).json({ error: "Failed to write code to file", details: error.message });
  }

  let inputFilePath = null;
  if (input) {
    inputFilePath = path.join(tempDir, "input.txt");
    try {
      fs.writeFileSync(inputFilePath, input);
    } catch (error) {
      fs.unlinkSync(tempCodeFilePath);
      return res.status(500).json({
        error: "Failed to write input to file",
        details: error.message,
      });
    }
  }

  if (compileCommand) {
    exec(compileCommand, (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        fs.unlinkSync(tempCodeFilePath);
        if (inputFilePath) fs.unlinkSync(inputFilePath);
        return res.json({ output: null, error: compileStderr });
      }
      executeCode(runCommand, inputFilePath, tempCodeFilePath, res);
    });
  } else {
    executeCode(runCommand, inputFilePath, tempCodeFilePath, res);
  }
};

function executeCode(command, inputFilePath, tempCodeFilePath, res) {
  const options = inputFilePath ? { input: fs.readFileSync(inputFilePath) } : {};
  const childProcess = exec(command, options, (error, stdout, stderr) => {
    if (fs.existsSync(tempCodeFilePath)) fs.unlinkSync(tempCodeFilePath);
    if (command.includes(".out") && fs.existsSync(path.join(os.tmpdir(), "main.out"))) {
      fs.unlinkSync(path.join(os.tmpdir(), "main.out"));
    } else if (command.includes("java") && fs.existsSync(tempCodeFilePath.replace(".java", ".class"))) {
      fs.unlinkSync(tempCodeFilePath.replace(".java", ".class"));
    }
    if (inputFilePath && fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);

    if (error) {
      res.json({ output: null, error: stderr });
    } else {
      res.json({ output: stdout, error: stderr });
    }
  });

  if (options.input) {
    childProcess.stdin.write(options.input);
    childProcess.stdin.end();
  }
}


const addproblem_post = async (req, res) => {
  try {
    const { title, description, difficulty, constraints, inputFormat, outputFormat, sampleTestCases, topicTags, companyTags, userid } = req.body;
   
    console.log(req.body);
   
    const newProblem = new Problem({
      userid,
      title,
      description,
      difficulty,
      constraints,
      inputFormat,
      outputFormat,
      sampleTestCases,
      topicTags,
      companyTags,
    });

    await newProblem.save();
    res.status(201).json({ message: 'Problem added successfully', Problem: newProblem });

  } catch (error) {
    console.error('Error adding problem:', error);
    res.status(500).json({ error: 'An error occurred while adding the problem' });
  }
};



const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
    // console.log(problems);
  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// get single problem
const singleproblem_get = (req, res) => {
  const id = req.params.id;
  Problem.findById(id)
    .then((question) => {
      res.json({ question: question });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "Error in fetching question" });
    });
};

const submit_post = async (req, res) => {
  const { problemid, userId, language } = req.body;

  try {
    // Find the problem by ID
    const question = await Problem.findById(problemid);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    question.submissionsCount+=1;
    await question.save();
   
    const sampleTestCases = question.sampleTestCases;

    // Determine file extension and commands based on language
    let fileExtension, compileCommand, runCommand, mainFileName;
    if (language === "python") {
      fileExtension = ".py";
      mainFileName = "main.py";
      runCommand = `python ${path.join(__dirname, '../middleware', mainFileName)}`;
    } else if (language === "cpp") {
      fileExtension = ".cpp";
      mainFileName = "main.cpp";
      compileCommand = `g++ ${path.join(__dirname, '../middleware', mainFileName)} -o ${path.join(__dirname, '../middleware', "main.out")}`;
      runCommand = `${path.join(__dirname, '../middleware', "main.out")}`;
    } else if (language === "java") {
      fileExtension = ".java";
      mainFileName = "Main.java";
      compileCommand = `javac ${path.join(__dirname, '../middleware', mainFileName)}`;
      runCommand = `java -cp ${path.join(__dirname, '../middleware')} Main`;
    } else {
      return res.status(400).json({ error: "Unsupported language" });
    }

    // Write code to a temporary file
    const tempCodeFilePath = path.join(__dirname, '../middleware', mainFileName);
    try {
      fs.writeFileSync(tempCodeFilePath, req.body.code, { encoding: 'utf8' });
    } catch (error) {
      console.error('Error writing code to file:', error);
      return res.status(500).json({ error: "Failed to write code to file", details: error.message });
    }

    // Compile and run code if needed
    if (compileCommand) {
      exec(compileCommand, (compileError, compileStdout, compileStderr) => {
        if (compileError) {
          console.log("Compile error occurred");
          fs.unlinkSync(tempCodeFilePath);
          const submission = new Submission({
            userid: userId,
            problemid: problemid,
            code: req.body.code,
            language,
            verdict: "Compilation Error",
          });
          submission.save();
          return res.status(500).json({ error: "Compilation error", details: compileStderr });
        }
        // Proceed to compare output after successful compilation
        compareOutput(userId, problemid, req.body.code, language, runCommand, sampleTestCases, tempCodeFilePath, res);
      });
    } else {
      // Directly compare output if no compilation needed
      compareOutput(userId, problemid, req.body.code, language, runCommand, sampleTestCases, tempCodeFilePath, res);
    }
  } catch (error) {
    console.error("Error submitting code:", error);
    return res.status(500).json({ error: "Error submitting code" });
  }
};

function compareOutput(userId, problemid, code, language, runCommand, testCases, tempCodeFilePath, res) {
  const results = [];

  const runTestCase = (index) => {
    if (index >= testCases.length) {
      const submission = new Submission({
        userid: userId,
        problemid: problemid,
        code,
        language,
        verdict: results.every(result => result.verdict === 'Pass') ? 'Pass' : 'Fail',
        results,
      });
      submission.save();

      if (fs.existsSync(tempCodeFilePath)) fs.unlinkSync(tempCodeFilePath);

      return res.json({ results });
    }

    const { input, output } = testCases[index];
    const options = { input };
    const childProcess = exec(runCommand, options, (error, stdout, stderr) => {
      if (error) {
        results.push({
          input,
          expectedOutput: output,
          actualOutput: '',
          error: stderr,
          verdict: 'Execution Error',
        });
        return runTestCase(index + 1);
      }

      const normalize = (str) => str.replace(/\r\n/g, "\n").trim();
      const actualOutput = normalize(stdout);
      const expectedOutput = normalize(output);
      const verdict = actualOutput === expectedOutput ? 'Pass' : 'Fail';

      results.push({
        input,
        expectedOutput: output,
        actualOutput,
        error: stderr,
        verdict,
      });

      runTestCase(index + 1);
    });

    if (options.input) {
      childProcess.stdin.write(options.input);
      childProcess.stdin.end();
    }
  };

  runTestCase(0);
}


const user_submissions_get=async (req,res)=>{
  
  const { problemid, userid } = req.params;
  try {
    const submissions = await Submission.find({ problemid: problemid, userid: userid });
    res.status(200).json({ submissions });
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({ error: 'Failed to fetch user submissions' });
  }
}



module.exports = {
  runproblem_post,
  addproblem_post,
  getProblems,
  singleproblem_get,
 submit_post,
 user_submissions_get,
};