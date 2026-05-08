import { useRef, useState } from 'react'
import { SiteBookmark } from './useBookmarks'

export function useDragAndDrop(
  onReorder: (draggedItem: SiteBookmark, targetIndex: number) => void,
) {
  const draggedItemRef = useRef<SiteBookmark | null>(null)
  const draggedIndexRef = useRef<number | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (
    e: React.DragEvent,
    item: SiteBookmark,
    index: number,
  ) => {
    draggedItemRef.current = item
    draggedIndexRef.current = index
    setDraggedIndex(index)

    const icon = (e.currentTarget as HTMLElement).querySelector(
      '[data-type="bookmark-icon"]',
    ) as HTMLElement | null
    if (icon) e.dataTransfer.setDragImage(icon, 32, 32)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    const draggedItem = draggedItemRef.current
    const fromIndex = draggedIndexRef.current
    if (draggedItem && fromIndex !== null && fromIndex !== targetIndex) {
      onReorder(draggedItem, targetIndex)
    }
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    draggedItemRef.current = null
    draggedIndexRef.current = null
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedIndex,
    dragOverIndex,
  }
}
