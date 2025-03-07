<!-- src/frontend/src/routes/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isAuthenticated, authLoading, initAuth } from '$lib/stores/auth';
  import LoginCard from '$lib/components/LoginCard.svelte';
  
  onMount(() => {
    // Initialize authentication when the page loads
    initAuth();
  });
  
  // Redirect to dashboard if authenticated
  $: if ($isAuthenticated) {
    goto('/dashboard');
  }
</script>

<div class="landing-container">
  {#if $authLoading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Connecting to Internet Identity...</p>
    </div>
  {:else}
    <LoginCard />
  {/if}
</div>

<style>
  .landing-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(135deg, #e0e6ff 0%, #f8e0ff 50%, #ffe0cc 100%);
    padding: 2rem;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: #5e35b1;
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
</style>