//this new file: frontend/src/data.js

export const sampleData = {
  classes: [
    { "id": 1, "name": "2026 A/L Physics", "subject": "Physics", "grade": "A/L", "day": "Saturday", "time": "10:00 AM - 12:00 PM", "fee_per_month": 8000 },
    { "id": 2, "name": "Grade 11 Mathematics", "subject": "Mathematics", "grade": "Grade 11", "day": "Sunday", "time": "8:00 AM - 10:00 AM", "fee_per_month": 6000 },
    { "id": 3, "name": "Grade 10 Science", "subject": "Science", "grade": "Grade 10", "day": "Wednesday", "time": "4:00 PM - 6:00 PM", "fee_per_month": 5000 },
  ],
  students: [
    { "id": 1, "name": "Kasun Perera", "contact_number": "0771234567", "enrolled_classes": [1, 2] },
    { "id": 2, "name": "Sanduni Fernando", "contact_number": "0779876543", "enrolled_classes": [1] },
    { "id": 3, "name": "Nimali Jayawardena", "contact_number": "0764445566", "enrolled_classes": [2, 3] }
  ],
  payments: [
    { "student_id": 1, "student_name": "Kasun Perera", "class_id": 1, "class_name": "2026 A/L Physics", "month": "2025-07", "amount": 8000, "status": "Paid", "payment_date": "2025-07-03" },
    { "student_id": 1, "student_name": "Kasun Perera", "class_id": 2, "class_name": "Grade 11 Mathematics", "month": "2025-07", "amount": 6000, "status": "Pending", "payment_date": null },
    { "student_id": 2, "student_name": "Sanduni Fernando", "class_id": 1, "class_name": "2026 A/L Physics", "month": "2025-07", "amount": 8000, "status": "Pending", "payment_date": null }
  ],
  "attendance": []
};
