// Main.mo - Document Management Application

import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor DocumentManager {
  // Types
  type UserId = Principal;
  
  type Document = {
    id : Nat;
    name : Text;
    content : Blob;
    contentType : Text;
    createdAt : Time.Time;
  };
  
  type UserProfile = {
    documents : [Document];
    email : ?Text;
  };
  
  // State
  private stable var nextDocId : Nat = 0;
  private stable var userProfilesEntries : [(UserId, UserProfile)] = [];
  
  private var userProfiles = HashMap.HashMap<UserId, UserProfile>(
    10, Principal.equal, Principal.hash
  );
  
  // Init
  system func preupgrade() {
    userProfilesEntries := Iter.toArray(userProfiles.entries());
  };
  
  system func postupgrade() {
    userProfiles := HashMap.fromIter<UserId, UserProfile>(
      userProfilesEntries.vals(), 10, Principal.equal, Principal.hash
    );
    userProfilesEntries := [];
  };
  
  // Helper Functions
  private func getDefaultUserProfile() : UserProfile {
    return {
      documents = [];
      email = null;
    };
  };
  
  private func getUserProfile(userId : UserId) : UserProfile {
    switch (userProfiles.get(userId)) {
      case (null) { getDefaultUserProfile() };
      case (?profile) { profile };
    };
  };
  
  private func updateUserProfile(userId : UserId, profile : UserProfile) {
    userProfiles.put(userId, profile);
  };
  
  // Public Methods
  public shared(msg) func whoami() : async Principal {
    return msg.caller;
  };
  
  public shared(msg) func getMyProfile() : async UserProfile {
    return getUserProfile(msg.caller);
  };
  
  public shared(msg) func updateEmail(email : Text) : async () {
    let userId = msg.caller;
    let currentProfile = getUserProfile(userId);
    
    let updatedProfile = {
      documents = currentProfile.documents;
      email = ?email;
    };
    
    updateUserProfile(userId, updatedProfile);
  };
  
  public shared(msg) func uploadDocument(name : Text, content : Blob, contentType : Text) : async Nat {
    let userId = msg.caller;
    let currentProfile = getUserProfile(userId);
    
    let docId = nextDocId;
    nextDocId += 1;
    
    let newDoc = {
      id = docId;
      name = name;
      content = content;
      contentType = contentType;
      createdAt = Time.now();
    };
    
    let documentsBuffer = Buffer.Buffer<Document>(currentProfile.documents.size() + 1);
    for (doc in currentProfile.documents.vals()) {
      documentsBuffer.add(doc);
    };
    documentsBuffer.add(newDoc);
    
    let updatedProfile = {
      documents = documentsBuffer.toArray();
      email = currentProfile.email;
    };
    
    updateUserProfile(userId, updatedProfile);
    return docId;
  };
  
  public shared(msg) func deleteDocument(docId : Nat) : async Bool {
    let userId = msg.caller;
    let currentProfile = getUserProfile(userId);
    
    let documentsBuffer = Buffer.Buffer<Document>(currentProfile.documents.size());
    var found = false;
    
    for (doc in currentProfile.documents.vals()) {
      if (doc.id != docId) {
        documentsBuffer.add(doc);
      } else {
        found := true;
      };
    };
    
    if (found) {
      let updatedProfile = {
        documents = documentsBuffer.toArray();
        email = currentProfile.email;
      };
      updateUserProfile(userId, updatedProfile);
    };
    
    return found;
  };
  
  public shared(msg) func getDocument(docId : Nat) : async ?Document {
    let userId = msg.caller;
    let currentProfile = getUserProfile(userId);
    
    for (doc in currentProfile.documents.vals()) {
      if (doc.id == docId) {
        return ?doc;
      };
    };
    
    return null;
  };
  
  public shared(msg) func sendDocumentsToEmail() : async Bool {
    let userId = msg.caller;
    let currentProfile = getUserProfile(userId);
    
    switch (currentProfile.email) {
      case (null) { 
        return false; // No email set
      };
      case (?email) {
        if (currentProfile.documents.size() == 0) {
          return false; // No documents to send
        };
        
        // In a real application, this would connect to an SMTP service
        // or call another canister that handles email sending
        // For this example, we'll just return success
        Debug.print("Sending documents to " # email);
        return true;
      };
    };
  };
}