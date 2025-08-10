# backend/app.py
import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="https://4c6b390693455ad98ba076b3126ad83c@o4509796061806592.ingest.de.sentry.io/4509813705998416",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)

app = Flask(__name__)
CORS(app)

DATABASE = 'bugs.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS bugs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT NOT NULL,
            priority TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/bugs', methods=['GET'])
def get_bugs():
    status = request.args.get('status')
    priority = request.args.get('priority')

    conn = get_db_connection()
    query = "SELECT * FROM bugs"
    params = []
    conditions = []

    if status:
        conditions.append("status = ?")
        params.append(status)
    
    if priority:
        conditions.append("priority = ?")
        params.append(priority)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    bugs = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in bugs])

@app.route('/bugs', methods=['POST'])
def create_bug():
    data = request.json
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO bugs (title, status, priority) VALUES (?, ?, ?)",
                 (data['title'], data.get('status', 'open'), data.get('priority', 'medium')))
    conn.commit()
    new_bug_id = cursor.lastrowid
    conn.close()

    conn = get_db_connection()
    new_bug = conn.execute("SELECT * FROM bugs WHERE id = ?", (new_bug_id,)).fetchone()
    conn.close()

    return jsonify(dict(new_bug)), 201

@app.route('/bugs/<int:bug_id>', methods=['PUT'])
def update_bug(bug_id):
    data = request.json
    conn = get_db_connection()
    conn.execute("UPDATE bugs SET title = ?, status = ?, priority = ? WHERE id = ?",
                 (data.get('title'), data.get('status'), data.get('priority'), bug_id))
    conn.commit()
    conn.close()

    conn = get_db_connection()
    updated_bug = conn.execute("SELECT * FROM bugs WHERE id = ?", (bug_id,)).fetchone()
    conn.close()

    if updated_bug is None:
        return jsonify({'error': 'Bug not found'}), 404

    return jsonify(dict(updated_bug))

@app.route('/bugs/<int:bug_id>', methods=['DELETE'])
def delete_bug(bug_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM bugs WHERE id = ?", (bug_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deleted'}), 204

@app.route('/error')
def trigger_error():
    division_by_zero = 1 / 0

if __name__ == '__main__':
    init_db()
    app.run(debug=True)