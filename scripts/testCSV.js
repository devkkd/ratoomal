#!/usr/bin/env node

// Test CSV generation
import fetch from 'node-fetch';

async function testCSVGeneration() {
  try {
    console.log('🔄 Testing CSV generation...');
    
    const inquiryId = '6979e3f347f510569410b754'; // Test inquiry ID
    const baseUrl = 'http://localhost:3000';
    
    console.log(`📍 Testing with inquiry ID: ${inquiryId}`);
    
    // First test debug endpoint
    console.log('🔍 Testing debug endpoint...');
    const debugResponse = await fetch(`${baseUrl}/api/admin/inquiry?inquiryId=${inquiryId}&debug=true`);
    
    if (debugResponse.ok) {
      const debugData = await debugResponse.json();
      console.log('✅ Debug response received');
      console.log('📊 Debug summary:');
      console.log('   - Expected products:', debugData.debug?.summary?.expectedProducts);
      console.log('   - Processed products:', debugData.debug?.summary?.processedProducts);
      console.log('   - Found products:', debugData.debug?.summary?.foundProducts);
      console.log('   - All products found:', debugData.debug?.summary?.allProductsFound);
      
      if (debugData.debug?.productsWithDetails) {
        console.log('📦 Products details:');
        debugData.debug.productsWithDetails.forEach((product, index) => {
          console.log(`   Product ${product.index}:`);
          console.log(`     - ID: ${product.cartProduct.productId}`);
          console.log(`     - Quantity: ${product.cartProduct.quantity}`);
          console.log(`     - Sizes: ${JSON.stringify(product.cartProduct.selectedSizes)}`);
          console.log(`     - Found: ${product.found ? '✅' : '❌'}`);
          console.log(`     - Name: ${product.productName}`);
        });
      }
    } else {
      console.error('❌ Debug request failed:', debugResponse.status);
      const errorText = await debugResponse.text();
      console.error('Error:', errorText);
    }
    
    // Now test CSV generation
    console.log('\n📄 Testing CSV generation...');
    const csvResponse = await fetch(`${baseUrl}/api/admin/inquiry?inquiryId=${inquiryId}&downloadExcel=true`);
    
    if (csvResponse.ok) {
      const csvContent = await csvResponse.text();
      console.log('✅ CSV generated successfully');
      console.log('📊 CSV stats:');
      console.log('   - Content length:', csvContent.length);
      
      // Count product rows in CSV
      const productRows = csvContent.split('\n').filter(line => line.match(/^\d+,"/));
      console.log('   - Product rows found:', productRows.length);
      
      console.log('\n📄 CSV Content Preview:');
      console.log('=' .repeat(80));
      console.log(csvContent.substring(0, 2000));
      console.log('=' .repeat(80));
      
      if (productRows.length > 0) {
        console.log('\n📦 Product rows in CSV:');
        productRows.forEach((row, index) => {
          console.log(`   Row ${index + 1}: ${row.substring(0, 100)}...`);
        });
      }
      
      // Check if all 3 products are present
      if (productRows.length === 3) {
        console.log('✅ SUCCESS: All 3 products found in CSV!');
      } else {
        console.log(`❌ ISSUE: Expected 3 products, found ${productRows.length}`);
      }
      
    } else {
      console.error('❌ CSV request failed:', csvResponse.status);
      const errorText = await csvResponse.text();
      console.error('Error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCSVGeneration();