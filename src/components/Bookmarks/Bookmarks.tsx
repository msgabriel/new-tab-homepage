import { useEffect, useState } from 'react'
import { SiteBookmark, useBookmarks } from '../../hooks/useBookmarks'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { useModal } from '../../hooks/useModal'
import { Button } from '../Button'
import { Modal } from '../Modal'
import { BookmarkForm } from './BookmarkForm'
import { BookmarkItem } from './BookmarkItem'
import styles from './Bookmarks.module.css'

export function Bookmarks() {
  const {
    sites,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    reorderBookmarks,
  } = useBookmarks()
  const { isOpen, toggle } = useModal()
  const [editing, setEditing] = useState<SiteBookmark | null>(null)
  const [contextMenu, setContextMenu] = useState<string | null>(null)

  const dragAndDrop = useDragAndDrop(reorderBookmarks)

  useEffect(() => {
    const handleDocumentClick = () => {
      if (contextMenu) setContextMenu(null)
    }
    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [contextMenu])

  const handleFormSubmit = (title: string, url: string) => {
    if (editing) {
      updateBookmark(editing.uuid, title, url)
    } else {
      addBookmark(title, url)
    }
    closeModal()
  }

  const handleEdit = (bookmark: SiteBookmark) => {
    setEditing(bookmark)
    setContextMenu(null)
    toggle()
  }

  const handleDelete = (uuid: string) => {
    deleteBookmark(uuid)
    setContextMenu(null)
  }

  const handleContextMenu = (e: React.MouseEvent, bookmarkId: string) => {
    e.preventDefault()
    setContextMenu(bookmarkId)
  }

  const openAddModal = () => {
    setEditing(null)
    toggle()
  }

  const closeModal = () => {
    setEditing(null)
    toggle()
  }

  return (
    <section id={styles.bookmarks} className={styles.container}>
      {sites.length > 0 && (
        <ul>
          {sites.map((bookmark, index) => (
            <BookmarkItem
              key={bookmark.uuid}
              bookmark={bookmark}
              index={index}
              showActions={contextMenu === bookmark.uuid}
              onEdit={() => handleEdit(bookmark)}
              onDelete={() => handleDelete(bookmark.uuid)}
              onContextMenu={e => handleContextMenu(e, bookmark.uuid)}
              onDragStart={dragAndDrop.handleDragStart}
              onDragOver={dragAndDrop.handleDragOver}
              onDrop={dragAndDrop.handleDrop}
              onDragEnd={dragAndDrop.handleDragEnd}
              isDragging={dragAndDrop.draggedIndex === index}
              isDraggedOver={
                dragAndDrop.dragOverIndex === index &&
                dragAndDrop.draggedIndex !== index
              }
            />
          ))}
        </ul>
      )}
      <AddButton hide={sites.length > 0} onClick={openAddModal} />
      <Modal isOpen={isOpen} toggle={closeModal}>
        <BookmarkForm
          bookmark={editing}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </section>
  )
}

type AddButtonProps = {
  hide: boolean
  onClick: () => void
}

function AddButton(props: AddButtonProps) {
  return (
    <Button
      id={styles.addSite}
      variant="icon"
      showOnHover
      onClick={props.onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 5l0 14" />
        <path d="M5 12l14 0" />
      </svg>
    </Button>
  )
}
