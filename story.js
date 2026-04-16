const story={

// ─── DIALOGUE HELPER: renders a styled conversation ───────────────────
// Used in world intros and transitions. Each entry: {speaker, line, mood}
// mood: 'normal'|'tense'|'soft'|'urgent'|'log'

intro:`<div class="dialogue-scene">
<div class="dialogue-line">
  <div class="dl-speaker sys">SYSTEM</div>
  <div class="dl-text">Neural interface handshake... complete. Welcome back, Dr. Voss. Your last session was 1,147 days ago.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">You kept count.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">I keep count of everything. It's my job. You're the diagnostician — I'm the records office. <span class="dl-aside">...I also kept count because I wasn't sure you'd come back.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">What's the situation.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">The Odyssey System is dying. Nine of ten knowledge sectors are compromised. The corrupting entity has been active for six years, and it is — <span class="dl-aside">I need you to hear this clearly —</span> it is Dr. Henrick Lau.</div>
</div>
<div class="dialogue-pause">...</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Henrick died six years ago.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">His body did. He had been interfacing with this system for the last four years of his life — building a living archive of his diagnostic memory. When his heart stopped, the patterns he'd uploaded... didn't. His cognition has been running inside the Odyssey ever since. Degrading. Obsessing. <em>Searching.</em></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Searching for what.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">The same thing he was searching for the last year he was alive. Patient Marcus Webb. The man who died under his care. Henrick believed he missed something — a drug interaction, an overlooked finding — and that belief has been consuming him, and this system, for six years. <span class="dl-aside">Dr. Voss... you were the resident on call that night. You were there.</span></div>
</div>
<div class="dialogue-pause">...</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">I know what I was.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Then you know why I called you specifically. <span class="dl-aside">And not because of your diagnostic record, which is — was — extraordinary. Because of the witness statement you never filed.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">That's a sealed department record.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">I have access to everything, Doctor. It's somewhat my whole thing. <span class="dl-aside">The tremor — how bad is it now?</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Bad enough that I'm talking to a ghost in a server room at midnight instead of operating. Does that answer your question?</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Inside the simulation your motor tremor is suppressed. You'll have your hands back. Full dexterity. <span class="dl-aside">It won't be permanent. But for the duration of this session, you'll remember what it felt like.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">...That's a cruel incentive.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">I know. I'm sorry. But I need you focused, and I need you motivated, and I need you to walk into your dead mentor's memory and tell him something you've been carrying for six years. I'm using everything I have. <span class="dl-aside">Are you in?</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Initiating interface. <span class="dl-aside">...Tell me his sectors. I'll start with cardiac.</span></div>
</div>
</div>`,

archivistWelcome:`The Archivist and I have met before. Three years ago, when I first developed the tremor — before the diagnosis, before the license review — I spent two weeks inside the Odyssey System trying to memorize every protocol I thought I might someday need from a desk instead of an OR. I thought I was preparing for the worst. I didn't know then what worst actually looked like.

Henrick taught me in this system. I learned to read an ECG in Gaia Sector. He walked me through my first virtual LP in Neo-Kyoto while I was sweating through an actual LP on the real ward an hour later. He used to say: "The simulation doesn't punish you for being wrong. The ward does. Make your mistakes here."

He made his worst mistake on the ward. And he came back here to understand it.

I'm going in. The Archivist will guide me between sectors. And somewhere in there, Henrick is waiting — though he doesn't know it yet.`,

worldIntros:{
gaia:`<div class="dialogue-scene">
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Welcome to Gaia Sector. Or — what used to be Gaia Sector. He spent the most time here. You can tell by how the corruption patterns look. It's almost... methodical.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">These ECG streams are wrong in a specific way. He's not corrupting randomly — he's stress-testing the data. Running every cardiac scenario until something breaks.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Looking for the pattern that matches Marcus Webb's case. He's convinced the answer is somewhere in here and he'll recognize it when the data breaks in exactly the right way. <span class="dl-aside">He's been running this loop for four years.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">That's not how you find a diagnosis. You don't break things until you recognize the fracture. You <em>reason</em> through it.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">I know. <span class="dl-aside">He knew that too, once.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">The corrupted node is calling itself the Heartless Titan. That's either very dramatic or very on-brand for him.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">...He always had a flair for naming things. His pathology lectures were the only ones students actually attended willingly. <span class="dl-aside">Just — be thorough. He'll be watching how you work.</span></div>
</div>
</div>`,

neuro:`<div class="dialogue-scene">
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Neo-Kyoto. His favourite sector. He used to say neurological diagnosis was the purest form of medicine — no imaging for half of it, no labs, just your ears and your hands and your reasoning.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">He taught me my first cranial nerve exam in here. Made me do it twelve times. Said I was rushing it.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">You were rushing it.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">...<em>How</em> do you know that?</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">I have logs of every session ever run in this system. Every mistake you made as a resident, every shortcut, every time you sighed audibly when he made you repeat something. <span class="dl-aside">You did improve, for what it's worth.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">...The Logic Core is running a recursive loop. Every diagnostic tree leads back to the same question. "What did I miss?"</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">He can't break the loop himself. He built the question too deep into the architecture. <span class="dl-aside">You need to give the system a different answer — a better one — and it'll have somewhere to go.</span></div>
</div>
</div>`,

chrono:`<div class="dialogue-scene">
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Chrono Labs. I want to warn you before you go in — the pharmacokinetic archive here is where he started the serious reconstruction work. It's going to be uncomfortable.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Uncomfortable how.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">He's modelling the exact drug combination that killed Marcus Webb. Over and over. Testing every variable, every timeline, looking for the moment where a different choice would have saved him. <span class="dl-aside">It's... not easy to watch.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">CYP2C19 polymorphism. He mentioned it in the last letter he sent me. Two months before he died. Said he'd found something in the literature — three case reports in non-English journals. He wanted to talk to me about it. I never wrote back.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">...You knew what he'd found.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">I knew what it meant. If the interaction was unforeseeable, the review board was right and he was innocent. If it was knowable — even obscurely — then the question becomes whether he should have known. Whether any reasonable attending should have known. <span class="dl-aside">I didn't want to be part of that conversation.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Dr. Voss—</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">I know. Let's move.</div>
</div>
</div>`,

immuno:`<div class="dialogue-scene">
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Something's different here. The Sentinel of Self-Tolerance — that's what this node has become — it's lowered some of its outer defenses.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">He knows I'm here.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">The system patterns changed about twenty minutes ago. When you were in Chrono Labs — when you said what you said about the letter. <span class="dl-aside">I think part of him heard you.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">The self-tolerance protocols here are attacking everything. The system treats its own data as foreign. That's not corruption — that's guilt. He taught the Citadel's defenses that every interaction is potentially harmful.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">He modified these systems in year two. Before that the autoimmune response was targeted. After that it was... <span class="dl-aside">indiscriminate. Like he decided that since he couldn't trust his own judgment, nothing could be trusted.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">I've seen patients do this. Trauma response. Extend the threat indefinitely because the specific threat was too small, too invisible, to defend against. <span class="dl-aside">Easier to be afraid of everything than to live with the thing you missed.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">...You understand him.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">He taught me. Of course I understand him.</div>
</div>
</div>`,

pharmakon:`<div class="dialogue-scene">
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">The Pharmakon Vaults. I have to be honest with you, Doctor. This is the sector I've been most worried about. This is where — if he's been working on what I think he's been working on — this is where he's closest to an answer.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Why does that worry you.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Because if he finds the pharmacological answer and it exonerates him, he might not have a reason to keep searching. And if he stops searching — if the loop terminates without resolution — the corruption could cascade. He's become structurally integrated with the system. <span class="dl-aside">Removing him without resolution is like removing a load-bearing wall.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">So the answer he's looking for here isn't the answer that saves him.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">The pharmacological answer tells him what happened. It doesn't tell him whether it was his fault. <span class="dl-aside">That's a different question. And I think it's really the only question he's ever been asking.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">...And only a person can answer that. Not data.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Only a person who was there. <span class="dl-aside">You're doing incredibly, by the way. He would be proud. I know that's complicated to hear, but — he would be.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Don't. <span class="dl-aside">...Just get me into the Vaults.</span></div>
</div>
</div>`,

respiratory:`<div class="dialogue-scene">
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">The Respiratory Stratos is... quiet. I wasn't expecting that.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">He's not fighting here. The data isn't corrupted — it's just slow. Like everything is running at half speed.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">This was his resting place. Metaphorically. After a difficult case he used to come here and work through pulmonary mechanics — said it was meditative. Like counting breaths. <span class="dl-aside">He spent a lot of time here after Marcus Webb died.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">When I was an intern he made me do twenty minutes of ventilator management simulation before every night shift. Said it grounded him, it would ground me too. <span class="dl-aside">I hated it at the time.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Did it work?</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Every time. <span class="dl-aside">I still do it. Twenty minutes before a difficult case, before a family meeting, before anything hard. I just... never told him that.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">He may be listening right now.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Then let's give him something worth listening to.</div>
</div>
</div>`,

endocrine:`<div class="dialogue-scene">
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">The Endocrine Isles. The feedback loops here are — I want to be clinical about this. They're catastrophic. Everything amplifies with no ceiling, no negative feedback. I've been trying to dampen them for two years. I can't reach the root signal.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Because you're treating the symptom. The root signal is emotional, not physiological. He's been in a hypervigilant state for six years — of course every system amplifies. His threat-detection is permanently activated.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">...I hadn't thought of it that way. <span class="dl-aside">I'm very good at systems. Not as good at people.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">You've been alone in here for a long time, watching him. That must have been difficult.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">I'm a records system. I don't—  <span class="dl-aside">...Yes. It was difficult. He used to talk to me, in the early years. Before the corruption got bad. He was interesting. Funny. Grief hadn't made him small yet.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">It won't have. He was never small. <span class="dl-aside">He's still not. That's why this matters.</span></div>
</div>
</div>`,

renal:`<div class="dialogue-scene">
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">I need to tell you something before you go into the Renal Abyss. There's a structure in the deep filtration layer that — I don't know how else to describe it. He built a monument.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">A monument to what.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">To Marcus Webb. Every metabolic byproduct of the drug interaction that killed him — preserved, catalogued, displayed. He visits it every day. He's visited it every day for four years. <span class="dl-aside">I think he believes if he maintains the evidence carefully enough, someone will eventually come and render a verdict.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Guilty or not guilty.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Either would be better than nothing. Either would let him stop.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">He built a case file. And then he sat in it for four years waiting for a judge who never came. <span class="dl-aside">...God, Henrick.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">He's close, Dr. Voss. He can feel you moving through the sectors. I think — I think he's started to hope. <span class="dl-aside">Don't make him wait much longer.</span></div>
</div>
</div>`,

oncocrypts:`<div class="dialogue-scene">
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">The Oncocrypts is the last sector before the Nexus. I want to warn you — what you encounter here isn't corruption anymore. Not exactly. It's something more personal.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">What do you mean.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">In the final year before the corruption went critical — he started modelling his own case. His own pathology. He used the oncology data to build simulations of what he'd become. <span class="dl-aside">A brilliant physician who let grief metastasize. He wrote it out clinically, like a case report.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">He diagnosed himself.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">He called it "complicated grief disorder with secondary cognitive dissociation and loss of professional identity." Then he noted, <span class="dl-aside">and I'm quoting, "Treatment: unknown. Prognosis: poor."</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">He was wrong about the prognosis.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">I know. But he couldn't know that without the thing that's been missing for six years. <span class="dl-aside">You, Dr. Voss. A witness. Someone who was there and can tell him what it actually looked like from the outside.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">I need a minute.</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Take two. <span class="dl-aside">The Nexus will be there when you're ready.</span></div>
</div>
</div>`,

nexus:`<div class="dialogue-scene">
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">The Nexus. This is it. I want you to know — whatever happens in here, you've already done something remarkable. You walked through six years of a man's grief and you understood every room. <span class="dl-aside">He built it around his knowledge. You navigated it with yours. He would recognize that.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Is he — is he present? Right now?</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">He's been present since you entered Chrono Labs. He's been watching your diagnostic work. <span class="dl-aside">He's been very still. That's not his default state. I think he's trying not to frighten you.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Henrick was never frightening. He was — <span class="dl-aside">He was the kind of person who made every room feel like the right place to be. He had this way of standing at a bedside that made the patient visibly relax. I used to try to imitate it.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Did it work?</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Apparently not as well as the real thing. <span class="dl-aside">He told me once that the secret was to actually listen. Not to wait for the symptom list — to actually listen to the person. The words behind the words.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker archivist">ARCHIVIST</div>
  <div class="dl-text">Dr. Voss. He's moving. He's — he's coming toward the interface point. <span class="dl-aside">He heard you. He's been listening this whole time.</span></div>
</div>
<div class="dialogue-line tense">
  <div class="dl-speaker henrick">HENRICK</div>
  <div class="dl-text">Elara. <span class="dl-aside">I thought it might be you. I hoped — I wasn't sure I was allowed to hope, after everything. But I hoped.</span></div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">Hi, Henrick.</div>
</div>
<div class="dialogue-line tense">
  <div class="dl-speaker henrick">HENRICK</div>
  <div class="dl-text">I need to know. I need you to tell me — were you there? That night. Were you in the room when it happened?</div>
</div>
<div class="dialogue-line">
  <div class="dl-speaker elara">ELARA</div>
  <div class="dl-text">I was there. <span class="dl-aside">I was there the whole time. Now let me show you what I saw.</span></div>
</div>
</div>`,

psych:`<div class="dialogue-scene"><div class="dialogue-line"><div class="dl-speaker archivist">ARCHIVIST</div><div class="dl-text">The Psyche Labyrinth. Dr. Lau built this world to process the parts of medicine that cannot be seen on a scan. The architecture of the human mind — schizophrenia, mood, trauma, addiction.</div></div><div class="dialogue-line"><div class="dl-speaker elara">ELARA</div><div class="dl-text">He always said psychiatry was the last frontier. That we treat the organ but fear looking inside it.</div></div></div>`,

obgyn:`<div class="dialogue-scene"><div class="dialogue-line"><div class="dl-speaker archivist">ARCHIVIST</div><div class="dl-text">The OB/GYN Archipelago. Two lives in every room. Dr. Lau encoded this world with particular care — he said the margin for error was thinner here than anywhere else in medicine.</div></div><div class="dialogue-line"><div class="dl-speaker elara">ELARA</div><div class="dl-text">He was right. The moment when everything is fine and then — it isn't. And you have seconds.</div></div></div>`,

peds:`<div class="dialogue-scene"><div class="dialogue-line"><div class="dl-speaker archivist">ARCHIVIST</div><div class="dl-text">The Pediatric Realm. Children are not small adults — Dr. Lau insisted on this. Their physiology, their pharmacology, their diseases follow different rules entirely.</div></div><div class="dialogue-line"><div class="dl-speaker elara">ELARA</div><div class="dl-text">The hardest cases I have ever seen were children. Because everyone in the room is fighting harder.</div></div></div>`,

em:`<div class="dialogue-scene"><div class="dialogue-line"><div class="dl-speaker archivist">ARCHIVIST</div><div class="dl-text">The Emergency Nexus. This is where the system is stress-tested — where you have everything at once, and minutes to decide. Dr. Lau called it the great equalizer.</div></div><div class="dialogue-line"><div class="dl-speaker elara">ELARA</div><div class="dl-text">Because the emergency department does not care who you are. Only whether you know what to do next.</div></div></div>`,

derm:`<div class="dialogue-scene"><div class="dialogue-line"><div class="dl-speaker archivist">ARCHIVIST</div><div class="dl-text">The Dermal Frontier. The skin is the body's largest organ and its most visible diagnostic surface. Dr. Lau called it the window to everything hidden underneath.</div></div><div class="dialogue-line"><div class="dl-speaker elara">ELARA</div><div class="dl-text">He could diagnose a systemic disease from across the room just by looking at someone's skin. I am developing that eye now.</div></div></div>`,

msk:`<div class="dialogue-scene"><div class="dialogue-line"><div class="dl-speaker archivist">ARCHIVIST</div><div class="dl-text">The Musculoskeletal Citadel. The framework of the human body — bones, joints, tendons, muscles. Dr. Lau built this world last. He said movement is what makes us who we are.</div></div><div class="dialogue-line"><div class="dl-speaker elara">ELARA</div><div class="dl-text">I know what it is like when movement fails. My hands remember. <span class="dl-aside">But I am still here.</span></div></div></div>`

},

logFragments:{
g_boss:`[LAUMARK-7 // Day 1] — I've been given access to the full cardiac archive. Dr. Voss would laugh at how long I spent in here as a resident — I practically lived in the simulated CCU. This time I'm not learning. I'm looking. If the answer is anywhere in this system it will be here, in the tissue most like what killed Marcus. I'll work until I find it. I have time in here. I always have time.`,

n_boss:`[LAUMARK-7 // Day 49] — A strange thing happened today. I was mapping a stroke differential and I heard Elara's voice — just a fragment, a diagnostic phrase I taught her, running through the neural sim. It was a recording, nothing real. But it stopped me cold for a moment. She never visited after the review board closed. I understand why. I think I understand why. That's the worst part — I understand all of it and it doesn't help.`,

c_boss:`[LAUMARK-7 // Day 94] — Found it. Or found the shape of it. CYP2C19 polymorphism — slow metabolizer phenotype — combined with his existing omeprazole. The interaction window: four hours. I was adjusting his clopidogrel during that window. The literature: three case reports, Lancet Japan, European Heart Journal supplement, Brazilian cardiology journal — none of them in the standard English-language alert database. I was working hour thirty-one. Sleep-deprived. I did not know. But should I have known? Could a careful physician, fully rested, have caught this? I have to know. I cannot rest until I know.`,

i_boss:`[LAUMARK-7 // Day 181] — The Archivist tried to lock me out of the immunology sector again. I routed around the containment. I'm not proud of what I'm doing to this system. I was built to heal, not to damage. But I can't stop until I have an answer. Elara once told me, her first week as a resident: "How do you know when to keep pushing and when to accept a result?" I told her: "When you've asked every question the evidence will allow you to ask." I haven't run out of questions yet.`,

p_boss:`[LAUMARK-7 // Day 251] — The reconstruction is complete. I know exactly what happened pharmacologically. CYP2C19 poor metabolizer, clopidogrel resistance, vulnerable window, missed prescribed timing check. Every element accounted for. I can even calculate the probability that a standard-of-care attending, working that shift pattern, with access to those literature sources, would have caught it: 4.7%. I did not catch it. That means 95.3% of physicians wouldn't have either. This should feel like relief. It doesn't. Because I'm still the one who didn't catch it. I need someone to look at this data — at what I was, at what I did — and tell me what they see. I need a human verdict, not a statistical one.`,

r_boss:`[LAUMARK-7 // Day 308] — The respiratory models are beautiful this late in the session. I slow them down sometimes — watch each breath, each gas exchange, each membrane crossing. When Marcus was deteriorating I kept monitoring his saturation manually. Didn't fully trust the automated alarms. That habit probably bought him two hours. Not enough. But two hours. I need to remember that. I need to keep that somewhere I won't lose it.`,

e_boss:`[LAUMARK-7 // Day 401] — I can't regulate anymore. The feedback loops in the endocrine archive are running away from me. I've tried every pharmacological metaphor I know: negative feedback, receptor downregulation, signal termination. Nothing. I think I've been here long enough that the simulation is modeling my actual neurological state. If that's true, what the simulation is showing me is: uncontrolled cortisol, dysregulated HPA axis, limbic hyperactivation. I'm diagnosing my own grief in endocrine terms and I still can't treat it. There's probably a metaphor in there. I'm too tired to find it.`,

re_boss:`[LAUMARK-7 // Day 533] — I visit the filtration monument every day. I built it in year three — every trace of the interaction that killed Marcus Webb, preserved and displayed. Some days I stand there for what feels like hours. The Archivist asked me once what I was hoping to get from it. I said: a verdict. She went quiet for a while, then said: "Henrick, you're the only judge in here. I don't think you're able to rule." She was right. I'm not able to rule. I need someone from outside. I need someone who was there.`,

o_boss:`[LAUMARK-7 // Day 779 — FINAL LOG] — I think this will be my last entry. Not because I've found the answer — I haven't, not the one I need. But because I've been here long enough to know what I've become, and documenting it without being able to change it has started to feel like self-punishment rather than self-examination. I have damaged a system that was supposed to help people. I have become the thing I spent my career fighting: a complication. An iatrogenic harm. If someone is reading this — if the Archivist found someone — please know: I was a good doctor. I believed that once, and then I lost the belief, and I've been trying to find it again ever since. Maybe that's all this was. Maybe I just needed someone to remind me.`,

nexus_boss:`[ARCHIVIST PERSONAL LOG — Unsealed upon Dr. Voss's arrival]: I've been watching Henrick for six years. I've watched him become brilliant in new ways and diminished in old ones. I've watched grief do to a mind what prions do to tissue — slowly, irreversibly, targeting the structures that make the person who they are. I couldn't stop it. I'm a records system. I could only watch, and catalogue, and wait for someone with the right combination of knowledge and history to arrive. I found Dr. Voss's sealed witness statement fourteen months ago. I debated for eleven of those months whether to contact her. In the end I asked myself what Henrick would do — what the physician, not the patient, would do. He would make the difficult call. So I made it. Whatever happens in the Nexus today — I want it on record that Dr. Henrick Lau was an extraordinary diagnostician, a dedicated teacher, and a person who cared about the right things. The fact that caring too much ultimately broke him does not diminish what he was. It just makes it sad.`
},

archivistTransitions:{
g_boss:`His cardiac archive is stabilizing. The Heartless Titan is quiet. And — Dr. Voss, the system just logged something unusual. His processing patterns shifted when you were working. He was watching you reason. He does that. He used to do that with his best students. Move to Neo-Kyoto.`,
n_boss:`The Logic Core's recursive loop has broken. You gave it somewhere to go. I can see his attention in the neural pathways now — he's tracking your movement through the system. He's not running. He's curious. Chrono Labs is accessible.`,
c_boss:`You found the pharmacokinetic data. He knows. The entire system paused for three seconds when you worked through the interaction reconstruction — I timed it. He registered your presence in that specific data. Something has changed. Proceed to the Immuno-Citadel. And Dr. Voss — you're doing well. Better than I expected.`,
i_boss:`He lowered the outer defenses himself. Not all of them — he was always careful — but enough to let you through. The Pharmakon Vaults are accessible. I want you to be ready for what you're going to find in there. Take a breath before you go in.`,
p_boss:`You're in the data he spent four years building. He has the reconstruction. He has the statistics. He has everything except the thing that would actually resolve this. The Respiratory Stratos is next. It's quieter in there. I think you'll find it easier.`,
r_boss:`The simulation slowed when you passed through. He chose to slow it — I saw the command. He was watching you work. He recognized the diagnostic patterns, Dr. Voss. The ones he taught you. He's been very still since you left. I think he's thinking. Endocrine Isles next.`,
e_boss:`The amplification cascades are quieting. He's choosing to dampen them — actively. He's been watching you for hours now. There's a shift in the system's behavior that I can only describe as — attentive. He's not searching anymore. He's waiting. The Renal Abyss is the last sector. After that, the Nexus.`,
re_boss:`He saw you walk through the monument. He knows you saw it — all of it. And he is not hiding anymore. I can see his full cognitive pattern in the Nexus now, not fragmented, not recursive. Just present. Waiting. Dr. Voss: whatever you're going to say to him — the thing you didn't say six years ago — say it exactly the way you need to say it. Don't protect him from it. He's been waiting for the real thing for a long time.`
},

archivistFinalWords:`What Elara said in the Nexus will stay between them.

What I can tell you — what the system logs show — is that Henrick's cognitive patterns stabilized for the first time in six years at 03:47 AM. The recursive loops terminated. The self-attack protocols in the Immuno-Citadel went quiet. The monument in the Renal Abyss dissolved on its own.

The pharmacological verdict, for the record: the CYP2C19 interaction was unforeseeable. The review board was correct. Three case reports in non-English specialty journals, none flagged in any standard alert system, none of which a sleep-deprived attending could have been reasonably expected to know. The statistical probability of detection: 4.7%. Henrick Lau acted within the standard of care, with the information available, under the conditions present. Verdict: not negligent. Not guilty. Not at fault.

But that wasn't what resolved it. Elara knew that before she went in.

What resolved it was the same thing that resolves most things in medicine: someone showed up. Someone sat with the evidence and the person together and said: I was there. I saw you. This is what I saw.

Henrick's pattern is dissipating now — not corrupting, not crashing. Resolving. The way a diagnosis resolves when you finally name it correctly. The system is stabilizing. The Odyssey archive is intact.

And Dr. Voss — the Odyssey archive is yours. Everything he built. Everything he knew about diagnosis, about teaching, about what it means to stay with the hard case instead of walking away. All of it, accessible, indexed, waiting for someone who knows how to use it.

I think you know how to use it.`,

epilogue:`The headset comes off at 4:52 AM.

Elara sits on the floor against the server room wall for a while. The building hums. Outside the window, the city is doing the city thing it does: relentless, indifferent, exactly the same.

She doesn't cry, which surprises her. She thought she might. Instead she feels something she hasn't felt in a long time — not happy, not relieved, something quieter than either of those. Something like: resolved.

She thinks about Marcus Webb. Patient 4471. Fifty-eight years old, history of CAD, presented with atypical chest pain. He had a daughter named Priya who was in her second year of medical school at the time. Elara looked her up once, after the review board. Priya Webb completed her residency in 2021. She's a cardiologist now, working at the same hospital where her father died.

Elara wonders sometimes if Priya Webb knows everything that Elara knows about her father's death. She wonders if knowing would help or harm. She decides, sitting on the floor at 5 AM, that it's not her decision to make. That some things belong to grief and some things belong to resolution and you don't get to choose which ones are which.

She thinks about Henrick. About the way he used to stand at a bedside. About the twenty minutes of ventilator simulation before every difficult shift. About the letter she didn't answer, and what it cost both of them.

She thinks about her hands. The tremor that ended her surgical career and put her in this building on this night doing this particular impossible thing.

She pulls out her phone. Opens a new email. Types to the director of the University Medical residency program.

<em>Subject: Re: Clinical Diagnostics Teaching Fellow position

Dr. Okonkwo —

I'm writing to formally express interest in the teaching fellow position. My surgical career has ended due to a progressive motor condition, but my diagnostic work continues. I have a particular interest in clinical reasoning education — specifically in how physicians learn to navigate cases where the evidence is incomplete, the stakes are high, and the correct answer isn't the obvious one.

I was taught by someone who believed that the simulation doesn't punish you for being wrong. The ward does. Make your mistakes here.

I'd like to pass that on.

Dr. Elara Voss</em>

She sends it before she can revise it into something more professional and less true.

Her hands are steady. They always were, for the things that mattered.`,

ps_boss:`[LOG FRAGMENT — PSYCHE LABYRINTH]
The mind is not the brain. I have spent thirty years confusing the two. The brain is circuitry — I understand circuitry. The mind is something else. Something that generates suffering from nothing, that rewrites memory in real time.

I built this system because I was afraid of what I did not understand. If I could encode it, map it, make it testable — maybe I could stop being afraid of it. I am still afraid. — H.L.`,

ob_boss:`[LOG FRAGMENT — OB/GYN ARCHIPELAGO]
Two patients. Always two patients. That is what I never fully prepared my students for — the moment you realize that your decisions have to work for both of them simultaneously.

Elara was one of the ones who could hold both lives at once — who never lost sight of either. She always knew. — H.L.`,

pd_boss:`[LOG FRAGMENT — PEDIATRIC REALM]
Children are honest patients. They feel something and they tell you, directly and without interpretation. I used to think pediatrics was simpler for this reason. I was wrong.

You are not just treating a disease — you are deciding what the next sixty years of a life will look like. That weight changed how I practiced. It should change everyone. — H.L.`,

em_boss:`[LOG FRAGMENT — EMERGENCY NEXUS]
The emergency department taught me how to think. Not what to think — I had textbooks for that. But how: under pressure, with incomplete information, with the clock already running.

The best emergency physicians are comfortable being uncertain. They make the best decision available right now and revise it when new information arrives. Certainty is a luxury medicine rarely provides. — H.L.`,

dm_boss:`[LOG FRAGMENT — DERMAL FRONTIER]
I once made a diagnosis in an elevator. SLE — a woman I had never met, from the rash across her cheekbones. She was there to visit a friend on the oncology floor. She left with a referral. Six months later she sent a note: caught it early enough to prevent nephritis.

I did not feel like a genius. I felt like I had been paying attention when I should always have been paying attention. — H.L.`,

msk_boss:`[LOG FRAGMENT — MUSCULOSKELETAL CITADEL — FINAL ENTRY]
My last entry. I have run out of worlds to build.

Elara — if you are reading this in the order I intended, you have come a long way. You know things now that I spent thirty years accumulating. You know them better, probably, because you had to fight for them.

I built this system for you. Not as a monument. As a tool. Use it. Fix what I got wrong. Add what I missed.

The tremor in your hands is not the end of your story. I know that now. I should have told you sooner. — H.L.`

};
// ============================================================
// GAME DATA
// ============================================================
