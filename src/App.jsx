import { useState, useEffect } from "react"
// Import the functions you need from the SDKs you need
import { ref, set } from "firebase/database"
import { db } from "./firebase"

// @ts-ignore
function saveLeds(ledArray, numRows, numCols) {
  ledArray.push(numRows)
  ledArray.push(numCols)
  set(ref(db, "leds"), ledArray)
}
// @ts-ignore

export default function App() {
  const [numRows, setNumRows] = useState(2) // adjust for your layout
  const [numCols, setNumCols] = useState(2) // 40x50 = 2000 LEDs
  const [total, setTotal] = useState(numRows * numCols)
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
  const [leds, setLeds] = useState(Array(total * 3).fill(0))

  useEffect(() => {
    fetch("https://led-ui-f781b-default-rtdb.firebaseio.com/leds.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json() // Parse the JSON from the response body
      })
      .then((data) => {
        setLeds(data.slice(0, -2)) // Use the parsed JSON data
        setNumRows(data[data.length - 2])
        setNumCols(data[data.length - 1])
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error)
      })
  }, [])
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
  const handleColorChange = (event) => {
    setColor(event.target.value)

    console.log(event.target.value)
  }

  // @ts-ignore
  const handleDimensionChange = (event) => {
    const value = parseInt(event.target.value) || 1
    if (event.target.id === "rowsAmount") setNumRows(value)
    else if (event.target.id === "colsAmount") setNumCols(value)
  }

  useEffect(() => {
    const newTotal = numRows * numCols
    setTotal(newTotal)
    setLeds(Array(newTotal * 3).fill(0))
  }, [numRows, numCols])

  return (
    <div className="p-4">
      <input onChange={handleDimensionChange} id="rowsAmount" type="number" placeholder="number of rows" />
      <input onChange={handleDimensionChange} id="colsAmount" type="number" placeholder="number of columns" />

      <h1 className="text-xl font-bold mb-4">LED Grid Editor</h1>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${numCols}, 15px)`,
        }}
      >
        <input type="color" value={color} onChange={handleColorChange} />

        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numCols}, 15px)`, // numCols wide
            gridTemplateRows: `repeat(${numRows}, 15px)`, // numRows tall
            // gap: "1px", // optional spacing between cells
          }}
        >
          {leds.map((led, i) =>
            i % 3 === 0 ? (
              <div
                key={i}
                onMouseMove={() => toggleLed(i)}
                className="cursor-pointer node"
                style={{
                  width: "15px",
                  height: "15px",
                  backgroundColor: leds[i] ? `rgb(${leds[i]}, ${leds[i + 1]}, ${leds[i + 2]})` : "black",
                  border: "1px solid #222",
                }}
              />
            ) : null
          )}
        </div>
      </div>
      <button onClick={() => saveLeds(leds, numRows, numCols)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Save JSON
      </button>
    </div>
  )
}
