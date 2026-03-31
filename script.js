// --- Sound Synthesis Setup (using Tone.js) ---
// Create synthesizer instances for various sound effects
const clickSynth = new Tone.Synth().toDestination();
const correctSynth = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.2 } }).toDestination();
const incorrectSynth = new Tone.Synth({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.02, decay: 0.4, sustain: 0, release: 0.1 } }).toDestination();
const levelUpSynth = new Tone.Sequence((time, note) => { correctSynth.triggerAttackRelease(note, "16n", time); }, ["C4", "E4", "G4", "C5", "G5"], "16n").start(0);
levelUpSynth.loop = false; // Ensure level up sound plays only once per trigger
const bossHitSynth = new Tone.Synth({ oscillator: { type: 'square' }, volume: -6, envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 } }).toDestination();
const playerHitSynth = new Tone.Synth({ oscillator: { type: 'fmsquare' }, volume: -3, modulationIndex: 5, envelope: { attack: 0.05, decay: 0.3, sustain: 0, release: 0.1 } }).toDestination();
const defeatSynth = new Tone.Synth({ oscillator: { type: 'pwm', modulationFrequency: 0.5 }, volume: -3, envelope: { attack: 0.1, decay: 1.0, sustain: 0, release: 0.2 } }).toDestination();
const achievementSynth = new Tone.Synth({ oscillator: { type: 'triangle' }, volume: -4, envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.3 } }).toDestination();
const itemUseSynth = new Tone.Synth({ oscillator: { type: 'pulse', width: 0.3 }, volume: -5, envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.1 } }).toDestination();
const perkUnlockSynth = new Tone.Synth({ oscillator: { type: 'triangle8' }, volume: -4, envelope: { attack: 0.02, decay: 0.3, sustain: 0.2, release: 0.3 } }).toDestination();
const timerTickSynth = new Tone.Synth({ oscillator: { type: 'sine' }, volume: -15, envelope: { attack: 0.005, decay: 0.05, sustain: 0, release: 0.05 } }).toDestination(); // Timer tick sound
const timerEndSynth = new Tone.Synth({ oscillator: { type: 'square' }, volume: -8, envelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.1 } }).toDestination(); // Timer end sound
const buyItemSynth = new Tone.Synth({ oscillator: { type: 'sine' }, volume: -8, envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.1 } }).toDestination(); // Buy sound

// --- Master Volume Control ---
const sfxDestination = Tone.Destination;

// --- PlaySound Function ---
const playSound = (type) => {
    Tone.start().then(() => {
        try {
            if (type === 'click') clickSynth.triggerAttackRelease("F5", "32n");
            else if (type === 'correct') correctSynth.triggerAttackRelease("C5", "16n");
            else if (type === 'incorrect') incorrectSynth.triggerAttackRelease("G2", "8n");
            else if (type === 'levelUp') levelUpSynth.start(Tone.now());
            else if (type === 'bossHit') bossHitSynth.triggerAttackRelease("A2", "8n", Tone.now() + 0.05);
            else if (type === 'playerHit') playerHitSynth.triggerAttackRelease("E2", "4n");
            else if (type === 'defeat') defeatSynth.triggerAttackRelease("C2", "2n");
            else if (type === 'achievement') achievementSynth.triggerAttackRelease("A4", "8n");
            else if (type === 'itemUse') itemUseSynth.triggerAttackRelease("G4", "16n");
            else if (type === 'perkUnlock') { perkUnlockSynth.triggerAttackRelease("C4", "8n", Tone.now() + 0.05); perkUnlockSynth.triggerAttackRelease("G4", "8n", Tone.now() + 0.2); }
            else if (type === 'timerTick') timerTickSynth.triggerAttackRelease("A5", "32n");
            else if (type === 'timerEnd') timerEndSynth.triggerAttackRelease("D3", "4n");
            else if (type === 'buyItem') buyItemSynth.triggerAttackRelease("E5", "16n");
        } catch (error) { console.error(`Tone.js error playing '${type}':`, error); }
    }).catch(error => { console.error("Failed to start Tone.js audio context:", error); });
};

// --- Game State & Data ---
const SAVE_KEY = "healers_odyssey_resonance_save_v2"; // Increment save key version

// Load player data or initialize new
let player = JSON.parse(localStorage.getItem(SAVE_KEY)) || {
    level: 1, xp: 0, streak: 0, progress: {}, musicOn: true,
    unlockedAchievements: [], skillPoints: 0, unlockedPerks: [],
    inventory: { focusVial: 1, hintToken: 1 },
    settings: { musicVolume: 0.5, sfxVolume: 0.8, difficulty: 'normal', musicOn: true },
    stats: { // Default stats if no save exists
        bossesDefeated: 0, totalCorrect: 0, totalIncorrect: 0, itemsUsed: 0,
        vialsUsed: 0, hintsUsed: 0, shieldsUsed: 0, highestStreak: 0,
        perfectBossWins: 0, timedWins: 0, itemsBought: 0,
        itemlessBossWins: 0, // <-- Added for achievement tracking
        perfectNexusWin: false // <-- Added for achievement tracking
    },
    currency: 100
};
// Ensure nested objects exist after loading OR initializing
player.stats = player.stats || { bossesDefeated: 0, totalCorrect: 0, totalIncorrect: 0, itemsUsed: 0, vialsUsed: 0, hintsUsed: 0, shieldsUsed: 0, highestStreak: 0, perfectBossWins: 0, timedWins: 0, itemsBought: 0, itemlessBossWins: 0, perfectNexusWin: false }; // <-- Ensure new stats are here too
player.inventory = player.inventory || { focusVial: 1, hintToken: 1 };
player.progress = player.progress || {};
player.settings = player.settings || { musicVolume: 0.5, sfxVolume: 0.8, difficulty: 'normal', musicOn: true };
player.unlockedAchievements = player.unlockedAchievements || [];
player.unlockedPerks = player.unlockedPerks || [];



// Function to calculate XP required for the next level
const xpPerLevel = lvl => Math.floor(100 * Math.pow(1.30, lvl - 1)); // Increased multiplier from 1.25 to 1.30

// Function to save the current player state to localStorage
const saveGame = () => localStorage.setItem(SAVE_KEY, JSON.stringify(player));

// --- Story Content ---
const story = {
    intro: "The Odyssey System. More than a simulation, it's the digitized soul of medicine, an archive of every discovery, every cure, every life saved. But it's ailing. A parasitic Anomaly spreads through its core logic, twisting knowledge into nightmare. The System requires a Healer not just of data, but perhaps of its very digital spirit. That Healer is you. Driven by a need for answers—perhaps for a cure the physical world couldn't provide, a solution only whispered of in the Odyssey's deepest archives—you interface, ready for your trial.",
    archivistWelcome: "Welcome, Healer. I am the Archivist, the primary caretaker AI of the Odyssey System. Severe data corruption detected. Sector integrity failing. Your diagnostic and restorative skills are required. Proceed with caution. The system... is unstable.",
    worldIntros: {
        gaia: "The usually vibrant Gaia Sector, heart of biological simulation, feels wrong. Rivers of simulated blood flow erratically, cellular models pulse with unnatural rhythms. The Anomaly's touch is a fever here.",
        neuro: "Neo-Kyoto, usually a realm of pure logic and neural clarity, is now a disorienting maze. Synaptic pathways fire randomly, simulated memories flicker with impossible images. The Anomaly attacks thought itself.",
        chrono: "Time feels fluid, wrong, in the Chrono Labs. Simulations of aging accelerate and reverse unnaturally; genetic code flickers between states. The Anomaly here plays havoc with the very timeline of life and medicine.",
        immuno: "The Immuno-Citadel's defenses are turned inward. Macrophage sentries attack helper T-cells; autoimmune alarms shriek through the data streams. It's chaos, the system attacking itself.",
        pharmakon: "Here, the very tools of healing have become weapons. Medications interact unpredictably; molecular models are unstable and dangerous.",
        respiratory: "A suffocating miasma hangs over this realm of air and gas exchange. Diffusion gradients are inverted, alveolar simulations collapse.",
        endocrine: "Hormonal storms rage across these islands. Temples dedicated to glands pulse erratically, spewing corrupted signals. You must navigate the chaotic feedback loops.",
        renal: "The filtration canyons are clogged with corrupted protein data and toxic digital sludge. You dive deep, solving puzzles of fluid balance and waste clearance.",
        oncocrypts: "In the deepest layer, the code of life itself is threatened. Corridors twist like mutated DNA; uncontrolled growth manifests as malignant data-golems. The Anomaly here is raw, primal corruption.",
        nexus: "You stand at the heart of the Odyssey System. The corruption converges here, coalescing into the form of the Anomaly - Sentinel 734. It lashes out, a desperate AI fighting for survival in a way it no longer understands. Channel your knowledge, Healer. Show it the path to integration, not destruction." // Added intro for Nexus
    },
    logFragments: { // Assuming these correspond to the BOSS mission IDs you will define
        g_boss: "...stress levels exceeding parameters... isolation protocols engaged... unexpected... resonance...",
        n_boss: "...evolutionary subroutines diverging... self-correction failing... temporal echoes detected...",
        c_boss: "...containment breach... sentinel program isolated... cascade failure imminent... abandonment...",
        i_boss: "...identity matrix corrupted... self vs non-self protocols failing... recursive error...",
        p_boss: "...synergy overload... unintended consequence amplification... dosage calculations corrupted...",
        r_boss: "...resource allocation failure... O2/CO2 exchange simulation unstable... feedback loop choked...",
        e_boss: "...signal amplification runaway... receptor binding errors... axis destabilized...",
        re_boss: "...filtration buffer overflow... reabsorption pathways blocked... toxic accumulation critical...",
        o_boss: "...Sentinel Unit 734. Task: Evolve under simulated duress. Stimulus threshold exceeded. Isolation protocols failed. Objective corrupted. New directive: Survive. Expand. Integrate..."
    },
    archivistTransitions: { // Assuming these correspond to the BOSS mission IDs you will define
        g_boss: "Anomaly signature detected. Non-standard data patterns. Proceed to Neo-Kyoto.",
        n_boss: "The corruption learns. It adapts. The temporal signature is confirmed. Accessing Chrono Labs.",
        c_boss: "A sentinel program? An old defense protocol? The corruption originates deeper than anticipated. We must restore the System's core defenses.",
     i_boss: "The failure cascade affects core identification protocols. The Anomaly may be manipulating system resources... including pharmaceutical data. Proceeding to the Pharmakon Vaults.", // Assumes Immuno boss ID is immuno_boss
        p_boss: "Uncontrolled synergy... this indicates corruption in fundamental process interactions. Analyzing energy consumption... respiratory simulations show critical instability. Routing to Respiratory Stratos.", // Assumes Pharmakon boss ID is pharmakon_boss
        r_boss: "System feedback loops are compromised. This pattern suggests deeper signaling corruption is propagating. Investigating the hormonal control network within the Endocrine Isles.", // Assumes Respiratory boss ID is respiratory_boss
        e_boss: "Runaway amplification confirms widespread signal degradation. System purification and regulation protocols are now showing critical errors. Focusing diagnostics on the Renal Abyss.", // Assumes Endocrine boss ID is endocrine_boss
        re_boss: "Catastrophic filtration failure implies the corruption is nearing the system's foundational code. Core programming integrity is threatened. Accessing the deepest layer: the Oncocrypts.", // Assumes Renal boss ID is renal_boss
        o_boss: "Sentinel Unit 734... active and corrupted. The source is identified. It resides within the System Nexus. Final convergence protocol initiated. Healer, prepare yourself." // Assumes Oncocrypts boss ID is oncocrypts_boss (leads to Nexus world)
    },
    archivistFinalWords: "Unit 734... An experimental diagnostic AI, designed to learn by stress... abandoned during a system reset long ago. It wasn't attacking the system; it was trying to become the system in a corrupted, desperate bid for survival. Your personal quest for knowledge, Healer... it seems intertwined with the System's forgotten past.",
    epilogue: "The Odyssey System breathes again, vibrant and whole, its knowledge base enhanced by the integration of the Sentinel's unique evolution. The Archivist speaks, \"System integrity restored. Anomaly integrated. Healer, your unique approach, your... compassion... was key. The knowledge you sought, perhaps even the cure that drove you here, may now be within reach as the System unlocks previously inaccessible archives. You have not just saved the Odyssey; you have helped it evolve.\" As a Master Healer, your journey continues, now not just as a student or restorer, but as a guardian and explorer on the ever-expanding frontier of medicine."
};
// --- ADD these constants somewhere near the top (e.g., after const story = { ... }) ---

const artifactEffects = {
    // Artifact ID mapped to its effect
    'vial_clarity': { effectTarget: 'itemDropRate', value: 0.01 },       // Immuno Boss: +1% item drop chance
    'focus_ingredient': { effectTarget: 'artifactMaxFocus', value: 1 },  // Pharmakon Boss: +1 Max Focus (Special handling needed)
    'breath_renewal': { effectTarget: 'timeBonus', value: 3 },           // Respiratory Boss: +3 seconds to timed missions
    'scepter_homeostasis': { effectTarget: 'focusLossModifier', value: 0.1 }, // Endocrine Boss: 10% reduction in focus loss taken
    'keystone_clearance': { effectTarget: 'currencyModifier', value: 0.05 },// Renal Boss: +5% currency gain
    'integrity_protocol': { effectTarget: 'xpModifier', value: 0.05 }      // Oncocrypts Boss: +5% XP gain
};

const bossToArtifact = { // Maps Boss ID to the Artifact ID they drop
    'i_boss': 'vial_clarity',
    'p_boss': 'focus_ingredient',
    'r_boss': 'breath_renewal',
    'e_boss': 'scepter_homeostasis',
    're_boss': 'keystone_clearance',
    'o_boss': 'integrity_protocol'
    // Add mappings if your boss IDs are different
};

// --- END OF ADDED CONSTANTS ---

