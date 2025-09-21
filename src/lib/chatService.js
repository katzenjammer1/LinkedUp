// src/lib/chatService.js
import { db } from "./firebase";
import { COLLECTIONS } from "./firestoreStructure";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

// Create or get a 1-on-1 chat
export const getOrCreateChat = async (user1Id, user2Id, user2Name) => {
  const chatId = [user1Id, user2Id].sort().join("_"); // deterministic ID
  const chatRef = doc(db, COLLECTIONS.CHATS, chatId);

  const chatDoc = await getDoc(chatRef);
  if (!chatDoc.exists()) {
    await setDoc(chatRef, {
      id: chatId,
      participants: [user1Id, user2Id],
      name: user2Name, // optional: show name of the other participant
      createdAt: serverTimestamp(),
      lastMessage: null,
    });
  }
  return chatId;
};

// Listen to all chats for a user
export const listenToUserChats = (userId, callback) => {
  const q = query(
    collection(db, COLLECTIONS.CHATS),
    where("participants", "array-contains", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(chats);
  });
};

// Listen to messages in a chat
export const listenToChatMessages = (chatId, callback) => {
  const q = query(
    collection(db, COLLECTIONS.CHATS, chatId, "messages"),
    orderBy("timestamp", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};

// Send a message
export const sendChatMessage = async (chatId, user, text) => {
  const msgRef = collection(db, COLLECTIONS.CHATS, chatId, "messages");
  const newMsg = {
    text,
    senderId: user.uid,
    senderName: user.name || user.displayName,
    senderAvatar: user.photoURL,
    timestamp: serverTimestamp(),
    type: "text",
  };
  await addDoc(msgRef, newMsg);

  // Update last message in chat
  const chatRef = doc(db, COLLECTIONS.CHATS, chatId);
  await setDoc(chatRef, { lastMessage: newMsg }, { merge: true });
};
