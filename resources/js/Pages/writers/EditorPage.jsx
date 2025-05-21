import { CharacterNetwork } from "@/components/script-editor/CharacterNetwork"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SettingsDialog } from "@/components/settings-dialog"
import { ArrowLeft, Languages, User } from "lucide-react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSelector } from "react-redux"
import { selectcharacters } from "../../features/Characters"
import { EditorField } from "../../components/script-editor/EditingField"
import { CharacterRelationships } from "../../components/script-editor/CharacterRelationships"
import AiAssistantDialog from '@/components/aiassistancedialog'

import { Link, usePage, router } from "@inertiajs/react"

import { Link, usePage } from "@inertiajs/react"

export default function EditorPage({ script, user, scenecharacters, scenes }) {
    const [showNetworkView, setShowNetworkView] = useState(false)
    const [editorContent, setEditorContent] = useState("");
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [includeScriptContext, setIncludeScriptContext] = useState(true);

    const { props } = usePage();

    useEffect(() => {
        if (script && script.content) {
            setEditorContent(script.content);
        } else {
            setEditorContent("");
        }
    }, [script]);

    const handleEditorChange = (newContent) => {
        setEditorContent(newContent);
    };

    const characters = useSelector(selectcharacters)

    return (
        <div className="flex w-[100vw] px-8 min-h-screen">
            {characters.length > 0 && <CharacterRelationships />}

            <section className="flex px-8 flex-9 flex-col">
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-14 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={"/dashboard"}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => setShowNetworkView(!showNetworkView)}
                                >
                                    {showNetworkView ? "ስክሪፕት አሳይ" : "ግንኙነት ኔትወርክ አሳይ"}
                                </Button>
                                <ThemeToggle />
                                <SettingsDialog user={user} />
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <User className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 py-6 relative"> {/* Added 'relative' for positioning */}
                    <div className="container max-w-6xl">
                        {showNetworkView ? (
                            <Card className="h-[600px]">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">የገጸ ባህሪዎች ግንኙነት ኔትወርክ</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[540px]">
                                    <CharacterNetwork />
                                </CardContent>
                            </Card>
                        ) : (
                            <EditorField
                                value={editorContent}
                                onChange={handleEditorChange}
                                script={script}
                                scenecharacters={scenecharacters}
                                scenes={scenes}
                                user={user}
                            />
                        )}
                    </div>

                    <div className="fixed bottom-5 right-5 z-40">
                        <button
                            onClick={() => setIsAiOpen(true)}
                            className="bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition duration-200"
                        >
                            🤖 AI
                        </button>
                    </div>

                    {isAiOpen && (
                        <div className="fixed bottom-20 right-5 z-40 bg-white p-2 rounded shadow-md text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeScriptContext}
                                    onChange={(e) => setIncludeScriptContext(e.target.checked)}
                                    className="rounded text-purple-600"
                                />
                                <span>የስክሪፕቱን መረጃ ያካትቱ</span>
                            </label>
                        </div>
                    )}

                    <AiAssistantDialog
                        isOpen={isAiOpen}
                        onClose={() => setIsAiOpen(false)}
                        initialContext={
                            includeScriptContext
                                ? editorContent.substring(0, 2000)
                                : ''
                        }
                    />
                </main>
            </section>
        </div>
    )
}