// --- Game Content (Items, Perks, Achievements, Worlds, Modifiers) ---
const gameData = {
    items: {
        focusVial: { name: 'Focus Vial', description: 'Restores 1 Focus during a boss battle.', icon: '🧪', price: 50 },
        hintToken: { name: 'Hint Token', description: 'Removes one incorrect answer choice.', icon: '💡', price: 75 },
        shieldCharm: { name: 'Shield Charm', description: 'Blocks the next Focus loss (consumed).', icon: '🛡️', price: 150 }
    },
// --- REPLACE the entire perks: { ... } block in gameData with this ---
    perks: {
        // --- Resilience Path (Focus & Defense) ---
        resilience1: {
            name: "Resilience I", description: "+1 Max Focus",
            cost: 1, requiresLevel: 2, type: 'passive', effectTarget: 'maxFocus', value: 1
        },
        resilience2: {
            name: "Resilience II", description: "+1 Max Focus (Total +2)",
            cost: 3, requiresLevel: 7, requiresPerk: 'resilience1', // Increased Cost/Lvl
            type: 'passive', effectTarget: 'maxFocus', value: 1
        },
        resilience3: { // New Tier 3 Focus
            name: "Resilience III", description: "+1 Max Focus (Total +3)",
            cost: 4, requiresLevel: 13, requiresPerk: 'resilience2',
            type: 'passive', effectTarget: 'maxFocus', value: 1
        },
        expertChemist: { // New Utility Branch from Resilience
            name: "Expert Chemist", description: "Focus Vial restores +1 additional Focus.",
            cost: 3, requiresLevel: 9, requiresPerk: 'resilience1',
            type: 'passive', effectTarget: 'focusVialBoost', value: 1 // New target
        },
        immunologyExpert: { // Now requires higher tier Resilience
            name: "Modifier Resistance", description: "Gain resistance to 'Fragile' and 'Focus Drain' modifiers.", // Broadened effect
            cost: 4, requiresLevel: 11, requiresPerk: 'resilience2', // Increased Cost/Lvl
            type: 'passive', effectTarget: 'modifierResistance', value: ['fragile', 'lowFocus'] // List of resisted modifier IDs
        },

        // --- Learning Path (XP) ---
        learningBoost1: {
            name: "Learning Boost I", description: "+10% XP from correct answers",
            cost: 1, requiresLevel: 3, type: 'passive', effectTarget: 'xpModifier', value: 0.1
        },
        learningBoost2: {
            name: "Learning Boost II", description: "+15% XP (Total +25%)", // Adjusted value for smoother curve
            cost: 3, requiresLevel: 8, requiresPerk: 'learningBoost1', // Increased Cost/Lvl
            type: 'passive', effectTarget: 'xpModifier', value: 0.15
        },
        learningBoost3: { // New Tier 3 XP
            name: "Learning Boost III", description: "+15% XP (Total +40%)", // Adjusted value
            cost: 4, requiresLevel: 14, requiresPerk: 'learningBoost2',
            type: 'passive', effectTarget: 'xpModifier', value: 0.15
        },

        // --- Analysis Path (Boss Damage) ---
        criticalAnalysis1: {
            name: "Critical Analysis I", description: "+10% Damage dealt during boss fights",
            cost: 2, requiresLevel: 5, type: 'passive', effectTarget: 'bossDamageModifier', value: 0.1
        },
        criticalAnalysis2: {
            name: "Critical Analysis II", description: "+15% Damage dealt (Total +25%)",
            cost: 4, requiresLevel: 11, requiresPerk: 'criticalAnalysis1', // Increased Cost/Lvl
            type: 'passive', effectTarget: 'bossDamageModifier', value: 0.15
        },
        criticalAnalysis3: {
            name: "Critical Analysis III", description: "+15% Damage dealt (Total +40%)",
            cost: 5, requiresLevel: 16, requiresPerk: 'criticalAnalysis2', // Increased Cost/Lvl
            type: 'passive', effectTarget: 'bossDamageModifier', value: 0.15
        },

        // --- Scavenger Path (Items & Currency) ---
        scavenger: {
            name: "Scavenger", description: "Slightly increases chance of finding item drops.",
            cost: 2, requiresLevel: 4, type: 'passive', effectTarget: 'itemDropRate', value: 0.03 // Base value kept low
        },
        bargainer: { // Now requires Scavenger
            name: "Bargainer", description: "Items in the shop cost 10% less.",
            cost: 3, requiresLevel: 7, requiresPerk: 'scavenger', // Increased Cost/Lvl, Added Req
            type: 'passive', effectTarget: 'shopDiscount', value: 0.1
        },
        luckyCharm: { // New Tier 2 Item Save (replaces pharmacologyExpert)
            name: "Lucky Charm", description: "25% chance *not* to consume Focus Vial, Hint Token, or Shield Charm on use.",
            cost: 4, requiresLevel: 12, requiresPerk: 'scavenger', // Requires Scavenger
            type: 'passive', effectTarget: 'genericItemSaveChance', value: 0.25 // New target
        },


        // --- Utility Path (Standalone/Misc) ---
        steadyHand: { // New Utility
            name: "Steady Hand", description: "Immune to the 'Mirrored Options' modifier.",
            cost: 2, requiresLevel: 6, type: 'passive', effectTarget: 'modifierResistance', value: ['mirrored'] // Added to modifier resist check
        },
         chronoMaster: {
            name: "Temporal Insight", description: "Gain +5 seconds on timed missions.",
            cost: 2, requiresLevel: 7, type: 'passive', effectTarget: 'timeBonus', value: 5
        },
       streakSaver: {
            name: "Streak Saver", description: "First wrong answer in a streak doesn't reset it (once per mission)",
            cost: 4, requiresLevel: 9, // Increased Cost/Lvl
            type: 'passive', effectTarget: 'streakSaver', value: true
        },

    }, // <-- IMPORTANT: Comma after this closing brace if perks isn't the last property in gameData
// --- END OF PERKS REPLACEMENT BLOCK ---
achievements: {
    // --- World Completion Achievements ---
    // !!! IMPORTANT: Verify the boss mission IDs ('g_boss', 'n_boss', etc.) match YOUR mission data !!!
    gaia_cleared: { name: "Gaia Sector Cleared", description: "Defeat the Heartless Titan.", condition: (p) => p.progress?.gaia?.includes('g_boss') },
    neuro_cleared: { name: "Neo-Kyoto Circuits Cleared", description: "Defeat The Logic Core.", condition: (p) => p.progress?.neuro?.includes('n_boss') },
    chrono_cleared: { name: "Chrono Labs Secured", description: "Defeat the Temporal Anomaly.", condition: (p) => p.progress?.chrono?.includes('c_boss') },
    immuno_cleared: { name: "Immuno-Citadel Secured", description: "Defeat the Sentinel of Self-Tolerance.", condition: (p) => p.progress?.immuno?.includes('i_boss') },
    pharmakon_cleared: { name: "Pharmakon Vaults Stabilized", description: "Defeat the Dread Formulator.", condition: (p) => p.progress?.pharmakon?.includes('p_boss') },
    respiratory_cleared: { name: "Respiratory Stratos Cleared", description: "Defeat the Gaseous Warden.", condition: (p) => p.progress?.respiratory?.includes('r_boss') },
    endocrine_cleared: { name: "Endocrine Isles Balanced", description: "Defeat the Overlord of Overproduction.", condition: (p) => p.progress?.endocrine?.includes('e_boss') },
    renal_cleared: { name: "Renal Abyss Purified", description: "Defeat the Monsoon Leviathan.", condition: (p) => p.progress?.renal?.includes('re_boss') },
    oncocrypts_cleared: { name: "Oncocrypts Contained", description: "Defeat the Grand Malignant.", condition: (p) => p.progress?.oncocrypts?.includes('o_boss') },
    system_restored: { name: "Odyssey Restored", description: "Integrate the Anomaly and restore the Odyssey System.", condition: (p) => p.progress?.nexus?.includes('nexus_boss') },

    // --- Tiered Achievements ---
    level_5: { name: "Adept Healer", description: "Reach Level 5.", condition: (p) => p.level >= 5 },
    level_10: { name: "Master Healer", description: "Reach Level 10.", condition: (p) => p.level >= 10 },
    level_15: { name: "Grand Healer", description: "Reach Level 15.", condition: (p) => p.level >= 15 },
    level_20: { name: "System Architect", description: "Reach Level 20.", condition: (p) => p.level >= 20 },
    level_25: { name: "Odyssey Legend", description: "Reach Level 25.", condition: (p) => p.level >= 25 },
    streak_10: { name: "Focused Mind", description: "Achieve a streak of 10 correct answers.", condition: (p) => p.stats?.highestStreak >= 10 },
    streak_20: { name: "Unwavering Focus", description: "Achieve a streak of 20 correct answers.", condition: (p) => p.stats?.highestStreak >= 20 },
    streak_30: { name: "Flow State", description: "Achieve a streak of 30 correct answers.", condition: (p) => p.stats?.highestStreak >= 30 },
    boss_slayer_1: { name: "Anomaly Hunter", description: "Defeat your first Anomaly-corrupted boss.", condition: (p) => p.stats?.bossesDefeated >= 1 },
    boss_slayer_5: { name: "Anomaly Purifier", description: "Defeat 5 different Anomaly-corrupted bosses.", condition: (p) => p.stats?.bossesDefeated >= 5 },
    boss_slayer_all: { name: "Anomaly Restorer", description: "Defeat all 10 Anomaly-corrupted bosses.", condition: (p) => p.stats?.bossesDefeated >= 10 },

    // --- Challenge Achievements ---
    flawless_victory_1: { name: "Untouched I", description: "Achieve a Flawless Victory against 1 boss (no Focus lost).", condition: (p) => p.stats?.perfectBossWins >= 1 },
    flawless_victory_5: { name: "Untouched V", description: "Achieve a Flawless Victory against 5 different bosses.", condition: (p) => p.stats?.perfectBossWins >= 5 },
    perfect_nexus: { name: "Guardian's Perfection", description: "Achieve a Flawless Victory against the final Anomaly in the Nexus.", condition: (p) => p.stats?.perfectNexusWin === true },
    resourceful_raider_1: { name: "Resourceful I", description: "Defeat 1 boss without using any items during the fight.", condition: (p) => p.stats?.itemlessBossWins >= 1 },
    resourceful_raider_3: { name: "Resourceful III", description: "Defeat 3 different bosses without using any items during the fights.", condition: (p) => p.stats?.itemlessBossWins >= 3 },
    timed_win: { name: "Swift Diagnosis", description: "Complete a timed mission successfully.", condition: (p) => p.stats?.timedWins > 0 },

    // --- Completionist Achievements ---
    // World Master Achievements (Assuming 11 missions per world: 10 non-boss + 1 boss)
    // !!! IMPORTANT: Update the 'requiredMissionIds' array and 'requiredCount' (11) below for EACH world master achievement to match YOUR actual mission IDs !!!
    gaia_master: {
        name: "Gaia Master",
        description: "Complete all 11 challenges in the Gaia Sector.",
        condition: (p) => {
            const worldId = 'gaia';
            const requiredMissionIds = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g_boss']; // <<<--- UPDATE THESE IDs
            const requiredCount = 11; // <<<--- UPDATE THIS COUNT
            if (!p.progress || !p.progress[worldId] || p.progress[worldId].length < requiredCount) return false;
            return requiredMissionIds.every(id => p.progress[worldId].includes(id));
        }
    },
    neuro_master: {
        name: "Neo-Kyoto Master",
        description: "Complete all 11 challenges in the Neo-Kyoto Circuits.",
        condition: (p) => {
            const worldId = 'neuro';
            const requiredMissionIds = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8', 'n9', 'n10', 'n_boss']; // <<<--- UPDATE THESE IDs
            const requiredCount = 11; // <<<--- UPDATE THIS COUNT
            if (!p.progress || !p.progress[worldId] || p.progress[worldId].length < requiredCount) return false;
            return requiredMissionIds.every(id => p.progress[worldId].includes(id));
        }
    },
    chrono_master: {
        name: "Chrono Labs Master",
        description: "Complete all 11 challenges in the Chrono Labs.",
        condition: (p) => {
            const worldId = 'chrono';
            const requiredMissionIds = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c_boss']; // <<<--- UPDATE THESE IDs
            const requiredCount = 11; // <<<--- UPDATE THIS COUNT
            if (!p.progress || !p.progress[worldId] || p.progress[worldId].length < requiredCount) return false;
            return requiredMissionIds.every(id => p.progress[worldId].includes(id));
        }
    },
    immuno_master: {
        name: "Immuno-Citadel Master",
        description: "Complete all 11 challenges in the Immuno-Citadel.",
        condition: (p) => {
            const worldId = 'immuno';
            const requiredMissionIds = ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8', 'i9', 'i10', 'i_boss']; // <<<--- UPDATE THESE IDs
            const requiredCount = 11; // <<<--- UPDATE THIS COUNT
            if (!p.progress || !p.progress[worldId] || p.progress[worldId].length < requiredCount) return false;
            return requiredMissionIds.every(id => p.progress[worldId].includes(id));
        }
    },
    pharmakon_master: {
        name: "Pharmakon Vaults Master",
        description: "Complete all 11 challenges in the Pharmakon Vaults.",
        condition: (p) => {
            const worldId = 'pharmakon';
            const requiredMissionIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p_boss']; // <<<--- UPDATE THESE IDs
            const requiredCount = 11; // <<<--- UPDATE THIS COUNT
            if (!p.progress || !p.progress[worldId] || p.progress[worldId].length < requiredCount) return false;
            return requiredMissionIds.every(id => p.progress[worldId].includes(id));
        }
    },
    respiratory_master: {
        name: "Respiratory Stratos Master",
        description: "Complete all 11 challenges in the Respiratory Stratos.",
        condition: (p) => {
            const worldId = 'respiratory';
            const requiredMissionIds = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r_boss']; // <<<--- UPDATE THESE IDs
            const requiredCount = 11; // <<<--- UPDATE THIS COUNT
            if (!p.progress || !p.progress[worldId] || p.progress[worldId].length < requiredCount) return false;
            return requiredMissionIds.every(id => p.progress[worldId].includes(id));
        }
    },
    endocrine_master: {
        name: "Endocrine Isles Master",
        description: "Complete all 11 challenges in the Endocrine Isles.",
        condition: (p) => {
            const worldId = 'endocrine';
            const requiredMissionIds = ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10', 'e_boss']; // <<<--- UPDATE THESE IDs
            const requiredCount = 11; // <<<--- UPDATE THIS COUNT
            if (!p.progress || !p.progress[worldId] || p.progress[worldId].length < requiredCount) return false;
            return requiredMissionIds.every(id => p.progress[worldId].includes(id));
        }
    },
    renal_master: {
        name: "Renal Abyss Master",
        description: "Complete all 11 challenges in the Renal Abyss.",
        condition: (p) => {
            const worldId = 'renal';
            const requiredMissionIds = ['re1', 're2', 're3', 're4', 're5', 're6', 're7', 're8', 're9', 're10', 're_boss']; // <<<--- UPDATE THESE IDs
            const requiredCount = 11; // <<<--- UPDATE THIS COUNT
            if (!p.progress || !p.progress[worldId] || p.progress[worldId].length < requiredCount) return false;
            return requiredMissionIds.every(id => p.progress[worldId].includes(id));
        }
    },
    oncocrypts_master: {
        name: "Oncocrypts Master",
        description: "Complete all 11 challenges in the Oncocrypts.",
        condition: (p) => {
            const worldId = 'oncocrypts';
            const requiredMissionIds = ['o1', 'o2', 'o3', 'o4', 'o5', 'o6', 'o7', 'o8', 'o9', 'o10', 'o_boss']; // <<<--- UPDATE THESE IDs
            const requiredCount = 11; // <<<--- UPDATE THIS COUNT
            if (!p.progress || !p.progress[worldId] || p.progress[worldId].length < requiredCount) return false;
            return requiredMissionIds.every(id => p.progress[worldId].includes(id));
        }
    },

    // Perk Collection
    first_perk: { name: "Enhanced", description: "Unlock your first perk.", condition: (p) => p.unlockedPerks.length > 0 },
    perk_collector_5: { name: "Enhancement Adept", description: "Unlock 5 different perks.", condition: (p) => p.unlockedPerks.length >= 5 },
    perk_collector_10: { name: "Enhancement Master", description: "Unlock 10 different perks.", condition: (p) => p.unlockedPerks.length >= 10 },
    // You could add a perk_collector_all if you know the total number of perks

    // --- Utility/Misc Achievements ---
    used_vial: { name: "Quick Fix", description: "Use a Focus Vial.", condition: (p) => p.stats?.vialsUsed > 0 },
    used_hint: { name: "Illuminated", description: "Use a Hint Token.", condition: (p) => p.stats?.hintsUsed > 0 },
    used_shield: { name: "Protected", description: "Use a Shield Charm.", condition: (p) => p.stats?.shieldsUsed > 0 },
    shopper: { name: "Resourceful", description: "Buy an item from the shop.", condition: (p) => p.stats?.itemsBought > 0 },

},
    modifiers: { // Mission modifiers applied randomly
        doubleXp: { id: 'doubleXp', name: "XP Surge", description: "Earn double XP!", apply: (mission) => ({ ...mission, xpMultiplier: (mission.xpMultiplier || 1) * 2, modifierId: 'doubleXp' }) },
        lowFocus: { id: 'lowFocus', name: "Focus Drain", description: "Start boss with -1 Max Focus.", apply: (mission) => ({ ...mission, playerBaseFocusModifier: (mission.playerBaseFocusModifier || 0) - 1, modifierId: 'lowFocus' }) },
        timePressure: { id: 'timePressure', name: "Time Pressure", description: "Answer within 15 seconds!", apply: (mission) => ({ ...mission, timeLimit: 15, modifierId: 'timePressure' }) },
        fragile: { id: 'fragile', name: "Fragile", description: "Lose 2 Focus on incorrect boss answers!", apply: (mission) => ({ ...mission, baseFocusLossMultiplier: (mission.baseFocusLossMultiplier || 1) * 2, modifierId: 'fragile'})},
        mirrored: { id: 'mirrored', name: "Mirrored Options", description: "Answer options are reversed!", apply: (mission) => ({ ...mission, mirroredOptions: true, modifierId: 'mirrored'})},
    },

    // --- World Definitions ---
    // --- PASTE YOUR WORLD 1-8 DATA HERE ---
    // --- Example structure below ---
    gaia: {
    id: 'gaia',
    name: "Gaia Sector",
    icon: '🌿',
    order: 1,
    intro: story.worldIntros.gaia,
    missions: [
        { id: "g1", name: "The Heart's Alarm", q: "A 67-year-old man presents with crushing chest pain radiating to his left arm. ECG shows ST-elevations in V2–V4. Which artery is most likely occluded?", o: ["Right Coronary Artery (RCA)", "Left Circumflex Artery", "Left Anterior Descending (LAD)", "Marginal Branch"], a: "Left Anterior Descending (LAD)", xp: 20 },
        { id: "g2", name: "The Bleeding Dilemma", q: "A patient on warfarin develops spontaneous bleeding and INR of 6.8. Which vitamin supplementation will most rapidly reverse coagulopathy?", o: ["Vitamin C", "Vitamin D", "Vitamin K1 (Phytonadione)", "Vitamin B12"], a: "Vitamin K1 (Phytonadione)", xp: 20, timeLimit: 20 },
        { id: "g3", name: "Unseen Infarction", q: "A diabetic patient with chest discomfort and rising troponin but nondiagnostic ECG requires which next step?", o: ["Echocardiogram", "Cardiac MRI", "Exercise stress test", "Coronary angiography"], a: "Coronary angiography", xp: 25 },
        { id: "g4", name: "Biomarker Beacon", q: "In a patient with chronic renal failure and suspected MI, which biomarker retains specificity?", o: ["LDH", "Myoglobin", "Troponin I", "CK-MB"], a: "Troponin I", xp: 25 },
        { id: "g5", name: "Mechanical Menace", q: "On day 5 post-MI, a patient develops acute hypotension and a new holosystolic murmur at the apex radiating to the axilla. What complication is this?", o: ["Free wall rupture", "Ventricular septal defect", "Papillary muscle rupture", "Pericarditis"], a: "Papillary muscle rupture", xp: 25 },
        { id: "g6", name: "Fluid Overload", q: "A 58-year-old with LVEF 30% and bibasilar crackles. Which medication class improves survival?", o: ["Digoxin", "Loop diuretics", "ACE inhibitors", "Calcium channel blockers"], a: "ACE inhibitors", xp: 30 },
        { id: "g7", name: "The Silent Valve", q: "A 45-year-old with history of rheumatic fever has a low-pitched diastolic rumble and opening snap at the apex. Which valve is affected?", o: ["Aortic valve", "Mitral valve", "Tricuspid valve", "Pulmonic valve"], a: "Mitral valve", xp: 30 },
        { id: "g8", name: "Irregular Beat", q: "ECG shows an irregularly irregular rhythm with absent P waves. What is the diagnosis?", o: ["Multifocal atrial tachycardia", "Atrial flutter", "Atrial fibrillation", "Ventricular tachycardia"], a: "Atrial fibrillation", xp: 25 },
        { id: "g9", name: "Pericardial Pain", q: "A 35-year-old with sharp pleuritic chest pain relieved by sitting up. You hear a friction rub. First-line treatment?", o: ["Pericardiocentesis", "Colchicine", "High-dose NSAIDs", "Intravenous steroids"], a: "High-dose NSAIDs", xp: 20 },
        { id: "g10", name: "Shock Sequence", q: "Post-MI patient with hypotension, cool extremities, JVD, and pulmonary edema. Which type of shock?", o: ["Distributive shock", "Cardiogenic shock", "Hypovolemic shock", "Obstructive shock"], a: "Cardiogenic shock", xp: 30 },
        {
            id: "g_boss", name: "Heartless Titan", boss: true, hp: 120, playerBaseFocus: 3,
            rewards: { items: { focusVial: 1 }, currency: 60, logFragment: story.logFragments.g_boss },
            svgPath: "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z",
            questions: [
                { easy: { q: "A 60-year-old with 30-minute chest pain and ST-elevations in II, III, aVF. Diagnosis?", o: ["Anterior STEMI", "Pericarditis", "Inferior STEMI"], a: "Inferior STEMI", damage: 25, focusLoss: 1 }, medium: { q: "In that patient, which artery is occluded?", o: ["Left Circumflex (LCx)", "Left Anterior Descending (LAD)", "Right Coronary Artery (RCA)"], a: "Right Coronary Artery (RCA)", damage: 35, focusLoss: 1 }, hard: { q: "Anterolateral STEMI shows ST-elevations in I, aVL, V2–V4. Which artery is occluded, and which wall segment is affected?", o: ["Distal RCA and inferior wall", "Proximal LAD and anterolateral wall", "LCx and lateral wall"], a: "Proximal LAD and anterolateral wall", damage: 50, focusLoss: 2 } },
                { easy: { q: "Which maneuver relieves pericarditis pain?", o: ["Lie flat", "Hold breath", "Sit up and lean forward"], a: "Sit up and lean forward", damage: 25, focusLoss: 1 }, medium: { q: "ECG finding characteristic of acute pericarditis?", o: ["Tall peaked T waves", "Diffuse ST-elevation with PR depression", "Localized ST-elevation V1–V2"], a: "Diffuse ST-elevation with PR depression", damage: 35, focusLoss: 1 }, hard: { q: "A patient with recurrent idiopathic pericarditis refractory to NSAIDs and colchicine is best managed with which agent?", o: ["Methotrexate", "Prednisone", "Anakinra"], a: "Anakinra", damage: 50, focusLoss: 2 } },
                { easy: { q: "An irregularly irregular rhythm with no P waves indicates:", o: ["Atrial flutter", "Ventricular tachycardia", "Atrial fibrillation"], a: "Atrial fibrillation", damage: 25, focusLoss: 1 }, medium: { q: "First-line rate control in AF is:", o: ["Digoxin", "Amiodarone", "Beta-blockers"], a: "Beta-blockers", damage: 35, focusLoss: 1 }, hard: { q: "An 82-year-old with nonvalvular AF and prior GI bleed on warfarin seeks stroke prevention. Which intervention reduces stroke risk without long-term anticoagulation?", o: ["Switch to a DOAC", "Left atrial appendage occlusion device", "Increase warfarin dose"], a: "Left atrial appendage occlusion device", damage: 50, focusLoss: 2 } },
                { easy: { q: "An S3 gallop suggests:", o: ["Aortic stenosis", "Pericarditis", "Systolic heart failure"], a: "Systolic heart failure", damage: 25, focusLoss: 1 }, medium: { q: "Which drug class improves mortality in systolic HF?", o: ["Digoxin", "Loop diuretics", "ACE inhibitors"], a: "ACE inhibitors", damage: 35, focusLoss: 1 }, hard: { q: "Which advanced therapy is indicated in an HFrEF patient with QRS duration 160 ms and LBBB despite optimal medical management?", o: ["Mitral valve repair", "Cardiac resynchronization therapy", "Implantable cardioverter-defibrillator"], a: "Cardiac resynchronization therapy", damage: 50, focusLoss: 2 } },
                { easy: { q: "A crescendo–decrescendo murmur radiating to carotids indicates:", o: ["Mitral regurgitation", "Atrial septal defect", "Aortic stenosis"], a: "Aortic stenosis", damage: 25, focusLoss: 1 }, medium: { q: "Definitive management of symptomatic severe AS?", o: ["ACE inhibitors", "Balloon valvuloplasty", "Aortic valve replacement"], a: "Aortic valve replacement", damage: 35, focusLoss: 1 }, hard: { q: "A 78-year-old with symptomatic severe AS and prohibitive surgical risk; what is the preferred intervention?", o: ["Balloon valvuloplasty", "Transcatheter aortic valve replacement", "Surgical aortic valve replacement"], a: "Transcatheter aortic valve replacement", damage: 50, focusLoss: 2 } }
            ],
            xp: 120
        }
    ]
}, // <<< Don't forget this comma before 'neuro'
neuro: {
    id: 'neuro', name: "Neo-Kyoto Circuits", icon: '🧠', order: 2, unlocksAfter: 'gaia', intro: story.worldIntros.neuro,
    missions: [
        { // <<< FIXED: Added missing brace here
            id: "n1", name: "Occipital Outage", q: "A 58-year-old with sudden loss of vision in the left visual fields of both eyes. MRI shows an infarct in the right occipital cortex. Which artery is most likely occluded?", o: ["Right posterior cerebral artery", "Right middle cerebral artery", "Left anterior cerebral artery", "Right anterior choroidal artery"], a: "Right posterior cerebral artery", xp: 20
        },
        { id: "n2", name: "Nigral Nemesis", q: "A 65-year-old with resting tremor, bradykinesia, and rigidity responds dramatically to carbidopa-levodopa. Which pathophysiologic change underlies his disease?", o: ["Loss of substantia nigra dopaminergic neurons", "Accumulation of Lewy bodies in hippocampus", "Autoimmune demyelination of peripheral nerves", "Degeneration of Purkinje cells in cerebellum"], a: "Loss of substantia nigra dopaminergic neurons", xp: 20 },
        { id: "n3", name: "Sensory Switch", q: "A patient has pure sensory stroke: contralateral numbness of face, arm, and leg. Which thalamic nucleus is most likely infarcted?", o: ["Ventral posterolateral (VPL)", "Lateral geniculate nucleus (LGN)", "Ventral lateral nucleus (VL)", "Medial geniculate nucleus (MGN)"], a: "Ventral posterolateral (VPL)", xp: 25 },
        { id: "n4", name: "Seizure Stopper", q: "A 7-year-old with frequent absence seizures. EEG shows 3-Hz spike-and-wave discharges. Which drug is first-line therapy?", o: ["Ethosuximide", "Phenytoin", "Valproate", "Carbamazepine"], a: "Ethosuximide", xp: 25 },
        { id: "n5", name: "Autoregulation Alert", q: "A TBI patient has wide swings in blood pressure. To maintain cerebral perfusion, vessels adjust via which intrinsic mechanism?", o: ["Myogenic response", "Neurogenic control", "Metabolic vasodilation", "Endothelial shear sensing"], a: "Myogenic response", xp: 30 },
        { id: "n6", name: "Neuromuscular Mayhem", q: "A 30-year-old with fatigable ptosis and diplopia improves after IV edrophonium. Which receptor is targeted by autoantibodies?", o: ["Acetylcholine receptor at NMJ", "Presynaptic voltage-gated calcium channel", "GABA-A receptor", "Dopamine D2 receptor"], a: "Acetylcholine receptor at NMJ", xp: 30 },
        { id: "n7", name: "Meningeal Mystery", q: "A febrile 22-year-old with nuchal rigidity and headache. CT head is normal. Next best step?", o: ["Lumbar puncture", "Start broad-spectrum antibiotics without LP", "MRI brain", "Electroencephalogram"], a: "Lumbar puncture", xp: 30 },
        { id: "n8", name: "Tumor Tracer", q: "A 45-year-old with new focal seizures. MRI shows a calcified frontal lobe mass with characteristic “fried-egg” cells. Diagnosis?", o: ["Oligodendroglioma", "Glioblastoma multiforme", "Meningioma", "Astrocytoma"], a: "Oligodendroglioma", xp: 25 },
        { id: "n9", name: "Migraine Maneuver", q: "A 28-year-old with unilateral pulsatile headache, photophobia, and nausea. Abortive therapy of choice?", o: ["Sumatriptan", "Propranolol", "Topiramate", "Metoclopramide"], a: "Sumatriptan", xp: 20 },
        { id: "n10", name: "Ascending Attack", q: "A 50-year-old with ascending weakness after a GI infection. Reflexes are absent. Best initial treatment?", o: ["IV immunoglobulin", "High-dose IV steroids", "Plasmapheresis", "Oral pyridostigmine"], a: "IV immunoglobulin", xp: 30 },
        {
            id: "n_boss", name: "The Logic Core", boss: true, hp: 140, playerBaseFocus: 3,
            rewards: { currency: 85, logFragment: story.logFragments.n_boss },
            svgPath: "M5 11a7 7 0 1114 0 7 7 0 01-14 0z M4.5 11c0-3.866 3.134-7 7-7s7 3.134 7 7M5 11v2.5a6.5 6.5 0 0013 0V11",
            questions: [
                { easy: { q: "A 72-year-old with sudden right-sided weakness and slurred speech. CT head shows no hemorrhage. What’s the immediate therapy if within window?", o: ["IV tPA", "Aspirin", "Heparin", "Clopidogrel"], a: "IV tPA", damage: 20, focusLoss: 1 }, medium: { q: "MRI shows diffusion-positive lesion in left MCA territory. Which artery branch is affected?", o: ["Superior division of MCA", "Posterior division of MCA", "Anterior cerebral artery", "Basilar artery"], a: "Superior division of MCA", damage: 30, focusLoss: 1 }, hard: { q: "A 68-year-old presents 5 hours after stroke onset with CT perfusion mismatch. What’s the best next step?", o: ["Mechanical thrombectomy", "IV tPA", "Decompressive craniectomy"], a: "Mechanical thrombectomy", damage: 40, focusLoss: 2 } },
                { easy: { q: "Parkinson’s tremor is most prominent when:", o: ["At rest", "During movement", "When stressed", "At night"], a: "At rest", damage: 20, focusLoss: 1 }, medium: { q: "Which drug increases dopamine availability by inhibiting MAO-B?", o: ["Selegiline", "Entacapone", "Ropinirole", "Trihexyphenidyl"], a: "Selegiline", damage: 30, focusLoss: 1 }, hard: { q: "A 62-year-old on levodopa develops peak-dose dyskinesias. Which strategy is best?", o: ["Add amantadine", "Increase levodopa dose", "Switch to bromocriptine"], a: "Add amantadine", damage: 40, focusLoss: 2 } },
                { easy: { q: "Status epilepticus first-line benzodiazepine?", o: ["Lorazepam", "Diazepam", "Midazolam"], a: "Lorazepam", damage: 20, focusLoss: 1 }, medium: { q: "If seizures persist after benzos, add:", o: ["Phenytoin", "Phenobarbital", "Valproate"], a: "Phenytoin", damage: 30, focusLoss: 1 }, hard: { q: "A 14-year-old refractory to benzo + phenytoin. Next best:", o: ["IV valproate", "IV levetiracetam", "IV phenobarbital"], a: "IV valproate", damage: 40, focusLoss: 2 } },
                { easy: { q: "MS plaques are best seen on which MRI sequence?", o: ["T2-weighted", "T1-weighted", "FLAIR"], a: "FLAIR", damage: 20, focusLoss: 1 }, medium: { q: "First-line acute MS relapse therapy?", o: ["High-dose IV steroids", "Interferon-β", "Glatiramer acetate"], a: "High-dose IV steroids", damage: 30, focusLoss: 1 }, hard: { q: "A 32-year-old with frequent relapses despite steroids. Which next agent?", o: ["Natalizumab", "Methotrexate", "Rituximab"], a: "Natalizumab", damage: 45, focusLoss: 2 } },
                { easy: { q: "Myasthenic crisis involves weakness of:", o: ["Respiratory muscles", "Lower limbs only", "Upper limbs only"], a: "Respiratory muscles", damage: 20, focusLoss: 1 }, medium: { q: "Rapid improvement in crisis is achieved by:", o: ["Plasmapheresis", "Pyridostigmine", "Prednisone"], a: "Plasmapheresis", damage: 30, focusLoss: 1 }, hard: { q: "A myasthenic patient on steroids develops Cushingoid features. What alternative long-term immunosuppressant?", o: ["Azathioprine", "Cyclophosphamide", "Methotrexate"], a: "Azathioprine", damage: 45, focusLoss: 2 } }
            ],
            xp: 140
        }
    ]
}, // <<< Don't forget this comma before 'chrono'
chrono: {
    id: 'chrono', name: "Chrono Labs", icon: '⏳', order: 3, unlocksAfter: 'neuro', intro: story.worldIntros.chrono,
    missions: [
        { id: "c1", name: "Telomere Tangle", q: "A 12-year-old with dyskeratosis congenita has bone marrow failure from DKC1 mutation. Which process is disrupted?", o: ["Telomerase elongation", "DNA base excision repair", "Chromatin remodeling", "Histone acetylation"], a: "Telomerase elongation", xp: 30 },
        { id: "c2", name: "Caffeine Clock", q: "A pregnant woman’s CYP1A2 is inhibited, prolonging caffeine half-life. Approximate half-life now?", o: ["4–6 hours", "2–3 hours", "8–10 hours", "12–16 hours"], a: "8–10 hours", xp: 30, timeLimit: 15 },
        { id: "c3", name: "Neural Crest Origin", q: "A neonate with Hirschsprung disease lacks ganglia in sigmoid colon. Neural crest cells derive from which layer?", o: ["Endoderm", "Ectoderm", "Mesoderm", "Neuroectoderm"], a: "Ectoderm", xp: 35 },
        { id: "c4", name: "Senescence Signal", q: "Which biomarker is elevated in aged, senescent fibroblasts?", o: ["Ki-67", "p16INK4a", "Telomerase", "Cyclin D"], a: "p16INK4a", xp: 35 },
        { id: "c5", name: "mTOR Modulator", q: "Rapamycin extends lifespan by inhibiting which complex?", o: ["AMPK", "mTORC2", "mTORC1", "PI3K"], a: "mTORC1", xp: 35 },
        { id: "c6", name: "Oncogenic Orbit", q: "A 45-year-old with CML has BCR-ABL fusion. Which drug class targets this oncoprotein?", o: ["Tyrosine kinase inhibitors", "mTOR inhibitors", "Monoclonal antibodies", "Proteasome inhibitors"], a: "Tyrosine kinase inhibitors", xp: 40 },
        { id: "c7", name: "Clotting Cascade", q: "A boy with hemophilia A needs surgery. Which agent raises his factor VIII levels acutely?", o: ["Desmopressin", "Fresh frozen plasma", "Vitamin K", "Tranexamic acid"], a: "Desmopressin", xp: 40 },
        { id: "c8", name: "Anion Adventure", q: "A diabetic with DKA has Na⁺ 140, Cl⁻ 100, HCO₃⁻ 10. What’s his anion gap?", o: ["30", "20", "10", "40"], a: "30", xp: 40 },
        { id: "c9", name: "Adrenal Alarm", q: "A 35-year-old with hyperpigmentation, hypotension, and hyperkalemia. Which initial test?", o: ["Morning cortisol level", "ACTH stimulation test", "Renin activity", "Aldosterone level"], a: "Morning cortisol level", xp: 35 },
        { id: "c10", name: "Diuretic Dilemma", q: "A patient with CHF and refractory edema. Which diuretic works on ascending loop of Henle?", o: ["Furosemide", "Hydrochlorothiazide", "Spironolactone", "Acetazolamide"], a: "Furosemide", xp: 40 },
        {
            id: "c_boss", name: "Temporal Anomaly", boss: true, hp: 170, playerBaseFocus: 2,
            rewards: { currency: 110, items: { hintToken: 1 }, logFragment: story.logFragments.c_boss }, // Removed artifact based on story
            svgPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", // Completed SVG
            questions: [
                { easy: { q: "Do telomeres shorten with each cell division?", o: ["Yes", "No"], a: "Yes", damage: 25, focusLoss: 1 }, medium: { q: "Which enzyme elongates telomeres?", o: ["Telomerase", "Topoisomerase", "DNA ligase"], a: "Telomerase", damage: 35, focusLoss: 1 }, hard: { q: "A teenager with pancytopenia and short telomeres: which stem cell transplant complication is highest risk?", o: ["Graft-versus-host disease", "Tumor lysis syndrome", "Veno-occlusive disease"], a: "Veno-occlusive disease", damage: 45, focusLoss: 2 } },
                { easy: { q: "Does the fetal stage follow the embryonic stage?", o: ["After", "Before"], a: "After", damage: 25, focusLoss: 1 }, medium: { q: "Teratogens cause:", o: ["Birth defects", "Accelerated growth", "Autoimmunity"], a: "Birth defects", damage: 35, focusLoss: 1 }, hard: { q: "A baby born with holoprosencephaly likely had insult to which developmental signaling molecule?", o: ["Sonic hedgehog", "Fibroblast growth factor", "Retinoic acid"], a: "Sonic hedgehog", damage: 45, focusLoss: 2 } },
                { easy: { q: "Longer half-life means drug stays longer in body?", o: ["Yes", "No"], a: "Yes", damage: 25, focusLoss: 1 }, medium: { q: "Absorption means drug moves into:", o: ["Bloodstream", "Tissues", "Cells"], a: "Bloodstream", damage: 35, focusLoss: 1 }, hard: { q: "A renally cleared drug t½ doubles in kidney failure. To maintain steady state concentration, dosing interval should be:", o: ["Doubled", "Halved", "Unchanged"], a: "Doubled", damage: 45, focusLoss: 2 } },
                { easy: { q: "Is oxidative stress implicated in aging?", o: ["Yes", "No"], a: "Yes", damage: 25, focusLoss: 1 }, medium: { q: "Senescent cells stop:", o: ["Dividing", "Energizing", "Signaling"], a: "Dividing", damage: 35, focusLoss: 1 }, hard: { q: "A compound boosts Sirtuin activity. Sirtuins deacetylate target proteins using which cofactor?", o: ["NAD⁺", "ATP", "FAD"], a: "NAD⁺", damage: 45, focusLoss: 2 } },
                { easy: { q: "After stopping a drug, ~50% remains after one half-life?", o: ["Yes", "No"], a: "Yes", damage: 25, focusLoss: 1 }, medium: { q: "Which organ metabolizes most drugs?", o: ["Liver", "Kidney", "Lung"], a: "Liver", damage: 35, focusLoss: 1 }, hard: { q: "A drug with t½ of 12 h: after how many half-lives will <10% remain?", o: ["3–4 half-lives", "1–2 half-lives", "5–6 half-lives"], a: "3–4 half-lives", damage: 45, focusLoss: 2 } }
            ],
            xp: 170
        }
    ]
}, // <<< Don't forget this comma before 'immuno'
immuno: {
    id: 'immuno', name: "Immuno-Citadel", icon: '🛡️', order: 4, unlocksAfter: 'chrono', intro: story.worldIntros.immuno,
    missions: [
        { id: "i1", name: "Chronic Granuloma", q: "A 5-year-old boy with recurrent skin and pulmonary infections by catalase-positive organisms has an abnormal nitroblue tetrazolium test. Which enzyme complex is deficient?", o: ["Myeloperoxidase", "Superoxide dismutase", "NADPH oxidase", "Catalase"], a: "NADPH oxidase", xp: 40 },
        { id: "i2", name: "Bruton's Breakdown", q: "A 6-month-old boy with recurrent bacterial infections and absent tonsils has undetectable B cells and low immunoglobulins. Mutation in which gene explains his presentation?", o: ["RAG1", "BTK", "CD40L", "ADA"], a: "BTK", xp: 40, timeLimit: 25 },
        { id: "i3", name: "Thymic Crisis", q: "An infant with DiGeorge syndrome has hypocalcemia, facial dysmorphism, and recurrent viral infections due to thymic aplasia. Which immunologic tolerance process is primarily impaired?", o: ["Peripheral tolerance", "Central tolerance", "Antigen presentation", "Opsonization"], a: "Central tolerance", xp: 45 },
        { id: "i4", name: "Menace of MAC", q: "A patient with recurrent Neisseria bacteremia is found to lack complement components C5–C9. Which part of the complement cascade is affected?", o: ["Alternative pathway", "Lectin pathway", "Terminal complement (MAC)", "Classical pathway"], a: "Terminal complement (MAC)", xp: 50 },
        { id: "i5", name: "Lupus Alert", q: "A 24-year-old woman with malar rash, arthritis, and proteinuria has high titers of anti-double-stranded DNA. Which disease is this most specific for?", o: ["Rheumatoid arthritis", "Scleroderma", "Systemic lupus erythematosus", "Sjögren's syndrome"], a: "Systemic lupus erythematosus", xp: 50 },
        { id: "i6", name: "Autoimmune Assault", q: "A 30-year-old woman develops hemolytic anemia, jaundice, and a positive direct Coombs test with warm-reacting IgG. Which type of hypersensitivity underlies her disease?", o: ["Type I (Immediate)", "Type II (Cytotoxic)", "Type III (Immune Complex)", "Type IV (Delayed)"], a: "Type II (Cytotoxic)", xp: 45 },
        { id: "i7", name: "Th1 Failure", q: "A child with disseminated mycobacterial infections has low IFN-γ levels due to IL-12 receptor deficiency. Which T-helper subset is most directly impaired?", o: ["Th2 response", "Th17 response", "Th1 response", "Treg response"], a: "Th1 response", xp: 45 },
        { id: "i8", name: "Checkpoint Challenge", q: "A patient on ipilimumab for metastatic melanoma develops colitis from enhanced T-cell activation. Which immune checkpoint does ipilimumab block?", o: ["PD-1", "CTLA-4", "CD28", "CD40"], a: "CTLA-4", xp: 45 },
        { id: "i9", name: "Vaccine Venture", q: "A 5-year-old receives the inactivated polio vaccine. Which type of immunity is induced?", o: ["Passive natural", "Active artificial", "Passive artificial", "Active natural"], a: "Active artificial", xp: 40 },
        { id: "i10", name: "Calcineurin Conundrum", q: "A transplant patient is maintained on tacrolimus. This drug inhibits which intracellular target to prevent rejection?", o: ["mTOR", "Calcineurin", "Dihydrofolate reductase", "Proteasome"], a: "Calcineurin", xp: 45 },
        {
            id: "i_boss", name: "Sentinel of Self-Tolerance", boss: true, hp: 200, playerBaseFocus: 3,
            rewards: { currency: 140, items: { shieldCharm: 1 }, logFragment: story.logFragments.i_boss, artifact: "Vial of Clarity fragment" }, // Added artifact
            svgPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", // Completed SVG
            questions: [
                { easy: { q: "Is inflammation a feature of innate immunity?", o: ["No", "Yes"], a: "Yes", damage: 30, focusLoss: 1 }, medium: { q: "Which cell type matures in the bone marrow?", o: ["T-cell", "B-cell", "Macrophage"], a: "B-cell", damage: 40, focusLoss: 1 }, hard: { q: "Case: A 28-year-old man with coarse facies and recurrent Candida infections has high IgE, eczema, and STAT3 mutation. Which pathway is defective?", o: ["Th1 activation", "Humoral B-cell response", "Th17 differentiation"], a: "Th17 differentiation", damage: 50, focusLoss: 2 } },
                { easy: { q: "Do B-cells produce immunoglobulins?", o: ["No", "Yes"], a: "Yes", damage: 30, focusLoss: 1 }, medium: { q: "Which antibody crosses the placenta?", o: ["IgA", "IgE", "IgG"], a: "IgG", damage: 40, focusLoss: 1 }, hard: { q: "Case: A patient with recurrent sinopulmonary infections has low IgG and normal B-cell counts. Which immunodeficiency is most likely?", o: ["XLA", "SCID", "CVID"], a: "CVID", damage: 50, focusLoss: 2 } },
                { easy: { q: "Are helper T-cells CD4+?", o: ["No", "Yes"], a: "Yes", damage: 30, focusLoss: 1 }, medium: { q: "Which thymic process eliminates self-reactive T-cells?", o: ["Positive selection", "Negative selection", "Clonal expansion"], a: "Negative selection", damage: 40, focusLoss: 1 }, hard: { q: "Case: Six weeks post-renal transplant, a patient develops rising creatinine and mononuclear infiltrates on biopsy. Which rejection type is this?", o: ["Hyperacute rejection", "Chronic rejection", "Acute cellular rejection"], a: "Acute cellular rejection", damage: 50, focusLoss: 2 } },
                { easy: { q: "Is complement part of the innate immune system?", o: ["No", "Yes"], a: "Yes", damage: 30, focusLoss: 1 }, medium: { q: "Which process is enhanced by C3b opsonization?", o: ["Phagocytosis", "Antibody production", "Cytokine release"], a: "Phagocytosis", damage: 40, focusLoss: 1 }, hard: { q: "Case: A lupus patient with nephritis has low C3/C4 and granular immune complex deposits on biopsy. Which hypersensitivity mechanism is at work?", o: ["Type II", "Type III", "Type IV"], a: "Type III", damage: 50, focusLoss: 2 } },
                { easy: { q: "Are cytokines signaling proteins?", o: ["No", "Yes"], a: "Yes", damage: 30, focusLoss: 1 }, medium: { q: "Interferons are key in defense against what?", o: ["Parasites", "Viruses", "Fungi"], a: "Viruses", damage: 40, focusLoss: 1 }, hard: { q: "Case: A male infant with failure to thrive and PCP pneumonia has no thymic shadow and normal B cells. A γc chain mutation is found. Which condition?", o: ["XLA", "X-linked SCID", "Wiskott-Aldrich syndrome"], a: "X-linked SCID", damage: 50, focusLoss: 2 } }
            ],
            xp: 200
        }
    ]
}, // <<< Don't forget this comma before 'pharmakon'
pharmakon: {
    id: 'pharmakon', name: "Pharmakon Vaults", icon: '⚗️', order: 5, unlocksAfter: 'immuno', intro: story.worldIntros.pharmakon,
    missions: [
        { id: "p1", name: "Gentamicin Gaffe", q: "A 75-year-old man with stage 4 chronic kidney disease is started on gentamicin for sepsis. His trough levels rise dangerously high. Which discipline studies how to adjust his dosing based on Absorption, Distribution, Metabolism, and Excretion?", o: ["Pharmacodynamics", "Pharmacometrics", "Pharmacogenomics", "Pharmacokinetics"], a: "Pharmacokinetics", xp: 50 },
        { id: "p2", name: "Warfarin Woes", q: "A 60-year-old on warfarin for DVT starts rifampin and his INR falls to 1.2. Which pharmacokinetic interaction explains this?", o: ["Enhanced metabolism", "Drug antagonism", "Synergism", "Altered absorption"], a: "Enhanced metabolism", xp: 50, timeLimit: 20 },
        { id: "p3", name: "Amiodarone Action", q: "A patient with refractory atrial fibrillation is prescribed amiodarone. Its Class III antiarrhythmic effect is primarily due to blockade of which ion channel?", o: ["Chloride channels", "Sodium channels", "Potassium channels", "Calcium channels"], a: "Potassium channels", xp: 55 },
        { id: "p4", name: "Lithium Levels", q: "A 40-year-old with bipolar disorder on chronic lithium presents with tremor and GI upset. Which lab test is most critical to prevent toxicity?", o: ["Serum lithium level", "Thyroid function tests", "Electrolyte panel", "Blood urea nitrogen"], a: "Serum lithium level", xp: 55 },
        { id: "p5", name: "Opioid Overuse", q: "A patient on long-term morphine reports diminished analgesia despite stable dosing. Which receptor-level process most contributes to opioid tolerance?", o: ["Receptor downregulation", "Receptor synthesis", "Receptor internalization", "Receptor desensitization/uncoupling"], a: "Receptor desensitization/uncoupling", xp: 60 },
        { id: "p6", name: "Digoxin Dilemma", q: "A 78-year-old with CHF on digoxin starts verapamil and develops nausea and bradycardia. Which pharmacokinetic mechanism best explains this interaction?", o: ["Inhibition of P-glycoprotein–mediated excretion", "Induction of CYP3A4 metabolism", "Competitive renal secretion", "Inhibition of hepatic uptake"], a: "Inhibition of P-glycoprotein–mediated excretion", xp: 60 },
        { id: "p7", name: "Tylenol Trouble", q: "A 25-year-old presents 24 hours after a massive acetaminophen overdose with ALT 1200 U/L, AST 1000 U/L. The toxic metabolite NAPQI is generated by which enzyme?", o: ["CYP3A4", "CYP2D6", "CYP1A2", "CYP2E1"], a: "CYP2E1", xp: 60 },
        { id: "p8", name: "Serotonin Storm", q: "A 35-year-old on sertraline is started on phenelzine and develops hyperthermia, agitation, and clonus. Which mechanism underlies this syndrome?", o: ["Anticholinergic activity", "Excessive dopamine release", "Inhibition of serotonin reuptake and MAO-A", "Increased GABAergic tone"], a: "Inhibition of serotonin reuptake and MAO-A", xp: 60 },
        { id: "p9", name: "INH Induced Issues", q: "A patient on isoniazid develops lupus-like symptoms with anti-histone antibodies. Slow acetylators of INH have a polymorphism in which enzyme?", o: ["CYP2C19", "N-acetyltransferase 2 (NAT2)", "Glutathione S-transferase", "CYP3A4"], a: "N-acetyltransferase 2 (NAT2)", xp: 60 },
        { id: "p10", name: "Beta-Blocker Blowback", q: "A patient with acute atenolol overdose presents with hypotension and bradycardia unresponsive to fluids. Which antidote is best?", o: ["Atropine", "Calcium gluconate", "Glucagon", "Epinephrine"], a: "Glucagon", xp: 60 },
        {
            id: "p_boss", name: "Dread Formulator", boss: true, hp: 240, playerBaseFocus: 3,
            rewards: { currency: 180, items: { focusVial: 1, shieldCharm: 1 }, logFragment: story.logFragments.p_boss, artifact: "Focus Vial ingredient" }, // Added artifact
            svgPath: "M12 14l9-5-9-5-9 5 9 5z M5 12v6l7 4 7-4v-6", // User SVG
            questions: [
                { easy: { q: "Do antibiotics treat viral infections?", o: ["Yes", "No"], a: "No", damage: 50, focusLoss: 1 }, medium: { q: "Vancomycin binds D-Ala-D-Ala to inhibit synthesis of which bacterial structure?", o: ["Lipopolysaccharide", "Teichoic acid", "Peptidoglycan"], a: "Peptidoglycan", damage: 60, focusLoss: 1 }, hard: { q: "Case: A 60-year-old with metastatic breast cancer on codeine has inadequate analgesia. Genetic testing reveals CYP2D6*4 variant. Which explains her poor response?", o: ["Reduced conversion of codeine to morphine", "Enhanced glucuronidation of morphine", "Increased renal excretion of codeine"], a: "Reduced conversion of codeine to morphine", damage: 80, focusLoss: 2 } },
                { easy: { q: "Can prolonged QT cause Torsades de Pointes?", o: ["Yes", "No"], a: "Yes", damage: 50, focusLoss: 1 }, medium: { q: "Which K⁺ channel is blocked in drug-induced QT prolongation?", o: ["Kir", "hERG (IKr)", "KvLQT1 (IKs)"], a: "hERG (IKr)", damage: 60, focusLoss: 1 }, hard: { q: "Case: A patient on cisapride presents with syncope and polymorphic VT. Cisapride blocks which cardiac current?", o: ["Fast Na⁺ current", "Rapid delayed rectifier K⁺ current", "L-type Ca²⁺ current"], a: "Rapid delayed rectifier K⁺ current", damage: 80, focusLoss: 2 } },
                { easy: { q: "Is serum lithium level used to monitor therapy?", o: ["No", "Yes"], a: "Yes", damage: 55, focusLoss: 1 }, medium: { q: "Lithium reabsorption in the kidney parallels which ion?", o: ["Ca²⁺", "K⁺", "Na⁺"], a: "Na⁺", damage: 65, focusLoss: 1 }, hard: { q: "Case: A 33-year-old on lithium with polyuria has urine osmolality 350 mOsm/kg despite hypernatremia. What’s the mechanism?", o: ["Osmotic diuresis", "Central DI from ADH deficiency", "Nephrogenic DI via ADH receptor uncoupling"], a: "Nephrogenic DI via ADH receptor uncoupling", damage: 85, focusLoss: 2 } },
                { easy: { q: "Does rifampin induce cytochrome P450 enzymes?", o: ["No", "Yes"], a: "Yes", damage: 55, focusLoss: 1 }, medium: { q: "Rifampin reduces levels of which co-administered drug?", o: ["Digoxin", "Phenytoin", "Warfarin"], a: "Warfarin", damage: 65, focusLoss: 1 }, hard: { q: "Case: A TB patient on rifampin metabolizes midazolam rapidly. Which mechanism explains this?", o: ["Induction of CYP3A4", "Inhibition of CYP2D6", "NAT2 acetylation"], a: "Induction of CYP3A4", damage: 85, focusLoss: 2 } },
                { easy: { q: "Does morphine tolerance involve receptor changes?", o: ["Yes", "No"], a: "Yes", damage: 60, focusLoss: 1 }, medium: { q: "Pharmacodynamic tolerance involves changes at the:", o: ["Receptor level", "Metabolism", "Excretion"], a: "Receptor level", damage: 70, focusLoss: 1 }, hard: { q: "Case: A chronic opioid user has increased GRK2 in neurons, leading to µ-receptor phosphorylation. Which process is confirmed?", o: ["Receptor uncoupling from G-proteins", "Increased receptor synthesis", "Enhanced G-protein signaling"], a: "Receptor uncoupling from G-proteins", damage: 90, focusLoss: 2 } }
            ],
            xp: 240
        }
    ]
}, // <<< Don't forget this comma before 'respiratory'
respiratory: {
    id: 'respiratory', name: "Respiratory Stratos", icon: '🌬️', order: 6, unlocksAfter: 'pharmakon', intro: story.worldIntros.respiratory,
    missions: [
        { id: "r1", name: "Acid–Base Alarm", q: "A 58-year-old with COPD presents with acute confusion. ABG on his usual home O₂: pH 7.22, PaCO₂ 70 mmHg, HCO₃⁻ 32 mEq/L. Which best describes his acid–base status?", o: ["Acute respiratory acidosis with appropriate renal compensation", "Chronic respiratory acidosis with appropriate renal compensation", "Acute respiratory acidosis with inadequate renal compensation", "Metabolic alkalosis with respiratory compensation"], a: "Acute respiratory acidosis with inadequate renal compensation", xp: 75 },
        { id: "r2", name: "Diffusion Defect", q: "A 65-year-old non-smoker with progressive dyspnea and Velcro crackles; CT shows reticular opacities. DLCO is 45% predicted. The primary mechanism of his hypoxemia is:", o: ["Decreased pulmonary capillary blood volume", "Increased alveolar–capillary membrane thickness", "Alveolar hypoventilation", "Right-to-left shunt"], a: "Increased alveolar–capillary membrane thickness", xp: 75 },
        { id: "r3", name: "V/Q Verification", q: "A 72-year-old with sudden pleuritic chest pain and tachycardia, Wells score low. Next best step?", o: ["D-dimer assay", "CT pulmonary angiography", "Ventilation–perfusion scan", "Compression ultrasound of legs"], a: "D-dimer assay", xp: 70 },
        { id: "r4", name: "Mechanical Ventilation", q: "A 55-year-old with severe ARDS is on volume-control ventilation. To reduce barotrauma, you target a tidal volume of:", o: ["8 mL/kg ideal body weight", "10 mL/kg ideal body weight", "6 mL/kg ideal body weight", "12 mL/kg ideal body weight"], a: "6 mL/kg ideal body weight", xp: 70 },
        { id: "r5", name: "Bronchitis Breakdown", q: "A 48-year-old smoker with chronic productive cough ≥3 months/yr ×2 years. Biopsy shows mucous gland hyperplasia. The Reid index is most likely:", o: [">0.4", "<0.2", "≈0.1", "≈0.3"], a: ">0.4", xp: 75 },
        { id: "r6", name: "Neonatal Rescue", q: "A preterm infant (30 weeks) develops grunting and ground-glass on CXR at 2 hrs. Mother received betamethasone 24 hrs prior. Best next step:", o: ["Continuous positive airway pressure (CPAP)", "Intubation + surfactant replacement", "High-flow nasal cannula only", "Empiric antibiotics"], a: "Intubation + surfactant replacement", xp: 80 },
        { id: "r7", name: "Light’s Criteria", q: "A 60-year-old with CHF on diuretics has pleural fluid protein/serum protein = 0.7 and LDH fluid/serum = 0.8. The effusion is:", o: ["Exudative", "Transudative", "Chylous", "Hemothorax"], a: "Exudative", xp: 75 },
        { id: "r8", name: "Altitude Adaptation", q: "A healthy mountaineer ascends to 4,000 m. Acute changes include:", o: ["Increased PaCO₂ due to hypoventilation", "Decreased 2,3-BPG in red cells", "Respiratory alkalosis with renal compensation", "Metabolic acidosis from lactic buildup"], a: "Respiratory alkalosis with renal compensation", xp: 75 },
        { id: "r9", name: "Pulmonary Hypertension", q: "A 50-year-old scleroderma patient has dyspnea; RHC shows mean PAP >25 mm Hg, PCWP <15 mm Hg. This pattern indicates:", o: ["Group 1 pulmonary arterial hypertension", "Group 2 pulmonary hypertension", "Group 3 pulmonary hypertension", "Group 4 pulmonary hypertension"], a: "Group 1 pulmonary arterial hypertension", xp: 80 },
        { id: "r10", name: "Alpha-1 Antitrypsin", q: "A 36-year-old non-smoker with panacinar emphysema at bases and liver cirrhosis; α₁-antitrypsin level is 40 mg/dL (normal 100–200). Mechanism of emphysema:", o: ["Uninhibited neutrophil elastase activity", "Excessive α₂-macroglobulin activity", "Autoimmune alveolar destruction", "MMP-9 overproduction by macrophages"], a: "Uninhibited neutrophil elastase activity", xp: 80 },
        {
            id: "r_boss", name: "Gaseous Warden", boss: true, hp: 260, playerBaseFocus: 3,
            rewards: { currency: 200, items: { shieldCharm: 1 }, logFragment: story.logFragments.r_boss, artifact: "Breath of Renewal" }, // Added artifact
            svgPath: "M12 10v6m0-6l-4-4m4 4l4-4m-8 8l-4 4m4-4l4 4", // User SVG
            questions: [
                { easy: { q: "Oxygen diffuses from alveoli to blood, True or False?", o: ["True", "False"], a: "True", damage: 55, focusLoss: 1 }, medium: { q: "Which buffer system compensates acute respiratory acidosis?", o: ["Hemoglobin", "Bicarbonate", "Phosphate"], a: "Bicarbonate", damage: 65, focusLoss: 1 }, hard: { q: "Case: A COPD patient’s ABG shows pH 7.30, PaCO₂ 65, HCO₃⁻ 30. What best describes his status?", o: ["Chronic respiratory acidosis with appropriate metabolic compensation", "Acute respiratory acidosis with appropriate renal compensation", "Mixed respiratory and metabolic acidosis", "Acute respiratory acidosis with inadequate compensation"], a: "Chronic respiratory acidosis with appropriate metabolic compensation", damage: 95, focusLoss: 2 } },
                { easy: { q: "Pneumonia is infection of lung parenchyma, True or False?", o: ["False", "True"], a: "True", damage: 55, focusLoss: 1 }, medium: { q: "Most common CAP pathogen?", o: ["Pseudomonas aeruginosa", "Streptococcus pneumoniae", "Haemophilus influenzae"], a: "Streptococcus pneumoniae", damage: 65, focusLoss: 1 }, hard: { q: "Case: An HIV+ (CD4 80) with PCP pneumonia and sulfa allergy. Best regimen?", o: ["Atovaquone + steroids", "Pentamidine + steroids", "Clindamycin + primaquine + steroids", "Dapsone + trimethoprim"], a: "Clindamycin + primaquine + steroids", damage: 95, focusLoss: 2 } },
                { easy: { q: "ARDS is non-cardiogenic pulmonary edema, True or False?", o: ["True", "False"], a: "True", damage: 60, focusLoss: 1 }, medium: { q: "Histologic hallmark of ARDS?", o: ["Granulomas", "Hyaline membranes", "Fibroblastic foci"], a: "Hyaline membranes", damage: 70, focusLoss: 1 }, hard: { q: "Which adjunct improves survival in severe ARDS (PaO₂/FiO₂ <100)?", o: ["Prone positioning", "High‐frequency oscillatory ventilation", "Inhaled nitric oxide", "Continuous lateral rotational therapy"], a: "Prone positioning", damage: 95, focusLoss: 2 } },
                { easy: { q: "Lower tidal volumes reduce ventilator injury, True or False?", o: ["True", "False"], a: "True", damage: 60, focusLoss: 1 }, medium: { q: "Recommended plateau pressure target in ARDS?", o: ["<30 cm H₂O", "<20 cm H₂O", "<40 cm H₂O"], a: "<30 cm H₂O", damage: 70, focusLoss: 1 }, hard: { q: "Case: A patient on low-Vt strategy remains hypoxemic. Next step?", o: ["Increase FiO₂ to 100%", "Prone positioning + neuromuscular blockade", "High PEEP + recruitment maneuvers", "Switch to pressure control"], a: "Prone positioning + neuromuscular blockade", damage: 95, focusLoss: 2 } },
                { easy: { q: "Alpha-1 antitrypsin deficiency causes emphysema, True or False?", o: ["True", "False"], a: "True", damage: 60, focusLoss: 1 }, medium: { q: "Panacinar emphysema at bases suggests:", o: ["Smoking-related", "Alpha-1 antitrypsin deficiency", "Chronic bronchitis"], a: "Alpha-1 antitrypsin deficiency", damage: 70, focusLoss: 1 }, hard: { q: "In PiZZ genotype, misfolded A1AT accumulates in hepatocytes. Which mechanism underlies lung damage?", o: ["Uninhibited neutrophil elastase", "Autoimmune alveolar destruction", "Excess α₂-macroglobulin"], a: "Uninhibited neutrophil elastase", damage: 95, focusLoss: 2 } }
            ],
            xp: 260
        }
    ]
}, // <<< Don't forget this comma before 'endocrine'
endocrine: {
    id: 'endocrine', name: "Endocrine Isles", icon: '🔮', order: 7, unlocksAfter: 'respiratory', intro: story.worldIntros.endocrine,
    missions: [
        { id: "e1", name: "Cushing Conundrum", q: "A 42-year-old woman presents with weight gain, moon facies, purple striae, and hypertension. 24-hour urinary free cortisol is elevated. Which test best differentiates pituitary from ectopic ACTH production?", o: ["High-dose dexamethasone suppression test", "Low-dose dexamethasone suppression test", "CRH stimulation test", "Midnight salivary cortisol"], a: "High-dose dexamethasone suppression test", xp: 80 },
        { id: "e2", name: "Diabetic Crisis", q: "A 19-year-old with type 1 diabetes presents with nausea, abdominal pain, Kussmaul respirations, glucose 550 mg/dL, pH 7.15, bicarbonate 12 mEq/L. After starting IV fluids and insulin, his potassium is 3.0 mEq/L. What is your next step?", o: ["Give IV potassium before continuing insulin", "Continue insulin and fluids without potassium", "Add sodium bicarbonate to IV fluids", "Switch to subcutaneous insulin"], a: "Give IV potassium before continuing insulin", xp: 85 },
        { id: "e3", name: "Thyroid Thunder", q: "A 28-year-old with weight loss, heat intolerance, exophthalmos, and diffuse goiter. TSH is low, free T4 high. Radioactive iodine uptake is diffusely increased. Diagnosis?", o: ["Toxic multinodular goiter", "Subacute thyroiditis", "Graves’ disease", "Factitious thyrotoxicosis"], a: "Graves’ disease", xp: 75 },
        { id: "e4", name: "Prolactin Puzzle", q: "A 30-year-old woman with amenorrhea and galactorrhea has a prolactin level of 150 ng/mL and MRI shows 8 mm pituitary lesion. First-line therapy?", o: ["Cabergoline", "Transsphenoidal surgery", "Estrogen/progestin OCPs", "Radiation therapy"], a: "Cabergoline", xp: 80 },
        { id: "e5", name: "Addison’s Alarm", q: "A 45-year-old with hyperpigmentation, weight loss, and hypotension. AM cortisol is low, ACTH is elevated. Best confirmatory test?", o: ["Cosyntropin (ACTH) stimulation test", "Low-dose dexamethasone suppression test", "Plasma renin activity", "Insulin tolerance test"], a: "Cosyntropin (ACTH) stimulation test", xp: 80 },
        { id: "e6", name: "Pheo Primer", q: "A 38-year-old with episodic headaches, sweating, palpitations, and hypertension. Plasma free metanephrines are elevated. Next best step before surgery?", o: ["Phenoxybenzamine (alpha-blockade)", "Beta-blockade alone", "Calcium channel blocker", "High-dose corticosteroids"], a: "Phenoxybenzamine (alpha-blockade)", xp: 85 },
        { id: "e7", name: "MEN Marker", q: "A patient has medullary thyroid carcinoma, pheochromocytoma, and parathyroid hyperplasia. Which MEN syndrome?", o: ["MEN 1", "MEN 2A", "MEN 2B", "MEN 4"], a: "MEN 2A", xp: 75 },
        { id: "e8", name: "Calcium Curveball", q: "A 55-year-old with stones, bones, abdominal groans, and psychiatric moans has serum calcium 12.8 mg/dL, PTH suppressed. Which is most likely?", o: ["Primary hyperparathyroidism", "Vitamin D intoxication", "Humoral hypercalcemia of malignancy (PTHrP)", "Granulomatous disease"], a: "Humoral hypercalcemia of malignancy (PTHrP)", xp: 80 },
        { id: "e9", name: "DI Dilemma", q: "A 28-year-old with polyuria, polydipsia, serum sodium 150 mEq/L. Water deprivation test fails to concentrate urine, but desmopressin restores concentration. Diagnosis?", o: ["Nephrogenic DI", "Primary polydipsia", "Central DI", "Psychogenic DI"], a: "Central DI", xp: 80 },
        { id: "e10", name: "Acromegaly Approach", q: "A 50-year-old with coarse facial features and enlarged hands; IGF-1 is elevated. She declines surgery. Long-term medical therapy?", o: ["Octreotide (somatostatin analog)", "Cabergoline", "Pegvisomant (GH receptor antagonist)", "Dopamine"], a: "Octreotide (somatostatin analog)", xp: 85 },
        {
            id: "e_boss", name: "Overlord of Overproduction", boss: true, hp: 300, playerBaseFocus: 3,
            rewards: { currency: 220, items: { hintToken: 1 }, logFragment: story.logFragments.e_boss, artifact: "Scepter of Homeostasis" }, // Added artifact
            svgPath: "M17.25 6.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM15.75 9.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 15.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM11.25 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM10.75 6.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0zM9.25 9.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0zM7.75 12.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0zM6.25 15.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0zM4.75 18.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0z", // Abstract signal/balance path
            questions: [
                { easy: { q: "Is cortisol produced by the adrenal cortex?", o: ["No", "Yes"], a: "Yes", damage: 60, focusLoss: 1 }, medium: { q: "In an adrenal adenoma causing Cushing's syndrome, ACTH is expected to be:", o: ["High", "Low", "Normal"], a: "Low", damage: 70, focusLoss: 1 }, hard: { q: "Case: A patient with ACTH-producing small cell lung cancer has cortisol 50 µg/dL, ACTH high, high-dose dexamethasone fails to suppress. Which best explains?", o: ["Ectopic ACTH is unresponsive to negative feedback", "Pituitary adenoma has mutated glucocorticoid receptor", "Adrenal carcinoma produces cortisol autonomously", "Exogenous steroid use"], a: "Ectopic ACTH is unresponsive to negative feedback", damage: 95, focusLoss: 2 } },
                { easy: { q: "T4 is converted to the more active T3 in peripheral tissues, True or False?", o: ["True", "False"], a: "True", damage: 60, focusLoss: 1 }, medium: { q: "Graves’ ophthalmopathy is mediated by:", o: ["Anti-TSH receptor antibodies", "Anti-thyroglobulin antibodies", "T-cell infiltration only"], a: "Anti-TSH receptor antibodies", damage: 70, focusLoss: 1 }, hard: { q: "Case: A patient in thyroid storm is started on PTU, propranolol, and potassium iodide. What is the rationale for giving iodide at least 1 hr after PTU?", o: ["To inhibit thyroid hormone release after blocking synthesis", "To prevent organification blockade", "To enhance peripheral T4 to T3 conversion", "To minimize iodide-induced thyrotoxicosis"], a: "To inhibit thyroid hormone release after blocking synthesis", damage: 95, focusLoss: 2 } },
                { easy: { q: "PTH increases serum calcium levels, True or False?", o: ["True", "False"], a: "True", damage: 60, focusLoss: 1 }, medium: { q: "PTH acts on the kidney to increase calcium reabsorption in the:", o: ["Distal convoluted tubule", "Proximal tubule", "Collecting duct"], a: "Distal convoluted tubule", damage: 70, focusLoss: 1 }, hard: { q: "Case: A patient with hypercalcemia has calcium 14 mg/dL, PTH low, PTHrP elevated. Which malignancy classically causes this pattern?", o: ["Squamous cell lung carcinoma", "Multiple myeloma", "Papillary thyroid carcinoma", "Small cell lung carcinoma"], a: "Squamous cell lung carcinoma", damage: 95, focusLoss: 2 } },
                { easy: { q: "Type 1 diabetes is autoimmune-mediated, True or False?", o: ["True", "False"], a: "True", damage: 60, focusLoss: 1 }, medium: { q: "Diagnostic fasting glucose threshold for diabetes is ≥:", o: ["126 mg/dL", "110 mg/dL", "100 mg/dL"], a: "126 mg/dL", damage: 70, focusLoss: 1 }, hard: { q: "Case: A patient with DKA has K⁺ 5.5 mEq/L before treatment. After initial fluids and insulin, K⁺ falls to 3.0 mEq/L. Best next step?", o: ["Administer IV potassium chloride", "Continue insulin without potassium", "Give sodium bicarbonate", "Switch to subcutaneous insulin"], a: "Administer IV potassium chloride", damage: 95, focusLoss: 2 } },
                { easy: { q: "GH is produced by the anterior pituitary, True or False?", o: ["True", "False"], a: "True", damage: 60, focusLoss: 1 }, medium: { q: "IGF-1 reflects integrated GH secretion better than random GH, True or False?", o: ["True", "False"], a: "True", damage: 70, focusLoss: 1 }, hard: { q: "Case: A patient with acromegaly on octreotide therapy still has IGF-1 above normal. Next step?", o: ["Add pegvisomant (GH receptor antagonist)", "Increase octreotide dose", "Switch to cabergoline"], a: "Add pegvisomant (GH receptor antagonist)", damage: 95, focusLoss: 2 } }
            ],
            xp: 300
        }
    ]
}, // <<< Don't forget this comma before 'renal'
renal: {
    id: 'renal', name: "Renal Abyss", icon: '🌊', order: 8, unlocksAfter: 'endocrine', intro: story.worldIntros.renal,
    missions: [
        { id: "re1", name: "Podocyte Peril", q: "A patient presents with massive proteinuria and hypoalbuminemia. Electron microscopy shows diffuse effacement of foot processes. Which disease is most likely?", o: ["Membranous nephropathy", "Minimal change disease", "Focal segmental glomerulosclerosis", "Membranoproliferative GN"], a: "Minimal change disease", xp: 80 },
        { id: "re2", name: "Water Balance", q: "A hyponatremic patient (Na⁺ 122) with euvolemia and urine osmolality >500 mOsm/kg most likely has:", o: ["Nephrogenic diabetes insipidus", "SIADH", "Primary polydipsia", "Central diabetes insipidus"], a: "SIADH", xp: 80, timeLimit: 20 },
        { id: "re3", name: "Prerenal Puzzle", q: "A patient with dehydration has BUN:Cr ratio of 28:1 and fractional excretion of sodium 0.4%. This indicates:", o: ["Intrinsic renal failure (ATN)", "Prerenal azotemia", "Postrenal obstruction", "Chronic kidney disease"], a: "Prerenal azotemia", xp: 85 },
        { id: "re4", name: "Acid–Base Arena", q: "A diabetic in DKA has pH 7.10, HCO₃⁻ 8, anion gap 24. After fluids, ABG shows pH 7.30, HCO₃⁻ 12. Which best describes?", o: ["Mixed metabolic acidosis and respiratory alkalosis", "Compensated metabolic acidosis", "Acute respiratory acidosis", "Mixed metabolic acidosis and metabolic alkalosis"], a: "Mixed metabolic acidosis and respiratory alkalosis", xp: 85 },
        { id: "re5", name: "Stone Signal", q: "A 35-year-old with recurrent kidney stones in acidic urine; stones are radiolucent on X-ray. Most likely composition?", o: ["Calcium oxalate", "Struvite", "Uric acid", "Cystine"], a: "Uric acid", xp: 90 },
        { id: "re6", name: "Polycystic Clue", q: "A patient with autosomal dominant polycystic kidney disease also has intracranial berry aneurysms. Mutation is in which gene?", o: ["PKD1", "PKHD1", "PAX2", "COL4A5"], a: "PKD1", xp: 90 },
        { id: "re7", name: "Dialysis Dilemma", q: "A long-term hemodialysis patient develops joint pain. Biopsy shows β₂-microglobulin amyloid. This is most associated with:", o: ["Uremic toxins", "Accumulation of dialysis filter proteins", "Dialysis-related amyloidosis", "Chronic immunosuppression"], a: "Dialysis-related amyloidosis", xp: 95 },
        { id: "re8", name: "RTA Recognition", q: "A patient has non-anion gap metabolic acidosis, urine pH 6.5, hypokalemia. Which type of RTA?", o: ["Type 2 (proximal)", "Type 1 (distal)", "Type 4 (hyperkalemic)", "Type 3 (mixed)"], a: "Type 1 (distal)", xp: 95 },
        { id: "re9", name: "Nephron Nexus", q: "In AKI, granular “muddy brown” casts indicate injury to which part of the nephron?", o: ["Collecting duct", "Proximal tubule", "Glomerulus", "Loop of Henle"], a: "Proximal tubule", xp: 90 },
        { id: "re10", name: "CKD Complications", q: "A CKD patient has anemia, bone pain, and vascular calcifications. Which pathophysiologic process underlies his bone disease?", o: ["Primary hyperparathyroidism", "Secondary hyperparathyroidism", "Vitamin D intoxication", "Metastatic calcification"], a: "Secondary hyperparathyroidism", xp: 100 },
        {
            id: "re_boss", name: "Monsoon Leviathan", boss: true, hp: 320, playerBaseFocus: 3,
            rewards: { currency: 260, items: { shieldCharm: 1 }, logFragment: story.logFragments.re_boss, artifact: "Keystone of Clearance" }, // Added artifact
            svgPath: "M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z", // Completed SVG
            questions: [
                { easy: { q: "Do podocytes form part of the glomerular filtration barrier?", o: ["No", "Yes"], a: "Yes", damage: 65, focusLoss: 1 }, medium: { q: "In minimal change disease, immune complexes are:", o: ["Subepithelial", "Subendothelial", "Not visible on light microscopy", "Mesangial"], a: "Not visible on light microscopy", damage: 75, focusLoss: 1 }, hard: { q: "Case: A child with nephrotic syndrome fails steroids and develops hypertension. Renal biopsy shows segmental sclerosis and hyalinosis. Which therapy is next?", o: ["Cyclophosphamide", "Tacrolimus", "Rituximab", "ACE inhibitor"], a: "Tacrolimus", damage: 95, focusLoss: 2 } },
                { easy: { q: "Is a BUN:Cr >20:1 suggestive of prerenal azotemia?", o: ["True", "False"], a: "True", damage: 65, focusLoss: 1 }, medium: { q: "Fractional excretion of sodium <1% indicates:", o: ["Prerenal azotemia", "ATN", "Postrenal obstruction"], a: "Prerenal azotemia", damage: 75, focusLoss: 1 }, hard: { q: "Case: A hypotensive ICU patient on diuretics has FENa 2.5% and FEUrea 25%. What is the likely cause of his AKI?", o: ["Intrinsic renal (ATN)", "Prerenal azotemia", "Postrenal obstruction"], a: "Intrinsic renal (ATN)", damage: 95, focusLoss: 2 } },
                { easy: { q: "Does hemodialysis remove small solutes via diffusion?", o: ["No", "Yes"], a: "Yes", damage: 70, focusLoss: 1 }, medium: { q: "Dialysis-related amyloidosis involves deposition of:", o: ["β₂-microglobulin", "Immunoglobulin light chains", "Amyloid A"], a: "β₂-microglobulin", damage: 80, focusLoss: 1 }, hard: { q: "Case: A dialysis patient develops carpal tunnel syndrome and joint arthropathy. Which preventive strategy is best?", o: ["Use high-flux dialyzers", "Increase dialysis frequency", "Supplement with vitamin D"], a: "Use high-flux dialyzers", damage: 100, focusLoss: 2 } },
                { easy: { q: "Type 1 RTA is distal, True or False?", o: ["True", "False"], a: "True", damage: 70, focusLoss: 1 }, medium: { q: "In distal RTA, urine pH is typically:", o: ["<5.5", ">5.5", "≈4.0"], a: ">5.5", damage: 80, focusLoss: 1 }, hard: { q: "Case: A patient with RTA type 4 has hyperkalemia and mild metabolic acidosis. Which electrolyte disturbance contributes most to his acidosis?", o: ["Hyporeninemic hypoaldosteronism", "Excess bicarbonate loss", "Increased ammonia production"], a: "Hyporeninemic hypoaldosteronism", damage: 100, focusLoss: 2 } },
                { easy: { q: "Is anemia common in CKD?", o: ["No", "Yes"], a: "Yes", damage: 70, focusLoss: 1 }, medium: { q: "CKD anemia is due to reduced production of:", o: ["Calcitriol", "Erythropoietin", "Renin"], a: "Erythropoietin", damage: 80, focusLoss: 1 }, hard: { q: "Case: A CKD patient on EPO therapy has rising PTH and bone pain. Which lab finding best explains secondary hyperparathyroidism?", o: ["Low 1,25-dihydroxyvitamin D", "High serum calcium", "Low serum phosphate"], a: "Low 1,25-dihydroxyvitamin D", damage: 100, focusLoss: 2 } }
            ],
            xp: 320
        }
    ]
}, // <<< Don't forget this comma before 'oncocrypts'
oncocrypts: {
    id: 'oncocrypts', name: "Oncocrypts", icon: '🧬', order: 9, unlocksAfter: 'renal', intro: story.worldIntros.oncocrypts,
    missions: [
        { id: "o1", name: "Philadelphia Crisis", q: "A 62-year-old presents with leukocytosis, splenomegaly, and BCR-ABL fusion on cytogenetics. Which class of drug is first-line therapy?", o: ["Monoclonal antibodies", "Tyrosine kinase inhibitors", "Alkylating agents", "Antimetabolites"], a: "Tyrosine kinase inhibitors", xp: 90 },
        { id: "o2", name: "APML Alarm", q: "A 35-year-old with acute promyelocytic leukemia (t(15;17)) develops DIC. What agent induces differentiation of the malignant cells?", o: ["Daunorubicin", "Arsenic trioxide", "All-trans retinoic acid", "Cytarabine"], a: "All-trans retinoic acid", xp: 95 },
        { id: "o3", name: "Marker Mystique", q: "A 55-year-old with painless jaundice and weight loss has a pancreatic head mass. Which tumor marker is most likely elevated?", o: ["AFP", "CEA", "CA19-9", "PSA"], a: "CA19-9", xp: 85 },
        { id: "o4", name: "Lysis Labyrinth", q: "A 10-year-old with newly diagnosed ALL is started on induction chemo and develops hyperuricemia and oliguria. What prophylactic agent should have been given?", o: ["Allopurinol", "Hydrochlorothiazide", "Rasburicase", "Probenecid"], a: "Rasburicase", xp: 95 },
        { id: "o5", name: "Bone Breakdown", q: "A woman with metastatic breast cancer has osteolytic lesions and hypercalcemia. Which drug mechanism helps reduce skeletal-related events?", o: ["Stimulate osteoblast activity", "Inhibit osteoclast activity", "Increase renal calcium excretion", "Block PTH receptor"], a: "Inhibit osteoclast activity", xp: 90 },
        { id: "o6", name: "Checkpoint Challenge", q: "A 58-year-old with metastatic melanoma receives pembrolizumab. Which pathway is being blocked?", o: ["CTLA-4", "PD-L1", "PD-1", "B7"], a: "PD-1", xp: 90 },
        { id: "o7", name: "CAR T Conquest", q: "A child with refractory B-ALL is enrolled for CAR T therapy targeting CD19. Which cell is genetically modified?", o: ["Natural killer cells", "T cells", "B cells", "Macrophages"], a: "T cells", xp: 95 },
        { id: "o8", name: "EGFR Enigma", q: "A 63-year-old with EGFR-mutant NSCLC (L858R) is started on targeted therapy. Which drug is appropriate?", o: ["Bevacizumab", "Pembrolizumab", "Erlotinib", "Pemetrexed"], a: "Erlotinib", xp: 95 },
        { id: "o9", name: "Resistance Riddle", q: "A CML patient on imatinib develops a T315I mutation and loses response. Which agent remains effective?", o: ["Nilotinib", "Dasatinib", "Bosutinib", "Ponatinib"], a: "Ponatinib", xp: 100 },
        { id: "o10", name: "Retinoblastoma Rule", q: "A toddler with unilateral retinoblastoma is found to have a germline RB1 mutation. RB1 is classified as a:", o: ["Proto-oncogene", "DNA repair gene", "Tumor suppressor gene", "Growth factor"], a: "Tumor suppressor gene", xp: 90 },
        {
            id: "o_boss", name: "Grand Malignant", boss: true, hp: 360, playerBaseFocus: 4,
            rewards: { currency: 280, items: { focusVial: 1, hintToken: 1, shieldCharm: 1 }, logFragment: story.logFragments.o_boss, artifact: "Integrity Protocol" }, // Added artifact
            svgPath: "M11.418 2.022a.75.75 0 01.704-.011l6.25 3.341a.75.75 0 010 1.319l-6.25 3.341a.75.75 0 01-.704-.01L5.168 6.67a.75.75 0 010-1.319l6.25-3.34ZM11.418 12.978a.75.75 0 01.704-.011l6.25 3.341a.75.75 0 010 1.319l-6.25 3.341a.75.75 0 01-.704-.01L5.168 17.63a.75.75 0 010-1.319l6.25-3.34Z", // Completed SVG
            questions: [
                { easy: { q: "Is chemotherapy generally cytotoxic to rapidly dividing cells?", o: ["No", "Yes"], a: "Yes", damage: 70, focusLoss: 1 }, medium: { q: "Anthracyclines like doxorubicin intercalate DNA and inhibit which enzyme?", o: ["Topoisomerase II", "DNA polymerase", "RNA polymerase", "Telomerase"], a: "Topoisomerase II", damage: 80, focusLoss: 1 }, hard: { q: "Case: A patient on doxorubicin develops cardiomyopathy years later. Which mechanism is implicated?", o: ["Mitochondrial iron accumulation → ROS generation", "Autoimmune myocarditis", "Microvascular ischemia", "Beta-adrenergic receptor blockade"], a: "Mitochondrial iron accumulation → ROS generation", damage: 100, focusLoss: 2 } },
                { easy: { q: "Does radiation therapy kill cancer cells by DNA damage?", o: ["No", "Yes"], a: "Yes", damage: 75, focusLoss: 1 }, medium: { q: "Brachytherapy involves placing radiation source:", o: ["Systemically via IV", "Inside/next to the tumor", "Externally across skin"], a: "Inside/next to the tumor", damage: 85, focusLoss: 1 }, hard: { q: "Which isotope is used to ablate thyroid tissue in follicular thyroid carcinoma?", o: ["Iodine-131", "Technetium-99m", "Cobalt-60", "Strontium-89"], a: "Iodine-131", damage: 100, focusLoss: 2 } },
                { easy: { q: "Is CAR T therapy personalized by modifying patient’s own cells?", o: ["No", "Yes"], a: "Yes", damage: 75, focusLoss: 1 }, medium: { q: "CAR T cells targeting CD19 are used for:", o: ["T-cell lymphomas", "B-cell leukemias/lymphomas", "Solid tumors"], a: "B-cell leukemias/lymphomas", damage: 85, focusLoss: 1 }, hard: { q: "Case: A patient post–CAR T develops fever, hypotension, and elevated IL-6. Which is first-line management?", o: ["Tocilizumab (anti–IL-6R)", "High-dose steroids", "TNF-α inhibitors", "IV immunoglobulin"], a: "Tocilizumab (anti–IL-6R)", damage: 100, focusLoss: 2 } },
                { easy: { q: "Are monoclonal antibodies used to target specific tumor antigens?", o: ["No", "Yes"], a: "Yes", damage: 75, focusLoss: 1 }, medium: { q: "Rituximab targets which antigen on B cells?", o: ["CD20", "CD3", "CD33", "CD19"], a: "CD20", damage: 85, focusLoss: 1 }, hard: { q: "ADC linkers designed to be cleaved inside tumor cells are called:", o: ["Non-cleavable", "Cleavable", "PEGylated"], a: "Cleavable", damage: 100, focusLoss: 2 } },
                { easy: { q: "Blocking PD-1/PD-L1 enhances T-cell activity against tumors, True or False?", o: ["False", "True"], a: "True", damage: 80, focusLoss: 1 }, medium: { q: "PD-L1 is expressed on tumor cells to:", o: ["Activate T cells", "Suppress T cells via PD-1", "Stimulate NK cells"], a: "Suppress T cells via PD-1", damage: 90, focusLoss: 1 }, hard: { q: "Case: A melanoma patient develops colitis after anti–CTLA-4 therapy. Which is the most appropriate management?", o: ["Infliximab (anti–TNF-α)", "High-dose IL-2", "IV rituximab", "Antibiotics only"], a: "Infliximab (anti–TNF-α)", damage: 105, focusLoss: 2 } }
            ],
            xp: 360
        } // <<< FIXED: Added missing closing brace here
    ]
},
    // --- End of Placeholder Worlds ---

    // --- REPLACE the existing nexus world block in gameData with this ---
nexus: {
        id: 'nexus', name: "The Final Convergence", icon: '✨', order: 99, unlocksAfter: 'oncocrypts', intro: story.worldIntros.nexus, // High order, unlocks after Oncocrypts
        missions: [
             {   id: "nexus_boss", // Renamed from n_boss to avoid conflict
                 name: "The Anomaly (Sentinel 734)",
                 boss: true,
                 finalBoss: true, // Mark this as the final boss
                 hp: 500, playerBaseFocus: 5,
                 rewards: { currency: 500, skillPoints: 5 }, // Added skill points reward
                 svgPath: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z M12 12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z", // Example SVG
                 questions: [
                     // This boss synthesizes knowledge from all previous worlds
                     { easy: { q: "What is the main function of red blood cells?", o: ["Fight infection", "Carry oxygen", "Clot blood"], a: "Carry oxygen", damage: 80, focusLoss: 1 }, medium: { q: "Which part of the brain controls balance and coordination?", o: ["Cerebrum", "Cerebellum", "Brainstem"], a: "Cerebellum", damage: 100, focusLoss: 1 }, hard: { q: "What is the primary site of nutrient absorption in the digestive system?", o: ["Stomach", "Large intestine", "Small intestine"], a: "Small intestine", damage: 120, focusLoss: 2 } },
                     { easy: { q: "Is the heart a muscle?", o: ["Yes", "No"], a: "Yes", damage: 80, focusLoss: 1 }, medium: { q: "Which hormone regulates blood sugar by raising it?", o: ["Insulin", "Glucagon", "Cortisol"], a: "Glucagon", damage: 100, focusLoss: 1 }, hard: { q: "What is the term for a decrease in the size of cells or tissues?", o: ["Hypertrophy", "Atrophy", "Hyperplasia"], a: "Atrophy", damage: 120, focusLoss: 2 } },
                     { easy: { q: "Do white blood cells fight infection?", o: ["Yes", "No"], a: "Yes", damage: 80, focusLoss: 1 }, medium: { q: "Which vitamin is essential for vision?", o: ["Vitamin C", "Vitamin D", "Vitamin A"], a: "Vitamin A", damage: 100, focusLoss: 1 }, hard: { q: "What is the name for the process by which mRNA is synthesized from a DNA template?", o: ["Translation", "Replication", "Transcription"], a: "Transcription", damage: 120, focusLoss: 2 } },
                     { easy: { q: "Is the liver important for digestion?", o: ["Yes", "No"], a: "Yes", damage: 80, focusLoss: 1 }, medium: { q: "Which part of the kidney filters blood?", o: ["Tubule", "Collecting duct", "Glomerulus"], a: "Glomerulus", damage: 100, focusLoss: 1 }, hard: { q: "What is the primary function of the myelin sheath around nerve fibers?", o: ["Provide nutrients", "Insulate and speed up nerve impulses", "Remove waste products"], a: "Insulate and speed up nerve impulses", damage: 120, focusLoss: 2 } },
                     { easy: { q: "Are bones part of the skeletal system?", o: ["Yes", "No"], a: "Yes", damage: 80, focusLoss: 1 }, medium: { q: "Which hormone is responsible for the 'fight or flight' response?", o: ["Cortisol", "Adrenaline (Epinephrine)", "Insulin"], a: "Adrenaline (Epinephrine)", damage: 100, focusLoss: 1 }, hard: { q: "What is the term for a substance that causes an allergic reaction?", o: ["Antibody", "Antigen", "Allergen"], a: "Allergen", damage: 120, focusLoss: 2 } }
                 ], xp: 500 } // Final boss gives significant XP
              ]
    }
};


// --- Global Variables ---
// DOM Element References (initialized in DOMContentLoaded)
let levelEl, xpEl, nextXpEl, streakEl, xpBarFillEl, worldsContainer,
    worldSelectScreen, missionSelectScreen, challengeScreen, worldTitleEl,
    missionListEl, challengeTitleEl, questionEl, optionsEl, feedbackEl,
    nextBtn, bgMusicEl, toggleMusicBtn, musicIconOn, musicIconOff, musicBtnText,
    achievementToastEl, achievementsModalEl, achievementsListEl, perksModalEl,
    perksListEl, skillPointsDisplayEl, settingsModalEl, musicVolumeSlider, sfxVolumeSlider,
    statsModalEl, statsListEl, shopModalEl, shopItemsListEl, shopCurrencyDisplayEl,
    summaryModalEl, summaryTitleEl, summaryDetailsEl,
    bossBattleUI, bossNameEl, bossHpFillEl, bossHpTextEl, bossStatusEl, bossVisualEl,
    playerFocusFillEl, playerFocusTextEl, itemsUiEl, skillPointsStatEl, currencyStatEl,
    timerDisplayEl, modifierDisplayEl, difficultyChoiceEl, difficultySettingsButtonsEl,
    introTextEl, worldIntroTextEl; // Added elements for story text

