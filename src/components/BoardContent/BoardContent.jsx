import Column from "components/Column/Column";
import React from "react";
import "./BoardContent.scss";

export default function BoardContent() {
  return (
    <div className="board-content">
      <Column />
      <Column />
    </div>
  );
}
