import React, { useState, useEffect } from "react";
import { router, usePage } from '@inertiajs/react';
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
    DropdownMenuLabel, // Import DropdownMenuLabel
    DropdownMenuSeparator, // Import DropdownMenuSeparator
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BookOpen,
    Calendar,
    FileText,
    FileUp,
    Grid,
    LayoutTemplate,
    MoreVertical,
    Search,
    Trash2,
    User,
} from "lucide-react";
import { ScheduleList } from "./schedule-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsDialog } from "@/components/settings-dialog";
import { CreateDialog } from "@/components/create-dialog";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { InviteCollaboratorDialog } from "@/components/invite-collaborator-dialog";
import { ScriptDetailsDialog } from "@/components/script-detail-dialog";
import { CollaboratorsListDialog } from "@/components/collaborators-list.jsx";
import { Button } from "@/components/ui/button"; // Ensure Button is imported  CollaboratorsListDialog 
import flasher from '@flasher/flasher'
import { UpdateScript } from "@/components/update-script";

dayjs.extend(relativeTime);

export function getRelativeDate(dateString) {
    const now = dayjs();
    const date = dayjs(dateString);

    const diffInDays = now.diff(date, 'day');

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
}

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
                id: "t1",
                name: "theatre script Template",
                description: "Gives standard layout of sample script for theatre.",
            },
        ],
    },
];

export default function Dashboard({ myScripts, invitedScripts, user}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTab, setSelectedTab] = useState("recent");
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

//     const { flash } = usePage().props;

//    useEffect(() => {
//         if (flash && flash.error) {
//             toast.error(flash.error);
//         }
//         if (flash && flash.success) {
//             toast.success(flash.success);
//         }
//     }, [flash]);


 // State to track theme mode: true = dark, false = light
 const [isDarkMode, setIsDarkMode] = useState(false);

useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode and save preference
  function toggleDarkMode() {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  }

        const { messages } = usePage().props;

        useEffect(() => {
        if (messages) {
            flasher.render(messages);
        }
        }, [messages]);
                
        console.log(messages);


    const filteredMyScripts = myScripts?.filter((script) =>
        script.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredInvitedScripts = invitedScripts?.filter((script) =>
        script.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

 const handleImport = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const json = JSON.parse(event.target.result);

      router.post('/import-script', {
        data: json,
      }, {
        onSuccess: () => {
          alert('Script imported successfully!');
        },
        onError: (errors) => {
          console.error('Import error:', errors);
          alert('Failed to import script.');
        }
      });
    } catch (error) {
      console.error('Error parsing JSON file:', error);
      alert('Invalid JSON file');
    }
  };

  reader.readAsText(file); 
};


    return (
        <div className="relative">
           
            {/* Success message popup at the top center
            {showSuccess && successMessage && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 p-4 bg-green-500 text-white rounded-lg shadow-lg z-100">
                    <p>{successMessage}</p>
                </div>
            )}
            {flash && flash.error && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 p-4 bg-red-500 text-white rounded-lg shadow-lg z-100">
                    {flash.error}
                </div>
            )} */}
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
                             {/* Dark/Light Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Dark Mode"
              className="rounded-md border p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? (
                // Sun icon for light mode
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07 5.07l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7M12 7a5 5 0 100 10 5 5 0 000-10z"
                  />
                </svg>
              ) : (
                // Moon icon for dark mode
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="none"
                >
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              )}
            </button>
                            <SettingsDialog user={user} />
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
                                    <DropdownMenuItem onClick={() => router.post('/logout')}>
                                        <span>Log out</span>
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
                                    <Button variant="outline" className="cursor-pointer relative" >
                                        <input type="file" onChange={handleImport} className="absolute top-0 cursor-pointer border-0 opacity-0 z-50 w-full h-full" name="" id="" />
                                        <FileUp className="mr-2 cursor-pointer  h-4 w-4" />
                                        Import
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="md:col-span-2">
                                    <Tabs defaultValue="recent" value={selectedTab} onValueChange={setSelectedTab}>
                                        <div className="flex items-center justify-between">
                                        <TabsList>
                                            <TabsTrigger value="recent">Recent</TabsTrigger>
                                            <TabsTrigger value="all">All Scripts</TabsTrigger>
                                            <TabsTrigger value="templates">Templates</TabsTrigger>
                                            <TabsTrigger value="invite">Invited</TabsTrigger>
                                            </TabsList>
                                            </div>

                                            {/* RECENT TAB: My Scripts Only */}
                                            <TabsContent value="recent" className="mt-6">
                                            {/* <div className="mt-2 py-4 border-b border-muted">
                                                <h2 className="text-xl font-semibold tracking-tight text-foreground">My Scripts</h2>
                                            </div> */}

                                            {filteredMyScripts?.length === 0 ? (
                                                <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                                                <FileText className="h-10 w-10 text-muted-foreground" />
                                                <h3 className="mt-4 text-lg font-medium">No scripts found</h3>
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    {searchQuery ? "Try a different search term" : "Create a new script to get started"}
                                                </p>
                                                <div className="mt-4">
                                                    <CreateDialog />
                                                </div>
                                                </div>
                                            ) : (
                                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                {filteredMyScripts.map((script) => (
                                                    <Card key={script.id} className="overflow-hidden">
                                                    <div className="aspect-video relative">
                                                        <img
                                                        src={`/${script.thumbnail}`}
                                                        alt={script.title}
                                                        fill
                                                        className="object-cover object-center h-60 w-full"
                                                        />
                                                        <div className="absolute top-2 right-2">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 backdrop-blur-sm hover:bg-black/30">
                                                                <MoreVertical className="h-4 w-4 text-white" />
                                                            </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                            <InviteCollaboratorDialog scriptId={script.id} />
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                if (window.confirm('Are you sure you want to delete this script?')) {
                                                                    router.delete(`/delete-script/${script.id}`)
                                                                    .then(() => {
                                                                        console.log('Script deleted successfully');
                                                                        router.visit(window.location.pathname, {
                                                                        preserveScroll: true,
                                                                        replace: true,
                                                                        });
                                                                    })
                                                                    .catch((error) => {
                                                                        console.error('Error deleting script:', error);
                                                                    });
                                                                }
                                                                }}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                <span>Delete</span>
                                                            </DropdownMenuItem>
                                                            
                                                            <CollaboratorsListDialog collaborators={script.collaborators_full} script={script}/>
                                                            
                                                            <UpdateScript script={script}/>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        </div>
                                                    </div>
                                                    <CardHeader className="p-4">
                                                        <CardTitle
                                                        className="line-clamp-1 cursor-pointer"
                                                        onClick={() => (window.location.href = `/editor/${script.id}`)}
                                                        >
                                                        {script.title}
                                                        </CardTitle>
                                                        <CardDescription className="line-clamp-2">{script.description}</CardDescription>
                                                    </CardHeader>
                                                    <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                                                        <div className="flex items-center">
                                                        <Calendar className="mr-1 h-3 w-3" />
                                                        <span>{getRelativeDate(script.created_at)}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                        <BookOpen className="mr-1 h-3 w-3" />
                                                        <span>{script.pages || '1 Pages'}</span>
                                                        </div>
                                                    </CardFooter>
                                                    </Card>
                                                ))}
                                                </div>
                                            )}
                                            </TabsContent>

                                            {/* INVITED TAB */}
                                            <TabsContent value="invite" className="mt-6">
                                            {/* <div className="mt-2 py-4 border-b border-muted">
                                                <h2 className="text-xl font-semibold tracking-tight text-foreground">Scripts I'm Invited To</h2>
                                            </div> */}

                                            {invitedScripts?.length === 0 ? (
                                                <p className="text-muted-foreground mt-4">You haven’t been invited to any scripts yet.</p>
                                            ) : (
                                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                {invitedScripts.map((script) => (
                                                    <Card key={script.id} className="overflow-hidden">
                                                    <div className="aspect-video relative">
                                                        <img
                                                        src={`/${script.thumbnail}`}
                                                        alt={script.title}
                                                        fill
                                                        className="object-cover object-center h-60 w-full"
                                                        />
                                                        <div className="absolute top-2 right-2">
                                                        <ScriptDetailsDialog script={script} />
                                                        </div>
                                                    </div>
                                                    <CardHeader className="p-4">
                                                        <CardTitle
                                                        className="line-clamp-1 cursor-pointer"
                                                        onClick={() => (window.location.href = `/editor/${script.id}`)}
                                                        >
                                                        {script.title}
                                                        </CardTitle>
                                                        <CardDescription className="line-clamp-2">{script.description}</CardDescription>
                                                    </CardHeader>
                                                    <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                                                        <div className="flex items-center">
                                                        <Calendar className="mr-1 h-3 w-3" />
                                                        <span>{getRelativeDate(script.created_at)}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                        <BookOpen className="mr-1 h-3 w-3" />
                                                        <span>{script.pages || '23 Pages'} pages</span>
                                                        </div>
                                                    </CardFooter>
                                                    </Card>
                                                ))}
                                                </div>
                                            )}
                                            </TabsContent>

                                        <TabsContent value="all" className="mt-6">
                                        {/* <div className="mt-2 py-4 border-b border-muted">
                                        <h2 className="text-xl font-semibold tracking-tight text-foreground">My Scripts</h2>
                                    </div> */}

                                    {filteredMyScripts?.length === 0 ? (
                                        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                                        <FileText className="h-10 w-10 text-muted-foreground" />
                                        <h3 className="mt-4 text-lg font-medium">No scripts found</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {searchQuery ? "Try a different search term" : "Create a new script to get started"}
                                        </p>
                                        <div className="mt-4">
                                            <CreateDialog />
                                        </div>
                                        </div>
                                    ) : (
                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {filteredMyScripts.map((script) => (
                                            <Card key={script.id} className="overflow-hidden">
                                            <div className="aspect-video relative">
                                                <img
                                                src={`/${script.thumbnail}`}
                                                alt={script.title}
                                                fill
                                                className="object-cover object-center h-60 w-full"
                                                />
                                                <div className="absolute top-2 right-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 backdrop-blur-sm hover:bg-black/30">
                                                        <MoreVertical className="h-4 w-4 text-white" />
                                                    </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                    <InviteCollaboratorDialog scriptId={script.id} />
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this script?')) {
                                                            router.delete(`/delete/${script._id}`)
                                                            .then(() => {
                                                                console.log('Script deleted successfully');
                                                                router.visit(window.location.pathname, {
                                                                preserveScroll: true,
                                                                replace: true,
                                                                });
                                                            })
                                                            .catch((error) => {
                                                                console.error('Error deleting script:', error);
                                                            });
                                                        }
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                    <CollaboratorsListDialog collaborators={script.collaborators} />
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                </div>
                                            </div>
                                            <CardHeader className="p-4">
                                                <CardTitle
                                                className="line-clamp-1 cursor-pointer"
                                                onClick={() => (window.location.href = `/editor/${script.id}`)}
                                                >
                                                {script.title}
                                                </CardTitle>
                                                <CardDescription className="line-clamp-2">{script.description}</CardDescription>
                                            </CardHeader>
                                            <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                <span>{getRelativeDate(script.created_at)}</span>
                                                </div>
                                                <div className="flex items-center">
                                                <BookOpen className="mr-1 h-3 w-3" />
                                                <span>{script.pages || '23 Pages'} pages</span>
                                                </div>
                                            </CardFooter>
                                            </Card>
                                        ))}
                                        </div>
                                    )}
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
                            {/* <div className="md:col-span-1">
                                <ScheduleList />
                            </div> */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
        </div>
    );
}