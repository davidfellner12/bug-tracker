# backend/app.py
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

# In-memory bug storage
bugs = []
bug_id_counter = 1

@app.route('/bugs', methods=['GET'])
def get_bugs():
    status = request.args.get('status')
    priority = request.args.get('priority')
    
    filtered_bugs = bugs
    
    if status:
        filtered_bugs = [bug for bug in filtered_bugs if bug['status'] == status]
    
    if priority:
        filtered_bugs = [bug for bug in filtered_bugs if bug['priority'] == priority]
        
    return jsonify(filtered_bugs)

@app.route('/bugs', methods=['POST'])
def create_bug():
    global bug_id_counter
    data = request.json
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    new_bug = {
        'id': bug_id_counter,
        'title': data['title'],
        'status': data.get('status', 'open'),
        'priority': data.get('priority', 'medium')
    }
    bugs.append(new_bug)
    bug_id_counter += 1
    return jsonify(new_bug), 201

@app.route('/bugs/<int:bug_id>', methods=['PUT'])
def update_bug(bug_id):
    data = request.json
    for bug in bugs:
        if bug['id'] == bug_id:
            bug.update(data)
            return jsonify(bug)
    return jsonify({'error': 'Bug not found'}), 404

@app.route('/bugs/<int:bug_id>', methods=['DELETE'])
def delete_bug(bug_id):
    global bugs
    bugs = [bug for bug in bugs if bug['id'] != bug_id]
    return jsonify({'message': 'Deleted'}), 204

@app.route('/error')
def trigger_error():
    division_by_zero = 1 / 0

if __name__ == '__main__':
    app.run(debug=True)
