import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { router } from '@inertiajs/react';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  Copy,
  FileText,
  FilePlus,
  FileUp,
  Grid,
  Languages,
  LayoutTemplate,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  User,
  Share,
} from "lucide-react";
import { ScheduleList } from "./schedule-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsDialog } from "@/components/settings-dialog";
// import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllRecentScripts } from "../../../features/recentScripts";
import { selectAllscripts } from "../../../features/scriptsSlice";
import { CreateDialog } from "../../../components/create-dialog";

const templateCategories = [
  {
    name: "Film",
    templates: [
      {
        id: "f1",
        name: "film script Template",
        description: "Gives standard layout of sample script for film.",
      },
    ],
  },
  {
    name: "Theatre",
    templates: [
      {
        id: "f1",
        name: "theatre script Template",
        description: "Gives standard layout of sample script for theatre.",
      },
    ],
  },
];

export default function Dashboard() {
  // const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("recent");

  const recentScripts = useSelector(selectAllRecentScripts);
  const scripts = useSelector(selectAllscripts);

  const filteredScripts = scripts.filter(
    (script) =>
      script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const recentFilteredScripts = recentScripts.filter(
    (script) =>
      script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  let Film = scripts?.filter((s) => {
    s.category == "Film";
  });
  let Theatre = scripts?.filter((s) => {
    s.category == "Theatre";
  });
  const handleImport = () => {
 
  };

  const handleStoryboard = () => {};

  return (
    <div className="flex min-h-screen w-[100vw] px-10 flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Amharic Screenplay Tool</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm mr-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search scripts..."
                className="w-full bg-background pl-8 md:w-[300px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ThemeToggle />
            <SettingsDialog />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span onClick={() => router.post('/logout')} >Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-bold tracking-tight">
                Your Scripts
              </h1>
              <div className="flex flex-wrap gap-2">
                <CreateDialog />
             
                <Button variant="outline" onClick={() => {}}>
                  <LayoutTemplate className="mr-2 h-4 w-4" />
                  Templates
                </Button>
                <Button variant="outline" className="cursor-pointer relative" onClick={handleImport}>
                  <input type="file" className="absolute top-0 cursor-pointer border-0 opacity-0 z-50 w-full h-full" name="" id="" />
                  <FileUp className="mr-2 cursor-pointer  h-4 w-4" />
                  Import
                </Button>
                <Button variant="outline" onClick={handleStoryboard}>
                  <Grid className="mr-2 h-4 w-4" />
                  Storyboard
                </Button>
               
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Tabs
                  defaultValue="recent"
                  value={selectedTab}
                  onValueChange={setSelectedTab}
                >
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="recent">Recent</TabsTrigger>
                      <TabsTrigger value="all">All Scripts</TabsTrigger>
                      <TabsTrigger value="templates">Templates</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="recent" className="mt-6">
                    {recentFilteredScripts.length === 0 ? (
                      <div className="flex h-[450px] flex-col items-center justify-center rounded-lg border border-dashed">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">
                          No scripts found
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {searchQuery
                            ? "Try a different search term"
                            : "Create a new script to get started"}
                        </p>
                        <Button  className="mt-4" onClick={() => {}}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Script
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {recentFilteredScripts.map((script) => (
                          <Card
                            key={script.id}
                            onClick={() => href="/editor"}
                            className="overflow-hidden"
                          >
                            <div className="aspect-video relative">
                              <img
                                src={script.thumbnail || "/placeholder.svg"}
                                alt={script.title}
                                fill
                                className="object-cover object-center h-60 w-full"
                              />
                              <div className="absolute top-2 right-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 bg-black/20 backdrop-blur-sm hover:bg-black/30"
                                    >
                                      <MoreVertical className="h-4 w-4 text-white" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Share className="mr-2 h-4 w-4" />
                                      <span>Invite collaborators</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      <span>Delete</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <CardHeader className="p-4">
                              <CardTitle className="line-clamp-1">
                                {script.title}
                              </CardTitle>
                              <CardDescription className="line-clamp-2">
                                {script.description}
                              </CardDescription>
                            </CardHeader>
                            <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                <span>{script.lastEdited}</span>
                              </div>
                              <div className="flex items-center">
                                <BookOpen className="mr-1 h-3 w-3" />
                                <span>{script.pages} pages</span>
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="all" className="mt-6">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredScripts.map((script) => (
                        <Card
                          key={script.id}
                          onClick={() => href="/editor"}
                          className="overflow-hidden"
                        >
                          <div className=" w-full relative">
                            <img
                              src={script.thumbnail || "/placeholder.svg"}
                              alt={script.title}
                              fill
                              className="object-cover object-center h-60 w-full"
                            />
                          </div>
                          <CardHeader className="p-4">
                            <CardTitle className="line-clamp-1">
                              {script.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {script.description}
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>{script.lastEdited}</span>
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="mr-1 h-3 w-3" />
                              <span>{script.pages} pages</span>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="templates" className="mt-6">
                    <div className="space-y-8">
                      {templateCategories.map((category) => (
                        <div key={category.name} className="space-y-4">
                          <h3 className="text-lg font-medium">
                            {category.name}
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {category.templates.map((template) => (
                              <Card
                                key={template.id}
                                className="cursor-pointer hover:bg-muted/50"
                              >
                                <CardHeader>
                                  <CardTitle className="text-base">
                                    {template.name}
                                  </CardTitle>
                                  <CardDescription>
                                    {template.description}
                                  </CardDescription>
                                </CardHeader>
                                <CardFooter>
                                  <Button variant="outline" size="sm">
                                    Use Template
                                  </Button>
                                </CardFooter>
                              </Card>
                              
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="md:col-span-1">
                <ScheduleList />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