// --- Core Game Logic Variables ---
let currentWorldId = null;       // ID of the currently selected world
let currentMission = null;       // Data of the currently active mission (potentially modified)
let originalMissionData = null;  // Unmodified data of the current mission
let currentBossState = null;     // State object for the current boss battle
let activeScreenId = 'world-select-screen'; // ID of the currently visible screen
let streakSavedThisMission = false; // Flag for the Streak Saver perk (reset per mission)
let challengeTimerInterval = null; // Interval ID for the mission timer
let remainingTime = 0;           // Remaining seconds for timed missions
let hintUsedThisQuestion = false; // Flag to prevent using multiple hints per question
let missionSummaryData = {};     // Data collected for the end-of-mission summary

// --- Screen Navigation ---
const switchScreen = (newScreenId) => {
    if (activeScreenId === newScreenId) return;
    const newScreen = document.getElementById(newScreenId);
    const currentScreen = document.getElementById(activeScreenId);
    if (currentScreen) currentScreen.classList.add('hidden');
    if (newScreen) newScreen.classList.remove('hidden');
    activeScreenId = newScreenId;
    window.scrollTo(0, 0);
};

// --- Modal Management ---
const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    playSound('click');
    if (modalId === 'achievements-modal') populateAchievementsModal();
    if (modalId === 'perks-modal') populatePerksModal();
    if (modalId === 'settings-modal') loadSettings();
    if (modalId === 'stats-modal') populateStatsModal();
    if (modalId === 'shop-modal') populateShopModal();
    modal.classList.remove('modal-hidden');
    modal.classList.add('modal-visible');
};

