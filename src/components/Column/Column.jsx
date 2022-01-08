import Card from 'components/Card/Card'
import ConfirmModal from 'components/Common/ConfirmModal'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Dropdown, Form } from 'react-bootstrap'
import { Container, Draggable } from 'react-smooth-dnd'
import { MODAL_ACTION_CONFIRM } from 'utils/constants'
import { cloneDeep, set } from 'lodash'
import { saveContentAfterPressEnter, selectAllInlineText } from 'utils/contentEditable'
import { mapOrder } from 'utils/sorts'
import './Column.scss'

export default function Column({ column, onCardDrop, onUpdateColumn }) {
  const cards = mapOrder(column.cards, column.cardOrder, 'id')
  const newCardTextAreaRef = useRef(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [columnTitle, setColumnTitle] = useState('')
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')

  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm)
  }

  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

  useEffect(() => {
    if (newCardTextAreaRef && newCardTextAreaRef.current) {
      newCardTextAreaRef.current.focus()
      newCardTextAreaRef.current.select()
    }
  }, [openNewCardForm])

  const handleColumnTileChange = (e) => {
    setColumnTitle(e.target.value)
  }

  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle,
    }
    onUpdateColumn(newColumn)
  }

  const onConfirmModalAction = (type) => {
    if (type == MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true,
      }
      onUpdateColumn(newColumn)
    }
    toggleShowConfirmModal()
  }

  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const addNewCard = () => {
    if (!newCardTitle.trim()) {
      newCardTextAreaRef.current.focus()
      return
    }
    const newCardToAdd = {
      id: Math.random().toString(36).substr(2, 5), // 5 random characters
      boardId: column.boardId,
      columnId: column.id,
      title: newCardTitle,
      cover: null,
    }
    let newColumn = cloneDeep(column)
    newColumn.cards.push(newCardToAdd)
    newColumn.cardOrder.push(newCardToAdd.id)
    onUpdateColumn(newColumn)
    setNewCardTitle('')
    toggleOpenNewCardForm()
  }

  const onNewCardTitleChange = (e) => {
    setNewCardTitle(e.target.value)
  }

  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control
            onClick={selectAllInlineText}
            className="trello-content-editable"
            size="sm"
            type="text"
            onChange={handleColumnTileChange}
            onKeyDown={saveContentAfterPressEnter}
            onBlur={handleColumnTitleBlur}
            value={columnTitle}
            spellCheck="false"
          />
        </div>
        <div className="column-dropdown-action">
          <Dropdown>
            <Dropdown.Toggle className="dropdown-btn" id="dropdown-basic" size="sm" />
            <Dropdown.Menu>
              <Dropdown.Item onClick={toggleOpenNewCardForm}>Add card...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>Remove column</Dropdown.Item>
              <Dropdown.Item>Move all cards in this column(beta)</Dropdown.Item>
              <Dropdown.Item>Archie all cards in this column(beta)</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>

      <div className="card-list">
        <Container
          orientation="vertical" // default
          groupName="thong-columns"
          onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
          getChildPayload={(index) => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview',
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
        {openNewCardForm && (
          <div className="add-new-card-area">
            <Form.Control
              ref={newCardTextAreaRef}
              className="textarea-enter-new-card"
              size="sm"
              as="textarea"
              rows="3"
              placeholder="Enter card title..."
              onChange={onNewCardTitleChange}
              onKeyDown={(event) => event.key === 'Enter' && addNewCard()}
              value={newCardTitle}
            />
          </div>
        )}
      </div>
      <footer>
        {openNewCardForm && (
          <div className="add-new-card-area">
            <Button onClick={addNewCard} variant="success" size="sm">
              Add card
            </Button>
            <span onClick={toggleOpenNewCardForm} className="cancel-icon">
              <i className="fa fa-trash icon"></i>
            </span>
          </div>
        )}
        {!openNewCardForm && (
          <div onClick={toggleOpenNewCardForm} className="footer-actions">
            <i className="fa fa-plus icon" /> Add another card
          </div>
        )}
      </footer>
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content={`Are you sure you want to remove <strong> ${column.title} </strong>. <br/> All related cards will also removed`}
      />
    </div>
  )
}
