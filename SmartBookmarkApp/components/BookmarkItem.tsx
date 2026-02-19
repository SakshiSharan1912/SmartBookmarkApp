'use client'

interface Bookmark {
  id: string
  title: string
  url: string
  created_at: string
}

interface BookmarkItemProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
}

export default function BookmarkItem({ bookmark, onDelete }: BookmarkItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 truncate">
            {bookmark.title}
          </h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm block truncate"
          >
            {getDomain(bookmark.url)}
          </a>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Added {formatDate(bookmark.created_at)}
          </p>
        </div>
        
        <div className="flex gap-2">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
          >
            Visit
          </a>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this bookmark?')) {
                onDelete(bookmark.id)
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
