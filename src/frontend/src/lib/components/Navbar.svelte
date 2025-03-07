<!-- src/frontend/src/lib/components/Navbar.svelte -->
<script>
  import { logout, principal } from '$lib/stores/auth';
  
  function handleLogout() {
    logout();
  }
  
  function truncatePrincipal(principalId) {
    if (!principalId) return '';
    const str = principalId.toString();
    return str.length > 16 
      ? `${str.slice(0, 8)}...${str.slice(-8)}`
      : str;
  }
</script>

<nav class="navbar">
  <div class="navbar-content">
    <div class="navbar-brand">
      <img src="/internet-identity-logo.svg" alt="Logo" class="logo" />
      <h1>Document Manager</h1>
    </div>
    
    <div class="navbar-user">
      {#if $principal}
        <span class="user-id">ID: {truncatePrincipal($principal)}</span>
      {/if}
      <button class="logout-button" on:click={handleLogout}>
        Logout
      </button>
    </div>
  </div>
</nav>

<style>
  .navbar {
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .navbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo {
    height: 32px;
    width: auto;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .navbar-user {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-id {
    font-size: 0.9rem;
    color: #666;
    font-family: monospace;
    background-color: #f5f5f5;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }

  .logout-button {
    background-color: transparent;
    color: #5e35b1;
    border: 1px solid #5e35b1;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .logout-button:hover {
    background-color: #f5f0ff;
  }

  @media (max-width: 600px) {
    .navbar-content {
      padding: 1rem;
      flex-direction: column;
      gap: 1rem;
    }

    .navbar-user {
      width: 100%;
      justify-content: space-between;
    }
  }
</style>