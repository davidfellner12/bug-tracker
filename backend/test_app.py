import pytest
import json
from app import app, get_db_connection, init_db, DATABASE
import os

@pytest.fixture
def client():
    # Use a temporary, in-memory database for testing
    app.config['TESTING'] = True
    app.config['DATABASE'] = ':memory:'
    with app.test_client() as client:
        with app.app_context():
            init_db()
        yield client

@pytest.fixture
def auth_headers(client):
    # Register a user
    client.post('/register', json={'username': 'testuser', 'password': 'testpassword'})
    # Log in the user and get the access token
    resp = client.post('/login', json={'username': 'testuser', 'password': 'testpassword'})
    token = json.loads(resp.data)['access_token']
    return {'Authorization': f'Bearer {token}'}

def test_register(client):
    resp = client.post('/register', json={'username': 'newuser', 'password': 'newpassword'})
    assert resp.status_code == 201
    assert json.loads(resp.data) == {'msg': 'User created'}

    resp = client.post('/register', json={'username': 'newuser', 'password': 'anotherpassword'})
    assert resp.status_code == 400
    assert json.loads(resp.data) == {'msg': 'User already exists'}

def test_login(client):
    client.post('/register', json={'username': 'testuser', 'password': 'testpassword'})

    resp = client.post('/login', json={'username': 'testuser', 'password': 'testpassword'})
    assert resp.status_code == 200
    assert 'access_token' in json.loads(resp.data)

    resp = client.post('/login', json={'username': 'wronguser', 'password': 'wrongpassword'})
    assert resp.status_code == 401
    assert json.loads(resp.data) == {'msg': 'Bad username or password'}

def test_get_bugs_protected(client, auth_headers):
    resp = client.get('/bugs', headers=auth_headers)
    assert resp.status_code == 200
    assert isinstance(json.loads(resp.data), list)

def test_create_bug_protected(client, auth_headers):
    bug_data = {'title': 'Test Bug', 'status': 'open', 'priority': 'high'}
    resp = client.post('/bugs', json=bug_data, headers=auth_headers)
    assert resp.status_code == 201
    assert json.loads(resp.data)['title'] == 'Test Bug'

def test_update_bug_protected(client, auth_headers):
    # Create a bug first
    bug_data = {'title': 'Bug to Update', 'status': 'open', 'priority': 'medium'}
    create_resp = client.post('/bugs', json=bug_data, headers=auth_headers)
    bug_id = json.loads(create_resp.data)['id']

    updated_data = {'title': 'Updated Bug', 'status': 'closed', 'priority': 'low'}
    resp = client.put(f'/bugs/{bug_id}', json=updated_data, headers=auth_headers)
    assert resp.status_code == 200
    assert json.loads(resp.data)['title'] == 'Updated Bug'

def test_delete_bug_protected(client, auth_headers):
    # Create a bug first
    bug_data = {'title': 'Bug to Delete', 'status': 'open', 'priority': 'medium'}
    create_resp = client.post('/bugs', json=bug_data, headers=auth_headers)
    bug_id = json.loads(create_resp.data)['id']

    resp = client.delete(f'/bugs/{bug_id}', headers=auth_headers)
    assert resp.status_code == 204

    # Verify it's deleted
    get_resp = client.get('/bugs', headers=auth_headers)
    bugs = json.loads(get_resp.data)
    assert not any(bug['id'] == bug_id for bug in bugs)
