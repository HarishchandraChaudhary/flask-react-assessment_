import React, { useState, useEffect } from 'react';

// Base URL for your Flask backend
const API_BASE_URL = 'http://127.0.0.1:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [editingComment, setEditingComment] = useState(null); // Stores the comment being edited
  const [editCommentText, setEditCommentText] = useState('');
  const [editCommentAuthor, setEditCommentAuthor] = useState('');
  const [message, setMessage] = useState(''); // For user feedback

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
      if (data.length > 0 && !selectedTask) {
        setSelectedTask(data[0]); // Select the first task by default
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setMessage("Failed to load tasks.");
    }
  };

  useEffect(() => {
    if (selectedTask) {
      fetchComments(selectedTask.id);
    }
  }, [selectedTask]);

  const fetchComments = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setMessage("Failed to load comments.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !newCommentAuthor.trim()) {
      setMessage("Author and comment text cannot be empty.");
      return;
    }
    if (!selectedTask) {
      setMessage("Please select a task first.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${selectedTask.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author: newCommentAuthor, text: newCommentText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedComment = await response.json();
      setComments([...comments, addedComment]);
      setNewCommentText('');
      setNewCommentAuthor('');
      setMessage("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      setMessage("Failed to add comment.");
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditCommentAuthor(comment.author);
    setEditCommentText(comment.text);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editCommentText.trim() || !editCommentAuthor.trim()) {
      setMessage("Author and comment text cannot be empty.");
      return;
    }
    if (!selectedTask || !editingComment) {
      setMessage("Error: No task or comment selected for editing.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${selectedTask.id}/comments/${editingComment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author: editCommentAuthor, text: editCommentText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedComment = await response.json();
      setComments(comments.map(c => c.id === updatedComment.id ? updatedComment : c));
      setEditingComment(null);
      setEditCommentText('');
      setEditCommentAuthor('');
      setMessage("Comment updated successfully!");
    } catch (error) {
      console.error("Error updating comment:", error);
      setMessage("Failed to update comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!selectedTask) {
      setMessage("Please select a task first.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this comment?")) { // Using window.confirm for simplicity
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${selectedTask.id}/comments/${commentId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setComments(comments.filter(c => c.id !== commentId));
        setMessage("Comment deleted successfully!");
      } catch (error) {
        console.error("Error deleting comment:", error);
        setMessage("Failed to delete comment.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-8 space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Task Comment Manager</h1>

        {message && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{message}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setMessage('')}>
              <svg className="fill-current h-6 w-6 text-blue-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )}

        {/* Task Selection */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select a Task</h2>
          <div className="flex flex-wrap gap-3">
            {tasks.map(task => (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`px-6 py-3 rounded-lg font-medium transition duration-300 ease-in-out
                  ${selectedTask && selectedTask.id === task.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {task.title}
              </button>
            ))}
          </div>
        </div>

        {selectedTask && (
          <div className="bg-indigo-50 p-6 rounded-lg shadow-inner mb-8">
            <h2 className="text-2xl font-bold text-indigo-800 mb-2">{selectedTask.title}</h2>
            <p className="text-gray-700">{selectedTask.description}</p>
          </div>
        )}

        {/* Add Comment Form */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Comment</h2>
          <form onSubmit={handleAddComment} className="space-y-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                id="author"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newCommentAuthor}
                onChange={(e) => setNewCommentAuthor(e.target.value)}
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label htmlFor="commentText" className="block text-sm font-medium text-gray-700">Comment</label>
              <textarea
                id="commentText"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows="3"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write your comment here..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out font-semibold"
              disabled={!selectedTask}
            >
              Add Comment
            </button>
          </form>
        </div>

        {/* Comments List */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments for {selectedTask?.title || 'Selected Task'}</h2>
          {comments.length === 0 ? (
            <p className="text-gray-600">No comments yet. Be the first to add one!</p>
          ) : (
            <ul className="space-y-4">
              {comments.map(comment => (
                <li key={comment.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                  {editingComment && editingComment.id === comment.id ? (
                    <form onSubmit={handleUpdateComment} className="space-y-3">
                      <div>
                        <label htmlFor={`editAuthor-${comment.id}`} className="block text-xs font-medium text-gray-600">Author</label>
                        <input
                          type="text"
                          id={`editAuthor-${comment.id}`}
                          className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                          value={editCommentAuthor}
                          onChange={(e) => setEditCommentAuthor(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`editCommentText-${comment.id}`} className="block text-xs font-medium text-gray-600">Comment</label>
                        <textarea
                          id={`editCommentText-${comment.id}`}
                          className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                          rows="2"
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition duration-150"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingComment(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-500 transition duration-150"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="text-sm text-gray-800 mb-1">
                        <span className="font-semibold">{comment.author}:</span> {comment.text}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleEditComment(comment)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition duration-150"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition duration-150"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
