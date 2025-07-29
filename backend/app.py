# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app) # Enable CORS for frontend communication

# In-memory data store for demonstration purposes
# In a real application, this would be a database
tasks = {
    "task1": {"id": "task1", "title": "Implement User Authentication", "description": "Develop a secure user authentication system."},
    "task2": {"id": "task2", "title": "Design Database Schema", "description": "Create the database schema for the new application modules."}
}

comments = {
    "task1": [
        {"id": str(uuid.uuid4()), "author": "Alice", "text": "Consider using JWT for authentication."},
        {"id": str(uuid.uuid4()), "author": "Bob", "text": "What about multi-factor authentication?"}
    ],
    "task2": [
        {"id": str(uuid.uuid4()), "author": "Charlie", "text": "Ensure normalization for scalability."},
        {"id": str(uuid.uuid4()), "author": "David", "text": "Think about indexing for performance."}
    ]
}

@app.route('/')
def home():
    """Home route for basic health check."""
    return jsonify({"message": "Welcome to the Task Comment API!"})

@app.route('/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks."""
    return jsonify(list(tasks.values()))

@app.route('/tasks/<string:task_id>/comments', methods=['GET'])
def get_comments(task_id):
    """
    Retrieve all comments for a specific task.
    ---
    Parameters:
      - task_id: The ID of the task.
    Returns:
      - JSON array of comments for the task.
    """
    if task_id not in tasks:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(comments.get(task_id, []))

@app.route('/tasks/<string:task_id>/comments', methods=['POST'])
def add_comment(task_id):
    """
    Add a new comment to a specific task.
    ---
    Parameters:
      - task_id: The ID of the task.
      - request body: JSON object with 'author' and 'text'.
    Returns:
      - The newly created comment.
    """
    if task_id not in tasks:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json()
    if not data or 'author' not in data or 'text' not in data:
        return jsonify({"error": "Author and text are required"}), 400

    new_comment = {
        "id": str(uuid.uuid4()),
        "author": data['author'],
        "text": data['text']
    }
    if task_id not in comments:
        comments[task_id] = []
    comments[task_id].append(new_comment)
    return jsonify(new_comment), 201

@app.route('/tasks/<string:task_id>/comments/<string:comment_id>', methods=['PUT'])
def edit_comment(task_id, comment_id):
    """
    Edit an existing comment for a specific task.
    ---
    Parameters:
      - task_id: The ID of the task.
      - comment_id: The ID of the comment to edit.
      - request body: JSON object with 'author' and/or 'text'.
    Returns:
      - The updated comment.
    """
    if task_id not in tasks:
        return jsonify({"error": "Task not found"}), 404
    if task_id not in comments:
        return jsonify({"error": "Comments for this task not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided for update"}), 400

    for i, comment in enumerate(comments[task_id]):
        if comment['id'] == comment_id:
            if 'author' in data:
                comments[task_id][i]['author'] = data['author']
            if 'text' in data:
                comments[task_id][i]['text'] = data['text']
            return jsonify(comments[task_id][i])
    return jsonify({"error": "Comment not found"}), 404

@app.route('/tasks/<string:task_id>/comments/<string:comment_id>', methods=['DELETE'])
def delete_comment(task_id, comment_id):
    """
    Delete a comment from a specific task.
    ---
    Parameters:
      - task_id: The ID of the task.
      - comment_id: The ID of the comment to delete.
    Returns:
      - Success message.
    """
    if task_id not in tasks:
        return jsonify({"error": "Task not found"}), 404
    if task_id not in comments:
        return jsonify({"error": "Comments for this task not found"}), 404

    original_len = len(comments[task_id])
    comments[task_id] = [c for c in comments[task_id] if c['id'] != comment_id]

    if len(comments[task_id]) < original_len:
        return jsonify({"message": "Comment deleted successfully"}), 200
    return jsonify({"error": "Comment not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
