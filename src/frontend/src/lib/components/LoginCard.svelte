<!-- src/frontend/src/lib/components/LoginCard.svelte -->
<script>
    import { login, authLoading } from '$lib/stores/auth';
  
    function handleLogin() {
      login();
    }
  </script>
  
  <div class="login-container">
    <div class="logo">
      <img src="/internet-identity-logo.svg" alt="Internet Identity Logo">
    </div>
    
    <div class="login-card">
      <h2>Enter Identity <span class="key-icon">🔑</span></h2>
      <p>to continue</p>
      
      <div class="input-field">
        <input type="text" placeholder="Internet Identity" disabled>
      </div>
      
      <button 
        class="primary-button" 
        on:click={handleLogin} 
        disabled={$authLoading}
      >
        {$authLoading ? 'Connecting...' : 'Continue'}
      </button>
      
      <p>
        <a href="#" class="text-link">Continue with another device</a>
      </p>
      
      <div class="divider"></div>
      
      <div class="options">
        <a href="#" class="text-link">Create New</a>
        <a href="#" class="text-link">Lost Access?</a>
      </div>
    </div>
  </div>
  
  <style>
    .login-container {
      width: 100%;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  
    .logo {
      margin-bottom: 2rem;
    }
  
    .logo img {
      width: 170px;
      height: auto;
    }
  
    .login-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      width: 100%;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
  
    .login-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(to right, #ff1b6b, #45caff);
      z-index: 1;
    }
  
    h2 {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .key-icon {
      margin-left: 0.5rem;
      font-size: 1.5rem;
    }
  
    p {
      color: #666;
      margin-bottom: 1.5rem;
    }
  
    .input-field {
      margin-bottom: 1.5rem;
      position: relative;
    }
  
    input {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 1rem;
      outline: none;
      transition: border 0.3s ease;
      background-color: #f9f9f9;
    }
  
    input:focus {
      border-color: #5e35b1;
    }
  
    .primary-button {
      background-color: #5e35b1;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 0.8rem 1rem;
      font-size: 1rem;
      cursor: pointer;
      width: 100%;
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
  
    .text-link {
      color: #5e35b1;
      text-decoration: none;
      transition: color 0.3s ease;
    }
  
    .text-link:hover {
      color: #4527a0;
      text-decoration: underline;
    }
  
    .divider {
      margin: 2rem 0;
      height: 1px;
      background-color: #e0e0e0;
    }
  
    .options {
      display: flex;
      justify-content: space-between;
      padding: 0 1rem;
    }
  </style>