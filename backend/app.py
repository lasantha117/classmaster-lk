from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import json
import os
import time
import io
import csv

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# --- Configuration ---
DATA_DIR = 'data'
DATA_FILE = os.path.join(DATA_DIR, 'classmaster_data.json')

# --- Helper Functions ---
def read_data():
    os.makedirs(DATA_DIR, exist_ok=True)
    default_data = {"classes": [], "students": [], "payments": [], "attendance": []}
    if not os.path.exists(DATA_FILE) or os.path.getsize(DATA_FILE) == 0:
        with open(DATA_FILE, 'w') as f:
            json.dump(default_data, f, indent=4)
        return default_data
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return default_data

def write_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

# --- API Endpoints ---

@app.route('/api/data', methods=['GET'])
def get_all_data():
    return jsonify(read_data())

@app.route('/api/students', methods=['POST'])
def add_student():
    data = read_data()
    new_student = request.get_json()
    new_student['id'] = int(time.time() * 1000)
    data['students'].append(new_student)
    write_data(data)
    return jsonify(new_student), 201

@app.route('/api/classes', methods=['POST'])
def add_class():
    data = read_data()
    new_class = request.get_json()
    new_class['id'] = int(time.time() * 1000)
    data['classes'].append(new_class)
    write_data(data)
    return jsonify(new_class), 201

@app.route('/api/payments/update', methods=['POST'])
def update_payment():
    data = read_data()
    update_info = request.get_json()
    # ... (existing logic)
    write_data(data)
    return jsonify({"message": "Payment updated successfully"}), 200

# --- NEW/UPDATED Endpoints for full CRUD ---

@app.route('/api/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    data = read_data()
    student_update_data = request.get_json()
    student_index = next((i for i, s in enumerate(data['students']) if s['id'] == student_id), None)
    if student_index is None:
        return jsonify({"error": "Student not found"}), 404
    data['students'][student_index] = student_update_data
    write_data(data)
    return jsonify({"message": f"Student {student_update_data['name']} updated successfully."}), 200

@app.route('/api/students/<int:student_id>', methods=['DELETE'])
def drop_student(student_id):
    data = read_data()
    student_to_remove = next((s for s in data['students'] if s['id'] == student_id), None)
    if not student_to_remove:
        return jsonify({"error": "Student not found"}), 404
    data['students'] = [s for s in data['students'] if s['id'] != student_id]
    data['payments'] = [p for p in data['payments'] if p['student_id'] != student_id]
    data['attendance'] = [a for a in data['attendance'] if a['student_id'] != student_id]
    write_data(data)
    return jsonify({"message": f"Student {student_to_remove['name']} has been dropped."}), 200

@app.route('/api/classes/<int:class_id>', methods=['PUT'])
def update_class(class_id):
    data = read_data()
    class_update_data = request.get_json()
    class_index = next((i for i, c in enumerate(data['classes']) if c['id'] == class_id), None)
    if class_index is None:
        return jsonify({"error": "Class not found"}), 404
    data['classes'][class_index] = class_update_data
    write_data(data)
    return jsonify({"message": f"Class {class_update_data['name']} updated successfully."}), 200

@app.route('/api/classes/<int:class_id>', methods=['DELETE'])
def delete_class(class_id):
    data = read_data()
    class_to_remove = next((c for c in data['classes'] if c['id'] == class_id), None)
    if not class_to_remove:
        return jsonify({"error": "Class not found"}), 404
    data['classes'] = [c for c in data['classes'] if c['id'] != class_id]
    for student in data['students']:
        if class_id in student.get('enrolled_classes', []):
            student['enrolled_classes'].remove(class_id)
    data['payments'] = [p for p in data['payments'] if p['class_id'] != class_id]
    write_data(data)
    return jsonify({"message": f"Class {class_to_remove['name']} deleted successfully."}), 200

@app.route('/api/reports/fees', methods=['GET'])
def download_fee_report():
    month = request.args.get('month')
    if not month: return jsonify({"error": "month parameter is required"}), 400
    
    data = read_data()
    report_data = [p for p in data['payments'] if p.get('month') == month]
    
    if not report_data:
         return jsonify({"error": "No data found for this selection"}), 404

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Student Name', 'Class Name', 'Amount', 'Status', 'Payment Date'])
    
    total_revenue = 0
    # **FIX**: Use `or ''` to handle None values gracefully during sorting.
    for row in sorted(report_data, key=lambda x: (x.get('student_name') or '', x.get('class_name') or '')):
         writer.writerow([row.get('student_name', 'N/A'), row.get('class_name', 'N/A'), row.get('amount', 0), row.get('status', 'N/A'), row.get('payment_date', 'N/A')])
         if row.get('status') == 'Paid':
             total_revenue += row.get('amount', 0)

    writer.writerow([])
    writer.writerow(['', '', '', 'Total Revenue:', f'LKR {total_revenue:,.2f}'])
    output.seek(0)
    
    return send_file(
        io.BytesIO(output.getvalue().encode()),
        mimetype='text/csv',
        as_attachment=True,
        download_name=f'fee_report_{month}.csv'
    )

if __name__ == '__main__':
    app.run(debug=True, port=5000)
