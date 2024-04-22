import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function BlogPost() {

  //creating state variables 
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [editPostId, setEditPostId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);

  //fetching all posts 
  useEffect(() => {
    fetchPosts();
  }, []);

  //setting the state variable of posts to the response data 
  const fetchPosts = async () => {
    const response = await axios.get('http://localhost:3001/posts');
    setPosts(response.data);
  }

  //handles changes in the title 
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  }

  //handles changes in the text
  const handleTextChange = (event) => {
    setText(event.target.value);
  }

  // updates state variables to be edited and setEditting to true 
  const handleEdit = (post) => {
    setTitle(post.title);
    setText(post.text);
    setEditPostId(post._id);
    setEditing(true);
  }

  //resets state variables to intitial values and sets editting mode to false 
  const handleCancelEdit = () => {
    setTitle('');
    setText('');
    setEditPostId(null);
    setEditing(false);
  }

  //This is called when a post is submitted. Prevents default form submission.
  //Checks if the post is being created or edited
  //Sends Post of put methods to the server side
  //updates state variables with the new data and clears the form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editPostId === null) {
      
      const response = await axios.post('http://localhost:3001/posts', { title, text });
      setPosts([...posts, response.data]);
    } else {
      
      await axios.put(`http://localhost:3001/posts/${editPostId}`, { title, text });
      const updatedPosts = posts.map(post => {
        if (post._id === editPostId) {
          return { ...post, title, text };
        } else {
          return post;
        }
      });
      setPosts(updatedPosts);
      setEditPostId(null);
      setEditing(false);
    }

    setTitle('');
    setText('');
  }

  //given a post id this function will delete a post sending a delete methode to the server side 
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/posts/${id}`);
    const newPosts = posts.filter(post => post._id !== id);
    setPosts(newPosts);
  }

  //This is similar to handleSubmit but for an edited post. 
  //Send the put method to the server so that is has up to date information 
  const handleSubmitEdit = async (event) => {
    event.preventDefault();
    await axios.put(`http://localhost:3001/posts/${editPostId}`, { title: setTitle, text: setText });
    const updatedPosts = posts.map(post => {
      if (post._id === editPostId) {
        return { ...post, title: setTitle, text: setText };
      } else {
        return post;
      }
    });
    setPosts(updatedPosts);
    setEditPostId(null);
    setEditing(false);
  }

  

//This is the html for the UI
//I used bootstrap becasue I ahd hear it is popular in creating nice looking web pages/UI
  return (
    <div className="container">
      <h1 className="text-center my-5">Blog Posts</h1>
  
      <ul className="list-group">
        {posts.map(post => (
          <li key={post._id} className="list-group-item">
            <h2>{post.title}</h2>
            <p>{post.text}</p>
  
            <button className="btn btn-danger mr-2" onClick={() => handleDelete(post._id)}>Delete</button>
            <button className="btn btn-secondary" onClick={() => handleEdit(post)}>Edit</button>
          </li>
        ))}
      </ul>
  
      {postToEdit === null ? (
        <form onSubmit={handleSubmit} className="my-5">
          <div className="form-group">
            <label htmlFor="title">Post Title:</label>
            <input type="text" className="form-control" id="title" name="title" value={title} onChange={handleTitleChange} />
          </div>
  
          <div className="form-group">
            <label htmlFor="text">Post Content:</label>
            <textarea className="form-control" id="text" name="text" value={text} onChange={handleTextChange}></textarea>
          </div>
  
          <button type="submit" className="btn btn-primary">{editPostId === null ? 'Create' : 'Update'}</button>
          {editPostId !== null && (
            <button type="button" className="btn btn-secondary ml-2" onClick={handleCancelEdit}>Cancel</button>
          )}
        </form>
      ) : (
        <form onSubmit={handleSubmitEdit} className="my-5">
          <div className="form-group">
            <label htmlFor="editTitle">Post Title:</label>
            <input type="text" className="form-control" id="editTitle" name="editTitle" value={title} onChange={handleTitleChange} />
          </div>
  
          <div className="form-group">
            <label htmlFor="editText">Post Content:</label>
            <textarea className="form-control" id="editText" name="editText" value={text} onChange={handleTextChange}></textarea>
          </div>
  
          <button type="submit" className="btn btn-primary mr-2">Update</button>
          <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
        </form>
      )}
    </div>
  );
     
}

export default BlogPost;