import { useState } from 'react';
import { motion } from 'framer-motion';
import CardRotate from './CardRotate';
import './Stack.css';

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cardDimensions = { width: 208, height: 208 },
  cardsData = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false
}) {
  const [cards, setCards] = useState(cardsData);
  const [selectedCard, setSelectedCard] = useState(null);
  const sendToBack = (id) => {
    setCards((prev) => {
      const newCards = [...prev];
      const index = newCards.findIndex((card) => card.id === id);
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };
  return (
    <>
      <div
        className="stack-container"
        style={{
          width: cardDimensions.width,
          height: cardDimensions.height,
          perspective: 600
        }}
      >
        {cards.map((card, index) => {
          const randomRotate = randomRotation ? Math.random() * 10 - 5 : 0;

          return (
            <CardRotate
              key={card.id}
              onSendToBack={() => sendToBack(card.id)}
              sensitivity={sensitivity}
            >
              <motion.div
                className="card"
                onClick={() => setSelectedCard(card)}
                animate={{
                  rotateZ: (cards.length - index - 1) * 4 + randomRotate,
                  scale: 1 + index * 0.06 - cards.length * 0.06,
                  transformOrigin: '90% 90%'
                }}
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: animationConfig.stiffness,
                  damping: animationConfig.damping
                }}
                style={{
                  width: cardDimensions.width,
                  height: cardDimensions.height,
                  position: 'relative'
                }}
              >
                <img src={card.img} alt={`card-${card.id}`} className="card-image" />
                {card.name && <div className="card-name">{card.name}</div>}
              </motion.div>
            </CardRotate>
          );
        })}
      </div>

      {/* Modal for selected card */}
      {selectedCard && (
  <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <img src={selectedCard.img} alt={selectedCard.name} className="modal-img" />
      <h2>{selectedCard.name}</h2>
      <p>{selectedCard.bio || "No bio available"}</p>
      <p>Age: {selectedCard.age || "N/A"}</p>
      {selectedCard.interests.length > 0 && (
        <p>Interests: {selectedCard.interests.join(', ')}</p>
      )}
      {selectedCard.preferredActivities.length > 0 && (
        <p>Activities: {selectedCard.preferredActivities.join(', ')}</p>
      )}
      <button onClick={() => setSelectedCard(null)}>Close</button>
    </div>
  </div>
)}
    </>
  );
}
