import { initialData } from "actions/initialData";
import Column from "components/Column/Column";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { mapOrder } from "utils/sorts";
import "./BoardContent.scss";

export default function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const boardFormDB = initialData.boards.find(
      (board) => board.id === "board-1"
    );
    if (boardFormDB) {
      setBoard(boardFormDB);
      setColumns(mapOrder(boardFormDB.columns, boardFormDB.columnOrder, "id"));
      setColumns(boardFormDB.columns);
    }
  }, []);

  if (isEmpty(board)) {
    return <div className="bot-found">Board not found!</div>;
  }

  return (
    <div className="board-content">
      {columns.map((column, index) => (
        <Column key={index} column={column} />
      ))}
    </div>
  );
}
