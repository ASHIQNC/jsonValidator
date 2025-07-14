'use client';

import React, { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

/**

 *
 * Props:
 *  - defaultValue: initial JSON string (optional)
 *  - placeholder: textarea placeholder (optional)
 *  - areaHeightClass: Tailwind height class for the textareas (default "h-80")
 */
function JsonValidator({
  defaultValue = '',
  placeholder = 'Paste your JSON here…',
  areaHeightClass = 'h-100',
}) {
  const [input, setInput] = useState(defaultValue);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(null);

  // Reset all UI state
  const clearAll = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
    setIsValid(null);
  }, []);

  // Validate the input string and pretty‑print if valid
  const validateAndFormat = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter some JSON to validate.');
      setOutput('');
      setIsValid(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError('');
      setIsValid(true);
    } catch (err) {
      setOutput('');
      setIsValid(false);
      setError(
        err instanceof Error ? err.message : 'Unknown error while parsing JSON.'
      );
    }
  }, [input]);

  // Copy formatted JSON to clipboard with fallback & notification
  const copyToClipboard = useCallback(async () => {
    try {
      if (!output) {
        toast.error('Nothing to copy.');
        return;
      }

      if (!navigator.clipboard) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = output;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } else {
        await navigator.clipboard.writeText(output);
      }

      toast.success('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      toast.error('Copy failed. Please copy manually.');
    }
  }, [output]);

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter'>
      <div className='container mx-auto px-4 py-8 max-w-6xl'>
        {/* Header */}
        <header className='text-center mb-8 select-none'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>
            JSON Validator &amp; Formatter
          </h1>
          <p className='text-gray-600 text-lg'>
            Validate, format, and beautify your JSON data instantly
          </p>
        </header>

        {/* Main */}
        <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Input */}
          <article
            className='bg-white rounded-lg shadow-lg p-6'
            aria-label='JSON input panel'
          >
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold text-gray-800'>
                <i
                  className='fas fa-edit mr-2 text-blue-500'
                  aria-hidden='true'
                />{' '}
                Input JSON
              </h2>
              <button
                type='button'
                onClick={clearAll}
                className='px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md shadow-sm transition-colors'
              >
                <i className='fas fa-trash mr-1' aria-hidden='true' /> Clear
              </button>
            </div>

            <label htmlFor='json-input' className='sr-only'>
              JSON input textarea
            </label>
            <textarea
              id='json-input'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className={`w-full ${areaHeightClass} p-4 border border-gray-300 rounded-md font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
              spellCheck={false}
              autoComplete='off'
              autoCorrect='off'
              autoCapitalize='off'
            />

            <button
              type='button'
              onClick={validateAndFormat}
              className='w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md transition-colors'
            >
              <i className='fas fa-check-circle mr-2' aria-hidden='true' />{' '}
              Validate &amp; Format JSON
            </button>
          </article>

          {/* Output */}
          <article
            className='bg-white rounded-lg shadow-lg p-6'
            aria-label='Formatted JSON output panel'
          >
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold text-gray-800'>
                <i
                  className='fas fa-code mr-2 text-green-500'
                  aria-hidden='true'
                />{' '}
                Formatted Output
              </h2>
              <button
                type='button'
                onClick={copyToClipboard}
                disabled={!output}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  output
                    ? 'bg-green-100 hover:bg-green-200 text-green-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <i className='fas fa-copy mr-1' aria-hidden='true' /> Copy
              </button>
            </div>

            {/* Validation status */}
            {isValid !== null && (
              <div
                role='status'
                className={`mb-4 p-3 rounded-md ${
                  isValid
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                <i
                  className={`fas ${
                    isValid
                      ? 'fa-check-circle text-green-500'
                      : 'fa-times-circle text-red-500'
                  } mr-2`}
                  aria-hidden='true'
                />
                {isValid ? 'Valid JSON' : 'Invalid JSON'}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-md overflow-auto'>
                <p className='text-red-800 text-sm font-mono break-all'>
                  {error}
                </p>
              </div>
            )}

            <pre
              id='json-output'
              className={`w-full ${areaHeightClass} p-4 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 overflow-auto whitespace-pre-wrap`}
            >
              {output || (
                <span className='text-gray-400 italic'>
                  Formatted JSON will appear here…
                </span>
              )}
            </pre>
          </article>
        </section>

        {/* Footer */}
        <footer className='mt-12 text-center text-gray-500 text-sm select-none'>
          © {new Date().getFullYear()} ASR. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

export default JsonValidator;
