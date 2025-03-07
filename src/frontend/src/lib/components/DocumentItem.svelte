<!-- src/frontend/src/lib/components/DocumentItem.svelte -->
<script>
    import { deleteDocument, getDocument } from '$lib/stores/documents';
  
    export let document;
  
    async function handleView() {
      const doc = await getDocument(document.id);
      
      if (doc) {
        // Create a blob from the document content
        const blob = new Blob([doc.content], { type: doc.contentType });
        const url = URL.createObjectURL(blob);
        
        // Open in a new tab
        window.open(url, '_blank');
      }
    }
  
    async function handleDelete() {
      if (confirm(`Are you sure you want to delete "${document.name}"?`)) {
        await deleteDocument(document.id);
      }
    }
  </script>
  
  <div class="document-actions">
    <button class="view-button" on:click={handleView}>
      View
    </button>
    <button class="delete-button" on:click={handleDelete}>
      Delete
    </button>
  </div>
  
  <style>
    .document-actions {
      display: flex;
      gap: 0.5rem;
    }
  
    button {
      padding: 0.3rem 0.8rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.875rem;
      transition: background-color 0.3s ease;
    }
  
    .view-button {
      background-color: #e3f2fd;
      color: #2196f3;
      border: 1px solid #bbdefb;
    }
  
    .view-button:hover {
      background-color: #bbdefb;
    }
  
    .delete-button {
      background-color: #ffebee;
      color: #f44336;
      border: 1px solid #ffcdd2;
    }
  
    .delete-button:hover {
      background-color: #ffcdd2;
    }
  </style>