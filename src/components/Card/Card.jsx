import React from "react";
import "./Card.scss";

export default function Card({ card }) {
  return (
    <li className="card-item">
      {card.cover && (
        <img src={card.cover} className="card-cover" alt="picsum-img" />
      )}
      {card.title}
    </li>
  );
}