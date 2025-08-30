'use client';

import { UserButton, useAuth, useUser } from '@clerk/nextjs';
import { useEffect } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../utils/firebase/firebase";
import { SnipLogoCompleta } from "./snip-logos";

export function Header() {
  const { isLoaded } = useAuth();
  const { userId, getToken } = useAuth();
  const { user } = useUser();

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
    <header className="w-full border-b [border-image:linear-gradient(90deg,#fff0,#fff3_25%,#fff6_75%,#fff0)_1] px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        <div className="flex items-center">
          {/* <SnipLogoS className="fill-foreground size-8" /> */}
          <SnipLogoCompleta className="fill-foreground h-8" />
        </div>

        <div className="flex items-center">
          <UserButton />
        </div>
      </div>
    </header>
  );
}