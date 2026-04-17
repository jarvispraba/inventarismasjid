// ========================================
// GOOGLE APPS SCRIPT - FINAL VERSION
// ========================================
// COPY SEMUA KODE INI KE GOOGLE APPS SCRIPT
// HAPUS SEMUA KODE LAMA, PASTE INI

// GANTI DENGAN ID SPREADSHEET ANDA
const SPREADSHEET_ID = "1Qa9MiACzDGXpnor2JUlLNQk8-YtGvO8Xc3ssHlVbpDo";
const SHEET_NAME = "Inventaris";

/**
 * Handle GET request
 */
function doGet(e) {
  try {
    Logger.log('=== GET REQUEST ===');
    Logger.log('Parameters: ' + JSON.stringify(e.parameter));
    
    // Jika ada parameter action, handle sebagai action
    if (e.parameter && e.parameter.action) {
      return handleAction(e.parameter);
    }
    
    // Jika tidak ada action, return semua data
    return getAllData();
    
  } catch (error) {
    Logger.log('ERROR in doGet: ' + error.toString());
    return createResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * Handle POST request
 */
function doPost(e) {
  try {
    Logger.log('=== POST REQUEST ===');
    Logger.log('Content: ' + e.postData.contents);
    
    const params = JSON.parse(e.postData.contents);
    return handleAction(params);
    
  } catch (error) {
    Logger.log('ERROR in doPost: ' + error.toString());
    return createResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * Get all data
 */
function getAllData() {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      // Hanya ada header atau kosong
      return createResponse({
        status: 'success',
        message: 'Data berhasil diambil',
        data: []
      });
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const result = rows.map((row, index) => {
      return {
        id_barang: row[0] || '',
        nama_barang: row[1] || '',
        kategori: row[2] || '',
        sub_kategori: row[3] || '',
        jumlah: row[4] || 0,
        kondisi: row[5] || '',
        status: row[6] || '',
        lokasi: row[7] || '',
        rowIndex: index + 2
      };
    });
    
    Logger.log('Returning ' + result.length + ' rows');
    
    return createResponse({
      status: 'success',
      message: 'Data berhasil diambil',
      data: result
    });
    
  } catch (error) {
    Logger.log('ERROR in getAllData: ' + error.toString());
    return createResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * Handle action
 */
function handleAction(params) {
  try {
    const action = params.action;
    Logger.log('Action: ' + action);
    
    switch (action) {
      case 'add':
        return addData(params);
      
      case 'update':
        return updateData(params);
      
      case 'delete':
        return deleteData(params);
      
      default:
        return createResponse({
          status: 'error',
          message: 'Invalid action: ' + action
        });
    }
    
  } catch (error) {
    Logger.log('ERROR in handleAction: ' + error.toString());
    return createResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * Add data
 */
function addData(params) {
  try {
    Logger.log('=== ADD DATA ===');
    
    // Parse data jika masih string
    let data;
    if (typeof params.data === 'string') {
      data = JSON.parse(params.data);
    } else {
      data = params.data;
    }
    
    Logger.log('Data to add: ' + JSON.stringify(data));
    
    // Validasi
    if (!data.id_barang || !data.nama_barang || !data.kategori || 
        !data.kondisi || !data.status || !data.lokasi) {
      Logger.log('Validation failed: missing fields');
      return createResponse({
        status: 'error',
        message: 'Data tidak lengkap'
      });
    }
    
    const sheet = getSheet();
    
    // Check duplicate ID
    const existingData = sheet.getDataRange().getValues();
    for (let i = 1; i < existingData.length; i++) {
      if (existingData[i][0] === data.id_barang) {
        Logger.log('Duplicate ID found: ' + data.id_barang);
        return createResponse({
          status: 'error',
          message: 'ID Barang sudah ada'
        });
      }
    }
    
    // Prepare new row
    const newRow = [
      data.id_barang,
      data.nama_barang,
      data.kategori,
      data.sub_kategori || '',
      data.jumlah || 0,
      data.kondisi,
      data.status,
      data.lokasi
    ];
    
    Logger.log('Appending row: ' + JSON.stringify(newRow));
    
    // Append to sheet
    sheet.appendRow(newRow);
    
    // Verify it was added
    const lastRow = sheet.getLastRow();
    Logger.log('Last row after append: ' + lastRow);
    
    // Flush changes
    SpreadsheetApp.flush();
    
    Logger.log('SUCCESS - Data added');
    
    return createResponse({
      status: 'success',
      message: 'Data berhasil ditambahkan'
    });
    
  } catch (error) {
    Logger.log('ERROR in addData: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return createResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * Update data
 */
function updateData(params) {
  try {
    Logger.log('=== UPDATE DATA ===');
    
    const rowIndex = parseInt(params.rowIndex);
    
    let data;
    if (typeof params.data === 'string') {
      data = JSON.parse(params.data);
    } else {
      data = params.data;
    }
    
    Logger.log('Row: ' + rowIndex);
    Logger.log('Data: ' + JSON.stringify(data));
    
    if (!rowIndex || rowIndex < 2) {
      return createResponse({
        status: 'error',
        message: 'Row index tidak valid'
      });
    }
    
    if (!data.id_barang || !data.nama_barang || !data.kategori || 
        !data.kondisi || !data.status || !data.lokasi) {
      return createResponse({
        status: 'error',
        message: 'Data tidak lengkap'
      });
    }
    
    const sheet = getSheet();
    
    const updatedRow = [
      data.id_barang,
      data.nama_barang,
      data.kategori,
      data.sub_kategori || '',
      data.jumlah || 0,
      data.kondisi,
      data.status,
      data.lokasi
    ];
    
    const range = sheet.getRange(rowIndex, 1, 1, updatedRow.length);
    range.setValues([updatedRow]);
    
    SpreadsheetApp.flush();
    
    Logger.log('SUCCESS - Data updated');
    
    return createResponse({
      status: 'success',
      message: 'Data berhasil diupdate'
    });
    
  } catch (error) {
    Logger.log('ERROR in updateData: ' + error.toString());
    return createResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * Delete data
 */
function deleteData(params) {
  try {
    Logger.log('=== DELETE DATA ===');
    
    const rowIndex = parseInt(params.rowIndex);
    Logger.log('Row to delete: ' + rowIndex);
    
    if (!rowIndex || rowIndex < 2) {
      return createResponse({
        status: 'error',
        message: 'Row index tidak valid'
      });
    }
    
    const sheet = getSheet();
    sheet.deleteRow(rowIndex);
    
    SpreadsheetApp.flush();
    
    Logger.log('SUCCESS - Data deleted');
    
    return createResponse({
      status: 'success',
      message: 'Data berhasil dihapus'
    });
    
  } catch (error) {
    Logger.log('ERROR in deleteData: ' + error.toString());
    return createResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * Get or create sheet
 */
function getSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      Logger.log('Sheet not found, creating: ' + SHEET_NAME);
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // Add headers
      const headers = [
        'ID Barang',
        'Nama Barang',
        'Kategori',
        'Sub Kategori',
        'Jumlah',
        'Kondisi',
        'Status',
        'Lokasi'
      ];
      
      sheet.appendRow(headers);
      
      // Format header
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#16a34a');
      headerRange.setFontColor('#ffffff');
      headerRange.setHorizontalAlignment('center');
      
      SpreadsheetApp.flush();
    }
    
    return sheet;
    
  } catch (error) {
    Logger.log('ERROR in getSheet: ' + error.toString());
    throw error;
  }
}

/**
 * Create JSON response
 */
function createResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Test function - Run this to test manually
 */
function testAddData() {
  const testParams = {
    action: 'add',
    data: {
      id_barang: 'TEST-' + new Date().getTime(),
      nama_barang: 'Test Item',
      kategori: 'Elektronik',
      sub_kategori: 'Test',
      jumlah: 1,
      kondisi: 'Baik',
      status: 'Tersedia',
      lokasi: 'Gudang'
    }
  };
  
  const result = addData(testParams);
  Logger.log('Test result: ' + result.getContent());
}

/**
 * Test function - Get all data
 */
function testGetData() {
  const result = getAllData();
  Logger.log('Get data result: ' + result.getContent());
}
