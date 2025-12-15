// MongoDB initialization script
db = db.getSiblingDB('student_management');

// Create students collection with validation
db.createCollection('students', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'rollNumber', 'department', 'year'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        email: {
          bsonType: 'string',
          pattern: '^\\S+@\\S+\\.\\S+$',
          description: 'must be a valid email and is required'
        },
        rollNumber: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        department: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        year: {
          bsonType: 'string',
          description: 'must be a string and is required'
        }
      }
    }
  }
});

// Create indexes for better performance
db.students.createIndex({ email: 1 }, { unique: true });
db.students.createIndex({ rollNumber: 1 }, { unique: true });
db.students.createIndex({ department: 1 });
db.students.createIndex({ year: 1 });

// Insert sample data
db.students.insertMany([
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    rollNumber: 'CS001',
    department: 'Computer Science',
    year: '3rd Year',
    phone: '+1234567890',
    address: '123 Main St, City',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    rollNumber: 'IT002',
    department: 'Information Technology',
    year: '2nd Year',
    phone: '+1234567891',
    address: '456 Oak Ave, Town',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    rollNumber: 'EC003',
    department: 'Electronics',
    year: '4th Year',
    phone: '+1234567892',
    address: '789 Pine Rd, Village',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('✅ Database initialized successfully with sample data');
