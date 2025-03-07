<!-- src/frontend/src/routes/dashboard/+page.svelte -->
<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { isAuthenticated, authLoading, initAuth } from '$lib/stores/auth';
    import { setupDocumentManager } from '$lib/stores/documents';
    import Navbar from '$lib/components/Navbar.svelte';
    import UploadForm from '$lib/components/UploadForm.svelte';
    import DocumentList from '$lib/components/DocumentList.svelte';
    import EmailForm from '$lib/components/EmailForm.svelte';
    
    onMount(() => {
      // Initialize authentication if not done already
      initAuth();
      
      // Setup document manager actor when authenticated
      setupDocumentManager();
    });
    
    // Redirect to login if not authenticated
    $: if (!$authLoading && !$isAuthenticated) {
      goto('/');
    }
  </script>
  
  <div class="dashboard-container">
    {#if $authLoading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    {:else if $isAuthenticated}
      <Navbar />
      
      <main class="dashboard-content">
        <UploadForm />
        <DocumentList />
        <EmailForm />
      </main>
      
      <footer class="dashboard-footer">
        <p>© {new Date().getFullYear()} Document Manager on Internet Computer</p>
      </footer>
    {/if}
  </div>
  
  <style>
    .dashboard-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f5f7fa;
    }
  
    .dashboard-content {
      max-width: 1000px;
      width: 100%;
      margin: 2rem auto;
      padding: 0 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      flex-grow: 1;
    }
  
    .dashboard-footer {
      background-color: white;
      padding: 1.5rem;
      text-align: center;
      color: #666;
      font-size: 0.9rem;
      margin-top: 3rem;
      border-top: 1px solid #e0e0e0;
    }
  
    .loading {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      color: #5e35b1;
      height: 100vh;
    }
  
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(94, 53, 177, 0.1);
      border-radius: 50%;
      border-top-color: #5e35b1;
      animation: spin 1s ease-in-out infinite;
    }
  
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  
    @media (max-width: 600px) {
      .dashboard-content {
        padding: 0 1rem;
        margin: 1rem auto;
      }
    }
  </style>