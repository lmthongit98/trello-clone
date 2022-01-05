import { initialData } from 'actions/initialData'
import Column from 'components/Column/Column'
import { isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { mapOrder } from 'utils/sorts'
import { applyDrag } from 'utils/dragDrop'
import './BoardContent.scss'

export default function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])

  useEffect(() => {
    const boardFormDB = initialData.boards.find((board) => board.id === 'board-1')
    if (boardFormDB) {
      setBoard(boardFormDB)
      setColumns(mapOrder(boardFormDB.columns, boardFormDB.columnOrder, 'id'))
      setColumns(boardFormDB.columns)
    }
  }, [])

  if (isEmpty(board)) {
    return <div className="bot-found">Board not found!</div>
  }

  const onColumnDrop = (dropResult) => {
    console.log(dropResult)
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult)
    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map((c) => c.id)
    newBoard.columns = newColumns
    setColumns(newColumns)
    console.log(newBoard)
  }

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns]
      let currentColumn = newColumns.find((c) => c.id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map((item) => item.id)
      setColumns(newColumns)
    }
  }

  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={(index) => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview',
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column onCardDrop={onCardDrop} column={column} />
          </Draggable>
        ))}
      </Container>
      <div className="add-new-column">
        <i className="fa fa-plus icon" /> Add another column
      </div>
    </div>
  )
}
