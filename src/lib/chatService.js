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
export const getOrCreateChat = async (
  user1Id,
  user2Id,
  user2Name,
  user1Name
) => {
  const chatId = [user1Id, user2Id].sort().join("_"); // deterministic ID
  const chatRef = doc(db, COLLECTIONS.CHATS, chatId);

  const chatDoc = await getDoc(chatRef);
  if (!chatDoc.exists()) {
    await setDoc(chatRef, {
      id: chatId,
      participants: [
        { id: user1Id, name: user1Name },
        { id: user2Id, name: user2Name },
      ],
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
    where("participants", "array-contains-any", [
      { id: userId, name: "" }, // This won't work perfectly, so we'll filter in memory
    ]),
    orderBy("createdAt", "desc")
  );

  // Better approach: get all chats and filter in memory
  const allChatsQuery = query(
    collection(db, COLLECTIONS.CHATS),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(allChatsQuery, (snapshot) => {
    const allChats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter chats where user is a participant and add display name
    const userChats = allChats
      .filter((chat) => {
        return (
          chat.participants && chat.participants.some((p) => p.id === userId)
        );
      })
      .map((chat) => {
        // Find the other participant to show their name
        const otherParticipant = chat.participants.find((p) => p.id !== userId);
        return {
          ...chat,
          name: otherParticipant ? otherParticipant.name : "Unknown User",
        };
      });

    callback(userChats);
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
