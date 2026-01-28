#!/usr/bin/env node

// Test API endpoints
import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('🔄 Testing API endpoints...');
    
    const baseUrl = 'http://localhost:3000';
    
    // Test basic API health
    console.log('🏥 Testing API health...');
    try {
      const healthResponse = await fetch(`${baseUrl}/api/admin/inquiry`);
      console.log('📊 Basic API response status:', healthResponse.status);
      
      if (healthResponse.ok) {
        const data = await healthResponse.json();
        console.log('✅ API is responding');
        console.log('📊 Response data:', {
          success: data.success,
          dataLength: data.data?.length || 0,
          error: data.error
        });
        
        // Log actual inquiry IDs
        if (data.data && data.data.length > 0) {
          console.log('📋 Found inquiries:');
          data.data.forEach((inquiry, index) => {
            console.log(`   ${index + 1}. ID: ${inquiry._id}`);
            console.log(`      - Company: ${inquiry.user?.companyName || 'N/A'}`);
            console.log(`      - Cart Products: ${inquiry.cartProducts?.length || 0}`);
            console.log(`      - Total Products: ${inquiry.totalProducts || 0}`);
            console.log(`      - Created: ${inquiry.createdAt}`);
          });
          
          // Test with the first inquiry ID
          const firstInquiryId = data.data[0]._id;
          console.log(`\n🎯 Testing with first inquiry ID: ${firstInquiryId}`);
          
          try {
            const testResponse = await fetch(`${baseUrl}/api/admin/inquiry?inquiryId=${firstInquiryId}&debug=true`);
            console.log('📊 Test response status:', testResponse.status);
            
            if (testResponse.ok) {
              const testData = await testResponse.json();
              console.log('✅ Test debug successful');
              console.log('📊 Test data summary:', {
                expectedProducts: testData.debug?.summary?.expectedProducts,
                processedProducts: testData.debug?.summary?.processedProducts,
                foundProducts: testData.debug?.summary?.foundProducts
              });
            } else {
              const errorText = await testResponse.text();
              console.log('❌ Test debug error:', errorText);
            }
          } catch (testError) {
            console.error('❌ Test debug failed:', testError.message);
          }
        }
      } else {
        const errorText = await healthResponse.text();
        console.log('❌ API error response:', errorText);
      }
    } catch (healthError) {
      console.error('❌ API health check failed:', healthError.message);
      console.log('💡 Make sure the server is running on http://localhost:3000');
      return;
    }
    
    // Test specific inquiry
    const inquiryId = '6979e3f347f510569410b754';
    console.log(`\n🔍 Testing specific inquiry: ${inquiryId}`);
    
    try {
      const debugResponse = await fetch(`${baseUrl}/api/admin/inquiry?inquiryId=${inquiryId}&debug=true`);
      console.log('📊 Debug response status:', debugResponse.status);
      
      if (debugResponse.ok) {
        const debugData = await debugResponse.json();
        console.log('✅ Debug response received');
        console.log('📊 Debug data:', JSON.stringify(debugData, null, 2));
      } else {
        const errorText = await debugResponse.text();
        console.log('❌ Debug error:', errorText);
      }
    } catch (debugError) {
      console.error('❌ Debug request failed:', debugError.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAPI();