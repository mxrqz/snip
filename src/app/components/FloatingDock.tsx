// import { HomeIcon, PlusIcon, SearchIcon } from "lucide-react";
// import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"

// export default function FloatingDock() {

//     return (
//         <nav className="fixed bottom-10">
//             <ul className="flex items-center gap-5 px-5 py-3 bg-gradient-to-t from-background to-neutral-950 border rounded-full">
//                 <li className=" p-2 rounded-full text-foreground flex items-center justify-center cursor-pointer">

//                     <Tooltip>
//                         <TooltipTrigger className="cursor-pointer">
//                             <HomeIcon className="size-5" strokeWidth={3} />
//                         </TooltipTrigger>

//                         <TooltipContent>
//                             <p>Home</p>
//                         </TooltipContent>
//                     </Tooltip>
//                 </li>

//                 <li className=" p-2 rounded-full text-foreground flex items-center justify-center cursor-pointer">
//                     <Tooltip>
//                         <TooltipTrigger className="cursor-pointer">
//                             <PlusIcon className="size-5" strokeWidth={3} />
//                         </TooltipTrigger>

//                         <TooltipContent>
//                             <p>Novo Link</p>
//                         </TooltipContent>
//                     </Tooltip>
//                 </li>

//                 <li className=" p-2 rounded-full text-foreground flex items-center justify-center cursor-pointer">
//                     <Tooltip>
//                         <TooltipTrigger className="cursor-pointer">
//                             <SearchIcon className="size-5" strokeWidth={3} />
//                         </TooltipTrigger>

//                         <TooltipContent>
//                             <p>Pesquisar</p>
//                         </TooltipContent>
//                     </Tooltip>
//                 </li>
//             </ul>
//         </nav>
//     )
// }

/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

// import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
    AnimatePresence,
    MotionValue,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "motion/react";

import { useRef, useState } from "react";

export type DockAction = 'home' | 'create' | 'search' | 'analytics' | 'recent' | 'settings';

export interface DockItem {
    title: string;
    icon: React.ReactNode;
    action: DockAction;
}

export const FloatingDock = ({
    items,
    onAction,
    desktopClassName,
    mobileClassName,
}: {
    items: DockItem[];
    onAction: (action: DockAction) => void;
    desktopClassName?: string;
    mobileClassName?: string;
}) => {
    return (
        <>
            <FloatingDockDesktop items={items} onAction={onAction} className={desktopClassName} />
            <FloatingDockMobile items={items} onAction={onAction} className={mobileClassName} />
        </>
    );
};

const FloatingDockMobile = ({
    items,
    onAction,
    className,
}: {
    items: DockItem[];
    onAction: (action: DockAction) => void;
    className?: string;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={cn("relative block md:hidden", className)}>
            <AnimatePresence>
                {open && (
                    <motion.ul
                        layoutId="nav"
                        className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2 w-fit"
                    >
                        {items.map((item, idx) => (
                            <motion.li
                            className="w-fit"
                                key={item.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 10,
                                    transition: {
                                        delay: idx * 0.05,
                                    },
                                }}
                                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                            >
                                <div
                                    onClick={() => onAction(item.action)}
                                    key={item.title}
                                    className="flex size-16 items-center justify-center rounded-full bg-gradient-to-b from-background to-neutral-950 border"
                                >
                                    <div className="text-foreground">{item.icon}</div>
                                </div>
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>

            <button
                onClick={() => setOpen(!open)}
                className="flex size-16 items-center justify-center rounded-full bg-background border bg-gradient-to-t from-background to-neutral-950"
            >
                <IconLayoutNavbarCollapse className=" text-foreground" />
            </button>
        </div>
    );
};

const FloatingDockDesktop = ({
    items,
    onAction,
    className,
}: {
    items: DockItem[];
    onAction: (action: DockAction) => void;
    className?: string;
}) => {
    const mouseX = useMotionValue(Infinity);
    
    return (
        <motion.ul
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-gradient-to-t from-background to-neutral-950 border px-4 pb-3 md:flex",
                className,
            )}
        >
            {items.map((item) => (
                <IconContainer mouseX={mouseX} key={item.title} onAction={onAction} {...item} />
            ))}
        </motion.ul>
    );
};

function IconContainer({
    mouseX,
    title,
    icon,
    action,
    onAction,
}: {
    mouseX: MotionValue;
    title: string;
    icon: React.ReactNode;
    action: DockAction;
    onAction: (action: DockAction) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

        return val - bounds.x - bounds.width / 2;
    });

    const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

    const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
    const heightTransformIcon = useTransform(
        distance,
        [-150, 0, 150],
        [20, 40, 20],
    );

    const width = useSpring(widthTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const height = useSpring(heightTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const widthIcon = useSpring(widthTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const heightIcon = useSpring(heightTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const [hovered, setHovered] = useState(false);

    return (
        <li>
            <motion.div
                ref={ref}
                style={{ width, height }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => onAction(action)}
                className="relative flex aspect-square items-center justify-center rounded-full bg-gradient-to-b from-background to-neutral-950 border cursor-pointer"
            >
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, x: "-50%" }}
                            exit={{ opacity: 0, y: 2, x: "-50%" }}
                            className="absolute -top-8 left-1/2 w-fit rounded-md border bg-foreground text-background px-2 py-0.5 text-xs whitespace-pre"
                        >
                            {title}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    style={{ width: widthIcon, height: heightIcon }}
                    className="flex items-center justify-center"
                >
                    {icon}
                </motion.div>
            </motion.div>
        </li>
    );
}
