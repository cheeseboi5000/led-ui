import { useState } from "react"
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

  // Initialize all LEDs off
  const [leds, setLeds] = useState(Array(total).fill(false))

  // @ts-ignore
  const toggleLed = (index) => {
    const newLeds = [...leds]
    newLeds[index] = !newLeds[index]
    setLeds(newLeds)
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
        {leds.map((led, i) => (
          <div
            key={i}
            onClick={() => toggleLed(i)}
            className="cursor-pointer"
            style={{
              width: "15px",
              height: "15px",
              backgroundColor: led ? "limegreen" : "black",
              border: "1px solid #222",
            }}
          />
        ))}
      </div>
      <button onClick={() => saveLeds(leds)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Save JSON
      </button>
    </div>
  )
}
