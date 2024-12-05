# Assignment 2 - Matrix

Now that we have finished assignment 1, lets make the code much more robust:

- 1. Use try/catch to wrap the code within your event handler for the "Process Input" button
to catch errors that may happen.  See this video for more about try/catch: 
https://www.tiktok.com/@meech.s.ward/video/7308421605472898309.

- 2. Take a look at the code from assignment 1 where we added a try-catch section
and a throw case to catch an error.

- 3. Add throws to catch all possible user input errors.  Here is a list of some of the possibilities:
  - 1. No input
  - 2. Missing input
  - 3. A or B are not an array
  - 4. A and B aren't the same length
  - 5. Invalid operations
  - 6. A or B element is not a number
  - 7. Unparsable text with parser error displayed.

- 4. Output of any errors should go into the srcOutput.innerText and be in RED when an error occurrs.

- 5. How to show eval() parsing errors: eval() will throw an exception if an erorr occurrs and you can show the error text like on any other throw.  
Note that you can add a little code to make the errors look a bit better for
the user.