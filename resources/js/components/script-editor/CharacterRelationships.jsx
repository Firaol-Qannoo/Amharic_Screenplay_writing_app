import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Users, X } from "lucide-react"
import { useSelector } from "react-redux"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"

import { charRelSchema } from "../../utils/validation/charrel"
import { charSchema } from "../../utils/validation/char"
import { addRelationship, selectcharacters } from "../../features/Characters"
import { relations } from "../../../../public/data/relations"
import { useTranslation } from "react-i18next";

export function CharacterRelationships() {
   const { t } = useTranslation();
  const characters = useSelector(selectcharacters)
const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(true)
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0])
  const [tobeRelate, settobeRelate] = useState("none")

  const getCharacterById = (id) => {
    return characters.find((char) => char.id === id)
  }

  useEffect(() => { })
 const { handleSubmit,setValue,reset, register,watch} = useForm({
      resolver: zodResolver(charRelSchema),
      mode: "onChange",
    });
    const { handleSubmit: updateHandler,setValue: updateSetValue,reset: updateReset, register: updateRegister} = useForm({
      resolver: zodResolver(charSchema),
      mode: "onChange",
    });


const [open, setopen] = useState(false)
const [openmain, setopenmain] = useState(false)
   const saveRelHandler = async (data) => { 
    setopen(open => !open)
    settobeRelate("none")
    reset()
    const mainChar = characters.find((ch) => ch.name === data.name)
    if (mainChar) {  
     
      setValue("toId", watch("toId"))
   
      await dispatch(addRelationship({...data, fromId: mainChar.id}))
      let rel = relations[data.type]
      console.log({...data, fromId: mainChar.id})
      console.log({type: rel.join(" / "),fromId: data.toId, toId: mainChar.id})
      await dispatch(addRelationship({type: rel.join(" / "), fromId: data.toId, toId: mainChar.id}))
    }

    setSelectedCharacter(mainChar)
   
   } 
   const [openchar, setopenchar] = useState(false)
   const saveCharHandler = async (data) => {
    updateReset()
    const mainChar = characters.find((ch) => ch.id === data.id)
    if (mainChar) {  
      console.log({id: data.id,updates: data}) 
      await dispatch(updateCharacter({id: data.id,updates: data}))
    }
    setSelectedCharacter(mainChar)
    setopenchar(open => !open)
   } 
   
      
   const selectOnChange = (value) => { 
    const relatedChar = characters.find((ch) => ch.name === value)
    if (relatedChar) { 
      setValue("toId", relatedChar.id); }
      settobeRelate(value)

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
            <h2 className="font-medium">{t("character_relationship_network.title")}</h2>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(!isOpen)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <Tabs defaultValue="tree" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tree">{t("character_relationship_network.tabs.tree")}</TabsTrigger>
              <TabsTrigger value="list">{t("character_relationship_network.tabs.list")}</TabsTrigger>
            </TabsList>
            <TabsContent value="tree" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">{selectedCharacter?.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xs text-muted-foreground mb-2">{selectedCharacter?.description}</p>

                  <div className="my-4 space-y-2">
                    <h4 className="text-xs font-medium">{t("character_relationship_network.count_relationships")}:</h4>
                    <div className="space-y-2">
                      {selectedCharacter?.relationships?.map((rel) => {
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
                
    <Dialog open={openmain} onOpenChange={setopenmain}>
      <DialogTrigger asChild>
       

      <Button>{t("character_relationship_network.edit_character_button")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("character_relationship_network.edit_character_button")}</DialogTitle>
       
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="w-full items-center gap-4">
          <div className="flex flex-col   gap-3 justify-between gp-2" >  {
         
          characters.map(ch=>{
           
              return  <div className="flex w-full justify-between px-10 items-center">
                {ch.name} 
                <Dialog open={open} onOpenChange={setopen}>
      <DialogTrigger asChild>
       

      <Button onClick={()=>setValue("name", ch.name)}>አስገባ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
       
        <div className=" py-4">
          <div className=" items-center gap-4">
          <div className="flex flex-col gp-2 " >  
        
          <Select   onValueChange={(value)=>selectOnChange(value)} >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="ከ ጋር አገናኝ" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel></SelectLabel>
          {
            characters.filter(cr=>cr.name!==watch("name")).map(c=>{
              return  <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
          })}
         
        
        </SelectGroup>
      </SelectContent>
    </Select>
  
    {tobeRelate !="none" &&  <div className="w-full  py-4">
       <div className="items-center  w-full flex flex-col gap-4">
        <div className="flex gap-2 items-center  text-nowrap" >{watch("name")} ለ {tobeRelate} <Input {...register("type")}></Input></div>
        <div className="flex gap-2 items-center  text-nowrap" >{t("character_relationship_network.relationship.description")}<Input {...register("description")}></Input></div>
     </div>
     </div>}
        
    
           </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit(saveRelHandler)}>{t("character_relationship_network.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
            
              </div>
             
                
          })
         }  </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={()=>setopenmain(p=>!p)} type="submit">{t("character_relationship_network.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  
                </CardContent>
              </Card>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">{t("character_relationship_network.all_relationships")}</span>
                </div>
              </div>

              <div className="space-y-2">
                {characters.map((char) => (
                  <Button
                    key={char.id}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {setSelectedCharacter(char)}}
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
                       <Dialog open={openchar} onOpenChange={setopenchar}>
                       <DialogTrigger asChild>
                        
                       <Card
                    key={char.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {updateSetValue("id", char.id); setSelectedCharacter(char)}}
                  >
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">{char.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <p className="text-xs text-muted-foreground">{char.description}</p>
                      <p className="text-xs font-medium mt-1">{char.role}</p>
                      <p className="text-xs text-muted-foreground mt-1">{char?.relationships?.length}{t("character_relationship_network.count_relationships")}</p>
                    </CardContent>
                  </Card>
                       </DialogTrigger>
                       <DialogContent className="sm:max-w-[425px]">
                        
                         <div className=" py-4">
                           <div className=" items-center gap-4">
                           <div className="flex flex-col gp-2 " >  
                     
                      <div className="w-full  py-4">
                        <div className="items-center  w-full flex flex-col gap-4">
                         <div className="flex gap-2 items-center  text-nowrap" >{t("character_relationship_network.fields.role")} <Input {...updateRegister("role")}></Input></div>
                         <div className="flex gap-2 items-center  text-nowrap" >{t("character_relationship_network.fields.description")}<Input {...updateRegister("description")}></Input></div>
                      </div>
                      </div>
                         
                     
                            </div>
                           </div>
                         </div>
                         <DialogFooter>
                           <Button type="submit" onClick={updateHandler(saveCharHandler)}>{t("character_relationship_network.save")}</Button>
                         </DialogFooter>
                       </DialogContent>
                     </Dialog>
                
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

