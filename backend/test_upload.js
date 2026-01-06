const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

(async function(){
  const fd = new FormData();
  fd.append('file', fs.createReadStream('./test_upload.txt'));
  try {
    const res = await axios.post('http://localhost:5000/api/storage/upload', fd, { headers: fd.getHeaders(), maxContentLength: Infinity, maxBodyLength: Infinity });
    console.log('Upload response:', res.data);
  } catch (err) {
    if (err.response) console.error('Error response:', err.response.status, err.response.data);
    else console.error('Upload error', err.message);
  }
})();