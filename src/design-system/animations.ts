// ═══ BOTOLA TICKET — FRAMER MOTION ANIMATION VARIANTS ═══

// ── Page transitions ──
export const pageTransition = {
    initial: { opacity: 0, y: 20, filter: "blur(6px)" },
    animate: {
        opacity: 1, y: 0, filter: "blur(0px)",
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

// ── Stagger children ──
export const staggerContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

// ── Card hover ──
export const cardHover = {
    whileHover: {
        y: -6,
        scale: 1.01,
        boxShadow: "0 24px 48px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,166,81,0.15)",
    },
    whileTap: { scale: 0.98 },
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
};

// ── Flip card (teams) ──
export const flipCardFront = {
    initial: { rotateY: 0 },
    hover: { rotateY: 180 },
};

export const flipCardBack = {
    initial: { rotateY: -180 },
    hover: { rotateY: 0 },
};

// ── Ticket floating animation ──
export const ticketFloat = {
    animate: {
        y: [0, -12, 0],
        rotate: [-1, 1, -1],
    },
    transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
    },
};

// ── Capacity gauge ──
export const gaugeAnimation = (fillPercent: number) => ({
    initial: { scaleX: 0 },
    animate: { scaleX: fillPercent / 100 },
    transition: { duration: 1.2, ease: "easeOut" as const, type: "spring" as const },
});

// ── Fade in from direction ──
export const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export const fadeInLeft = {
    initial: { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

// ── SVG path draw ──
export const pathDraw = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 2, ease: "easeInOut" as const },
};

// ── Scale in (for success checkmark, etc.) ──
export const scaleIn = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring" as const, stiffness: 200, delay: 0.2 },
};

// ── Countdown digit flip ──
export const digitFlip = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: { duration: 0.3 },
};
