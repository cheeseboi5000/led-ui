import { useState, useEffect } from "react"
// Import the functions you need from the SDKs you need
import { ref, set } from "firebase/database"
import { db } from "./firebase"

// @ts-ignore
function saveLeds(ledArray) {
  set(ref(db, "leds"), ledArray)
}

export default function App() {
  const numRows = 5 // adjust for your layout
  const numCols = 5 // 40x50 = 2000 LEDs
  const total = numRows * numCols
  const [isMouseDown, setIsMouseDown] = useState(false)

  // Handle mouse down event
  const handleMouseDown = () => {
    setIsMouseDown(true)
    console.log("Mouse button is down!")
  }

  // Handle mouse up event
  const handleMouseUp = () => {
    setIsMouseDown(false)
    console.log("Mouse button is up!")
  }

  // Attach event listeners to the document to capture mouse events globally
  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)

    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  // Initialize all LEDs off
  const [leds, setLeds] = useState(Array(total * 3).fill(0))
  const [color, setColor] = useState("#ff0000")

  // @ts-ignore
  const toggleLed = (index) => {
    if (isMouseDown) {
      const newLeds = [...leds]
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)
      newLeds[index] = r
      newLeds[index + 1] = g
      newLeds[index + 2] = b
      setLeds(newLeds)
    }
  }
  // @ts-ignore
  const handleChange = (event) => {
    setColor(event.target.value)

    console.log(event.target.value)
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">LED Grid Editor</h1>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${numCols}, 15px)`,
        }}
      >
        <input type="color" value={color} onChange={handleChange} />

        {leds.map((led, i) =>
          i % 3 == 0 ? (
            <div
              key={i}
              onMouseMove={() => toggleLed(i)}
              className="cursor-pointer node"
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: leds[i] ? `rgb(${leds[i]},${leds[i + 1]},${leds[i + 2]})` : "black",
                border: "1px solid #222",
              }}
            ></div>
          ) : (
            <></>
          )
        )}
      </div>
      <button onClick={() => saveLeds(leds)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Save JSON
      </button>
    </div>
  )
}
