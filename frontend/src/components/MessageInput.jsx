import { useState, useRef } from "react"
import { useChatStore } from "../store/useChatStore"

const MessageInput = () => {
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const { sendMessage } = useChatStore()

  // Khi chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result) 
      }
      reader.readAsDataURL(file)
    }
  }

  // Xoá ảnh đã chọn
  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = null
    }
  }

  // Gửi tin nhắn
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() && !imagePreview) return 

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      })
      // Reset sau khi gửi
      setText("")
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = null
      }
    } catch (error) {
      console.error("Send message failed:", error)
    }
  }

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex items-center gap-2 p-2 border-t"
    >
      {/* Input text */}
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded px-3 py-2"
      />

      {/* Input file hidden */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Button chọn ảnh */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-3 py-2 bg-gray-200 rounded"
      >
        📷
      </button>

      {/* Nút gửi */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Send
      </button>

      {/* Preview ảnh */}
      {imagePreview && (
        <div className="absolute bottom-16 left-2 bg-white p-2 border rounded shadow">
          <img
            src={imagePreview}
            alt="preview"
            className="max-w-[200px] max-h-[200px] object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="block mt-1 text-sm text-red-500"
          >
            Remove
          </button>
        </div>
      )}
    </form>
  )
}

export default MessageInput
