import React, { useState, useContext } from 'react';
import Editor from '@monaco-editor/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../providers/authProvider';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';
import Header from './Header';
import { backendurl } from '../backendurl';

const IDE = () => {
  const [code, setCode] = useState(`#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`); // Default code
  const [language, setLanguage] = useState('cpp'); // Default language
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light'); // Default theme
  const authData = useContext(AuthContext);
  const [error, setError] = useState("");
  const isLoggedIn = authData ? true : false;

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (lang === 'cpp') {
      setCode(`#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`);
    } else if (lang === 'python') {
      setCode(`print("Hello, World!")`);
    } else if (lang === 'java') {
      setCode(`public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`);
    }
  };
  
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const runCode = () => {
    setLoading(true); // Set loading state to true
    axios
      .post(`${backendurl}/problem/runproblem`, { code, language, input })
      .then((res) => {
        if (res.data.output !== '') {
          setError("");
          setOutput(res.data.output);
          toast.success('Code executed successfully!');
        }
        if (res.data.error !== '') {
          setError(res.data.error);
          toast.error("Error in your code. Check output.");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Failed to run code. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Header />
     
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex justify-between items-center mt-14 mb-4">
          <div className="flex space-x-3">
            <button
              className={`px-4 py-2 rounded-full font-semibold transition ${language === 'python' ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => handleLanguageChange('python')}
            >
              Python
            </button>
            <button
              className={`px-4 py-2 rounded-full font-semibold transition ${language === 'cpp' ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => handleLanguageChange('cpp')}
            >
              C++
            </button>
            <button
              className={`px-4 py-2 rounded-full font-semibold transition ${language === 'java' ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => handleLanguageChange('java')}
            >
              Java
            </button>
          </div>
          <button
            className="px-4 py-2 rounded-full font-semibold bg-gray-200 text-black transition"
            onClick={toggleTheme}
          >
             Toggle Theme
          </button>
        </div>

        <div className="flex space-x-4 ">
          <div className="flex-1 bg-white rounded-lg shadow-md">
            <Editor
              height="75vh"
              width="100%"
              theme={theme}
              language={language}
              value={code}
              onChange={(newValue) => setCode(newValue)}
              beforeMount={(monaco) => {
                monaco.editor.defineTheme('dark', {
                  base: 'vs-dark',
                  inherit: true,
                  rules: [],
                  colors: {
                    'editor.background': '#1E1E1E',
                  },
                });
                monaco.editor.defineTheme('light', {
                  base: 'vs',
                  inherit: true,
                  rules: [],
                  colors: {
                    'editor.background': '#FFFFFF',
                  },
                });
              }}
            />
          </div>
          <div className="w-1/4 space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-2">Input</h2>
              <textarea
                className="w-full h-40 p-2 rounded-lg bg-gray-100 border border-gray-300"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-2">Output</h2>
              <div className="w-full h-40 p-2 rounded-lg bg-gray-100 border border-gray-300 overflow-auto">
                {isLoading ? (
                  <p className="text-gray-500">Running code...</p>
                ) : (
                  <pre className="whitespace-pre-wrap">{output} {error}</pre>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold transition hover:bg-red-600"
            onClick={runCode}
          >
            Run Code
          </button>
        </div>
      </div>
    </>
  );
};

export default IDE;