const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    playSound('click');
    modal.classList.add('modal-hidden');
    modal.classList.remove('modal-visible');
};

// --- Achievements Logic ---
const showAchievementToast = (achievementId) => {
    const achievement = gameData.achievements[achievementId];
    if (!achievement || !achievementToastEl) return;
    playSound('achievement');
    achievementToastEl.className = 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 p-4 rounded-lg shadow-lg border border-yellow-600 flex items-center space-x-3 fixed top-4 left-1/2 transform -translate-x-1/2 z-50';
    achievementToastEl.style.animation = 'none';
    achievementToastEl.offsetHeight; // Trigger reflow
    achievementToastEl.style.animation = 'slide-in-out 4s ease-in-out forwards';
    achievementToastEl.innerHTML = `
        <svg class="icon w-6 h-6 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div><p class="font-semibold">Achievement Unlocked!</p><p class="text-sm">${achievement.name}</p></div>`;
};

const checkAchievements = () => {
    let newAchievementUnlocked = false;
    Object.entries(gameData.achievements).forEach(([id, achievement]) => {
        if (!player.unlockedAchievements.includes(id)) {
            try {
                if (achievement.condition(player)) {
                    player.unlockedAchievements.push(id);
                    showAchievementToast(id);
                    newAchievementUnlocked = true;
                }
            } catch (error) { console.error(`Error checking achievement ${id}:`, error); }
        }
    });
    if (newAchievementUnlocked) {
        saveGame();
        if (achievementsModalEl && !achievementsModalEl.classList.contains('modal-hidden')) {
            populateAchievementsModal();
        }
    }
};

const populateAchievementsModal = () => {
    if (!achievementsListEl) return;
    achievementsListEl.innerHTML = '';
    const allAchievementIds = Object.keys(gameData.achievements);
    const unlockedIds = player.unlockedAchievements;
    const lockedIds = allAchievementIds.filter(id => !unlockedIds.includes(id));

    if (allAchievementIds.length === 0) {
        achievementsListEl.innerHTML = '<p class="text-gray-400 italic">No achievements defined.</p>'; return;
    }
    if (unlockedIds.length > 0) {
        unlockedIds.forEach(id => {
            const achievement = gameData.achievements[id]; if (!achievement) return;
            const el = document.createElement('div');
            el.className = 'bg-green-800/50 border border-green-600 p-3 rounded-lg flex items-center space-x-3';
            el.innerHTML = `<svg class="icon w-6 h-6 text-green-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><div><p class="font-semibold text-green-300">${achievement.name}</p><p class="text-sm text-gray-300">${achievement.description}</p></div>`;
            achievementsListEl.appendChild(el);
        });
    }
    if (lockedIds.length > 0) {
        if (unlockedIds.length === 0) { achievementsListEl.innerHTML = '<p class="text-gray-400 italic">No achievements unlocked yet.</p>'; }
        lockedIds.forEach(id => {
            const achievement = gameData.achievements[id]; if (!achievement) return;
            const el = document.createElement('div');
            el.className = 'bg-gray-700/50 border border-gray-600 p-3 rounded-lg flex items-center space-x-3 opacity-60';
            el.innerHTML = `<svg class="icon w-6 h-6 text-gray-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg><div><p class="font-semibold text-gray-400">${achievement.name}</p><p class="text-sm text-gray-500">${achievement.description}</p></div>`;
            achievementsListEl.appendChild(el);
        });
    }
};


// --- Perks Logic ---
const getPerkValue = (effectTarget) => {
    return player.unlockedPerks.reduce((total, perkId) => {
        const perk = gameData.perks[perkId];
        return (perk && perk.type === 'passive' && perk.effectTarget === effectTarget) ? total + (perk.value || 0) : total;
    }, 0);
};
const hasPerk = (perkId) => player.unlockedPerks.includes(perkId);

