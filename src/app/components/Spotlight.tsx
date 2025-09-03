import { ArrowRight, Command, ExternalLinkIcon, Link2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { copyToClipboard } from "@/app/utils/functions";
import { createLink } from "@/app/services/dashboardService";
import { CreateLinkResponse } from "@/app/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Spotlight({isOpen}: {isOpen: boolean}) {
    const [input, setInput] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [shortUrlData, setShortUrlData] = useState<CreateLinkResponse>()
    const [isSearching, setIsSearching] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [os, setOs] = useState<'mac' | 'windows' | 'linux' | 'mobile' | 'unknown'>('unknown');

    useEffect(() => {
        const detectOS = () => {
            if (typeof navigator === 'undefined') return 'unknown';
            
            const userAgent = navigator.userAgent.toLowerCase();
            const platform = navigator.platform?.toLowerCase() || '';
            
            // Detecta mobile primeiro
            if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
                return 'mobile';
            }
            
            // Detecta desktop OS
            if (platform.includes('mac') || userAgent.includes('mac')) {
                return 'mac';
            } else if (platform.includes('win') || userAgent.includes('windows')) {
                return 'windows';
            } else if (platform.includes('linux') || userAgent.includes('linux')) {
                return 'linux';
            }
            
            return 'unknown';
        };

        setOs(detectOS());
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsSearching(true);
        setShowResult(false);

        const link = await createLink(input)

        if (link.success && link.data) {
            setShortUrl(link.data?.shortUrl);
            setShortUrlData(link)
            setShowResult(true);
        }

        setIsSearching(false);
    };

    const resetDemo = () => {
        setInput('');
        setShortUrlData(undefined)
        setShowResult(false);
        setIsSearching(false);
    };

    return (
        <div className="flex flex-col items-center gap-3 justify-center flex-1 w-full relative">
            {/* Main Spotlight Container */}
            <div className="w-full bg-foreground rounded-3xl shadow-2xl border overflow-hidden">

                {/* Top Bar */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 bg-background rounded-full" />
                            <div className="w-3 h-3 bg-background rounded-full" />
                            <div className="w-3 h-3 bg-background rounded-full" />
                        </div>

                        <div className="text-sm text-background font-medium">Snip Spotlight</div>
                    </div>
                </div>

                {/* Search Area */}
                <div className="p-6 flex gap-5 w-full">
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="relative w-full h-14 flex items-center">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Command className="w-5 h-5" />
                            </div>

                            <input
                                type="text"
                                placeholder="Cole sua URL aqui..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full pl-12 pr-4 h-full bg-gray-50 rounded-2xl border-none outline-none text-black placeholder-gray-400 text-lg"
                                autoFocus
                            />
                        </div>
                    </form>

                    <Button className="h-14 aspect-video bg-background text-foreground">
                        <ArrowRight />
                    </Button>
                </div>

                {/* Results Area */}
                <div className="px-6 pb-6 min-h-[200px] flex w-full justify-center">

                    {/* Loading State */}
                    {isSearching && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl w-full justify-center">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                <Link2 className="w-4 h-4 text-white animate-pulse" />
                            </div>
                            <div>
                                <div className="text-black font-medium">Encurtando link...</div>
                                <div className="text-gray-500 text-sm">Processando sua URL</div>
                            </div>
                        </div>
                    )}

                    {/* Result */}
                    {showResult && shortUrlData && shortUrlData.data && (
                        <div className="flex flex-col gap-3 w-full">
                            <Link href={`/analytics/${shortUrlData.data?.shortCode}`} target="_blank">
                                <div className="flex items-center justify-between gap-3 p-4 bg-black rounded-2xl cursor-pointer hover:bg-gray-800 transition-colors">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                            <Link2 className="w-4 h-4 text-black" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="text-white font-medium">Link encurtado</div>
                                            <div className="text-gray-300 text-sm font-mono">{shortUrlData.data?.shortUrl}</div>
                                        </div>
                                    </div>

                                    <ExternalLinkIcon />
                                </div>
                            </Link>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => copyToClipboard(shortUrl)}
                                    className="flex-1 py-2 px-4 bg-background text-foreground hover:bg-foreground hover:text-background hover:border-2 hover:border-background rounded-xl text-sm font-medium transition-colors"
                                >
                                    Copiar

                                    <Link2 />
                                </Button>

                                <Button
                                    onClick={resetDemo}
                                    className="rounded-xl text-sm font-medium text-background bg-transparent hover:bg-background hover:text-foreground transition-colors border-2 border-background"
                                >
                                    Novo
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isSearching && !showResult && (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                                <Link2 className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="text-gray-500 text-sm">
                                Digite ou cole uma URL para encurtar
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Keyboard Hint */}
            {os !== 'mobile' && (
                <div className="">
                    <div className="flex items-center gap-2 text-white text-sm">
                        <kbd className="px-2 py-1 bg-white text-black rounded text-xs">
                            {os === 'mac' ? '⌘' : 'Ctrl'}
                        </kbd>
                        <kbd className="px-2 py-1 bg-white text-black rounded text-xs">K</kbd>
                        <span>para {isOpen ? "fechar" : "abrir"}</span>
                    </div>
                </div>
            )}
        </div>
    )
}
