import React from 'react';
import BlogPost from './blogPost';

//This is a react functional component name App
//When App is rendered in index.js it will diplay what is on blogPost.js
function App() {
  return (
    <div>
      <BlogPost />
    </div>
  );
}

export default App;