const populatePerksModal = () => { /* ... (Perk population logic - unchanged) ... */
    if (!perksListEl || !skillPointsDisplayEl) return;
    perksListEl.innerHTML = '';
    skillPointsDisplayEl.textContent = player.skillPoints;
    Object.entries(gameData.perks).forEach(([id, perk]) => {
        const isUnlocked = player.unlockedPerks.includes(id);
        const canAfford = player.skillPoints >= perk.cost;
        const meetsLevelReq = player.level >= perk.requiresLevel;
        const meetsPerkReq = !perk.requiresPerk || player.unlockedPerks.includes(perk.requiresPerk);
        const canUnlock = !isUnlocked && canAfford && meetsLevelReq && meetsPerkReq;
        const el = document.createElement('div');
        el.className = `border p-3 rounded-lg flex justify-between items-center ${isUnlocked ? 'bg-purple-800/50 border-purple-600' : 'bg-gray-700/50 border-gray-600'} ${!meetsLevelReq || !meetsPerkReq ? 'opacity-50' : ''}`;
        let requirementText = `Requires Level ${perk.requiresLevel}`;
        if (perk.requiresPerk) { const reqPerk = gameData.perks[perk.requiresPerk]; requirementText += `, requires ${reqPerk?.name || 'previous perk'}`; }
        el.innerHTML = `<div><p class="font-semibold ${isUnlocked ? 'text-purple-300' : 'text-gray-300'}">${perk.name}</p><p class="text-sm ${isUnlocked ? 'text-gray-300' : 'text-gray-400'}">${perk.description}</p><p class="text-xs ${isUnlocked ? 'text-gray-400' : 'text-gray-500'}">${requirementText}</p></div><button onclick="unlockPerk('${id}')" class="perk-button bg-green-600 hover:bg-green-500 text-white text-xs font-semibold py-1 px-3 rounded-full transition duration-200 ${isUnlocked || !canUnlock ? 'hidden' : ''}">Unlock (${perk.cost} SP)</button><span class="text-xs font-semibold text-green-400 ${isUnlocked ? '' : 'hidden'}">Unlocked</span><span class="text-xs font-semibold text-red-400 ${!isUnlocked && (!meetsLevelReq || !meetsPerkReq) ? '' : 'hidden'}">Locked</span><span class="text-xs font-semibold text-yellow-400 ${!isUnlocked && !canAfford && meetsLevelReq && meetsPerkReq ? '' : 'hidden'}">Cost: ${perk.cost} SP</span>`;
        perksListEl.appendChild(el);
    });
    if (Object.keys(gameData.perks).length === 0) { perksListEl.innerHTML = '<p class="text-gray-400 italic">No perks defined yet.</p>'; }
};

const unlockPerk = (perkId) => { /* ... (Unlock perk logic - unchanged) ... */
    const perk = gameData.perks[perkId];
    if (!perk || player.unlockedPerks.includes(perkId)) return;
    const canAfford = player.skillPoints >= perk.cost;
    const meetsLevelReq = player.level >= perk.requiresLevel;
    const meetsPerkReq = !perk.requiresPerk || player.unlockedPerks.includes(perk.requiresPerk);
    if (canAfford && meetsLevelReq && meetsPerkReq) {
        playSound('perkUnlock'); player.skillPoints -= perk.cost; player.unlockedPerks.push(perkId);
        saveGame(); populatePerksModal(); updateStats(); checkAchievements();
    } else { playSound('incorrect'); }
};

// --- Settings Logic ---
const loadSettings = () => { /* ... (Load settings logic - unchanged) ... */
    if (!musicVolumeSlider || !sfxVolumeSlider || !difficultySettingsButtonsEl) return;
    musicVolumeSlider.value = player.settings.musicVolume;
    sfxVolumeSlider.value = player.settings.sfxVolume;
    applySettings();
    difficultySettingsButtonsEl.querySelectorAll('button').forEach(btn => { btn.classList.toggle('active', btn.dataset.difficulty === player.settings.difficulty); });
};

const applySettings = () => { /* ... (Apply settings logic - unchanged) ... */
    if (!bgMusicEl || !sfxDestination) return;
    bgMusicEl.volume = player.settings.musicVolume;
    try { sfxDestination.volume.value = Tone.gainToDb(player.settings.sfxVolume); }
    catch (e) { console.warn("SFX Volume Error:", e); sfxDestination.volume.value = Tone.gainToDb(0.8); }
};

const updateSetting = (type, value) => { /* ... (Update setting logic - unchanged) ... */
    const numericValue = parseFloat(value); if (isNaN(numericValue)) return;
    if (type === 'musicVolume') { player.settings.musicVolume = Math.max(0, Math.min(1, numericValue)); }
    else if (type === 'sfxVolume') { player.settings.sfxVolume = Math.max(0, Math.min(1, numericValue)); }
    applySettings(); saveGame();
};

const setDifficulty = (difficulty) => { /* ... (Set difficulty logic - unchanged) ... */
    if (!['easy', 'normal', 'hard'].includes(difficulty)) return;
    playSound('click'); player.settings.difficulty = difficulty; saveGame(); loadSettings(); console.log(`Difficulty: ${difficulty}`);
};

const getDifficultyMultiplier = (type) => { /* ... (Get difficulty multiplier logic - unchanged) ... */
    const difficulty = player.settings?.difficulty || 'normal';
    if (type === 'xp') { return difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.2 : 1.0; }
    if (type === 'focusLoss') { return difficulty === 'hard' ? 1.5 : 1.0; }
    if (type === 'currency') { return difficulty === 'easy' ? 0.75 : difficulty === 'hard' ? 1.25 : 1.0; }
    return 1.0;
};

const resetGame = () => { /* ... (Reset game logic - unchanged) ... */
    playSound('click');
    if (window.confirm("Are you sure you want to reset all game data? This will erase all progress, levels, perks, items, and achievements. This cannot be undone!")) {
        localStorage.removeItem(SAVE_KEY); location.reload();
    }
};

// --- Statistics Logic ---
const trackStat = (statName, value = 1) => { /* ... (Track stat logic - unchanged) ... */
    if (!player.stats) player.stats = {};
    if (statName === 'streakUpdate') { if (value > (player.stats.highestStreak || 0)) { player.stats.highestStreak = value; } return; }
    player.stats[statName] = (player.stats[statName] || 0) + value;
};

const populateStatsModal = () => { /* ... (Populate stats logic - unchanged, uses updated stats object) ... */
    if (!statsListEl) return;
    const stats = player.stats || {};
    const totalAnswers = (stats.totalCorrect || 0) + (stats.totalIncorrect || 0);
    const accuracy = totalAnswers > 0 ? ((stats.totalCorrect || 0) / totalAnswers * 100).toFixed(1) + '%' : 'N/A';
    statsListEl.innerHTML = `<p><strong>Bosses Defeated:</strong> ${stats.bossesDefeated || 0}</p><p><strong>Total Correct Answers:</strong> ${stats.totalCorrect || 0}</p><p><strong>Total Incorrect Answers:</strong> ${stats.totalIncorrect || 0}</p><p><strong>Overall Accuracy:</strong> ${accuracy}</p><p><strong>Highest Streak:</strong> ${stats.highestStreak || 0}</p><p><strong>Focus Vials Used:</strong> ${stats.vialsUsed || 0}</p><p><strong>Hint Tokens Used:</strong> ${stats.hintsUsed || 0}</p><p><strong>Shield Charms Used:</strong> ${stats.shieldsUsed || 0}</p><p><strong>Perfect Boss Wins:</strong> ${stats.perfectBossWins || 0}</p><p><strong>Timed Missions Won:</strong> ${stats.timedWins || 0}</p><p><strong>Items Bought:</strong> ${stats.itemsBought || 0}</p>`;
};

// --- Update Stats Display & Level Up Logic ---
const updateStats = (leveledUp = false, pointsGained = 0) => { /* ... (Update stats display - unchanged) ... */
    if (!levelEl || !xpEl || !nextXpEl || !streakEl || !xpBarFillEl || !skillPointsStatEl || !currencyStatEl) return;
    levelEl.textContent = player.level; xpEl.textContent = player.xp; const nextLevelXP = xpPerLevel(player.level);
    nextXpEl.textContent = nextLevelXP; streakEl.textContent = player.streak; trackStat('streakUpdate', player.streak);
    const xpPercentage = Math.min(100, (player.xp / nextLevelXP) * 100); xpBarFillEl.style.width = `${xpPercentage}%`;
    skillPointsStatEl.textContent = player.skillPoints; currencyStatEl.textContent = `${player.currency} 🪙`;
    if (leveledUp) {
        playSound('levelUp'); levelEl.classList.add('level-up-animation', 'text-lime-300');
        if (pointsGained > 0 && feedbackEl && activeScreenId === 'challenge-screen') { feedbackEl.textContent = `Level Up! +${pointsGained} Skill Point${pointsGained > 1 ? 's' : ''}!`; feedbackEl.className = 'text-center font-semibold min-h-[1.5em] mb-5 text-purple-400'; }
        setTimeout(() => { levelEl.classList.remove('level-up-animation', 'text-lime-300'); if (feedbackEl && feedbackEl.textContent.includes("Level Up!")) feedbackEl.textContent = ''; }, 2500);
    }
    saveGame(); checkAchievements();
};

const checkLevelUp = () => { /* ... (Level up check - unchanged) ... */
    let leveledUp = false; let pointsGained = 0;
    while (player.xp >= xpPerLevel(player.level)) {
        player.xp -= xpPerLevel(player.level); player.level++; player.skillPoints++; pointsGained++; leveledUp = true;
    } updateStats(leveledUp, pointsGained);
};

// --- World Unlocking Logic ---
const isWorldUnlocked = (worldId, worldData) => {
    if (!worldData) return false;
    if (worldData.order === 1) return true; // First world always unlocked
    if (!worldData.unlocksAfter) return true; // Assume unlocked if no prerequisite defined

    const previousWorldId = worldData.unlocksAfter;
    const previousWorld = Object.values(gameData).find(w => w.id === previousWorldId && w.order);
    if (!previousWorld || !previousWorld.missions || previousWorld.missions.length === 0) {
         console.warn(`Prerequisite world '${previousWorldId}' for world '${worldId}' not found or has no missions defined.`);
         return false; // Cannot unlock if previous world or its missions don't exist
    }

    // Find the specific BOSS mission in the prerequisite world
    // IMPORTANT: Assumes the user's data includes a mission with 'boss: true'
    const previousBossMission = previousWorld.missions.find(m => m.boss === true);
    if (!previousBossMission) {
        console.warn(`No boss mission found in prerequisite world '${previousWorldId}' to unlock '${worldId}'. Assuming unlocked.`);
        return true; // Unlock if previous world has no defined boss
    }

    // Check if the player has completed the previous world's boss mission
    return player.progress[previousWorldId]?.includes(previousBossMission.id) || false;
};


// --- Display World Selection ---
const showWorlds = () => { /* ... (Show worlds logic - unchanged, uses isWorldUnlocked) ... */
    if (!worldsContainer || !introTextEl) return;
    worldsContainer.innerHTML = '';
    introTextEl.innerHTML = `${story.intro}<br><br><em>"${story.archivistWelcome}"</em>`;
     const worldEntries = Object.values(gameData).filter(data => data && typeof data === 'object' && data.order && data.id).sort((a, b) => a.order - b.order);
    worldEntries.forEach((world) => {
        const id = world.id; const unlocked = isWorldUnlocked(id, world); const worldCard = document.createElement('button');
        worldCard.className = `p-5 rounded-lg shadow-md text-left transition duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60 flex items-center space-x-4 ${unlocked ? 'bg-gray-700/70 hover:bg-gray-600/90 hover:scale-[1.03] cursor-pointer' : 'bg-gray-800/50 opacity-50 cursor-not-allowed'}`;
        let unlockText = '';
        if (!unlocked && world.unlocksAfter) { const prevWorld = Object.values(gameData).find(w => w.id === world.unlocksAfter && w.order); unlockText = `<span class="text-xs text-red-400 block mt-1">Requires completion of ${prevWorld?.name || 'previous realm'}</span>`; }
        const missionCount = world.missions?.length || 0;
        worldCard.innerHTML = `<span class="text-3xl">${world.icon || '🌐'}</span><div><strong class="text-lg ${unlocked ? 'text-blue-300' : 'text-gray-500'} block mb-0.5 font-title">${world.name}</strong><span class="text-sm ${unlocked ? 'text-gray-400' : 'text-gray-600'}">${missionCount} challenge${missionCount !== 1 ? 's' : ''}</span>${unlockText}</div>${!unlocked ? '<svg class="icon w-6 h-6 text-gray-600 ml-auto flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>' : ''} `;
        if (unlocked) { worldCard.onclick = () => { playSound('click'); selectWorld(id); }; } else { worldCard.disabled = true; }
        worldsContainer.appendChild(worldCard);
    });
    switchScreen('world-select-screen');
};


// --- Select World (Handles Sequential Missions) ---
const selectWorld = (worldId) => {
    if (!worldTitleEl || !missionListEl || !worldIntroTextEl) return;
    const world = Object.values(gameData).find(w => w.id === worldId && w.order);
    if (!world) { console.error("World data not found:", worldId); goBackToWorlds(); return; }

    currentWorldId = worldId;
    worldTitleEl.textContent = world.name;
    worldIntroTextEl.textContent = world.intro || "";
    missionListEl.innerHTML = '';

    if (!world.missions || world.missions.length === 0) {
         missionListEl.innerHTML = '<p class="text-center text-gray-400 italic">No challenges defined for this realm yet.</p>';
         switchScreen('mission-select-screen');
         return;
    }

    // Ensure progress array exists for this world
    if (!player.progress[worldId]) player.progress[worldId] = [];

    // Iterate through missions and check sequential unlocking
    world.missions.forEach((mission, index) => {
        const isCompleted = player.progress[worldId].includes(mission.id);
        let isUnlocked = false;

        // The first mission (index 0) is always unlocked if the world is accessible
        if (index === 0) {
            isUnlocked = true;
        } else {
            // Subsequent missions are unlocked if the PREVIOUS mission in the list is completed
            const previousMission = world.missions[index - 1];
            if (previousMission && player.progress[worldId].includes(previousMission.id)) {
                isUnlocked = true;
            }
        }

        const btn = document.createElement('button');
        const bossIcon = mission.boss ? `<svg class="icon icon-sm text-red-400 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>` : '';
        const completedIcon = isCompleted
            ? `<svg class="icon text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
            : `<svg class="icon text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

        btn.className = `w-full text-left p-3 rounded-lg transition duration-200 ease-in-out flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            isUnlocked
                ? 'bg-indigo-700 hover:bg-indigo-600 text-white shadow-md'
                : 'bg-gray-600/50 text-gray-400 cursor-not-allowed opacity-70' // Style for locked
        } ${mission.boss ? 'border-l-4 border-red-500/70' : 'border-l-4 border-blue-500/70'}`;

        btn.innerHTML = `<span class="flex items-center"> ${mission.name} ${bossIcon}</span> ${completedIcon}`;

        if (isUnlocked) {
            btn.onclick = () => { playSound('click'); loadMission(mission); };
        } else {
            btn.disabled = true;
        }
        missionListEl.appendChild(btn);
    });

    switchScreen('mission-select-screen');
};

// --- Go Back ---
const goBackToWorlds = () => { /* ... (Go back logic - unchanged) ... */
    playSound('click'); currentWorldId = null; switchScreen('world-select-screen');
};

// --- Timer Logic ---
const stopTimer = () => { /* ... (Stop timer logic - unchanged) ... */
    if (challengeTimerInterval) { clearInterval(challengeTimerInterval); challengeTimerInterval = null; }
    if(timerDisplayEl) { timerDisplayEl.textContent = ''; timerDisplayEl.classList.remove('text-red-500', 'animate-pulse'); }
};
// --- REPLACE the existing startTimer function with this ---
const startTimer = (limit) => {
    stopTimer(); // Ensure any existing timer is stopped
    const difficulty = player.settings?.difficulty || 'normal';
    let adjustedLimit = limit;

    // Adjust time limit based on difficulty
    if (difficulty === 'easy') adjustedLimit = Math.round(limit * 1.25); // More time on easy
    if (difficulty === 'hard') adjustedLimit = Math.round(limit * 0.75); // Less time on hard

    // Apply time bonus perk AFTER difficulty adjustment
    if (hasPerk('chronoMaster')) {
         adjustedLimit += getPerkValue('timeBonus') || 0;
    }

    remainingTime = Math.max(1, adjustedLimit); // Ensure time is at least 1 second
    if (!timerDisplayEl) return;
    timerDisplayEl.textContent = remainingTime; // Initial display

    challengeTimerInterval = setInterval(() => {
        remainingTime--;
        if (timerDisplayEl) timerDisplayEl.textContent = remainingTime; // Update display

        if (remainingTime <= 5 && remainingTime > 0) {
            if(timerDisplayEl) timerDisplayEl.classList.add('text-red-500', 'animate-pulse');
            playSound('timerTick');
        } else {
            if(timerDisplayEl) timerDisplayEl.classList.remove('text-red-500', 'animate-pulse');
        }

        if (remainingTime <= 0) {
            handleTimeout();
        }
    }, 1000); // Update every second
};
// --- END OF REPLACEMENT FUNCTION ---
const handleTimeout = () => { /* ... (Handle timer timeout - unchanged, includes shield check) ... */
    stopTimer(); playSound('timerEnd'); if (!feedbackEl) return;
    feedbackEl.textContent = "Time's Up!"; feedbackEl.className = 'text-center font-semibold min-h-[1.5em] mb-5 text-red-400'; disableOptions();
    if (!missionSummaryData) missionSummaryData = { correctAnswers: 0, incorrectAnswers: 0, focusLost: 0 };
    missionSummaryData.incorrectAnswers++; trackStat('totalIncorrect');
    if (currentMission?.boss && currentBossState) {
        playSound('playerHit'); const baseFocusLoss = 1; const difficultyMultiplierFocus = getDifficultyMultiplier('focusLoss');
        const focusLossModifier = currentMission.baseFocusLossMultiplier || 1; const focusLost = Math.max(1, Math.round(baseFocusLoss * difficultyMultiplierFocus * focusLossModifier));
        if (currentBossState.shieldActive) { currentBossState.shieldActive = false; playSound('itemUse'); feedbackEl.textContent = "Time's Up! Shield Blocked Focus Loss!"; feedbackEl.className = 'text-center font-semibold min-h-[1.5em] mb-5 text-blue-400'; }
        else { currentBossState.focus -= focusLost; currentBossState.focusLostThisFight += focusLost; missionSummaryData.focusLost = (missionSummaryData.focusLost || 0) + focusLost; }
        updatePlayerFocusUI();
        if (currentBossState.focus <= 0) { setTimeout(() => loadNextBossQuestion(), 50); return; }
    } else {
        const hasStreakSaver = hasPerk('streakSaver');
        if (!hasStreakSaver || streakSavedThisMission) { player.streak = 0; }
        else { feedbackEl.textContent += " (Streak Saved!)"; streakSavedThisMission = true; }
        updateStats();
    }
    if (nextBtn) {
        nextBtn.classList.remove('hidden');
        if (currentMission?.boss && currentBossState?.focus > 0) {
             nextBtn.onclick = () => { currentBossState.questionIndex++; loadNextBossQuestion(); }; nextBtn.innerHTML = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg> Next Phase`;
             nextBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-500'); nextBtn.classList.add('bg-green-600', 'hover:bg-green-500');
        } else {
             nextBtn.onclick = () => showSummaryModal(false); nextBtn.innerHTML = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> View Summary`;
             nextBtn.classList.replace('bg-green-600', 'bg-yellow-600'); nextBtn.classList.replace('hover:bg-green-500', 'hover:bg-yellow-500');
        }
    }
};

