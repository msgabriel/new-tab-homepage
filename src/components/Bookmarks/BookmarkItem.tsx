import { useEffect, useState } from 'react'
import {
  getFavicon,
  getFaviconBrightness,
} from '../../helpers/bookmark.helpers'
import { SiteBookmark } from '../../hooks/useBookmarks'
import { Button } from '../Button'
import styles from './Bookmarks.module.css'

type BookmarkItemProps = {
  bookmark: SiteBookmark
  index: number
  showActions: boolean
  onEdit: () => void
  onDelete: () => void
  onContextMenu: (e: React.MouseEvent) => void
  onDragStart: (e: React.DragEvent, item: SiteBookmark, index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDrop: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  isDraggedOver: boolean
}

export function BookmarkItem({
  bookmark,
  index,
  showActions,
  onEdit,
  onDelete,
  onContextMenu,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDraggedOver,
}: BookmarkItemProps) {
  const [faviconBrightness, setFaviconBrightness] = useState<
    'white' | 'black' | 'other'
  >('other')
  const [darkMode, setDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )

  useEffect(() => {
    const checkFavicon = async () => {
      const faviconUrl = getFavicon(bookmark.url)
      const brightness = await getFaviconBrightness(faviconUrl)
      setFaviconBrightness(brightness)
    }
    checkFavicon()
  }, [bookmark.url])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (e: MediaQueryListEvent) => setDarkMode(e.matches)

    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  const invertFavicon =
    (faviconBrightness === 'white' && !darkMode) ||
    (faviconBrightness === 'black' && darkMode)

  return (
    <li onDragOver={e => onDragOver(e, index)}>
      <a
        href={bookmark.url}
        data-type="bookmark-item"
        className={styles.bookmarkItem}
        draggable
        onDragStart={e => onDragStart(e, bookmark, index)}
        onDragEnd={onDragEnd}
        onDrop={e => onDrop(e, index)}
        onContextMenu={onContextMenu}
      >
        <div
          data-type="bookmark-icon"
          className={`${styles.bookmarkIcon} ${
            isDraggedOver ? styles.dragOver : ''
          }`}
        >
          <img
            src={getFavicon(bookmark.url)}
            alt="favicon"
            className={styles.faviconImage}
            style={{ filter: invertFavicon ? 'invert(1)' : 'none' }}
          />
        </div>
        <div className={styles.bookmarkTitle}>
          <p>{bookmark.title}</p>
        </div>
      </a>
      {showActions && <BookmarkActions onEdit={onEdit} onDelete={onDelete} />}
    </li>
  )
}

type BookmarkActionsProps = {
  onEdit: () => void
  onDelete: () => void
}

function BookmarkActions({ onEdit, onDelete }: BookmarkActionsProps) {
  return (
    <div className={styles.actions}>
      <Button variant="icon" onClick={onEdit}>
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
          <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
          <path d="M13.5 6.5l4 4" />
        </svg>
      </Button>
      <Button variant="icon" onClick={onDelete}>
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
          <path d="M18 6l-12 12" />
          <path d="M6 6l12 12" />
        </svg>
      </Button>
    </div>
  )
}
