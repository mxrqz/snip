'use client';

import { UserButton, useAuth, useUser } from '@clerk/nextjs';
import { useEffect } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../utils/firebase/firebase";
import { SnipLogoCompleta } from "./snip-logos";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  const { isLoaded } = useAuth();
  const { userId, getToken } = useAuth();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!userId || !isLoaded) return

    if (auth.currentUser && auth.currentUser.uid === userId) return

    const signIn = async () => {
      const token = await getToken({ template: 'integration_firebase' })
      if (!token) return

      try {
        await signInWithCustomToken(auth, token)
      } catch (e) {
        console.error("Erro ao logar no Firebase:", e)
      }
    }

    signIn()
  }, [userId, getToken, user, isLoaded])


  return (
    <header className="w-full border-b [border-image:linear-gradient(90deg,#fff0,#fff3_25%,#fff6_75%,#fff0)_1] flex py-4 sticky top-0 z-10 bg-background/30 backdrop-blur-sm px-10 md:px-0 standalone:pt-16">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">

        <div className="flex items-center">
          <SnipLogoCompleta className="fill-foreground h-8" />
        </div>

        <div className="flex items-center">
          {isSignedIn ? (
            <div className="flex gap-5">
              <Link href={"/dashboard"} >
                <Button className="bg-foreground text-background hover:text-background hover:bg-foreground">
                  Dashboard
                </Button>
              </Link>

              <UserButton />
            </div>
          ) : (
            <Link href={"/login"}>
              <Button className="bg-foreground text-background hover:text-background hover:bg-foreground">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}