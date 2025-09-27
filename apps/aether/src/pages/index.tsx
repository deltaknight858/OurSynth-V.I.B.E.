
import Head from "next/head";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <>
      <Head>
        <title>Login - Aether</title>
        <meta name="description" content="Login to your Aether account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="flex min-h-screen items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome to Aether
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
