import { initialData } from 'actions/initialData'
import Column from 'components/Column/Column'
import { isEmpty } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap'
import { mapOrder } from 'utils/sorts'
import { applyDrag } from 'utils/dragDrop'
import './BoardContent.scss'

export default function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const newColumnInputRef = useRef(null)

  useEffect(() => {
    const boardFormDB = initialData.boards.find((board) => board.id === 'board-1')
    if (boardFormDB) {
      setBoard(boardFormDB)
      setColumns(mapOrder(boardFormDB.columns, boardFormDB.columnOrder, 'id'))
      setColumns(boardFormDB.columns)
    }
  }, [])

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()
    }
  }, [openNewColumnForm])

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
    setBoard(newBoard)
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

  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
  }

  const handleNewColumnTitleChange = (e) => {
    setNewColumnTitle(e.target.value)
  }

  const addNewColumn = () => {
    if (!newColumnTitle.trim()) {
      newColumnInputRef.current.focus()
      return
    }
    const newColumnToAdd = {
      id: Math.random().toString(36).substr(2, 5), // 5 random characters
      boardId: board.id,
      title: newColumnTitle,
      cardOrder: [],
      cards: [],
    }
    let newColumns = [...columns]
    newColumns.push(newColumnToAdd)
    let newBoard = { ...board }
    newBoard.columns = newColumns
    setColumns(newColumns)
    setBoard(newBoard)
    setNewColumnTitle('')
    toggleOpenNewColumnForm()
  }

  const onUpdateColumn = (columnToUpdate) => {
    const columnId = columnToUpdate.id
    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex((item) => item.id === columnId)
    if (columnToUpdate._destroy) {
      newColumns.splice(columnIndexToUpdate, 1)
    } else {
      newColumns.splice(columnIndexToUpdate, 1, columnToUpdate)
    }
    let newBoard = { ...board }
    newBoard.columns = newColumns
    setColumns(newColumns)
    setBoard(newBoard)
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
            <Column onCardDrop={onCardDrop} column={column} onUpdateColumn={onUpdateColumn} />
          </Draggable>
        ))}
      </Container>
      <BootstrapContainer className="trello-clone-container">
        {!openNewColumnForm && (
          <Row>
            <Col onClick={toggleOpenNewColumnForm} className="add-new-column">
              <i className="fa fa-plus icon" /> Add another column
            </Col>
          </Row>
        )}
        {openNewColumnForm && (
          <Row>
            <Col className="enter-new-column">
              <Form.Control
                className="input-enter-new-column"
                size="sm"
                type="text"
                placeholder="Enter column title..."
                ref={newColumnInputRef}
                onChange={handleNewColumnTitleChange}
                onKeyDown={(event) => event.key === 'Enter' && addNewColumn()}
                value={newColumnTitle}
              />
              <Button onClick={addNewColumn} variant="success" size="sm">
                Add column
              </Button>
              <span onClick={toggleOpenNewColumnForm} className="cancel-new-column">
                <i className="fa fa-trash icon"></i>
              </span>
            </Col>
          </Row>
        )}
      </BootstrapContainer>
    </div>
  )
}
