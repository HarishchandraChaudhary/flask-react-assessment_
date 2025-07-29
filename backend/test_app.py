# backend/test_app.py

import pytest
from app import app, tasks, comments # Import app and data stores for testing
import json

@pytest.fixture
def client():
    """Configures the Flask app for testing, ensuring a clean state."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        # Clear and reset data for each test to ensure isolation
        global tasks, comments
        tasks = {
            "task1": {"id": "task1", "title": "Implement User Authentication", "description": "Develop a secure user authentication system."},
            "task2": {"id": "task2", "title": "Design Database Schema", "description": "Create the database schema for the new application modules."}
        }
        comments = {
            "task1": [
                {"id": "comment1_task1", "author": "Alice", "text": "Consider using JWT for authentication."},
                {"id": "comment2_task1", "author": "Bob", "text": "What about multi-factor authentication?"}
            ],
            "task2": [
                {"id": "comment1_task2", "author": "Charlie", "text": "Ensure normalization for scalability."},
            ]
        }
        yield client

def test_get_comments_success(client):
    """Test retrieving comments for an existing task."""
    response = client.get('/tasks/task1/comments')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2
    assert data[0]['author'] == "Alice"

def test_get_comments_task_not_found(client):
    """Test retrieving comments for a non-existent task."""
    response = client.get('/tasks/nonexistent_task/comments')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert "Task not found" in data['error']

def test_add_comment_success(client):
    """Test adding a new comment to an existing task."""
    new_comment_data = {"author": "Eve", "text": "Let's use OAuth 2.0."}
    response = client.post('/tasks/task1/comments', json=new_comment_data)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['author'] == "Eve"
    assert data['text'] == "Let's use OAuth 2.0."
    assert len(comments['task1']) == 3 # Verify comment was added to in-memory store

def test_add_comment_missing_fields(client):
    """Test adding a comment with missing required fields."""
    response = client.post('/tasks/task1/comments', json={"author": "Frank"})
    assert response.status_code == 400
    data = json.loads(response.data)
    assert "Author and text are required" in data['error']

def test_add_comment_task_not_found(client):
    """Test adding a comment to a non-existent task."""
    response = client.post('/tasks/nonexistent_task/comments', json={"author": "Grace", "text": "Test"})
    assert response.status_code == 404
    data = json.loads(response.data)
    assert "Task not found" in data['error']

def test_edit_comment_success(client):
    """Test editing an existing comment."""
    edit_data = {"text": "Revised: Consider using JWT for authentication with refresh tokens."}
    response = client.put('/tasks/task1/comments/comment1_task1', json=edit_data)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['text'] == "Revised: Consider using JWT for authentication with refresh tokens."
    # Verify in-memory store was updated
    assert comments['task1'][0]['text'] == "Revised: Consider using JWT for authentication with refresh tokens."

def test_edit_comment_not_found(client):
    """Test editing a non-existent comment."""
    edit_data = {"text": "Non-existent comment update."}
    response = client.put('/tasks/task1/comments/nonexistent_comment', json=edit_data)
    assert response.status_code == 404
    data = json.loads(response.data)
    assert "Comment not found" in data['error']

def test_edit_comment_task_not_found(client):
    """Test editing a comment for a non-existent task."""
    edit_data = {"text": "Update."}
    response = client.put('/tasks/nonexistent_task/comments/comment1_task1', json=edit_data)
    assert response.status_code == 404
    data = json.loads(response.data)
    assert "Task not found" in data['error']

def test_delete_comment_success(client):
    """Test deleting an existing comment."""
    response = client.delete('/tasks/task1/comments/comment1_task1')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "Comment deleted successfully" in data['message']
    assert len(comments['task1']) == 1 # Verify comment was removed from in-memory store

def test_delete_comment_not_found(client):
    """Test deleting a non-existent comment."""
    response = client.delete('/tasks/task1/comments/nonexistent_comment')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert "Comment not found" in data['error']

def test_delete_comment_task_not_found(client):
    """Test deleting a comment from a non-existent task."""
    response = client.delete('/tasks/nonexistent_task/comments/comment1_task1')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert "Task not found" in data['error']

def test_get_tasks_success(client):
    """Test retrieving all tasks."""
    response = client.get('/tasks')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2
    assert any(task['id'] == 'task1' for task in data)
    assert any(task['id'] == 'task2' for task in data)
