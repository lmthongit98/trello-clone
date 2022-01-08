import Card from 'components/Card/Card'
import ConfirmModal from 'components/Common/ConfirmModal'
import React, { useEffect, useState } from 'react'
import { Dropdown, Form } from 'react-bootstrap'
import { Container, Draggable } from 'react-smooth-dnd'
import { MODAL_ACTION_CONFIRM } from 'utils/constants'
import { saveContentAfterPressEnter, selectAllInlineText } from 'utils/contentEditable'
import { mapOrder } from 'utils/sorts'
import './Column.scss'

export default function Column({ column, onCardDrop, onUpdateColumn }) {
  const cards = mapOrder(column.cards, column.cardOrder, 'id')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [columnTitle, setColumnTitle] = useState('')

  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

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
              <Dropdown.Item>Add card...</Dropdown.Item>
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
      </div>
      <footer>
        <div className="footer-actions">
          <i className="fa fa-plus icon" /> Add another card
        </div>
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
