<!-- src/frontend/src/lib/components/UploadForm.svelte -->
<script>
    import { uploadDocument, loading } from '$lib/stores/documents';
    
    let files = [];
    let uploading = false;
    let message = '';
    let messageType = '';
  
    async function handleSubmit(event) {
      event.preventDefault();
      
      if (files.length === 0) {
        showMessage('Please select at least one file to upload.', 'error');
        return;
      }
      
      uploading = true;
      message = '';
      
      try {
        for (let i = 0; i < files.length; i++) {
          const success = await uploadDocument(files[i]);
          
          if (!success) {
            showMessage(`Failed to upload ${files[i].name}`, 'error');
            break;
          }
        }
        
        // Reset file input if all uploads succeeded
        files = [];
        showMessage('Documents uploaded successfully!', 'success');
      } catch (error) {
        showMessage('An error occurred during upload. Please try again.', 'error');
        console.error('Upload error:', error);
      } finally {
        uploading = false;
      }
    }
    
    function showMessage(msg, type) {
      message = msg;
      messageType = type;
      
      // Clear message after 3 seconds
      setTimeout(() => {
        message = '';
      }, 3000);
    }
  </script>
  
  <div class="upload-form-container">
    <h2>Upload Documents</h2>
    
    <form on:submit={handleSubmit}>
      <div class="form-content">
        <div class="file-input-container">
          <input
            type="file"
            id="fileInput"
            multiple
            bind:files
            disabled={uploading || $loading}
          />
          <label for="fileInput" class="file-label">
            {files.length > 0 ? `${files.length} file(s) selected` : 'Choose files'}
          </label>
        </div>
        
        <button 
          type="submit" 
          class="primary-button" 
          disabled={uploading || $loading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      
      {#if message}
        <div class="message {messageType}">
          {message}
        </div>
      {/if}
    </form>
  </div>
  
  <style>
    .upload-form-container {
      background-color: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      margin-bottom: 2rem;
    }
  
    h2 {
      margin-bottom: 1.5rem;
      font-size: 1.4rem;
      color: #333;
      font-weight: 600;
    }
  
    .form-content {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
  
    .file-input-container {
      flex: 1;
      min-width: 200px;
    }
  
    input[type="file"] {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }
  
    .file-label {
      display: block;
      padding: 0.8rem 1rem;
      border: 1px dashed #5e35b1;
      border-radius: 6px;
      background-color: #f5f0ff;
      cursor: pointer;
      text-align: center;
      color: #5e35b1;
      transition: all 0.3s ease;
    }
  
    .file-label:hover {
      background-color: #ede7f6;
    }
  
    .primary-button {
      background-color: #5e35b1;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.3s ease;
    }
  
    .primary-button:hover:not(:disabled) {
      background-color: #4527a0;
    }
  
    .primary-button:disabled {
      background-color: #9e9e9e;
      cursor: not-allowed;
    }
  
    .message {
      margin-top: 1rem;
      padding: 0.8rem;
      border-radius: 6px;
      text-align: center;
    }
  
    .success {
      background-color: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #a5d6a7;
    }
  
    .error {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #ef9a9a;
    }
  </style>