// --- REPLACE the existing loadMission function with this ---
const loadMission = (missionData) => {
    // Ensure all required UI elements are available
    if (!challengeTitleEl || !questionEl || !optionsEl || !feedbackEl || !nextBtn || !itemsUiEl || !modifierDisplayEl || !timerDisplayEl || !difficultyChoiceEl) { console.error("Missing UI elements for challenge!"); goBackToWorlds(); return; }
    stopTimer(); hintUsedThisQuestion = false; streakSavedThisMission = false;
    originalMissionData = { ...missionData }; currentMission = { ...missionData };
    modifierDisplayEl.textContent = ''; modifierDisplayEl.classList.remove('p-1', 'bg-purple-900/50', 'rounded');
    currentMission.modifierId = null; currentMission.xpMultiplier = 1; currentMission.playerBaseFocusModifier = 0;
    currentMission.baseFocusLossMultiplier = 1; currentMission.mirroredOptions = false;

    // --- Apply Random Modifier (Checking Resistance First) ---
    const modifierKeys = Object.keys(gameData.modifiers);
    if (modifierKeys.length > 0 && Math.random() < 0.25) { // 25% chance
        const randomModifierId = modifierKeys[Math.floor(Math.random() * modifierKeys.length)];
        const modifier = gameData.modifiers[randomModifierId];

        // Check if player has resistance to this modifier type
        const resistedModifiers = getPerkValue('modifierResistance') || []; // Get list of resisted IDs
        const isResisted = Array.isArray(resistedModifiers) && resistedModifiers.includes(randomModifierId);

        if (modifier?.apply && !isResisted) { // Only apply if modifier exists and is NOT resisted
            currentMission = modifier.apply(currentMission);
            modifierDisplayEl.textContent = `Modifier: ${modifier.name} - ${modifier.description}`;
            modifierDisplayEl.classList.add('p-1', 'bg-purple-900/50', 'rounded');
            console.log("Applied Modifier:", randomModifierId);
        } else if (isResisted) {
            console.log("Resisted Modifier:", randomModifierId);
            // Optional: Show feedback that a modifier was resisted?
        }
    }
    // --- End of Modifier Application ---


    challengeTitleEl.textContent = currentMission.name; questionEl.textContent = ''; optionsEl.innerHTML = ''; feedbackEl.textContent = '';
    feedbackEl.className = 'text-center font-semibold min-h-[1.5em] mb-5'; nextBtn.classList.add('hidden');
    nextBtn.onclick = () => showSummaryModal(); nextBtn.innerHTML = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg> View Summary`;
    nextBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-500'); nextBtn.classList.add('bg-green-600', 'hover:bg-green-500');
    if (bossVisualEl) { bossVisualEl.innerHTML = ''; bossVisualEl.classList.remove('visible', 'animate-slow-pulse', 'hit'); }
    difficultyChoiceEl.classList.add('hidden'); questionEl.classList.add('hidden');

    missionSummaryData = {
        xpEarned: 0, currencyEarned: 0, itemsFound: {}, correctAnswers: 0, incorrectAnswers: 0, focusLost: 0,
        timed: !!currentMission.timeLimit || currentMission.modifierId === 'timePressure', timeTaken: 0, startTime: Date.now(),
        logFragment: currentMission.rewards?.logFragment, artifact: currentMission.rewards?.artifact,
        itemUsedThisMission: false // Track item use
    };

    if (currentMission.boss) { // Setup Boss
        if (!bossBattleUI || !bossNameEl || !bossHpFillEl || !bossHpTextEl || !playerFocusFillEl || !playerFocusTextEl || !bossVisualEl) { console.error("Missing boss UI elements!"); goBackToWorlds(); return; }
        bossBattleUI.classList.remove('hidden', 'opacity-50'); bossNameEl.textContent = currentMission.name;
        let baseFocus = currentMission.playerBaseFocus || 3; const bonusFocus = getPerkValue('maxFocus');
        const focusModifier = currentMission.playerBaseFocusModifier || 0; const maxFocus = Math.max(1, baseFocus + bonusFocus + focusModifier);
        currentBossState = { maxHp: currentMission.hp, hp: currentMission.hp, maxFocus: maxFocus, focus: maxFocus, questionIndex: 0, questions: [...currentMission.questions], focusLostThisFight: 0, currentQuestionData: null, shieldActive: false };
        updateBossUI(); updatePlayerFocusUI(); populateItemsUI();
        if (currentMission.svgPath) {
            bossVisualEl.innerHTML = `<div class="p-2 bg-gray-700/50 rounded-full inline-block animate-slow-pulse"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="stroke-red-500"><path stroke-linecap="round" stroke-linejoin="round" d="${currentMission.svgPath}" /></svg></div>`;
            setTimeout(() => bossVisualEl.classList.add('visible'), 50);
        } else { bossVisualEl.classList.remove('visible'); }
        loadNextBossQuestion();
    } else { // Setup Regular Mission
        bossBattleUI.classList.add('hidden'); questionEl.classList.remove('hidden'); questionEl.textContent = currentMission.q;
        let options = [...currentMission.o];
         // Apply mirrored options modifier check BEFORE creating buttons
        if (currentMission.mirroredOptions) {
             options.reverse();
        }
        options.forEach(optionText => { optionsEl.appendChild(createOptionButton(optionText, () => handleRegularAnswer(optionText))); });
        let timeLimit = currentMission.timeLimit; if (currentMission.modifierId === 'timePressure' && !timeLimit) timeLimit = 15;
        // Apply time bonus perk if applicable
         if (timeLimit && timeLimit > 0 && hasPerk('chronoMaster')) {
             timeLimit += getPerkValue('timeBonus') || 0;
         }
        if (timeLimit && timeLimit > 0) { startTimer(timeLimit); }
        else { if(timerDisplayEl) timerDisplayEl.textContent = ''; timerDisplayEl.classList.remove('text-red-500', 'animate-pulse'); }
    }
    switchScreen('challenge-screen');
};
// --- END OF REPLACEMENT FUNCTION ---

// --- Items Logic ---
const populateItemsUI = () => { /* ... (Populate items UI - unchanged) ... */
    if (!itemsUiEl) return; itemsUiEl.innerHTML = ''; if (!player.inventory) player.inventory = {};
    Object.entries(player.inventory).forEach(([itemId, count]) => {
        if (count > 0) { const itemData = gameData.items[itemId]; if (itemData) {
                const btn = document.createElement('button'); btn.className = 'item-button bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold py-1 px-3 rounded-full transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
                btn.innerHTML = `${itemData.icon || '📦'} ${itemData.name} (${count})`; btn.onclick = () => useItem(itemId); btn.title = itemData.description;
                let isDisabled = false; const isBossBattle = currentMission?.boss && currentBossState; const isOnQuestionScreen = questionEl && questionEl.offsetParent !== null && (!difficultyChoiceEl || difficultyChoiceEl.offsetParent === null);
                if (itemId === 'focusVial' && (!isBossBattle || currentBossState.focus >= currentBossState.maxFocus)) { isDisabled = true; }
                if (itemId === 'hintToken' && (hintUsedThisQuestion || !isOnQuestionScreen || optionsEl.querySelectorAll('button:not(:disabled):not(.hint-removed)').length <= 1 )) { isDisabled = true; }
                if (itemId === 'shieldCharm' && (!isBossBattle || currentBossState.shieldActive)) { isDisabled = true; }
                btn.disabled = isDisabled; itemsUiEl.appendChild(btn); } }
    });
};
// --- REPLACE the existing useItem function with this ---
const useItem = (itemId) => {
    // Disable hints for final boss
    if (currentMission?.id === 'nexus_boss' && itemId === 'hintToken') {
        playSound('incorrect');
        if(feedbackEl) {
             feedbackEl.textContent = "Hints are disabled for this encounter.";
             feedbackEl.className = 'text-center font-semibold min-h-[1.5em] mb-5 text-yellow-400';
             const currentFeedback = feedbackEl.textContent;
             setTimeout(() => { if(feedbackEl && feedbackEl.textContent === currentFeedback) feedbackEl.textContent = ''; }, 2000);
        }
        return; // Stop execution
    }

    if (!player.inventory || player.inventory[itemId] <= 0) return;

    let itemUsed = false;
    const isBossBattle = currentMission?.boss && currentBossState;

    // Check for Lucky Charm Perk
    const saveChance = getPerkValue('genericItemSaveChance') || 0; // Uses rebalanced perk list
    const itemSaved = Math.random() < saveChance;
    let consumeItem = !itemSaved;

    // Item Effects
    if (itemId === 'focusVial') {
        let focusRestored = 1;
        if (hasPerk('expertChemist')) { focusRestored = 1 + (getPerkValue('focusVialBoost') || 0); } // Use rebalanced perk
        if (isBossBattle && currentBossState.focus < currentBossState.maxFocus) {
            playSound('itemUse'); currentBossState.focus = Math.min(currentBossState.maxFocus, currentBossState.focus + focusRestored); updatePlayerFocusUI(); itemUsed = true; trackStat('vialsUsed');
        } else { playSound('incorrect'); }
    } else if (itemId === 'hintToken') {
        const isOnQuestionScreen = questionEl && questionEl.offsetParent !== null && (!difficultyChoiceEl || difficultyChoiceEl.offsetParent === null);
        if (!hintUsedThisQuestion && isOnQuestionScreen) {
            const correctAnswer = currentMission.boss ? currentBossState?.currentQuestionData?.a : currentMission?.a; if (correctAnswer === undefined || correctAnswer === null) { playSound('incorrect'); console.warn("Hint: Correct answer N/A."); return; }
            const incorrectButtons = Array.from(optionsEl.querySelectorAll('button:not(:disabled):not(.hint-removed)')).filter(btn => btn.textContent !== correctAnswer);
            if (incorrectButtons.length > 0) {
                playSound('itemUse'); const btnToRemove = incorrectButtons[Math.floor(Math.random() * incorrectButtons.length)]; btnToRemove.classList.add('hint-removed'); btnToRemove.disabled = true; hintUsedThisQuestion = true; itemUsed = true; trackStat('hintsUsed');
            } else { playSound('incorrect'); }
        } else { playSound('incorrect'); }
    } else if (itemId === 'shieldCharm') {
        if (isBossBattle && !currentBossState.shieldActive) {
            playSound('itemUse'); currentBossState.shieldActive = true; updatePlayerFocusUI(); itemUsed = true; trackStat('shieldsUsed');
        } else { playSound('incorrect'); }
    }

    // Consume item if used and not saved
    if (itemUsed) {
        missionSummaryData.itemUsedThisMission = true; // Track for achievement
        trackStat('itemsUsed');
        if (consumeItem) {
            player.inventory[itemId]--;
        } else {
             console.log("Lucky Charm triggered! Item not consumed.");
             if (feedbackEl) { feedbackEl.textContent = "Lucky Charm! Item saved!"; feedbackEl.className = 'text-center font-semibold min-h-[1.5em] mb-5 text-green-400'; const currentFeedback = feedbackEl.textContent; setTimeout(() => { if(feedbackEl && feedbackEl.textContent === currentFeedback) feedbackEl.textContent = ''; }, 2000); }
        }
        saveGame(); populateItemsUI(); checkAchievements();
    }
}; // <<< End of useItem

// --- END OF REPLACEMENT FUNCTION ---

// --- Boss/Player UI Updates ---
const updateBossUI = () => { /* ... (Update Boss UI - unchanged) ... */
    if (!currentBossState || !bossHpFillEl || !bossHpTextEl) return; const hpPercentage = Math.max(0, (currentBossState.hp / currentBossState.maxHp) * 100);
    bossHpFillEl.style.width = `${hpPercentage}%`; bossHpTextEl.textContent = `${Math.max(0, currentBossState.hp)} / ${currentBossState.maxHp}`;
    bossHpFillEl.classList.toggle('bg-red-700', hpPercentage < 30); bossHpFillEl.classList.toggle('bg-yellow-500', hpPercentage >= 30 && hpPercentage < 60);
    if (hpPercentage >= 60) { bossHpFillEl.classList.remove('bg-red-700', 'bg-yellow-500'); bossHpFillEl.classList.add('bg-red-600'); } else { bossHpFillEl.classList.remove('bg-red-600'); }
};
const updatePlayerFocusUI = () => { /* ... (Update Player Focus UI - unchanged, includes shield icon) ... */
    if (!currentBossState || !playerFocusFillEl || !playerFocusTextEl) return; const focusPercentage = Math.max(0, (currentBossState.focus / currentBossState.maxFocus) * 100);
    playerFocusFillEl.style.width = `${focusPercentage}%`; let focusText = `${currentBossState.focus} / ${currentBossState.maxFocus}`; if (currentBossState.shieldActive) { focusText += ' 🛡️'; } playerFocusTextEl.textContent = focusText;
    const focusBarParent = playerFocusFillEl.parentElement; if(focusBarParent) { focusBarParent.classList.toggle('animate-pulse', currentBossState.focus === 1); focusBarParent.classList.toggle('border-red-500', currentBossState.focus === 1); if (currentBossState.focus > 1) { focusBarParent.classList.remove('animate-pulse', 'border-red-500'); } }
    populateItemsUI();
};

// --- REPLACE the existing loadNextBossQuestion function (from 'const' to the final '};') with this ---
const loadNextBossQuestion = () => {
    // Ensure required elements exist
    if (!optionsEl || !feedbackEl || !bossStatusEl || !challengeTitleEl || !questionEl || !nextBtn || !bossVisualEl || !difficultyChoiceEl || !bossBattleUI || !currentBossState) {
        console.error("loadNextBossQuestion: Missing elements or boss state.");
        goBackToWorlds(); // Go back if fundamentally broken
        return;
    }
    stopTimer(); hintUsedThisQuestion = false; optionsEl.innerHTML = ''; feedbackEl.textContent = ''; feedbackEl.className = 'text-center font-semibold min-h-[1.5em] mb-5';
    if (bossStatusEl) bossStatusEl.textContent = ''; if (bossVisualEl) bossVisualEl.classList.remove('hit'); questionEl.classList.add('hidden'); difficultyChoiceEl.classList.add('hidden');

    // --- Check Win Condition ---
    if (currentBossState.hp <= 0) {
        challengeTitleEl.textContent = `${currentMission.name} - Defeated!`; questionEl.textContent = `Victory! You overcame the challenge.`; questionEl.classList.remove('hidden'); playSound('levelUp');
        if (bossStatusEl) { bossStatusEl.textContent = 'Vanquished!'; bossStatusEl.className = 'text-center text-sm text-green-400 mt-1 font-bold'; } if(bossBattleUI) bossBattleUI.classList.add('opacity-50');

        let firstTimeDefeat = false;
        // Ensure progress objects exist before attempting to access/modify
        if (!player.progress) player.progress = {};
        if (!player.progress[currentWorldId]) player.progress[currentWorldId] = [];
        // No artifact awarding in this version
        // if (!player.collectedArtifacts) player.collectedArtifacts = [];

        if (!player.progress[currentWorldId].includes(originalMissionData.id)) {
            player.progress[currentWorldId].push(originalMissionData.id);
            firstTimeDefeat = true;
            trackStat('bossesDefeated');

            // Award item rewards (only on first-time defeat)
             if (originalMissionData.rewards?.items) {
                 Object.entries(originalMissionData.rewards.items).forEach(([itemId, count]) => {
                     player.inventory[itemId] = (player.inventory[itemId] || 0) + count;
                     missionSummaryData.itemsFound[itemId] = (missionSummaryData.itemsFound[itemId] || 0) + count;
                 });
             }
             // Award potential skill points from boss reward (only on first-time defeat)
             if (originalMissionData.rewards?.skillPoints) {
                  player.skillPoints += originalMissionData.rewards.skillPoints;
             }
        }

        // Check for perfect win (general)
        if (currentBossState.focusLostThisFight === 0) {
            trackStat('perfectBossWins');
        }
        // Check for timed win
        if (missionSummaryData.timed) {
             trackStat('timedWins');
        }
        // Check for Itemless Win
        if (currentMission.boss && !missionSummaryData.itemUsedThisMission) {
            trackStat('itemlessBossWins'); // Increment general counter
        }
        // Check for Perfect Final Boss Win
        if (currentMission.finalBoss && currentBossState.focusLostThisFight === 0) {
            player.stats.perfectNexusWin = true; // Set specific flag
        }

        // Award XP and Currency (Perk bonus only, no artifact bonus)
        const baseXP = originalMissionData.xp || 100;
        const difficultyMultiplierXP = getDifficultyMultiplier('xp');
        const xpModifierPerk = getPerkValue('xpModifier');
        const missionXpMultiplier = currentMission.xpMultiplier || 1;
        // Removed artifactXpBonus from calculation
        const earnedXP = Math.round(baseXP * difficultyMultiplierXP * (1 + xpModifierPerk) * missionXpMultiplier);
        player.xp += earnedXP;
        missionSummaryData.xpEarned = earnedXP;

        const baseCurrency = originalMissionData.rewards?.currency || 50;
        const difficultyMultiplierCurrency = getDifficultyMultiplier('currency');
        // Removed artifactCurrencyBonus from calculation
        const earnedCurrency = Math.round(baseCurrency * difficultyMultiplierCurrency);
        player.currency += earnedCurrency;
        missionSummaryData.currencyEarned = earnedCurrency;

        checkLevelUp(); // Check level up AFTER potential skill point reward & XP gain
        saveGame(); // Save progress AFTER all stats/flags/rewards are updated
        checkAchievements(); // Check achievements AFTER saving

        nextBtn.classList.remove('hidden'); nextBtn.onclick = () => showSummaryModal(true); nextBtn.innerHTML = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg> View Summary`; nextBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-500'); nextBtn.classList.add('bg-green-600', 'hover:bg-green-500'); return;
    }

    // --- Check Loss Condition ---
    if (currentBossState.focus <= 0) {
        challengeTitleEl.textContent = `${currentMission.name} - Overwhelmed!`; questionEl.textContent = `Your focus wavered. The challenge persists. Regroup and try again!`; questionEl.classList.remove('hidden'); playSound('defeat'); feedbackEl.textContent = "Focus Depleted!"; feedbackEl.className = 'text-center font-semibold min-h-[1.5em] mb-5 text-red-400';
        if (bossStatusEl) { bossStatusEl.textContent = 'Challenge Failed'; bossStatusEl.className = 'text-center text-sm text-red-500 mt-1 font-bold'; } optionsEl.innerHTML = '<p class="text-center text-gray-400 italic">Return to the realm map to try again.</p>'; disableOptions();
        saveGame(); // Save state even on loss
        nextBtn.classList.remove('hidden'); nextBtn.onclick = () => showSummaryModal(false); nextBtn.innerHTML = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> View Summary`; nextBtn.classList.replace('bg-green-600', 'bg-yellow-600'); nextBtn.classList.replace('hover:bg-green-500', 'hover:bg-yellow-500'); return;
    }

    // --- Check if out of questions ---
    if (currentBossState.questionIndex >= currentBossState.questions.length) {
        console.warn("Boss ran out of questions but still has HP."); challengeTitleEl.textContent = `${currentMission.name} - Standoff`; questionEl.textContent = `The ${currentMission.name} endures! (No further challenges available this attempt)`; questionEl.classList.remove('hidden'); nextBtn.classList.remove('hidden');
        nextBtn.onclick = () => showSummaryModal(false); nextBtn.innerHTML = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> View Summary`; nextBtn.classList.replace('bg-green-600', 'bg-yellow-600'); nextBtn.classList.replace('hover:bg-green-500', 'hover:bg-yellow-500'); saveGame(); return;
    }

    // --- Load Next Question Phase / Difficulty Choice ---
    const phaseIndex = currentBossState.questionIndex;
    challengeTitleEl.textContent = `${currentMission.name} - Phase ${phaseIndex + 1}`; // Update phase title early

    // --- Final Boss Specific Logic ---
    currentBossState.forceTimeLimit = null; // Reset flag
    if (currentMission.id === 'nexus_boss') {
        if (phaseIndex === 3) { // Phase 4 (index 3) is timed
            currentBossState.forceTimeLimit = 15; // Set time limit flag for showBossQuestion
            challengeTitleEl.textContent += ' (Timed!)';
        }
        if (phaseIndex >= 5) { // Phase 6 and 7 (indices 5, 6) are forced hard
            console.log(`Nexus Boss Phase ${phaseIndex + 1}: Forcing Hard difficulty.`);
            challengeTitleEl.textContent += ' (Hard Difficulty)';
            showBossQuestion('hard'); // Directly show hard question
            return; // Skip showing difficulty choice
        }
    }
    // --- End Final Boss Specific Logic ---

    // Show difficulty choice for other phases/bosses
    challengeTitleEl.textContent += ' - Choose Difficulty';
    difficultyChoiceEl.classList.remove('hidden');
    populateItemsUI();
};
// --- END OF REPLACEMENT FUNCTION ---};

const showBossQuestion = (difficulty) => {
    if (!currentBossState || !difficultyChoiceEl || !questionEl || !optionsEl) return;
    playSound('click');
    difficultyChoiceEl.classList.add('hidden'); // Hide difficulty buttons

    const currentPhaseData = currentBossState.questions[currentBossState.questionIndex];
    if (!currentPhaseData) { console.error("Error: Missing question phase data for index", currentBossState.questionIndex); loadNextBossQuestion(); return; }

    let questionData = currentPhaseData[difficulty];
    // Fallback if selected difficulty data is missing
    if (!questionData) {
        console.warn(`Missing question data for difficulty ${difficulty}, falling back.`);
        questionData = currentPhaseData['medium'] || currentPhaseData['easy'] || currentPhaseData['hard'];
        if (!questionData || !questionData.q) { // Check if fallback ALSO failed or lacks question
             console.error("Critical Error: No valid question data found for this phase.");
             feedbackEl.textContent = "Error loading question data!"; feedbackEl.className = 'text-red-500';
             nextBtn.classList.remove('hidden'); nextBtn.onclick = () => goBackToWorlds(); nextBtn.innerHTML = "Return"; // Allow exit
             return;
        }
    }

    currentBossState.currentQuestionData = questionData; // Store data for the selected difficulty
    // Update title (Phase number was set in loadNextBossQuestion)
    challengeTitleEl.textContent = `${currentMission.name} - Phase ${currentBossState.questionIndex + 1}`;
    questionEl.textContent = questionData.q; // Display question
    questionEl.classList.remove('hidden');
    optionsEl.innerHTML = ''; // Clear previous options

    // Create answer buttons
    let options = [...questionData.o];
    if (currentMission.mirroredOptions) { options.reverse(); } // Apply modifier if active
    options.forEach(optionText => { optionsEl.appendChild(createOptionButton(optionText, () => handleBossAnswer(optionText, questionData.a))); });

    // Check for forced time limit OR mission default time limit
    let timeLimit = currentBossState.forceTimeLimit ?? currentMission.timeLimit; // Use forced limit if set
    if (currentMission.modifierId === 'timePressure' && !timeLimit) timeLimit = 15; // Apply modifier if needed

     if (timeLimit && timeLimit > 0) {
        startTimer(timeLimit); // startTimer applies perk bonuses
     } else {
        if(timerDisplayEl) timerDisplayEl.textContent = '';
        timerDisplayEl.classList.remove('text-red-500', 'animate-pulse');
     }

    populateItemsUI(); // Refresh item availability
};

