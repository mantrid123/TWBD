<!-- src/frontend/src/lib/components/DocumentList.svelte -->
<script>
    import { onMount } from 'svelte';
    import DocumentItem from './DocumentItem.svelte';
    import { 
      documents, 
      loading, 
      error, 
      loadUserProfile 
    } from '$lib/stores/documents';
  
    onMount(() => {
      loadUserProfile();
    });
  
    function formatDate(timestamp) {
      if (!timestamp) return '';
      // Convert nanoseconds to milliseconds
      const date = new Date(Number(timestamp) / 1000000);
      return date.toLocaleString();
    }
  </script>
  
  <div class="document-list-container">
    <h2>Your Documents</h2>
  
    {#if $loading}
      <div class="loading">Loading documents...</div>
    {:else if $error}
      <div class="error">{$error}</div>
    {:else if $documents.length === 0}
      <div class="empty-state">
        <p>No documents uploaded yet.</p>
        <p>Use the upload form above to add documents.</p>
      </div>
    {:else}
      <div class="documents-table-container">
        <table class="documents-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each $documents as document (document.id)}
              <tr>
                <td>{document.name}</td>
                <td>{formatDate(document.createdAt)}</td>
                <td class="actions">
                  <DocumentItem {document} />
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
  
  <style>
    .document-list-container {
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
  
    .loading, .error, .empty-state {
      padding: 1.5rem;
      text-align: center;
      color: #666;
      font-style: italic;
    }
  
    .error {
      color: #f44336;
    }
  
    .documents-table-container {
      overflow-x: auto;
    }
  
    .documents-table {
      width: 100%;
      border-collapse: collapse;
    }
  
    .documents-table th,
    .documents-table td {
      padding: 0.8rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
  
    .documents-table th {
      font-weight: 600;
      color: #666;
    }
  
    .actions {
      display: flex;
      gap: 0.5rem;
    }
  </style>