<!-- src/frontend/src/lib/components/EmailForm.svelte -->
<script>
  import { onMount } from 'svelte';
  import { 
    userEmail, 
    documents, 
    loading, 
    updateEmail, 
    sendDocumentsToEmail 
  } from '$lib/stores/documents';
  
  let email = '';
  let message = '';
  let messageType = '';
  
  onMount(() => {
    // Set email from store when component mounts
    email = $userEmail;
  });

  // Keep local email in sync with store
  $: {
    if ($userEmail !== email && $userEmail !== '') {
      email = $userEmail;
    }
  }
  
  async function handleSaveEmail() {
    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }
    
    const success = await updateEmail(email);
    
    if (success) {
      showMessage('Email saved successfully!', 'success');
    } else {
      showMessage('Failed to save email.', 'error');
    }
  }
  
  async function handleSendDocuments() {
    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }
    
    if ($documents.length === 0) {
      showMessage('You have no documents to send.', 'error');
      return;
    }
    
    const success = await sendDocumentsToEmail();
    
    if (success) {
      showMessage('Documents sent successfully!', 'success');
    } else {
      showMessage('Failed to send documents.', 'error');
    }
  }
  
  function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
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

<div class="email-form-container">
  <h2>Email Documents</h2>
  
  <form>
    <div class="form-content">
      <div class="email-input-container">
        <input
          type="email"
          id="emailInput"
          placeholder="Enter email address"
          bind:value={email}
          disabled={$loading}
        />
      </div>
      
      <div class="buttons">
        <button 
          type="button" 
          class="secondary-button" 
          on:click={handleSaveEmail} 
          disabled={$loading}
        >
          Save Email
        </button>
        
        <button 
          type="button" 
          class="primary-button" 
          on:click={handleSendDocuments} 
          disabled={$loading || $documents.length === 0}
        >
          Send Documents
        </button>
      </div>
    </div>
    
    {#if message}
      <div class="message {messageType}">
        {message}
      </div>
    {/if}
    
    {#if $documents.length === 0}
      <div class="info-message">
        Upload documents first to send them via email.
      </div>
    {/if}
  </form>
</div>

<style>
  .email-form-container {
    background-color: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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
    align-items: flex-start;
  }

  .email-input-container {
    flex: 1;
    min-width: 250px;
  }

  input[type="email"] {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
    transition: border 0.3s ease;
  }

  input[type="email"]:focus {
    border-color: #5e35b1;
  }

  .buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .primary-button, .secondary-button {
    border-radius: 6px;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .primary-button {
    background-color: #5e35b1;
    color: white;
    border: none;
  }

  .primary-button:hover:not(:disabled) {
    background-color: #4527a0;
  }

  .secondary-button {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #e0e0e0;
  }

  .secondary-button:hover:not(:disabled) {
    background-color: #e0e0e0;
  }

  .primary-button:disabled, .secondary-button:disabled {
    background-color: #9e9e9e;
    color: #f5f5f5;
    cursor: not-allowed;
    border-color: #9e9e9e;
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

  .info-message {
    margin-top: 1rem;
    padding: 0.5rem;
    color: #666;
    font-style: italic;
    text-align: center;
    font-size: 0.9rem;
  }

  @media (max-width: 600px) {
    .form-content {
      flex-direction: column;
    }

    .buttons {
      width: 100%;
    }

    .primary-button, .secondary-button {
      flex: 1;
    }
  }
</style>