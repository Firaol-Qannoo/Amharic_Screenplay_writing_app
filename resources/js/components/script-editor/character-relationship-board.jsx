import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, ChevronUp, Users } from "lucide-react"


const characters = [
  {
    id: "1",
    name: "አበበ",
    role: "ዋና ገጸ ባህሪ",
    description: "የታሪኩ ዋና ገጸ ባህሪ፣ 35 ዓመት፣ መምህር",
    relationships: [
      { to: "2", type: "ባል", description: "የአልማዝ ባል" },
      { to: "3", type: "አባት", description: "የሰላምን አባት" },
      { to: "5", type: "ወንድም", description: "የከበደ ወንድም" },
    ],
  },
  {
    id: "2",
    name: "አልማዝ",
    role: "ዋና ገጸ ባህሪ",
    description: "የአበበ ሚስት፣ 32 ዓመት፣ ነርስ",
    relationships: [
      { to: "1", type: "ሚስት", description: "የአበበ ሚስት" },
      { to: "3", type: "እናት", description: "የሰላም እናት" },
      { to: "4", type: "ጠላት", description: "ከፍቅርተ ጋር ግጭት አላት" },
    ],
  },
  {
    id: "3",
    name: "ሰላም",
    role: "ሁለተኛ ደረጃ ገጸ ባህሪ",
    description: "የአበበና አልማዝ ልጅ፣ 10 ዓመት፣ ተማሪ",
    relationships: [
      { to: "1", type: "ልጅ", description: "የአበበ ልጅ" },
      { to: "2", type: "ልጅ", description: "የአልማዝ ልጅ" },
    ],
  },
  {
    id: "4",
    name: "ፍቅርተ",
    role: "ተቃዋሚ",
    description: "የታሪኩ ተቃዋሚ፣ 40 ዓመት፣ የንግድ ባለቤት",
    relationships: [
      { to: "2", type: "ጠላት", description: "ከአልማዝ ጋር ግጭት አለው" },
      { to: "5", type: "ጓደኛ", description: "የከበደ ጓደኛ" },
    ],
  },
  {
    id: "5",
    name: "ከበደ",
    role: "ሁለተኛ ደረጃ ገጸ ባህሪ",
    description: "የአበበ ወንድም፣ 38 ዓመት፣ ነጋዴ",
    relationships: [
      { to: "1", type: "ወንድም", description: "የአበበ ወንድም" },
      { to: "4", type: "ጓደኛ", description: "የፍቅርተ ጓደኛ" },
    ],
  },
]

export function CharacterRelationshipBoard() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [expandedCharacter, setExpandedCharacter] = useState("1") 

  const getCharacterById = (id) => {
    return characters.find((char) => char.id === id)
  }

  const toggleCharacter = (id) => {
    setExpandedCharacter(expandedCharacter === id ? null : id)
  }

  return (
    <Card
      className={`fixed right-4 bottom-4 w-80 shadow-lg transition-all duration-300 ${isMinimized ? "h-12" : "max-h-[500px]"}`}
    >
      <CardHeader
        className="py-3 px-4 flex flex-row items-center justify-between space-y-0 bg-muted/50 cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <CardTitle className="text-sm">የገጸ ባህሪዎች ግንኙነት</CardTitle>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 overflow-auto max-h-[452px]">
          <div className="p-3 space-y-1">
            {characters.map((character) => (
              <div key={character.id} className="space-y-1">
                <div
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => toggleCharacter(character.id)}
                >
                  <div className="flex items-center gap-2">
                    {expandedCharacter === character.id ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{character.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{character.role}</span>
                </div>

                {expandedCharacter === character.id && (
                  <div className="ml-6 space-y-2 mb-2">
                    <p className="text-xs text-muted-foreground">{character.description}</p>

                    <div className="space-y-1 mt-2">
                      <h4 className="text-xs font-medium">ግንኙነቶች:</h4>
                      {character.relationships.map((rel) => {
                        const relatedChar = getCharacterById(rel.to)
                        return (
                          <div
                            key={rel.to}
                            className="flex items-center justify-between p-2 rounded-md border-l-2 border-primary/30 bg-muted/30 text-xs"
                          >
                            <div>
                              <span className="font-medium">{relatedChar?.name}</span>
                              <span className="mx-1">-</span>
                              <span className="text-muted-foreground">{rel.type}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleCharacter(rel.to)
                              }}
                            >
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

