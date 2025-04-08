import { useEffect, useRef } from "react"


const characters = [
  {
    id: "1",
    name: "አበበ",
    role: "ዋና ገጸ ባህሪ",
    relationships: [
      { to: "2", type: "ባል", strength: 5 },
      { to: "3", type: "አባት", strength: 4 },
      { to: "5", type: "ወንድም", strength: 3 },
    ],
  },
  {
    id: "2",
    name: "አልማዝ",
    role: "ዋና ገጸ ባህሪ",
    relationships: [
      { to: "1", type: "ሚስት", strength: 5 },
      { to: "3", type: "እናት", strength: 4 },
      { to: "4", type: "ጠላት", strength: 2 },
    ],
  },
  {
    id: "3",
    name: "ሰላም",
    role: "ሁለተኛ ደረጃ ገጸ ባህሪ",
    relationships: [
      { to: "1", type: "ልጅ", strength: 4 },
      { to: "2", type: "ልጅ", strength: 4 },
    ],
  },
  {
    id: "4",
    name: "ፍቅርተ",
    role: "ተቃዋሚ",
    relationships: [
      { to: "2", type: "ጠላት", strength: 2 },
      { to: "5", type: "ጓደኛ", strength: 3 },
    ],
  },
  {
    id: "5",
    name: "ከበደ",
    role: "ሁለተኛ ደረጃ ገጸ ባህሪ",
    relationships: [
      { to: "1", type: "ወንድም", strength: 3 },
      { to: "4", type: "ጓደኛ", strength: 3 },
    ],
  },
]

export function CharacterNetwork() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    
    const setCanvasDimensions = () => {
      const parent = canvas.parentElement
      if (!parent) return

      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    
    const nodePositions = {}
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.7

    
    nodePositions["1"] = { x: centerX, y: centerY }

    
    const otherCharacters = characters.filter((char) => char.id !== "1")
    otherCharacters.forEach((char, index) => {
      const angle = (index / otherCharacters.length) * Math.PI * 2
      nodePositions[char.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    
    const drawNetwork = () => {
      if (!ctx) return

      
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      
      characters.forEach((char) => {
        const fromPos = nodePositions[char.id]

        char.relationships.forEach((rel) => {
          const toPos = nodePositions[rel.to]
          if (!fromPos || !toPos) return

          
          ctx.beginPath()
          ctx.moveTo(fromPos.x, fromPos.y)
          ctx.lineTo(toPos.x, toPos.y)

          
          const lineWidth = rel.strength * 0.5
          ctx.lineWidth = lineWidth

          
          let strokeStyle = "#888888"
          if (
            rel.type === "ባል" ||
            rel.type === "ሚስት" ||
            rel.type === "አባት" ||
            rel.type === "እናት" ||
            rel.type === "ልጅ"
          ) {
            strokeStyle = "#4f46e5" 
          } else if (rel.type === "ጓደኛ") {
            strokeStyle = "#22c55e" 
          } else if (rel.type === "ጠላት") {
            strokeStyle = "#ef4444" 
          } else if (rel.type === "ወንድም") {
            strokeStyle = "#3b82f6" 
          }

          ctx.strokeStyle = strokeStyle
          ctx.stroke()

          
          const midX = (fromPos.x + toPos.x) / 2
          const midY = (fromPos.y + toPos.y) / 2

          ctx.fillStyle = "#ffffff"
          ctx.fillRect(midX - 15, midY - 10, 30, 20)

          ctx.font = "10px Arial"
          ctx.fillStyle = strokeStyle
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(rel.type, midX, midY)
        })
      })

      
      characters.forEach((char) => {
        const pos = nodePositions[char.id]
        if (!pos) return

        
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2)

        
        let fillStyle = "#64748b" 
        if (char.role === "ዋና ገጸ ባህሪ") {
          fillStyle = "#4f46e5" 
        } else if (char.role === "ተቃዋሚ") {
          fillStyle = "#ef4444" 
        } else if (char.role === "ሁለተኛ ደረጃ ገጸ ባህሪ") {
          fillStyle = "#3b82f6" 
        }

        ctx.fillStyle = fillStyle
        ctx.fill()

        
        ctx.font = "bold 12px Arial"
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(char.name, pos.x, pos.y)
      })
    }

    drawNetwork()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

