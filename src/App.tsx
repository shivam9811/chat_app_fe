import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')
    setSocket(ws)
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data])
    }
    ws.onopen = ()=>{
      ws.send(JSON.stringify({
        type: "connect",
        payload:{
          roomId:"red"
        }
      }))
    }
    return ()=>{
      ws.close();
    }
  }, [])
 
  const sendMessage = () => {
    if (socket && input.trim()) {
      socket.send(JSON.stringify({
        type:"chat",
        payload:{
          message:input
        }
      }))
      setInput("") // clear after send
    }
  }

  return (
    <div className="h-screen bg-black flex flex-col justify-between">
      <div className="flex-1 overflow-y-auto pt-2 pb-2 pl-4 pr-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index}>
            <span className="bg-white text-black rounded p-4 inline-block max-w-md break-words">
              {message}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full flex p-4 gap-2">
        <input
          type="text"
          className="flex-1 p-4 rounded border border-gray-300 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
        />
        <button
          className="bg-purple-600 rounded px-6 py-2 text-white hover:bg-purple-700"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default App
