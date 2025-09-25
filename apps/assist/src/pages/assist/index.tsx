import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ChatPanel from "@/components/chat/ChatPanel";
import CodebotPanel from "@/components/codebot/CodebotPanel";
import { Button } from "@/components/ui/button";
// Update the import path below to the correct location of AppShell, for example:
import { AppShell } from "../../../shell/src/Appshell";
// If AppShell is not present, create the file or adjust the path accordingly.

export default function AssistMainPage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [chatSidePanel, setChatSidePanel] = useState(false);

  return (
    <AppShell>
      <div className="flex flex-col h-full w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex gap-2 border-b bg-background px-4 py-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="codebot">Codebot</TabsTrigger>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => setChatSidePanel((v) => !v)}
            >
              {chatSidePanel ? "Main Panel" : "Chat Side Panel"}
            </Button>
          </TabsList>
          <div className="flex flex-1 h-full">
            {chatSidePanel ? (
              <>
                <div className="flex-1 p-4">
                  {activeTab === "codebot" && <CodebotPanel />}
                  {activeTab === "chat" && (
                    <Card className="flex items-center justify-center h-full text-muted-foreground">
                      Select Codebot to use main area, or switch back to Chat.
                    </Card>
                  )}
                </div>
                <div className="w-[400px] border-l bg-background p-4">
                  <ChatPanel />
                </div>
              </>
            ) : (
              <div className="flex-1 p-4">
                {activeTab === "chat" && <ChatPanel />}
                {activeTab === "codebot" && <CodebotPanel />}
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </AppShell>
  );
}
