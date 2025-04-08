import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Users, X } from "lucide-react"


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

export function CharacterRelationships() {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0])

  const getCharacterById = (id) => {
    return characters.find((char) => char.id === id)
  }

  return (
    <>
      
      <div
        className={`h-full w-[320px] bg-background border-r shadow-lg transition-transform duration-300 z-40 ${
          isOpen ? "flex-3" : "hidden"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <h2 className="font-medium">የገጸ ባህሪዎች ግንኙነት</h2>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(!isOpen)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <Tabs defaultValue="tree" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tree">ግንኙነት ዛፍ</TabsTrigger>
              <TabsTrigger value="list">ገጸ ባህሪዎች</TabsTrigger>
            </TabsList>
            <TabsContent value="tree" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">{selectedCharacter.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xs text-muted-foreground mb-2">{selectedCharacter.description}</p>

                  <div className="mt-4 space-y-2">
                    <h4 className="text-xs font-medium">ግንኙነቶች:</h4>
                    <div className="space-y-2">
                      {selectedCharacter.relationships.map((rel) => {
                        const relatedChar = getCharacterById(rel.to)
                        return (
                          <div
                            key={rel.to}
                            className="flex items-center justify-between rounded-md border p-2 cursor-pointer hover:bg-muted"
                            onClick={() => relatedChar && setSelectedCharacter(relatedChar)}
                          >
                            <div>
                              <p className="text-sm font-medium">{relatedChar?.name}</p>
                              <p className="text-xs text-muted-foreground">{rel.type}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ሁሉም ግንኙነቶች</span>
                </div>
              </div>

              <div className="space-y-2">
                {characters.map((char) => (
                  <Button
                    key={char.id}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => setSelectedCharacter(char)}
                  >
                    <div>
                      <p className="font-medium">{char.name}</p>
                      <p className="text-xs text-muted-foreground">{char.role}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="list" className="mt-4">
              <div className="space-y-2">
                {characters.map((char) => (
                  <Card
                    key={char.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedCharacter(char)}
                  >
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">{char.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <p className="text-xs text-muted-foreground">{char.description}</p>
                      <p className="text-xs font-medium mt-1">{char.role}</p>
                      <p className="text-xs text-muted-foreground mt-1">{char.relationships.length} ግንኙነቶች</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className={`${isOpen ? "hidden": "block my-4"}`} onClick={()=>setIsOpen(!isOpen)}>
      <Users className="h-5 w-5" />
      </div>
    </>
  )
}