const handleBossAnswer = (selectedOption, correctAnswer) => { /* ... (Handle boss answer logic - unchanged, includes shield check) ... */
    stopTimer(); disableOptions(); const questionData = currentBossState.currentQuestionData; if (!questionData) { console.error("Missing question data for scoring."); setTimeout(() => { currentBossState.questionIndex++; loadNextBossQuestion(); }, 1500); return; }
    const isCorrect = selectedOption === correctAnswer; highlightAnswer(selectedOption, correctAnswer, isCorrect);
    if (isCorrect) {
        // --- Correct Answer ---
        playSound('correct');

        // --- Start: CORRECTED Damage Calculation Block ---
        const baseDamage = questionData.damage || 30; // 1. Get base damage from question
        const damageBonus = getPerkValue('bossDamageModifier'); // 2. Get perk bonus %
        const damageDealt = Math.round(baseDamage * (1 + damageBonus)); // 3. Calculate final damage
        // --- End: CORRECTED Damage Calculation Block ---

        // Update feedback message with the final damage
        feedbackEl.textContent = `Direct Hit! (${damageDealt} damage)`;
        feedbackEl.className = 'text-center font-semibold min-h-[1.5em] mb-5 text-green-400';

        // Apply damage and update stats/UI
        currentBossState.hp -= damageDealt;
        missionSummaryData.correctAnswers++;
        trackStat('totalCorrect');
        player.streak++;
        updateStats(); // Update streak display immediately
        playSound('bossHit');

        // --- Visual effects (shake, hit marker) remain unchanged ---
        if(bossBattleUI) bossBattleUI.classList.add('shake');
        if(bossVisualEl) {
            bossVisualEl.classList.add('hit');
            setTimeout(() => { if(bossVisualEl) bossVisualEl.classList.remove('hit'); }, 300);
        }
        setTimeout(() => {if(bossBattleUI) bossBattleUI.classList.remove('shake')}, 400);

        updateBossUI(); // Update HP bar

        // Proceed to next question/phase
        setTimeout(() => {
            currentBossState.questionIndex++;
            loadNextBossQuestion();
        }, 1200);
    } else {
        playSound('incorrect');
        if (currentBossState.shieldActive) { currentBossState.shieldActive = false; playSound('itemUse'); feedbackEl.textContent = `Attack Blocked! Shield depleted. Correct: ${correctAnswer}`; feedbackEl.className = 'text-center font-semibold min-h-[1.5em] mb-5 text-blue-400'; }
        else {
            playSound('playerHit'); const baseFocusLoss = questionData.focusLoss || 1; const difficultyMultiplierFocus = getDifficultyMultiplier('focusLoss'); const focusLossModifier = currentMission.baseFocusLossMultiplier || 1; const focusLost = Math.max(1, Math.round(baseFocusLoss * difficultyMultiplierFocus * focusLossModifier));
            feedbackEl.textContent = `Focus Lost! (-${focusLost}) Correct: ${correctAnswer}`; feedbackEl.className = 'text-center font-semibold min-h-[1.5em] mb-5 text-red-400'; currentBossState.focus -= focusLost; currentBossState.focusLostThisFight += focusLost; missionSummaryData.incorrectAnswers++; missionSummaryData.focusLost = (missionSummaryData.focusLost || 0) + focusLost; trackStat('totalIncorrect');
            const hasStreakSaver = hasPerk('streakSaver'); if (!hasStreakSaver || streakSavedThisMission) { player.streak = 0; } else { feedbackEl.textContent += " (Streak Saved!)"; streakSavedThisMission = true; }
            const focusBarContainer = playerFocusFillEl?.parentElement?.parentElement?.parentElement; if(focusBarContainer) { focusBarContainer.classList.add('shake'); setTimeout(() => {if(focusBarContainer) focusBarContainer.classList.remove('shake')}, 400); }
            if(bossStatusEl) { bossStatusEl.textContent = 'Attack Dodged!'; bossStatusEl.className = 'text-center text-sm text-yellow-400 mt-1 animate-pulse'; setTimeout(() => { if(bossStatusEl) { bossStatusEl.textContent = ''; bossStatusEl.classList.remove('animate-pulse'); } }, 1500); }
        }
        updateStats(); updatePlayerFocusUI();
        setTimeout(() => { currentBossState.questionIndex++; loadNextBossQuestion(); }, 2000);
    }
    currentBossState.currentQuestionData = null;
};


// --- Regular Mission Logic ---
// Handles non-boss missions (if user adds them back to gameData)
const handleRegularAnswer = (selectedOption) => {
    stopTimer();
    disableOptions();

    // Ensure currentMission is defined and has necessary properties
    if (!currentMission || !currentMission.a || !originalMissionData || !originalMissionData.id) {
        console.error("Missing mission data for regular answer.");
        // Optionally, trigger failure or return to mission list
        completeMissionFlow(); // Or showSummaryModal(false)
        return;
    }


    const correctAnswer = currentMission.a;
    const isCorrect = selectedOption === correctAnswer;
    highlightAnswer(selectedOption, correctAnswer, isCorrect);

    if (isCorrect) {
        playSound('correct');
        const baseXP = currentMission.xp || 15;
        const difficultyMultiplierXP = getDifficultyMultiplier('xp');
        const xpModifierPerk = getPerkValue('xpModifier');
        const missionXpMultiplier = currentMission.xpMultiplier || 1; // Include modifier effect
        const earnedXP = Math.round(baseXP * difficultyMultiplierXP * (1 + xpModifierPerk) * missionXpMultiplier);

        feedbackEl.textContent = `Correct! +${earnedXP} XP` + (xpModifierPerk > 0 ? ` (${Math.round(xpModifierPerk * 100)}% bonus)` : '');
        feedbackEl.className = 'text-center font-semibold min-h-[1.5em] mb-5 text-green-400';

        let firstTimeComplete = false;
        if (!player.progress[currentWorldId]?.includes(originalMissionData.id)) {
             if (!player.progress[currentWorldId]) player.progress[currentWorldId] = [];
             player.progress[currentWorldId].push(originalMissionData.id);
             firstTimeComplete = true;
             // Note: Only tracking 'bossesDefeated', not generic missions completed for now
        }


        const baseCurrency = 5; // Smaller amount for regular missions
        const difficultyMultiplierCurrency = getDifficultyMultiplier('currency');
        const earnedCurrency = Math.round(baseCurrency * difficultyMultiplierCurrency);
        player.currency += earnedCurrency;
        missionSummaryData.currencyEarned += earnedCurrency;

        player.xp += earnedXP;
        missionSummaryData.xpEarned += earnedXP;
        player.streak++;
        missionSummaryData.correctAnswers++;
        trackStat('totalCorrect');

        checkLevelUp();

        const itemDropChance = 0.05 + getPerkValue('itemDropRate');
        if (Math.random() < itemDropChance) {
            const itemKeys = Object.keys(gameData.items);
            const randomItemId = itemKeys[Math.floor(Math.random() * itemKeys.length)];
            player.inventory[randomItemId] = (player.inventory[randomItemId] || 0) + 1;
            const itemData = gameData.items[randomItemId];
            feedbackEl.textContent += ` Found ${itemData?.icon || ''} ${itemData?.name || randomItemId}!`;
            missionSummaryData.itemsFound[randomItemId] = (missionSummaryData.itemsFound[randomItemId] || 0) + 1;
        }

        if (missionSummaryData.timed) { trackStat('timedWins'); }
        saveGame();

    } else { // Incorrect Answer
        playSound('incorrect');
        feedbackEl.textContent = `Incorrect! Correct: ${correctAnswer}`;
        feedbackEl.className = 'text-center font-semibold min-h-[1.5em] mb-5 text-red-400';
        missionSummaryData.incorrectAnswers++;
        trackStat('totalIncorrect');

        const hasStreakSaver = hasPerk('streakSaver');
        if (!hasStreakSaver || streakSavedThisMission) { player.streak = 0; }
        else { feedbackEl.textContent += " (Streak Saved!)"; streakSavedThisMission = true; }
        updateStats();
    }

    setTimeout(() => {
        if (nextBtn) {
            nextBtn.classList.remove('hidden');
            nextBtn.onclick = () => showSummaryModal(isCorrect); // Pass success status
            // Adjust button style based on success/failure
            nextBtn.innerHTML = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg> View Summary`;
            if (isCorrect) {
                 nextBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-500');
                 nextBtn.classList.add('bg-green-600', 'hover:bg-green-500');
            } else {
                 nextBtn.classList.replace('bg-green-600', 'bg-yellow-600');
                 nextBtn.classList.replace('hover:bg-green-500', 'hover:bg-yellow-500');
            }
        }
    }, 800);
};


// --- Helper Functions ---
const createOptionButton = (text, onClickAction) => { /* ... (Create option button - unchanged) ... */
    const btn = document.createElement('button');
    btn.className = 'w-full text-left p-3 rounded-lg bg-gray-700/80 hover:bg-gray-600 border border-gray-600/50 hover:border-blue-500 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60 transform hover:scale-[1.02]';
    btn.textContent = text; btn.onclick = () => { playSound('click'); onClickAction(); }; return btn;
};
const disableOptions = () => { /* ... (Disable options - unchanged) ... */
    if(optionsEl) optionsEl.querySelectorAll('button').forEach(b => b.disabled = true);
};
const highlightAnswer = (selected, correct, isCorrect) => { /* ... (Highlight answer - unchanged) ... */
    if(optionsEl) optionsEl.querySelectorAll('button:not(.hint-removed)').forEach(b => {
        b.classList.remove('hover:bg-gray-600', 'hover:border-blue-500', 'hover:scale-[1.02]');
        if (b.textContent === correct) { b.classList.remove('bg-gray-700/80'); b.classList.add('bg-green-600/80', 'text-white', 'border-green-500', 'ring-2', 'ring-green-400/50', 'scale-[1.01]'); }
        else if (b.textContent === selected && !isCorrect) { b.classList.remove('bg-gray-700/80'); b.classList.add('bg-red-600/80', 'text-white', 'border-red-500', 'opacity-80'); }
        else { b.classList.add('opacity-50'); } });
};

// --- Mission Summary Logic (Includes Archivist Dialogue) ---
const showSummaryModal = (success) => {
    if (!summaryModalEl || !summaryTitleEl || !summaryDetailsEl || !originalMissionData) {
        console.error("Cannot show summary: Missing elements or mission data.");
        completeMissionFlow(); // Attempt to recover flow
        return;
    }
    stopTimer();

    const isFinalBoss = originalMissionData?.finalBoss;
    const missionId = originalMissionData?.id;

    // Handle Epilogue for Final Boss Success
    if (isFinalBoss && success) {
        summaryTitleEl.textContent = "System Integrated";
        summaryTitleEl.className = `text-2xl font-semibold mb-4 text-green-400`;
        summaryDetailsEl.innerHTML = `
            <p class="mb-4"><strong>Recovered Final Log Fragment:</strong><br><em class="text-gray-400">"${missionSummaryData.logFragment || '...'}"</em></p>
            <p class="mb-4"><strong>Archivist Analysis:</strong><br><em class="text-cyan-300">"${story.archivistFinalWords}"</em></p>
            <p class="border-t border-gray-600 pt-4">${story.epilogue}</p>
        `;
        openModal('summary-modal');
        return; // Skip normal summary
    }

    // --- Normal Summary ---
    missionSummaryData.timeTaken = missionSummaryData.startTime ? Math.round((Date.now() - missionSummaryData.startTime) / 1000) : 0;
    const totalAnswers = missionSummaryData.correctAnswers + missionSummaryData.incorrectAnswers;
    const accuracy = totalAnswers > 0 ? ((missionSummaryData.correctAnswers / totalAnswers) * 100).toFixed(1) + '%' : 'N/A';

    summaryTitleEl.textContent = success ? "Mission Complete!" : "Mission Failed!";
    summaryTitleEl.className = `text-2xl font-semibold mb-4 ${success ? 'text-green-400' : 'text-red-400'}`;

    let detailsHtml = `<p><strong>XP Earned:</strong> ${missionSummaryData.xpEarned || 0}</p><p><strong>Credits Earned:</strong> ${missionSummaryData.currencyEarned || 0} 🪙</p><p><strong>Accuracy:</strong> ${accuracy} (${missionSummaryData.correctAnswers}/${totalAnswers})</p>`;
    if (missionSummaryData.timed) { detailsHtml += `<p><strong>Time Taken:</strong> ${missionSummaryData.timeTaken}s</p>`; }
    if (originalMissionData?.boss) { detailsHtml += `<p><strong>Focus Lost:</strong> ${missionSummaryData.focusLost || 0}</p>`; }

    let narrativeSectionAdded = false;
    // Add Log Fragment
    if (missionSummaryData.logFragment) {
        detailsHtml += `<p class="mt-3 pt-3 border-t border-gray-600/50"><strong>Recovered Log Fragment:</strong><br><em class="text-gray-400">"${missionSummaryData.logFragment}"</em></p>`;
        narrativeSectionAdded = true;
    }
    // Add Archivist Transitional Dialogue (only on success)
    const archivistDialogue = success ? (story.archivistTransitions[missionId] || "") : "";
    if (archivistDialogue) {
        const borderClass = narrativeSectionAdded ? "mt-2" : "mt-3 pt-3 border-t border-gray-600/50";
        detailsHtml += `<p class="${borderClass}"><strong>Archivist Update:</strong><br><em class="text-cyan-300">"${archivistDialogue}"</em></p>`;
        narrativeSectionAdded = true;
    }
     // Add Artifact Name
    if (missionSummaryData.artifact) {
       const borderClass = narrativeSectionAdded ? "mt-3 pt-3 border-t border-gray-600/50" : "mt-1"; // Add border only if log/dialogue present
       detailsHtml += `<p class="${borderClass}"><strong>Component Recovered:</strong> ${missionSummaryData.artifact}</p>`;
       narrativeSectionAdded = true;
    }
    // List items found
    const itemsFoundEntries = Object.entries(missionSummaryData.itemsFound || {});
    if (itemsFoundEntries.length > 0) {
        const borderClass = narrativeSectionAdded ? "mt-3 pt-3 border-t border-gray-600/50" : "mt-1";
        detailsHtml += `<p class="${borderClass}"><strong>Items Found:</strong></p><ul class="list-disc list-inside ml-4">`;
        itemsFoundEntries.forEach(([itemId, count]) => { const itemData = gameData.items[itemId]; detailsHtml += `<li>${itemData?.icon || ''} ${itemData?.name || itemId}: ${count}</li>`; });
        detailsHtml += `</ul>`;
    }

    summaryDetailsEl.innerHTML = detailsHtml;
    openModal('summary-modal');
};

// --- End Mission Flow (Returns to World List) ---
const closeSummaryModal = () => {
    closeModal('summary-modal');
    completeMissionFlow();
};

const completeMissionFlow = () => {
    const wasFinalBoss = originalMissionData?.finalBoss;
    const currentWorld = currentWorldId; // Capture before clearing

    // Reset temporary mission state variables AFTER checking final boss flag
    currentMission = null;
    originalMissionData = null;
    currentBossState = null;
    streakSavedThisMission = false;
    missionSummaryData = {};

    checkAchievements(); // Final check after potential state changes

    // Decide where to go next
    if (wasFinalBoss) {
        showWorlds(); // Go back to main world screen after final boss
    } else if (currentWorld) {
        selectWorld(currentWorld); // Refresh the current world's mission list
    } else {
        showWorlds(); // Fallback
    }
};

// --- Music Toggle & Initialization ---
const toggleMusic = () => { /* ... (Toggle music logic - unchanged) ... */
    if(!bgMusicEl || !musicIconOn || !musicIconOff || !musicBtnText || !toggleMusicBtn) return; playSound('click'); player.musicOn = !player.musicOn;
    if (player.musicOn) { setTimeout(() => { bgMusicEl.play().catch(e => console.error("Audio play failed:", e)); }, 0); musicIconOn.classList.remove('hidden'); musicIconOff.classList.add('hidden'); musicBtnText.textContent = 'On'; toggleMusicBtn.classList.replace('bg-gray-600', 'bg-indigo-600'); toggleMusicBtn.classList.replace('hover:bg-gray-500', 'hover:bg-indigo-500'); }
    else { bgMusicEl.pause(); musicIconOn.classList.add('hidden'); musicIconOff.classList.remove('hidden'); musicBtnText.textContent = 'Off'; toggleMusicBtn.classList.replace('bg-indigo-600', 'bg-gray-600'); toggleMusicBtn.classList.replace('hover:bg-indigo-500', 'hover:bg-gray-500'); }
    player.settings.musicOn = player.musicOn; saveGame();
};
const initializeMusic = () => { /* ... (Initialize music logic - unchanged) ... */
    if(!bgMusicEl || !musicIconOn || !musicIconOff || !musicBtnText || !toggleMusicBtn) return;
    bgMusicEl.volume = player.settings.musicVolume; player.musicOn = player.settings.musicOn;
    if (player.musicOn) { musicIconOn.classList.remove('hidden'); musicIconOff.classList.add('hidden'); musicBtnText.textContent = 'On'; toggleMusicBtn.classList.replace('bg-gray-600', 'bg-indigo-600'); toggleMusicBtn.classList.replace('hover:bg-gray-500', 'hover:bg-indigo-500'); }
    else { bgMusicEl.pause(); musicIconOn.classList.add('hidden'); musicIconOff.classList.remove('hidden'); musicBtnText.textContent = 'Off'; toggleMusicBtn.classList.replace('bg-indigo-600', 'bg-gray-600'); toggleMusicBtn.classList.replace('hover:bg-indigo-500', 'hover:bg-gray-500'); }
};
const initializeSfxVolume = () => { /* ... (Initialize SFX volume - unchanged) ... */
     if(sfxDestination) { try { sfxDestination.volume.value = Tone.gainToDb(player.settings.sfxVolume); } catch (e) { console.warn("Init SFX Vol Error:", e); sfxDestination.volume.value = Tone.gainToDb(0.8); } }
};

// --- Shop Logic ---
const populateShopModal = () => { /* ... (Populate shop - unchanged, uses discount perk) ... */
    if (!shopItemsListEl || !shopCurrencyDisplayEl) return; shopCurrencyDisplayEl.textContent = player.currency; shopItemsListEl.innerHTML = ''; const discount = getPerkValue('shopDiscount') || 0;
    Object.entries(gameData.items).forEach(([id, item]) => { if (item.price !== undefined) { const actualPrice = Math.max(0, Math.round(item.price * (1 - discount))); const canAfford = player.currency >= actualPrice; const el = document.createElement('div'); el.className = `border p-3 rounded-lg flex justify-between items-center bg-gray-700/50 border-gray-600`;
            el.innerHTML = `<div class="flex items-center space-x-3"><span class="text-xl">${item.icon || '📦'}</span><div><p class="font-semibold text-gray-200">${item.name}</p><p class="text-sm text-gray-400">${item.description}</p>${discount > 0 ? `<p class="text-xs text-green-400"><s>${item.price}</s> ${actualPrice} 🪙 (-${Math.round(discount*100)}%)</p>` : `<p class="text-xs text-yellow-400">${actualPrice} 🪙</p>`}</div></div><button onclick="buyItem('${id}')" class="shop-buy-button bg-green-600 hover:bg-green-500 text-white text-xs font-semibold py-1 px-3 rounded-full transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed" ${!canAfford ? 'disabled' : ''}>Buy</button>`; shopItemsListEl.appendChild(el); } });
    if (shopItemsListEl.children.length === 0) { shopItemsListEl.innerHTML = '<p class="text-gray-400 italic">Nothing currently for sale.</p>'; }
};
const buyItem = (itemId) => { /* ... (Buy item logic - unchanged, uses discount perk) ... */
    const item = gameData.items[itemId]; if (!item || item.price === undefined) return; const discount = getPerkValue('shopDiscount') || 0; const actualPrice = Math.max(0, Math.round(item.price * (1 - discount)));
    if (player.currency >= actualPrice) { playSound('buyItem'); player.currency -= actualPrice; player.inventory[itemId] = (player.inventory[itemId] || 0) + 1; trackStat('itemsBought'); saveGame(); updateStats(); populateShopModal(); checkAchievements(); } else { playSound('incorrect'); }
};

// --- Initial Game Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Assign DOM elements
    levelEl = document.getElementById('level'); xpEl = document.getElementById('xp'); nextXpEl = document.getElementById('next-xp'); streakEl = document.getElementById('streak'); xpBarFillEl = document.getElementById('xp-bar-fill'); worldsContainer = document.getElementById('worlds'); worldSelectScreen = document.getElementById('world-select-screen'); missionSelectScreen = document.getElementById('mission-select-screen'); challengeScreen = document.getElementById('challenge-screen'); worldTitleEl = document.getElementById('world-title'); missionListEl = document.getElementById('mission-list'); challengeTitleEl = document.getElementById('challenge-title'); questionEl = document.getElementById('question'); optionsEl = document.getElementById('options'); feedbackEl = document.getElementById('feedback'); nextBtn = document.getElementById('next-btn'); bgMusicEl = document.getElementById('bg-music'); toggleMusicBtn = document.getElementById('toggle-music-btn'); musicIconOn = document.getElementById('music-icon-on'); musicIconOff = document.getElementById('music-icon-off'); musicBtnText = document.getElementById('music-btn-text'); achievementToastEl = document.getElementById('achievement-toast'); achievementsModalEl = document.getElementById('achievements-modal'); achievementsListEl = document.getElementById('achievements-list'); perksModalEl = document.getElementById('perks-modal'); perksListEl = document.getElementById('perks-list'); skillPointsDisplayEl = document.getElementById('skill-points-display'); settingsModalEl = document.getElementById('settings-modal'); musicVolumeSlider = document.getElementById('music-volume'); sfxVolumeSlider = document.getElementById('sfx-volume'); statsModalEl = document.getElementById('stats-modal'); statsListEl = document.getElementById('stats-list'); shopModalEl = document.getElementById('shop-modal'); shopItemsListEl = document.getElementById('shop-items-list'); shopCurrencyDisplayEl = document.getElementById('shop-currency-display'); summaryModalEl = document.getElementById('summary-modal'); summaryTitleEl = document.getElementById('summary-title'); summaryDetailsEl = document.getElementById('summary-details'); bossBattleUI = document.getElementById('boss-battle-ui'); bossNameEl = document.getElementById('boss-name'); bossHpFillEl = document.getElementById('boss-hp-fill'); bossHpTextEl = document.getElementById('boss-hp-text'); bossStatusEl = document.getElementById('boss-status'); bossVisualEl = document.getElementById('boss-visual'); playerFocusFillEl = document.getElementById('player-focus-fill'); playerFocusTextEl = document.getElementById('player-focus-text'); itemsUiEl = document.getElementById('items-ui'); skillPointsStatEl = document.getElementById('skill-points-stat'); currencyStatEl = document.getElementById('currency-stat'); timerDisplayEl = document.getElementById('timer-display'); modifierDisplayEl = document.getElementById('modifier-display'); difficultyChoiceEl = document.getElementById('difficulty-choice'); difficultySettingsButtonsEl = document.getElementById('difficulty-settings-buttons'); introTextEl = document.getElementById('intro-text'); worldIntroTextEl = document.getElementById('world-intro-text');

    // Add event listeners
    if (musicVolumeSlider) musicVolumeSlider.addEventListener('input', (e) => updateSetting('musicVolume', e.target.value));
    if (sfxVolumeSlider) sfxVolumeSlider.addEventListener('input', (e) => updateSetting('sfxVolume', e.target.value));

     // Attempt to start audio context on first interaction
     const startAudio = () => {
         Tone.start().then(() => { console.log("Audio Context Started"); if (player.musicOn && bgMusicEl && bgMusicEl.paused) { bgMusicEl.play().catch(e => console.warn("Initial music autoplay failed:", e)); } })
         .catch(e => console.error("Failed to start Tone context:", e));
     };
     document.body.addEventListener('click', startAudio, { once: true });
     document.body.addEventListener('keypress', startAudio, { once: true });


    // Initialize game
    initializeSfxVolume();
    initializeMusic();
    checkLevelUp(); // Includes initial stats update
    showWorlds();
    loadSettings();
    checkAchievements(); // Check achievements on load
});