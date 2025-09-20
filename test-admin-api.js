// Test script to verify admin registration API
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testAdminRegistration() {
    console.log('🧪 Testing Admin Registration API...\n');
    
    // Test data
    const testAdmin = {
        name: 'Test Admin',
        email: 'test@admin.com',
        phone: '+91 9876543210',
        password: 'testpass123',
        adminLevel: 'admin',
        permissions: ['view_reports', 'manage_users'],
        department: 'IT',
        employeeId: 'EMP001'
    };
    
    try {
        // Test 1: Health check
        console.log('1️⃣ Testing server health...');
        const healthResponse = await axios.get(`${API_BASE_URL}/health`);
        console.log('✅ Server is healthy:', healthResponse.data);
        
        // Test 2: Admin registration
        console.log('\n2️⃣ Testing admin registration...');
        const registerResponse = await axios.post(`${API_BASE_URL}/admin/register`, testAdmin);
        console.log('✅ Admin registration successful:', registerResponse.data);
        
        // Test 3: Check if registration endpoint is accessible
        console.log('\n3️⃣ Testing endpoint accessibility...');
        const endpointTest = await axios.head(`${API_BASE_URL}/auth/login`);
        console.log('✅ Auth endpoint accessible:', endpointTest.status === 200);
        
        console.log('\n🎉 All tests passed! The API is working correctly.');
        
    } catch (error) {
        if (error.response) {
            console.error('❌ API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('❌ Network Error:', error.message);
            console.error('   Make sure the server is running on port 3001');
        } else {
            console.error('❌ Test Error:', error.message);
        }
    }
}

// Run the test
testAdminRegistration();