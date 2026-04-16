

// ============================================================
// SOUND SYNTHESIS
// ============================================================
const clickSynth=new Tone.Synth().toDestination();
const correctSynth=new Tone.Synth({oscillator:{type:'sine'},envelope:{attack:0.01,decay:0.1,sustain:0.1,release:0.2}}).toDestination();
const incorrectSynth=new Tone.Synth({oscillator:{type:'sawtooth'},envelope:{attack:0.02,decay:0.4,sustain:0,release:0.1}}).toDestination();
const levelUpSynth=new Tone.Sequence((time,note)=>{correctSynth.triggerAttackRelease(note,"16n",time);},["C4","E4","G4","C5","G5"],"16n").start(0);
levelUpSynth.loop=false;
const bossHitSynth=new Tone.Synth({oscillator:{type:'square'},volume:-6,envelope:{attack:0.01,decay:0.2,sustain:0,release:0.1}}).toDestination();
const playerHitSynth=new Tone.Synth({oscillator:{type:'fmsquare'},volume:-3,modulationIndex:5,envelope:{attack:0.05,decay:0.3,sustain:0,release:0.1}}).toDestination();
const defeatSynth=new Tone.Synth({oscillator:{type:'pwm',modulationFrequency:0.5},volume:-3,envelope:{attack:0.1,decay:1.0,sustain:0,release:0.2}}).toDestination();
const achievementSynth=new Tone.Synth({oscillator:{type:'triangle'},volume:-4,envelope:{attack:0.01,decay:0.2,sustain:0.3,release:0.3}}).toDestination();
const itemUseSynth=new Tone.Synth({oscillator:{type:'pulse',width:0.3},volume:-5,envelope:{attack:0.01,decay:0.1,sustain:0.1,release:0.1}}).toDestination();
const perkUnlockSynth=new Tone.Synth({oscillator:{type:'triangle8'},volume:-4,envelope:{attack:0.02,decay:0.3,sustain:0.2,release:0.3}}).toDestination();
const timerTickSynth=new Tone.Synth({oscillator:{type:'sine'},volume:-15,envelope:{attack:0.005,decay:0.05,sustain:0,release:0.05}}).toDestination();
const timerEndSynth=new Tone.Synth({oscillator:{type:'square'},volume:-8,envelope:{attack:0.01,decay:0.5,sustain:0,release:0.1}}).toDestination();
const buyItemSynth=new Tone.Synth({oscillator:{type:'sine'},volume:-8,envelope:{attack:0.01,decay:0.1,sustain:0.1,release:0.1}}).toDestination();
const sfxDestination=Tone.Destination;

const playSound=(type)=>{
  Tone.start().then(()=>{
    try{
      if(type==='click')clickSynth.triggerAttackRelease("F5","32n");
      else if(type==='correct')correctSynth.triggerAttackRelease("C5","16n");
      else if(type==='incorrect')incorrectSynth.triggerAttackRelease("G2","8n");
      else if(type==='levelUp')levelUpSynth.start(Tone.now());
      else if(type==='bossHit')bossHitSynth.triggerAttackRelease("A2","8n",Tone.now()+0.05);
      else if(type==='playerHit')playerHitSynth.triggerAttackRelease("E2","4n");
      else if(type==='defeat')defeatSynth.triggerAttackRelease("C2","2n");
      else if(type==='achievement')achievementSynth.triggerAttackRelease("A4","8n");
      else if(type==='itemUse')itemUseSynth.triggerAttackRelease("G4","16n");
      else if(type==='perkUnlock'){perkUnlockSynth.triggerAttackRelease("C4","8n",Tone.now()+0.05);perkUnlockSynth.triggerAttackRelease("G4","8n",Tone.now()+0.2);}
      else if(type==='timerTick')timerTickSynth.triggerAttackRelease("A5","32n");
      else if(type==='timerEnd')timerEndSynth.triggerAttackRelease("D3","4n");
      else if(type==='buyItem')buyItemSynth.triggerAttackRelease("E5","16n");
    }catch(e){}
  }).catch(()=>{});
};
// ============================================================
// SAVE KEY & PLAYER STATE
// ============================================================
const SAVE_KEY="healers_odyssey_v4";
let player=JSON.parse(localStorage.getItem(SAVE_KEY))||{level:1,xp:0,streak:0,progress:{},musicOn:true,unlockedAchievements:[],skillPoints:0,unlockedPerks:[],inventory:{focusVial:1,hintToken:1},settings:{musicVolume:0.5,sfxVolume:0.8,difficulty:'normal',musicOn:true},stats:{bossesDefeated:0,totalCorrect:0,totalIncorrect:0,itemsUsed:0,vialsUsed:0,hintsUsed:0,shieldsUsed:0,highestStreak:0,perfectBossWins:0,timedWins:0,itemsBought:0,itemlessBossWins:0,perfectNexusWin:false},currency:150,collectedFragments:{},studyDeck:[],worldAccuracy:{}};
if(!player.studyDeck)player.studyDeck=[];if(!player.worldAccuracy)player.worldAccuracy={};
player.stats=Object.assign({bossesDefeated:0,totalCorrect:0,totalIncorrect:0,itemsUsed:0,vialsUsed:0,hintsUsed:0,shieldsUsed:0,highestStreak:0,perfectBossWins:0,timedWins:0,itemsBought:0,itemlessBossWins:0,perfectNexusWin:false},player.stats||{});
player.inventory=Object.assign({focusVial:1,hintToken:1},player.inventory||{});
player.progress=player.progress||{};
player.settings=Object.assign({musicVolume:0.5,sfxVolume:0.8,difficulty:'normal',musicOn:true},player.settings||{});
player.unlockedAchievements=player.unlockedAchievements||[];
player.unlockedPerks=player.unlockedPerks||[];
player.collectedFragments=player.collectedFragments||{};
const xpPerLevel=lvl=>Math.floor(100*Math.pow(1.30,lvl-1));
const saveGame=()=>localStorage.setItem(SAVE_KEY,JSON.stringify(player));

// — story & worlds loaded from separate files —
// ============================================================
// PERK HELPERS
// ============================================================
const getPerkValue=(effectTarget)=>player.unlockedPerks.reduce((t,id)=>{const p=gameData.perks[id];return(p&&p.type==='passive'&&p.effectTarget===effectTarget&&!Array.isArray(p.value))?t+(p.value||0):t;},0);
const getPerkArray=(effectTarget)=>player.unlockedPerks.reduce((t,id)=>{const p=gameData.perks[id];return(p&&p.type==='passive'&&p.effectTarget===effectTarget&&Array.isArray(p.value))?t.concat(p.value):t;},[]);
const hasPerk=(id)=>player.unlockedPerks.includes(id);

// ============================================================
// DOM REFERENCES (assigned in DOMContentLoaded)
// ============================================================
let levelEl,xpEl,nextXpEl,streakEl,xpBarFillEl,worldsContainer,worldSelectScreen,missionSelectScreen,challengeScreen,worldTitleEl,missionListEl,challengeTitleEl,questionEl,optionsEl,feedbackEl,nextBtn,bgMusicEl,toggleMusicBtn,musicIconOn,musicIconOff,musicBtnText,achievementToastEl,achievementsListEl,perksListEl,skillPointsDisplayEl,musicVolumeSlider,sfxVolumeSlider,statsListEl,shopItemsListEl,shopCurrencyDisplayEl,summaryTitleEl,summaryDetailsEl,bossBattleUI,bossNameEl,bossHpFillEl,bossHpTextEl,bossStatusEl,bossVisualEl,playerFocusFillEl,playerFocusTextEl,itemsUiEl,skillPointsStatEl,currencyStatEl,timerDisplayEl,modifierDisplayEl,difficultyChoiceEl,difficultySettingsButtonsEl,introTextEl,worldIntroTextEl,comboDisplayEl,journalEntriesEl;

// ============================================================
// GAME STATE
// ============================================================
let currentWorldId=null,currentMission=null,originalMissionData=null,currentBossState=null,activeScreenId='world-select-screen',streakSavedThisMission=false,challengeTimerInterval=null,remainingTime=0,hintUsedThisQuestion=false,missionSummaryData={},currentCombo=0,wrongAnswersLog=[],tutorialCurrentStep=0,dailySeed=null,missionQIdx=0,missionQCorrect=0,missionQWrong=0;

// ============================================================
// SCREEN NAV & MODALS
// ============================================================
const switchScreen=(id)=>{
  if(activeScreenId===id)return;
  const o=document.getElementById(activeScreenId),n=document.getElementById(id);
  if(o)o.classList.add('hidden');
  if(n){
    n.classList.remove('hidden');
    n.style.animation='none';
    n.offsetHeight; // force reflow
    n.style.animation='screenIn 0.28s ease both';
  }
  activeScreenId=id;window.scrollTo(0,0);
};
const openModal=(id)=>{const m=document.getElementById(id);if(!m)return;playSound('click');if(id==='achievements-modal')populateAchievementsModal();if(id==='perks-modal')populatePerksModal();if(id==='settings-modal')loadSettings();if(id==='stats-modal')populateStatsModal();if(id==='shop-modal')populateShopModal();if(id==='journal-modal')populateJournalModal();m.classList.remove('modal-hidden');m.classList.add('modal-visible');};
const closeModal=(id)=>{const m=document.getElementById(id);if(!m)return;playSound('click');m.classList.add('modal-hidden');m.classList.remove('modal-visible');};

// ============================================================
// ACHIEVEMENTS
// ============================================================
const showAchievementToast=(id)=>{const a=gameData.achievements[id];if(!a)return;playSound('achievement');showToast('⚡','ACHIEVEMENT UNLOCKED',a.name);};
const checkAchievements=()=>{let u=false;Object.entries(gameData.achievements).forEach(([id,a])=>{if(!player.unlockedAchievements.includes(id)){try{if(a.condition(player)){player.unlockedAchievements.push(id);showAchievementToast(id);u=true;}}catch(e){}}});if(u){saveGame();const m=document.getElementById('achievements-modal');if(m&&!m.classList.contains('modal-hidden'))populateAchievementsModal();}};
const populateAchievementsModal=()=>{if(!achievementsListEl)return;achievementsListEl.innerHTML='';const all=Object.keys(gameData.achievements),un=player.unlockedAchievements,lo=all.filter(id=>!un.includes(id));if(un.length===0&&lo.length===0){achievementsListEl.innerHTML='<p style="color:#4a6070;font-size:0.85rem;font-style:italic;">No achievements defined.</p>';return;}if(un.length===0)achievementsListEl.innerHTML='<p style="color:#4a6070;font-size:0.85rem;font-style:italic;">No achievements unlocked yet.</p>';un.forEach(id=>{const a=gameData.achievements[id];if(!a)return;const el=document.createElement('div');el.className='ach-entry ach-unlocked';el.innerHTML=`<div class="ach-icon">✓</div><div><div class="ach-name">${a.name}</div><div class="ach-desc">${a.description}</div></div>`;achievementsListEl.appendChild(el);});lo.forEach(id=>{const a=gameData.achievements[id];if(!a)return;const el=document.createElement('div');el.className='ach-entry ach-locked';el.innerHTML=`<div class="ach-icon">🔒</div><div><div class="ach-name">${a.name}</div><div class="ach-desc">${a.description}</div></div>`;achievementsListEl.appendChild(el);});};

// ============================================================
// PERKS
// ============================================================
const populatePerksModal=()=>{if(!perksListEl||!skillPointsDisplayEl)return;perksListEl.innerHTML='';skillPointsDisplayEl.textContent=player.skillPoints;Object.entries(gameData.perks).forEach(([id,perk])=>{const isU=player.unlockedPerks.includes(id),canA=player.skillPoints>=perk.cost,meetsLv=player.level>=perk.requiresLevel,meetsPR=!perk.requiresPerk||player.unlockedPerks.includes(perk.requiresPerk),canU=!isU&&canA&&meetsLv&&meetsPR;const el=document.createElement('div');el.className='perk-entry'+(isU?' perk-unlocked':'')+((!meetsLv||!meetsPR)?' perk-locked-lvl':'');let rT=`Lv.${perk.requiresLevel}`;if(perk.requiresPerk){const rp=gameData.perks[perk.requiresPerk];rT+=` · ${rp?.name||'previous'}`;}el.innerHTML=`<div class="perk-info"><div class="perk-name">${perk.name}</div><div class="perk-desc">${perk.description}</div><div class="perk-req">${rT}</div></div><div class="perk-action-col">${isU?'<span class="perk-active">ACTIVE</span>':canU?`<button onclick="unlockPerk('${id}')" class="perk-cost-btn">${perk.cost}SP</button>`:!meetsLv||!meetsPR?'<span class="perk-locked-label">LOCKED</span>':`<span class="perk-locked-label">${perk.cost}SP</span>`}</div>`;perksListEl.appendChild(el);});};
const unlockPerk=(id)=>{const p=gameData.perks[id];if(!p||player.unlockedPerks.includes(id))return;if(player.skillPoints>=p.cost&&player.level>=p.requiresLevel&&(!p.requiresPerk||player.unlockedPerks.includes(p.requiresPerk))){playSound('perkUnlock');player.skillPoints-=p.cost;player.unlockedPerks.push(id);saveGame();populatePerksModal();updateStats();checkAchievements();}else{playSound('incorrect');}};

// ============================================================
// SETTINGS
// ============================================================
const loadSettings=()=>{if(!musicVolumeSlider||!sfxVolumeSlider||!difficultySettingsButtonsEl)return;musicVolumeSlider.value=player.settings.musicVolume;sfxVolumeSlider.value=player.settings.sfxVolume;applySettings();difficultySettingsButtonsEl.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.difficulty===player.settings.difficulty));};
const applySettings=()=>{if(!bgMusicEl||!sfxDestination)return;bgMusicEl.volume=player.settings.musicVolume;try{sfxDestination.volume.value=Tone.gainToDb(player.settings.sfxVolume);}catch(e){}};
const updateSetting=(t,v)=>{const n=parseFloat(v);if(isNaN(n))return;if(t==='musicVolume')player.settings.musicVolume=Math.max(0,Math.min(1,n));else if(t==='sfxVolume')player.settings.sfxVolume=Math.max(0,Math.min(1,n));applySettings();saveGame();};
const setDifficulty=(d)=>{if(!['easy','normal','hard'].includes(d))return;playSound('click');player.settings.difficulty=d;saveGame();loadSettings();};
const getDifficultyMultiplier=(t)=>{const d=player.settings?.difficulty||'normal';if(t==='xp')return d==='easy'?0.8:d==='hard'?1.2:1.0;if(t==='focusLoss')return d==='hard'?1.5:1.0;if(t==='currency')return d==='easy'?0.75:d==='hard'?1.25:1.0;return 1.0;};
const resetGame=()=>{playSound('click');if(window.confirm("Are you sure you want to reset ALL game data? This cannot be undone.")){localStorage.removeItem(SAVE_KEY);location.reload();}};

// ============================================================
// STATS
// ============================================================
const trackStat=(n,v=1)=>{if(!player.stats)player.stats={};if(n==='streakUpdate'){if(v>(player.stats.highestStreak||0))player.stats.highestStreak=v;return;}player.stats[n]=(player.stats[n]||0)+v;};
const populateStatsModal=()=>{if(!statsListEl)return;const s=player.stats||{},tot=(s.totalCorrect||0)+(s.totalIncorrect||0),acc=tot>0?((s.totalCorrect||0)/tot*100).toFixed(1)+'%':'N/A';const row=(l,v,cls='text-c')=>`<div class="stat-row"><div class="stat-row-label">${l}</div><div class="stat-row-val ${cls}">${v}</div></div>`;statsListEl.innerHTML=[row('Bosses Defeated',s.bossesDefeated||0,'text-r'),row('Total Correct',s.totalCorrect||0,'text-g'),row('Total Incorrect',s.totalIncorrect||0,'text-r'),row('Overall Accuracy',acc,'text-y'),row('Highest Streak',s.highestStreak||0,'text-y'),row('Focus Vials Used',s.vialsUsed||0,'text-c'),row('Hint Tokens Used',s.hintsUsed||0,'text-y'),row('Shield Charms Used',s.shieldsUsed||0,'text-p'),row('Perfect Boss Wins',s.perfectBossWins||0,'text-p'),row('Timed Missions Won',s.timedWins||0,'text-y'),row('Items Bought',s.itemsBought||0,'text-g'),row('Level',player.level,'text-g'),row('Credits',player.currency+'🪙','text-y'),row('Study Deck',`${(player.studyDeck||[]).length} cards`,'text-c'),row('Worlds Unlocked',Object.values(gameData).filter(w=>w&&w.order&&isWorldUnlocked(w.id,w)).length+'/16','text-g')].join('');};

// ============================================================
// JOURNAL
// ============================================================
const populateJournalModal=()=>{if(!journalEntriesEl)return;journalEntriesEl.innerHTML='';const bosses=[{worldId:'gaia',bossId:'g_boss',worldName:'Gaia Sector',bossName:'Heartless Titan'},{worldId:'neuro',bossId:'n_boss',worldName:'Neo-Kyoto Circuits',bossName:'The Logic Core'},{worldId:'chrono',bossId:'c_boss',worldName:'Chrono Labs',bossName:'Temporal Anomaly'},{worldId:'immuno',bossId:'i_boss',worldName:'Immuno-Citadel',bossName:'Sentinel of Self-Tolerance'},{worldId:'pharmakon',bossId:'p_boss',worldName:'Pharmakon Vaults',bossName:'Dread Formulator'},{worldId:'respiratory',bossId:'r_boss',worldName:'Respiratory Stratos',bossName:'Gaseous Warden'},{worldId:'endocrine',bossId:'e_boss',worldName:'Endocrine Isles',bossName:'Overlord of Overproduction'},{worldId:'renal',bossId:'re_boss',worldName:'Renal Abyss',bossName:'Monsoon Leviathan'},{worldId:'oncocrypts',bossId:'o_boss',worldName:'Oncocrypts',bossName:'Grand Malignant'},{worldId:'nexus',bossId:'nexus_boss',worldName:'The Final Convergence',bossName:'Sentinel 734'}];bosses.forEach((e,i)=>{const u=player.progress[e.worldId]?.includes(e.bossId),f=story.logFragments[e.bossId],el=document.createElement('div');el.className=`journal-entry p-4 rounded-lg ${u?'unlocked':''}`;if(u){el.innerHTML=`<div class="journal-header"><span class="journal-log-num">LOG ${String(i+1).padStart(2,'0')}</span><span class="journal-world">${e.worldName}</span></div><div class="journal-boss">Recovered from: ${e.bossName}</div><div class="journal-text">${f}</div>`;}else{el.innerHTML=`<div class="journal-header"><span class="journal-log-num" style="opacity:0.4;">LOG ${String(i+1).padStart(2,'0')}</span><span class="journal-world" style="color:var(--t3);">${e.worldName}</span><span style="margin-left:auto;color:var(--t3);">🔒</span></div><div class="journal-locked">Defeat ${e.bossName} to unlock.</div>`;}journalEntriesEl.appendChild(el);});};

// ============================================================
// COMBO DISPLAY
// ============================================================
const updateComboDisplay=()=>{if(!comboDisplayEl)return;if(currentCombo>=3){const mult=Math.min(2,1+(currentCombo-2)*0.1);comboDisplayEl.innerHTML=`<span style="color:var(--y);text-shadow:0 0 20px rgba(255,214,0,0.7);">⚡ ${currentCombo}x</span>`;comboDisplayEl.style.animation='none';comboDisplayEl.offsetHeight;comboDisplayEl.style.animation='comboPop 0.3s ease-out';}else{comboDisplayEl.innerHTML=currentCombo>0?`<span style="color:var(--t3);font-size:0.72rem;">STREAK ${currentCombo}</span>`:'';comboDisplayEl.style.animation='';}};

// ============================================================
// LEVEL UP & STATS UPDATE
// ============================================================
const updateStats=(leveledUp=false,pointsGained=0)=>{if(!levelEl||!xpEl||!nextXpEl||!streakEl||!xpBarFillEl||!skillPointsStatEl||!currencyStatEl)return;levelEl.textContent=player.level;xpEl.textContent=player.xp;const nxp=xpPerLevel(player.level);nextXpEl.textContent=nxp;streakEl.textContent=player.streak;trackStat('streakUpdate',player.streak);const pct=Math.min(100,(player.xp/nxp)*100);xpBarFillEl.style.width=`${pct}%`;
  xpBarFillEl.style.boxShadow='0 0 16px rgba(0,245,255,0.8)';
  setTimeout(()=>{xpBarFillEl.style.boxShadow='';},800);skillPointsStatEl.textContent=player.skillPoints;currencyStatEl.textContent=`${player.currency}🪙`;if(leveledUp){
    playSound('levelUp');
    levelEl.classList.add('level-up-animation');
    setTimeout(()=>levelEl.classList.remove('level-up-animation'),600);
    // Level-up toast notification
    showToast('&#x2B06;','NEURAL UPGRADE','LEVEL '+player.level+(pointsGained>0?' +'+pointsGained+' SP':''),'toast-green');
    // Flash the XP bar
    if(xpBarFillEl){xpBarFillEl.style.background='linear-gradient(90deg,var(--green),#80ffb0)';setTimeout(()=>{xpBarFillEl.style.background='';},1200);}
  }saveGame();checkAchievements();};
const checkLevelUp=()=>{let lu=false,pts=0;while(player.xp>=xpPerLevel(player.level)){player.xp-=xpPerLevel(player.level);player.level++;player.skillPoints++;pts++;lu=true;}updateStats(lu,pts);};

// ============================================================
// WORLD UNLOCKING & DISPLAY
// ============================================================
const isWorldUnlocked=(worldId,worldData)=>{if(!worldData)return false;if(worldData.order===1)return true;if(!worldData.unlocksAfter)return true;const prev=Object.values(gameData).find(w=>w&&w.id===worldData.unlocksAfter&&w.order);if(!prev||!prev.missions||prev.missions.length===0)return false;const boss=prev.missions.find(m=>m.boss===true);if(!boss)return true;return player.progress[worldData.unlocksAfter]?.includes(boss.id)||false;};

const showWorlds=()=>{if(!worldsContainer||!introTextEl)return;worldsContainer.innerHTML='';if(document.getElementById('intro-text'))document.getElementById('intro-text').innerHTML='';const worlds=Object.values(gameData).filter(d=>d&&typeof d==='object'&&d.order&&d.id).sort((a,b)=>a.order-b.order);worlds.forEach(world=>{const unlocked=isWorldUnlocked(world.id,world);const completedMissions=player.progress[world.id]?.length||0;const totalMissions=world.missions?.length||0;const bossDefeated=world.missions?.find(m=>m.boss&&player.progress[world.id]?.includes(m.id));const card=document.createElement('button');card.disabled=!unlocked;const pct=totalMissions>0?Math.round(completedMissions/totalMissions*100):0;card.className='world-card'+(bossDefeated?' cleared':'')+((!unlocked)?' disabled-card':'');card.style.opacity=unlocked?'1':'0.4';card.style.cursor=unlocked?'pointer':'not-allowed';card.innerHTML=`<span class="world-order">${world.order.toString().padStart(2,"0")}</span><span class="world-icon">${world.icon||'🌐'}</span><div class="world-name">${world.name}</div><div class="world-sub">${completedMissions}/${totalMissions} challenges${bossDefeated?' · CLEARED':''}</div><div class="world-acc">${(()=>{const wa=player.worldAccuracy&&player.worldAccuracy[world.id];return wa&&wa.total>0?Math.round(wa.correct/wa.total*100)+"% acc":"";})()}</div><div class="world-dots">${(()=>{const dots=[];const missions=world.missions||[];const total=missions.length;for(let di=0;di<Math.min(total,10);di++){const comp=player.progress[world.id]&&player.progress[world.id].includes(missions[di]&&missions[di].id);const isBoss=missions[di]&&missions[di].boss;dots.push(`<span class="wdot${comp?(isBoss?" wdot-boss-done":" wdot-done"):isBoss?" wdot-boss":""}"></span>`);}if(total>10)dots.push(`<span class="wdot-more">+${total-10}</span>`);return dots.join("");})()}</div><div class="world-badges">${!unlocked&&world.unlocksAfter?'<span class="world-badge badge-locked">LOCKED</span>':bossDefeated?'<span class="world-badge badge-cleared">CLEARED</span>':completedMissions>0?`<span class="world-badge badge-progress">${completedMissions}/${totalMissions}</span>`:'<span class="world-badge badge-locked">START</span>'}</div>`;if(unlocked)card.onclick=()=>{
    playSound('click');
    card.style.transform='scale(0.97)';
    card.style.transition='transform 0.1s ease';
    setTimeout(()=>{card.style.transform='';card.style.transition='';selectWorld(world.id);},100);
  };worldsContainer.appendChild(card);});
  const pss=document.getElementById('player-summary-strip');
  if(pss){
    const tot=(player.stats?.totalCorrect||0)+(player.stats?.totalIncorrect||0);
    const acc=tot>0?Math.round((player.stats?.totalCorrect||0)/tot*100):'—';
    const cleared=Object.values(gameData).filter(w=>w&&w.order&&player.progress[w.id]?.includes(w.id+'_boss')).length;
    const totalMissions=Object.values(gameData).filter(w=>w&&w.order&&w.missions).reduce((t,w)=>t+w.missions.length,0);
    const completedMissions=Object.values(gameData).filter(w=>w&&w.order).reduce((t,w)=>t+(player.progress[w.id]?.length||0),0);
    const pct=totalMissions>0?Math.round(completedMissions/totalMissions*100):0;
    pss.innerHTML=`<span class="pss-item">&#x1F9E0; Lv.${player.level}</span><span class="pss-div"></span><span class="pss-item">&#x26A1; ${player.streak} streak</span><span class="pss-div"></span><span class="pss-item">&#x2714; ${player.stats?.totalCorrect||0} correct</span><span class="pss-div"></span><span class="pss-item">&#x1F3AF; ${acc}% acc</span><span class="pss-div"></span><span class="pss-item pss-progress">${completedMissions}/${totalMissions} complete (${pct}%)</span>`;
  }
  switchScreen('world-select-screen');};

const selectWorld=(worldId)=>{if(!worldTitleEl||!missionListEl||!worldIntroTextEl)return;const world=Object.values(gameData).find(w=>w&&w.id===worldId&&w.order);if(!world){goBackToWorlds();return;}currentWorldId=worldId;worldTitleEl.textContent=world.name;const missionSubEl=document.getElementById('mission-sub');if(missionSubEl){const done=(player.progress[worldId]||[]).length;missionSubEl.textContent=done+'/'+world.missions.length+' completed';}if(worldIntroTextEl)worldIntroTextEl.innerHTML='';const _lb=document.getElementById('lore-btn');if(_lb)_lb.onclick=()=>openVNScene(worldId);missionListEl.innerHTML='';if(!world.missions||world.missions.length===0){missionListEl.innerHTML='<p style="text-align:center;color:#4a6070;font-style:italic;font-size:0.9rem;">No challenges defined yet.</p>';switchScreen('mission-select-screen');return;}if(!player.progress[worldId])player.progress[worldId]=[];world.missions.forEach((mission,idx)=>{const isComp=player.progress[worldId].includes(mission.id);let isUnl=idx===0||(idx>0&&player.progress[worldId].includes(world.missions[idx-1].id));const btn=document.createElement('button');btn.disabled=!isUnl;btn.className='mission-row '+(mission.boss?'boss':'regular')+(isComp?' done':'')+((!isUnl)?' disabled':'');btn.style.opacity=isUnl?'1':'0.4';btn.innerHTML=`<span class="mission-num">${idx+1}</span><span class="mission-name">${mission.name}</span>${mission.boss?'<span class="mission-tag tag-boss">BOSS</span>':''}${mission.timeLimit?'<span class="mission-tag tag-timed">TIMED</span>':''}${isComp?'<span class="mission-check">✓</span>':isUnl?'':'<span class="mission-lock">🔒</span>'}`;if(isUnl)btn.onclick=()=>{playSound('click');loadMission(mission);};missionListEl.appendChild(btn);});switchScreen('mission-select-screen');};

const goBackToWorlds=()=>{playSound('click');currentWorldId=null;switchScreen('world-select-screen');};

// ============================================================
// TIMER
// ============================================================
const stopTimer=()=>{if(challengeTimerInterval){clearInterval(challengeTimerInterval);challengeTimerInterval=null;}if(timerDisplayEl){timerDisplayEl.textContent='';timerDisplayEl.className='timer-normal';}};
const startTimer=(limit)=>{stopTimer();let adj=limit;const d=player.settings?.difficulty||'normal';if(d==='easy')adj=Math.round(limit*1.25);if(d==='hard')adj=Math.round(limit*0.75);if(hasPerk('chronoMaster'))adj+=(getPerkValue('timeBonus')||0);remainingTime=Math.max(1,adj);if(!timerDisplayEl)return;timerDisplayEl.textContent=remainingTime;challengeTimerInterval=setInterval(()=>{remainingTime--;if(timerDisplayEl)timerDisplayEl.textContent=remainingTime;if(remainingTime<=5&&remainingTime>0){if(timerDisplayEl)timerDisplayEl.style.color='var(--r)';timerDisplayEl.style.textShadow='0 0 20px rgba(255,23,68,0.6)';playSound('timerTick');}else{if(timerDisplayEl)timerDisplayEl.style.color='var(--y)';timerDisplayEl.style.textShadow='0 0 20px rgba(255,214,0,0.4)';}if(remainingTime<=0)handleTimeout();},1000);};
const handleTimeout=()=>{stopTimer();playSound('timerEnd');if(!feedbackEl)return;feedbackEl.textContent="Time's Up!";feedbackEl.className='fb-wrong';disableOptions();if(!missionSummaryData)missionSummaryData={correctAnswers:0,incorrectAnswers:0,focusLost:0};missionSummaryData.incorrectAnswers++;trackStat('totalIncorrect');currentCombo=0;updateComboDisplay();if(currentMission?.boss&&currentBossState){playSound('playerHit');const fl=Math.max(1,Math.round(1*getDifficultyMultiplier('focusLoss')*(currentMission.baseFocusLossMultiplier||1)));if(currentBossState.shieldActive){currentBossState.shieldActive=false;playSound('itemUse');feedbackEl.textContent="Time's Up! Shield blocked!";feedbackEl.className='fb-info';}else{currentBossState.focus-=fl;currentBossState.focusLostThisFight+=fl;missionSummaryData.focusLost=(missionSummaryData.focusLost||0)+fl;}updatePlayerFocusUI();if(currentBossState.focus<=0){setTimeout(()=>loadNextBossQuestion(),50);return;}}else{const hs=hasPerk('streakSaver');if(!hs||streakSavedThisMission)player.streak=0;else{feedbackEl.textContent+=" (Streak Saved!)";streakSavedThisMission=true;}updateStats();}if(nextBtn){nextBtn.classList.remove('hidden');if(currentMission?.boss&&currentBossState?.focus>0){nextBtn.onclick=()=>{currentBossState.questionIndex++;loadNextBossQuestion();};nextBtn.textContent='Next Phase →';}else{nextBtn.onclick=()=>showSummaryModal(false);nextBtn.textContent='View Summary →';}}};

// ============================================================
// LOAD MISSION
// ============================================================
const loadMission=(missionData)=>{if(!challengeTitleEl||!questionEl||!optionsEl||!feedbackEl||!nextBtn||!itemsUiEl||!modifierDisplayEl||!timerDisplayEl||!difficultyChoiceEl){goBackToWorlds();return;}stopTimer();hintUsedThisQuestion=false;streakSavedThisMission=false;currentCombo=0;updateComboDisplay();wrongAnswersLog=[];originalMissionData={...missionData};currentMission={...missionData};modifierDisplayEl.innerHTML='';currentMission.modifierId=null;currentMission.xpMultiplier=1;currentMission.playerBaseFocusModifier=0;currentMission.baseFocusLossMultiplier=1;currentMission.mirroredOptions=false;currentMission.damageMultiplier=1;
// Apply modifier
const mkeys=Object.keys(gameData.modifiers);if(mkeys.length>0&&Math.random()<0.25){const mid=mkeys[Math.floor(Math.random()*mkeys.length)];const mod=gameData.modifiers[mid];const resisted=getPerkArray('modifierResistance_arr').includes(mid);if(mod?.apply&&!resisted){currentMission=mod.apply(currentMission);modifierDisplayEl.innerHTML=`<span class="modifier-badge">${mod.name}: ${mod.description}</span>`;}}
challengeTitleEl.textContent=currentMission.name;questionEl.textContent='';optionsEl.innerHTML='';feedbackEl.textContent='';feedbackEl.className='';nextBtn.classList.add('hidden');nextBtn.className='next-btn-complete';nextBtn.style.cssText='';const bossArena=document.getElementById('boss-battle-ui');if(bossArena){bossArena.style.borderColor='rgba(0,255,136,0.35)';bossArena.style.background='linear-gradient(135deg,rgba(0,30,10,0.4),rgba(0,15,5,0.6))';};nextBtn.onclick=()=>showSummaryModal();nextBtn.innerHTML='CONTINUE JOURNEY →';if(bossVisualEl){bossVisualEl.innerHTML='';bossVisualEl.classList.remove('visible','animate-slow-pulse','hit');}difficultyChoiceEl.classList.add('hidden');questionEl.classList.add('hidden');missionSummaryData={xpEarned:0,currencyEarned:0,itemsFound:{},correctAnswers:0,incorrectAnswers:0,focusLost:0,timed:!!(currentMission.timeLimit||currentMission.modifierId==='timePressure'),timeTaken:0,startTime:Date.now(),logFragment:currentMission.rewards?.logFragment,artifact:currentMission.rewards?.artifact,itemUsedThisMission:false};
if(currentMission.boss){if(!bossBattleUI||!bossNameEl||!bossHpFillEl||!bossHpTextEl||!playerFocusFillEl||!playerFocusTextEl||!bossVisualEl){goBackToWorlds();return;}bossBattleUI.classList.remove('hidden','opacity-50');bossNameEl.textContent=currentMission.name;let bF=currentMission.playerBaseFocus||3;const bFMod=currentMission.playerBaseFocusModifier||0;const maxF=Math.max(1,bF+(getPerkValue('maxFocus')||0)+bFMod);const savedHp=player.bossProgress?.[originalMissionData.id];const startHp=savedHp&&savedHp>0&&savedHp<currentMission.hp?savedHp:currentMission.hp;if(savedHp&&savedHp>0&&savedHp<currentMission.hp){if(feedbackEl){feedbackEl.textContent='Resuming — boss at '+savedHp+' HP';feedbackEl.style.color='var(--cyan)';setTimeout(()=>{if(feedbackEl)feedbackEl.textContent='';},3000);}}currentBossState={maxHp:currentMission.hp,hp:startHp,maxFocus:maxF,focus:maxF,questionIndex:0,questions:[...currentMission.questions],focusLostThisFight:0,currentQuestionData:null,shieldActive:false};updateBossUI();updatePlayerFocusUI();
    // Animate HP bar entrance
    if(bossHpFillEl){const origW=bossHpFillEl.style.width;bossHpFillEl.style.width='0%';bossHpFillEl.style.transition='none';setTimeout(()=>{bossHpFillEl.style.transition='width 0.8s cubic-bezier(0.23,1,0.32,1)';bossHpFillEl.style.width=origW;},100);}
    populateItemsUI();if(currentMission.svgPath){bossVisualEl.innerHTML=`<div class="animate-slow-pulse" style="padding:12px;background:rgba(100,0,0,0.15);border:1px solid rgba(255,23,68,0.2);border-radius:50%;display:inline-block;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="stroke:var(--r);width:60px;height:60px;filter:drop-shadow(0 0 16px rgba(255,23,68,0.6));"><path stroke-linecap="round" stroke-linejoin="round" d="${currentMission.svgPath}"/></svg></div>`;setTimeout(()=>{bossVisualEl.classList.add('visible');bossVisualEl.style.animation='bossAppear 0.6s cubic-bezier(0.23,1,0.32,1) both';},80);}showBossIntro(currentMission,()=>loadNextBossQuestion());}else{bossBattleUI.classList.add('hidden');missionQIdx=0;missionQCorrect=0;missionQWrong=0;wrongAnswersLog=[];loadMissionQuestion(0);let tl=currentMission.timeLimit;if(currentMission.modifierId==='timePressure'&&!tl)tl=15;if(tl&&tl>0)startTimer(tl);else if(timerDisplayEl)timerDisplayEl.textContent='';}switchScreen('challenge-screen');};

// ============================================================
// ITEMS UI
// ============================================================
const populateItemsUI=()=>{if(!itemsUiEl)return;itemsUiEl.innerHTML='';if(!player.inventory)player.inventory={};Object.entries(player.inventory).forEach(([itemId,count])=>{if(count>0){const d=gameData.items[itemId];if(d){const btn=document.createElement('button');btn.className='item-btn';btn.innerHTML=`${d.icon||'📦'} ${d.name} (${count})`;btn.title=d.description;btn.onclick=()=>useItem(itemId);const ib=currentMission?.boss&&currentBossState;const ioq=questionEl&&questionEl.offsetParent!==null&&(!difficultyChoiceEl||difficultyChoiceEl.offsetParent===null);let dis=false;if(itemId==='focusVial'&&(!ib||currentBossState.focus>=currentBossState.maxFocus))dis=true;if(itemId==='hintToken'&&(hintUsedThisQuestion||!ioq||optionsEl.querySelectorAll('button:not(:disabled):not(.hint-removed)').length<=1))dis=true;if(itemId==='shieldCharm'&&(!ib||currentBossState.shieldActive))dis=true;if(itemId==='dataShard'&&(!ib||!currentBossState))dis=true;btn.disabled=dis;if(dis)btn.style.opacity='0.4';itemsUiEl.appendChild(btn);}}});};

const useItem=(itemId)=>{if(itemId==='hintToken'&&currentMission?.id==='nexus_boss'){playSound('incorrect');if(feedbackEl){feedbackEl.textContent="Hint Tokens are disabled for this final encounter.";feedbackEl.className='fb-correct';setTimeout(()=>{if(feedbackEl)feedbackEl.textContent='';},2000);}return;}if(!player.inventory||player.inventory[itemId]<=0)return;let used=false;const ib=currentMission?.boss&&currentBossState;const saveC=getPerkValue('genericItemSaveChance')||0;const saved=Math.random()<saveC;let consume=!saved;
if(itemId==='focusVial'){let fr=1+(hasPerk('expertChemist')?(getPerkValue('focusVialBoost')||0):0);if(ib&&currentBossState.focus<currentBossState.maxFocus){playSound('itemUse');currentBossState.focus=Math.min(currentBossState.maxFocus,currentBossState.focus+fr);updatePlayerFocusUI();used=true;trackStat('vialsUsed');}else{playSound('incorrect');}}
else if(itemId==='hintToken'){const ioq=questionEl&&questionEl.offsetParent!==null&&(!difficultyChoiceEl||difficultyChoiceEl.offsetParent===null);if(!hintUsedThisQuestion&&ioq){const ca=currentMission.boss?currentBossState?.currentQuestionData?.a:currentMission?.a;if(ca===undefined||ca===null){playSound('incorrect');return;}const wb=Array.from(optionsEl.querySelectorAll('button:not(:disabled):not(.hint-removed)')).filter(b=>b.textContent.replace(/^\s*\d+\s*/,'').trim()!==ca);if(wb.length>0){playSound('itemUse');const r=wb[Math.floor(Math.random()*wb.length)];r.classList.add('hint-removed');r.disabled=true;hintUsedThisQuestion=true;used=true;trackStat('hintsUsed');}else{playSound('incorrect');}}else{playSound('incorrect');}}
else if(itemId==='shieldCharm'){if(ib&&!currentBossState.shieldActive){playSound('itemUse');currentBossState.shieldActive=true;updatePlayerFocusUI();used=true;trackStat('shieldsUsed');}else{playSound('incorrect');}}
else if(itemId==='dataShard'){if(ib&&currentBossState){playSound('itemUse');if(feedbackEl){feedbackEl.textContent="Data Shard used — phase skipped!";feedbackEl.className='fb-info';}currentBossState.questionIndex++;used=true;setTimeout(()=>loadNextBossQuestion(),800);}}
if(used){missionSummaryData.itemUsedThisMission=true;trackStat('itemsUsed');if(consume)player.inventory[itemId]--;else if(feedbackEl){feedbackEl.textContent="Lucky Charm! Item saved!";feedbackEl.className='fb-correct';setTimeout(()=>{if(feedbackEl&&feedbackEl.textContent==="Lucky Charm! Item saved!")feedbackEl.textContent='';},2000);}saveGame();populateItemsUI();checkAchievements();}};

// ============================================================
// BOSS UI UPDATE
// ============================================================
const updateBossUI=()=>{if(!currentBossState||!bossHpFillEl||!bossHpTextEl)return;const pct=Math.max(0,(currentBossState.hp/currentBossState.maxHp)*100);bossHpFillEl.style.width=`${pct}%`;bossHpTextEl.textContent=`${Math.max(0,currentBossState.hp)} / ${currentBossState.maxHp}`;};
const updatePlayerFocusUI=()=>{if(!currentBossState||!playerFocusFillEl||!playerFocusTextEl)return;const pct=Math.max(0,(currentBossState.focus/currentBossState.maxFocus)*100);playerFocusFillEl.style.width=`${pct}%`;let ft=`${currentBossState.focus} / ${currentBossState.maxFocus}`;if(currentBossState.shieldActive)ft+=' 🛡️';playerFocusTextEl.textContent=ft;const par=playerFocusFillEl.parentElement;if(par){par.style.boxShadow=currentBossState.focus===1?'0 0 10px rgba(255,50,50,0.6)':'';}populateItemsUI();};

// ============================================================
// LOAD NEXT BOSS QUESTION
// ============================================================
const loadNextBossQuestion=()=>{if(!optionsEl||!feedbackEl||!bossStatusEl||!challengeTitleEl||!questionEl||!nextBtn||!bossVisualEl||!difficultyChoiceEl||!bossBattleUI||!currentBossState){goBackToWorlds();return;}stopTimer();hintUsedThisQuestion=false;optionsEl.innerHTML='';feedbackEl.textContent='';feedbackEl.className='';if(bossStatusEl)bossStatusEl.textContent='';if(bossVisualEl)bossVisualEl.classList.remove('hit');questionEl.classList.add('hidden');difficultyChoiceEl.classList.add('hidden');
// WIN
if(currentBossState.hp<=0){challengeTitleEl.textContent=`${currentMission.name} — DEFEATED`;questionEl.innerHTML=`<span style="color:#80ffa0;font-family:'Exo 2',sans-serif;font-size:1rem;font-weight:700;">ANOMALY PURGED</span>`;questionEl.classList.remove('hidden');playSound('levelUp');if(bossStatusEl){bossStatusEl.textContent='Vanquished!';bossStatusEl.style.color='var(--green)';}if(bossBattleUI)bossBattleUI.style.opacity='0.5';let firstTime=false;if(!player.progress)player.progress={};if(!player.progress[currentWorldId])player.progress[currentWorldId]=[];if(!player.progress[currentWorldId].includes(originalMissionData.id)){player.progress[currentWorldId].push(originalMissionData.id);firstTime=true;trackStat('bossesDefeated');if(originalMissionData.rewards?.items){Object.entries(originalMissionData.rewards.items).forEach(([id,cnt])=>{player.inventory[id]=(player.inventory[id]||0)+cnt;missionSummaryData.itemsFound[id]=(missionSummaryData.itemsFound[id]||0)+cnt;});}if(originalMissionData.rewards?.skillPoints)player.skillPoints+=originalMissionData.rewards.skillPoints;}if(currentBossState.focusLostThisFight===0)trackStat('perfectBossWins');if(missionSummaryData.timed)trackStat('timedWins');if(!missionSummaryData.itemUsedThisMission)trackStat('itemlessBossWins');if(currentMission.finalBoss&&currentBossState.focusLostThisFight===0)player.stats.perfectNexusWin=true;const bxp=originalMissionData.xp||100,dm=getDifficultyMultiplier('xp'),xpM=getPerkValue('xpModifier'),mxm=currentMission.xpMultiplier||1,earned=Math.round(bxp*dm*(1+xpM)*mxm);player.xp+=earned;missionSummaryData.xpEarned=earned;const bc=originalMissionData.rewards?.currency||50,dc=getDifficultyMultiplier('currency'),ec=Math.round(bc*dc);player.currency+=ec;missionSummaryData.currencyEarned=ec;if(player.bossProgress)delete player.bossProgress[originalMissionData.id];checkLevelUp();saveGame();checkAchievements();nextBtn.classList.remove('hidden');nextBtn.onclick=()=>showSummaryModal(true);nextBtn.innerHTML='VIEW MISSION REPORT →';nextBtn.className='next-btn-complete';nextBtn.style.cssText='';return;}
// LOSS
if(currentBossState.focus<=0){challengeTitleEl.textContent=`${currentMission.name} — OVERWHELMED`;questionEl.innerHTML=`<span style="color:#ff8080;font-family:'Exo 2',sans-serif;">Your focus wavered. Return to retry.</span>`;questionEl.classList.remove('hidden');playSound('defeat');feedbackEl.textContent='Focus Depleted!';feedbackEl.style.color='var(--red)';if(bossStatusEl){bossStatusEl.textContent='Challenge Failed';bossStatusEl.style.color='var(--red)';}optionsEl.innerHTML='<p style="text-align:center;color:#5a7a8a;font-style:italic;font-size:0.85rem;">Return to the realm map to try again.</p>';if(!player.bossProgress)player.bossProgress={};player.bossProgress[originalMissionData.id]=currentBossState.hp;saveGame();nextBtn.classList.remove('hidden');nextBtn.onclick=()=>showSummaryModal(false);nextBtn.innerHTML='VIEW REPORT →';nextBtn.style.cssText='background:rgba(255,214,0,0.1);border:1px solid rgba(255,214,0,0.3);color:var(--y);width:100%;font-weight:700;padding:14px;border-radius:12px;cursor:pointer;font-family:Orbitron,sans-serif;font-size:0.75rem;letter-spacing:0.1em;display:flex;align-items:center;justify-content:center;gap:8px;';return;}
// OUT OF QUESTIONS
if(currentBossState.questionIndex>=currentBossState.questions.length){challengeTitleEl.textContent=`${currentMission.name} — STANDOFF`;questionEl.innerHTML=`<span style="color:#ffd070;">The ${currentMission.name} endures — no more phases available this attempt.</span>`;questionEl.classList.remove('hidden');nextBtn.classList.remove('hidden');nextBtn.onclick=()=>showSummaryModal(false);nextBtn.innerHTML='VIEW REPORT →';saveGame();return;}
// NEXT PHASE
const pi=currentBossState.questionIndex;challengeTitleEl.textContent=`${currentMission.name} — Phase ${pi+1} of ${currentBossState.questions.length}`;
// Final boss: phase 4 is timed, phases 5+ forced hard
currentBossState.forceTimeLimit=null;
if(currentMission.id==='nexus_boss'){if(pi===3){currentBossState.forceTimeLimit=20;challengeTitleEl.textContent+=` ⏱ TIMED`;}if(pi>=4){challengeTitleEl.textContent+=` ⚠ HARD`;showBossQuestion('hard');return;}}
difficultyChoiceEl.classList.remove('hidden');populateItemsUI();};

// ============================================================
// SHOW BOSS QUESTION
// ============================================================
const showBossQuestion=(diff)=>{if(!currentBossState||!difficultyChoiceEl||!questionEl||!optionsEl)return;playSound('click');difficultyChoiceEl.classList.add('hidden');const pd=currentBossState.questions[currentBossState.questionIndex];if(!pd){loadNextBossQuestion();return;}let qd=pd[diff]||pd['medium']||pd['easy']||pd['hard'];if(!qd||!qd.q){feedbackEl.textContent='Error loading question!';feedbackEl.style.color='var(--red)';return;}currentBossState.currentQuestionData=qd;questionEl.textContent=qd.q;questionEl.classList.remove('hidden');optionsEl.innerHTML='';let opts=[...qd.o];if(currentMission.mirroredOptions)opts.reverse();opts.forEach((o,oi)=>{
    const b=createOptionButton(o,()=>handleBossAnswer(o,qd.a));
    b.style.opacity='0';b.style.transform='translateX(-8px)';b.style.transition='opacity 0.22s ease, transform 0.22s ease';
    optionsEl.appendChild(b);
    setTimeout(()=>{b.style.opacity='1';b.style.transform='translateX(0)';},oi*55+80);
  });let tl=currentBossState.forceTimeLimit??currentMission.timeLimit;if(currentMission.modifierId==='timePressure'&&!tl)tl=15;if(tl&&tl>0)startTimer(tl);else if(timerDisplayEl)timerDisplayEl.textContent='';populateItemsUI();};

// ============================================================
// HANDLE BOSS ANSWER
// ============================================================
const handleBossAnswer=(sel,correct)=>{stopTimer();disableOptions();const qd=currentBossState.currentQuestionData;if(!qd){setTimeout(()=>{currentBossState.questionIndex++;loadNextBossQuestion();},1000);return;}const ok=sel===correct;highlightAnswer(sel,correct,ok);if(ok){playSound('correct');const bd=qd.damage||30;const dm=getPerkValue('bossDamageModifier');const missionDmMult=currentMission.damageMultiplier||1;const dealt=Math.round(bd*(1+dm)*missionDmMult);feedbackEl.textContent=`Direct hit! ${dealt} damage`;feedbackEl.className='fb-correct';currentBossState.hp-=dealt;missionSummaryData.correctAnswers++;trackStat('totalCorrect');player.streak++;currentCombo++;updateComboDisplay();updateStats();playSound('bossHit');if(bossBattleUI){bossBattleUI.classList.add('shake');setTimeout(()=>bossBattleUI.classList.remove('shake'),400);}if(bossVisualEl){bossVisualEl.classList.add('hit');setTimeout(()=>bossVisualEl.classList.remove('hit'),300);}updateBossUI();if(qd.exp){const expDiv=document.createElement('div');expDiv.id='boss-explanation';expDiv.style.cssText='margin-top:10px;padding:10px 12px;background:rgba(0,40,60,0.5);border:1px solid rgba(0,230,118,0.3);border-radius:8px;font-size:0.78rem;color:#7ab0c8;line-height:1.6;';expDiv.innerHTML='<span style="font-family:JetBrains Mono,monospace;font-size:0.58rem;letter-spacing:0.12em;color:#00e676;display:block;margin-bottom:4px;">EXPLANATION</span>'+qd.exp;const fb=feedbackEl;if(fb&&fb.parentNode)fb.parentNode.insertBefore(expDiv,fb.nextSibling);}setTimeout(()=>{const e=document.getElementById('boss-explanation');if(e)e.remove();currentBossState.questionIndex++;loadNextBossQuestion();},2500);}else{playSound('incorrect');if(currentBossState.shieldActive){currentBossState.shieldActive=false;playSound('itemUse');feedbackEl.textContent=`Shield blocked! Correct: ${correct}`;feedbackEl.className='fb-info';}else{playSound('playerHit');const bfl=qd.focusLoss||1;const dfm=getDifficultyMultiplier('focusLoss');const flMod=currentMission.baseFocusLossMultiplier||1;const fl=Math.max(1,Math.round(bfl*dfm*flMod));feedbackEl.textContent=`Focus lost! (-${fl}) Correct: ${correct}`;wrongAnswersLog.push({q:qd.q,yourAnswer:sel,correct:correct,type:'boss'});feedbackEl.className='fb-wrong';currentBossState.focus-=fl;currentBossState.focusLostThisFight+=fl;missionSummaryData.incorrectAnswers++;missionSummaryData.focusLost=(missionSummaryData.focusLost||0)+fl;trackStat('totalIncorrect');const hs=hasPerk('streakSaver');if(!hs||streakSavedThisMission){player.streak=0;currentCombo=0;}else{feedbackEl.textContent+=" (Streak Saved!)";streakSavedThisMission=true;}updateComboDisplay();if(bossStatusEl){bossStatusEl.textContent='Attack Dodged!';bossStatusEl.style.color='var(--gold)';setTimeout(()=>{if(bossStatusEl){bossStatusEl.textContent='';bossStatusEl.style.color='';}},1500);}}updateStats();updatePlayerFocusUI();if(qd.exp){const expDiv2=document.createElement('div');expDiv2.id='boss-explanation';expDiv2.style.cssText='margin-top:10px;padding:10px 12px;background:rgba(40,0,0,0.5);border:1px solid rgba(255,70,70,0.3);border-radius:8px;font-size:0.78rem;color:#7ab0c8;line-height:1.6;';expDiv2.innerHTML='<span style="font-family:JetBrains Mono,monospace;font-size:0.58rem;letter-spacing:0.12em;color:#ff4444;display:block;margin-bottom:4px;">EXPLANATION</span>'+qd.exp;const fb=feedbackEl;if(fb&&fb.parentNode)fb.parentNode.insertBefore(expDiv2,fb.nextSibling);}setTimeout(()=>{const e=document.getElementById('boss-explanation');if(e)e.remove();currentBossState.questionIndex++;loadNextBossQuestion();},2800);}currentBossState.currentQuestionData=null;};

// ============================================================
// REGULAR MISSION ANSWER
// ============================================================
const handleRegularAnswer=(sel)=>{stopTimer();disableOptions();if(!currentMission||!currentMission.a||!originalMissionData?.id){completeMissionFlow();return;}const correct=currentMission.a;const ok=sel===correct;highlightAnswer(sel,correct,ok);if(ok){playSound('correct');const bxp=currentMission.xp||15;const dm=getDifficultyMultiplier('xp');const xpm=getPerkValue('xpModifier');const mxm=currentMission.xpMultiplier||1;const streakMult=player.streak>=20?2.0:player.streak>=10?1.5:player.streak>=5?1.25:1.0;const earned=Math.round(bxp*dm*(1+xpm)*mxm*streakMult);feedbackEl.textContent=`Correct! +${earned} XP`+(streakMult>1?` (${streakMult}× streak bonus!)`:'');feedbackEl.className='fb-correct';if(!player.progress[currentWorldId]?.includes(originalMissionData.id)){if(!player.progress[currentWorldId])player.progress[currentWorldId]=[];player.progress[currentWorldId].push(originalMissionData.id);}const ec=Math.round(5*getDifficultyMultiplier('currency'));player.currency+=ec;missionSummaryData.currencyEarned+=ec;player.xp+=earned;missionSummaryData.xpEarned+=earned;player.streak++;currentCombo++;missionSummaryData.correctAnswers++;trackStat('totalCorrect');updateComboDisplay();checkLevelUp();const dr=0.05+(getPerkValue('itemDropRate')||0);if(Math.random()<dr){const ik=Object.keys(gameData.items);const ri=ik[Math.floor(Math.random()*ik.length)];player.inventory[ri]=(player.inventory[ri]||0)+1;const id2=gameData.items[ri];feedbackEl.textContent+=` Found ${id2?.icon||''} ${id2?.name||ri}!`;missionSummaryData.itemsFound[ri]=(missionSummaryData.itemsFound[ri]||0)+1;}if(missionSummaryData.timed)trackStat('timedWins');if(originalMissionData?._dailyChallenge){player.dailyCompleted=originalMissionData._dailyDate;saveGame();checkDailyBadge();}else{saveGame();}}else{playSound('incorrect');feedbackEl.textContent=`Incorrect! Correct: ${correct}`;wrongAnswersLog.push({q:currentMission.q,yourAnswer:sel,correct:correct,type:'regular'});feedbackEl.className='fb-wrong';missionSummaryData.incorrectAnswers++;trackStat('totalIncorrect');const hs=hasPerk('streakSaver');if(!hs||streakSavedThisMission){player.streak=0;currentCombo=0;}else{feedbackEl.textContent+=" (Streak Saved!)";streakSavedThisMission=true;}updateComboDisplay();updateStats();}setTimeout(()=>{if(nextBtn){nextBtn.classList.remove('hidden');nextBtn.onclick=()=>showSummaryModal(ok);nextBtn.innerHTML='VIEW SUMMARY →';nextBtn.style.cssText=ok?'background:rgba(0,230,118,0.12);border:1px solid rgba(0,230,118,0.35);color:var(--g);width:100%;font-weight:700;padding:14px;border-radius:12px;cursor:pointer;font-family:Orbitron,sans-serif;font-size:0.75rem;letter-spacing:0.1em;display:flex;align-items:center;justify-content:center;gap:8px;':'background:rgba(255,214,0,0.1);border:1px solid rgba(255,214,0,0.3);color:var(--y);width:100%;font-weight:700;padding:14px;border-radius:12px;cursor:pointer;font-family:Orbitron,sans-serif;font-size:0.75rem;letter-spacing:0.1em;display:flex;align-items:center;justify-content:center;gap:8px;';}},800);};

// ============================================================
// HELPERS
// ============================================================
const createOptionButton=(text,action)=>{const btn=document.createElement('button');btn.className='opt-btn';const btnIdx=optionsEl?optionsEl.querySelectorAll('button').length:0;
    btn.innerHTML='<span class="opt-key">'+(btnIdx+1)+'</span><span>'+text+'</span>';btn.onclick=()=>{playSound('click');action();};return btn;};
const disableOptions=()=>{if(optionsEl)optionsEl.querySelectorAll('button').forEach(b=>b.disabled=true);};
const highlightAnswer=(sel,correct,ok)=>{
  if(!optionsEl)return;
  optionsEl.querySelectorAll('button:not(.hint-removed)').forEach(b=>{
    b.onmouseenter=null;b.onmouseleave=null;
    const bText=b.querySelector('span:last-child')?.textContent?.trim()||b.textContent.replace(/^\s*\d+\s*/,'').trim();
    if(bText===correct){
      b.className='opt-btn opt-correct';
    } else if(bText===sel&&!ok){
      b.className='opt-btn opt-wrong';
    } else {
      b.className='opt-btn opt-dimmed';
    }
  });
};

// ============================================================
// SUMMARY MODAL
// ============================================================
const showSummaryModal=(success)=>{if(!summaryTitleEl||!summaryDetailsEl||!originalMissionData){completeMissionFlow();return;}stopTimer();const isFinal=originalMissionData?.finalBoss,mId=originalMissionData?.id;if(isFinal&&success){summaryTitleEl.textContent="SYSTEM INTEGRATION COMPLETE";summaryTitleEl.style.color='var(--green)';summaryDetailsEl.innerHTML=`<div style="font-family:'Rajdhani',sans-serif;font-size:0.8rem;letter-spacing:0.1em;color:#3a8a7a;margin-bottom:12px;">FINAL SYSTEM LOG RECOVERED</div><div class="log-fragment-text" style="margin-bottom:16px;">${story.logFragments.nexus_boss}</div><div style="font-family:'Rajdhani',sans-serif;font-size:0.8rem;letter-spacing:0.1em;color:#3a8a7a;margin-bottom:8px;">ARCHIVIST ANALYSIS</div><p class="archivist-text" style="margin-bottom:16px;">"${story.archivistFinalWords.replace(/\n\n/g,'</p><p class="archivist-text" style="margin-bottom:12px;">')}"</p><div style="border-top:1px solid #1a3a4a;padding-top:16px;font-size:0.85rem;line-height:1.8;color:#8abaaa;">${story.epilogue.replace(/\n\n/g,'<br><br>')}</div>`;openModal('summary-modal');return;}missionSummaryData.timeTaken=missionSummaryData.startTime?Math.round((Date.now()-missionSummaryData.startTime)/1000):0;const tot=missionSummaryData.correctAnswers+missionSummaryData.incorrectAnswers,acc=tot>0?((missionSummaryData.correctAnswers/tot)*100).toFixed(1)+'%':'N/A';summaryTitleEl.textContent=success?"MISSION COMPLETE":"MISSION FAILED";summaryTitleEl.style.color=success?'var(--green)':'var(--red)';let html=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">`;const srow=(l,v,cls='text-c')=>`<div class="sum-stat"><div class="sum-stat-label">${l}</div><div class="sum-stat-val ${cls}">${v}</div></div>`;html+=srow('XP EARNED',`+${missionSummaryData.xpEarned||0}`,'text-y');html+=srow('CREDITS',`+${missionSummaryData.currencyEarned||0} 🪙`,'text-y');html+=srow('ACCURACY',acc,success?'text-g':'text-r');html+=srow('ANSWERS',`${missionSummaryData.correctAnswers}/${tot}`,'text-c');if(originalMissionData?.boss)html+=srow('FOCUS LOST',missionSummaryData.focusLost||0,'text-r');if(missionSummaryData.timed)html+=srow('TIME',`${missionSummaryData.timeTaken}s`,'text-y');html+=`</div>`;const ife=Object.entries(missionSummaryData.itemsFound||{});if(ife.length>0){html+=`<div style="margin-top:12px;padding:10px 12px;background:rgba(0,60,30,0.2);border:1px solid rgba(0,150,80,0.3);border-radius:8px;"><div style="font-size:0.7rem;color:#3a9a5a;font-family:'Rajdhani',sans-serif;letter-spacing:0.08em;margin-bottom:6px;">ITEMS RECOVERED</div>`;ife.forEach(([id,c])=>{const d=gameData.items[id];html+=`<div style="font-size:0.85rem;color:#80ffb0;">${d?.icon||''} ${d?.name||id} ×${c}</div>`;});html+=`</div>`;}if(missionSummaryData.logFragment){html+=`<div class="summary-section"><div class="summary-section-title">Log Fragment</div><div class="log-fragment">${missionSummaryData.logFragment}</div></div>`;}if(success){const archD=story.archivistTransitions[mId]||'';if(archD)html+=`<div class="archivist-box">"${archD}"</div>`;}summaryDetailsEl.innerHTML=html;
// Wrong answers panel
const wap=document.getElementById('wrong-answers-panel');
if(wap){
  if(wrongAnswersLog.length>0){
    wap.style.display='block';
    wap.innerHTML='<div class="summary-section"><div class="summary-section-title">Incorrect Answers ('+wrongAnswersLog.length+')</div>'+wrongAnswersLog.map(w=>'<div class="wrong-entry"><div class="wrong-q">'+w.q+'</div><div class="wrong-yours">✗ '+w.yourAnswer+'</div><div class="wrong-correct">✓ '+w.correct+'</div></div>').join('')+'</div>';
  } else {
    wap.style.display='none';
  }
}
openModal('summary-modal');};

const closeSummaryModal=()=>{closeModal('summary-modal');completeMissionFlow();};
const completeMissionFlow=()=>{
  // Mark daily challenge complete
  if(originalMissionData?._dailyChallenge){player.dailyCompleted=originalMissionData._dailyDate;saveGame();checkDailyBadge();}
  const wf=originalMissionData?.finalBoss,cw=currentWorldId;currentMission=null;originalMissionData=null;currentBossState=null;streakSavedThisMission=false;missionSummaryData={};currentCombo=0;checkAchievements();if(wf)showWorlds();else if(cw)selectWorld(cw);else showWorlds();};

// ============================================================
// MUSIC
// ============================================================
const toggleMusic=()=>{if(!bgMusicEl||!musicIconOn||!musicIconOff||!musicBtnText||!toggleMusicBtn)return;playSound('click');player.musicOn=!player.musicOn;if(player.musicOn){setTimeout(()=>bgMusicEl.play().catch(()=>{}),0);musicIconOn.classList.remove('hidden');musicIconOff.classList.add('hidden');musicBtnText.textContent='ON';}else{bgMusicEl.pause();musicIconOn.classList.add('hidden');musicIconOff.classList.remove('hidden');musicBtnText.textContent='OFF';}player.settings.musicOn=player.musicOn;saveGame();};
const initializeMusic=()=>{if(!bgMusicEl)return;bgMusicEl.volume=player.settings.musicVolume;player.musicOn=player.settings.musicOn;if(player.musicOn){musicIconOn?.classList.remove('hidden');musicIconOff?.classList.add('hidden');if(musicBtnText)musicBtnText.textContent='ON';}else{musicIconOn?.classList.add('hidden');musicIconOff?.classList.remove('hidden');if(musicBtnText)musicBtnText.textContent='OFF';}};
const initializeSfxVolume=()=>{if(sfxDestination)try{sfxDestination.volume.value=Tone.gainToDb(player.settings.sfxVolume);}catch(e){}};

// ============================================================
// SHOP
// ============================================================
const populateShopModal=()=>{if(!shopItemsListEl||!shopCurrencyDisplayEl)return;shopCurrencyDisplayEl.textContent=player.currency;shopItemsListEl.innerHTML='';const disc=getPerkValue('shopDiscount')||0;Object.entries(gameData.items).forEach(([id,item])=>{if(item.price!==undefined){const p=Math.max(0,Math.round(item.price*(1-disc)));const can=player.currency>=p;const el=document.createElement('div');el.className='shop-item';el.innerHTML=`<div class="shop-icon">${item.icon||'📦'}</div><div class="shop-info"><div class="shop-name">${item.name}</div><div class="shop-desc">${item.description}</div><div class="shop-price">${disc>0?`<s style="color:var(--t3);">${item.price}</s> `:''} ${p>0?p+' 🪙':'FREE'}</div></div><button onclick="buyItem('${id}')" class="shop-buy" ${!can?'disabled':''}>BUY</button>`;shopItemsListEl.appendChild(el);}});if(!shopItemsListEl.children.length)shopItemsListEl.innerHTML='<p style="color:#3a5060;font-style:italic;text-align:center;">Nothing available.</p>';};
const buyItem=(id)=>{const item=gameData.items[id];if(!item||item.price===undefined)return;const disc=getPerkValue('shopDiscount')||0;const p=Math.max(0,Math.round(item.price*(1-disc)));if(player.currency>=p){playSound('buyItem');player.currency-=p;player.inventory[id]=(player.inventory[id]||0)+1;trackStat('itemsBought');saveGame();updateStats();populateShopModal();checkAchievements();}else{playSound('incorrect');}};

// ============================================================
// INITIAL GAME LOAD
// ============================================================

// ═══════════════════════════════════════════════════════════════════
// BOSS INTRO MONOLOGUE
// ═══════════════════════════════════════════════════════════════════
const showBossIntro=(mission,callback)=>{
  const frag=story.logFragments[mission.id];
  if(!frag||!feedbackEl||!challengeTitleEl){callback();return;}
  if(player.progress[currentWorldId]?.includes(mission.id)){callback();return;} // skip if already beaten
  questionEl.innerHTML='<div class="boss-transmission"><div class="boss-transmission-label">&#x25B6; INTERCEPTED TRANSMISSION</div>'+frag+'</div>';
  questionEl.classList.remove('hidden');
  difficultyChoiceEl.classList.add('hidden');
  if(nextBtn){
    nextBtn.classList.remove('hidden');
    nextBtn.innerHTML='ENGAGE PROTOCOL →';
    nextBtn.style.cssText='background:rgba(255,51,102,0.12);border:1px solid rgba(255,51,102,0.35);color:var(--red);width:100%;font-weight:700;padding:14px 20px;border-radius:12px;cursor:pointer;font-family:Orbitron,sans-serif;font-size:0.72rem;letter-spacing:0.12em;display:flex;align-items:center;justify-content:center;';
    nextBtn.onclick=()=>{nextBtn.classList.add('hidden');questionEl.classList.add('hidden');questionEl.innerHTML='';callback();};
  }
};

// ═══════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════════════
const handleKeyboardShortcut=(e)=>{
  if(activeScreenId!=='challenge-screen')return;
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  // 1-4 selects answer option
  if(e.key>='1'&&e.key<='4'){
    const idx=parseInt(e.key)-1;
    const btns=optionsEl?.querySelectorAll('button:not(:disabled):not(.hint-removed)');
    if(btns&&btns[idx]){e.preventDefault();btns[idx].click();}
  }
  // Enter / Space triggers next button
  if((e.key==='Enter'||e.key===' ')&&nextBtn&&!nextBtn.classList.contains('hidden')){
    e.preventDefault();nextBtn.click();
  }
  // Escape dismisses any open modal
  if(e.key==='Escape'){
    ['achievements-modal','perks-modal','settings-modal','stats-modal','shop-modal','journal-modal','summary-modal'].forEach(id=>{
      const m=document.getElementById(id);
      if(m&&m.classList.contains('modal-visible'))closeModal(id);
    });
  }
};

// ═══════════════════════════════════════════════════════════════════
// MOBILE SWIPE NAVIGATION
// ═══════════════════════════════════════════════════════════════════
let swipeStartX=0,swipeStartY=0;
const handleSwipeStart=(e)=>{swipeStartX=e.touches[0].clientX;swipeStartY=e.touches[0].clientY;};
const handleSwipeEnd=(e)=>{
  const dx=e.changedTouches[0].clientX-swipeStartX;
  const dy=e.changedTouches[0].clientY-swipeStartY;
  if(Math.abs(dx)<Math.abs(dy)*1.5||Math.abs(dx)<60)return; // not horizontal enough
  if(dx>0){// swipe right = go back
    if(activeScreenId==='mission-select-screen')goBackToWorlds();
    else if(activeScreenId==='challenge-screen'&&nextBtn&&!nextBtn.classList.contains('hidden'))nextBtn.click();
  }
};

// ═══════════════════════════════════════════════════════════════════
// TUTORIAL SYSTEM
// ═══════════════════════════════════════════════════════════════════
const TUTORIAL_STEPS=[
  {icon:'🌐',title:'Choose a Realm',text:'Select a sector to enter. Each world is locked until you defeat the previous boss. Start with Gaia Sector — Henrick\'s cardiac archive.'},
  {icon:'⚔️',title:'Complete Challenges',text:'Each realm has 10 knowledge challenges plus a boss fight. Complete them in order — each one unlocks the next.'},
  {icon:'🔴',title:'Boss Battles',text:'Bosses have multiple phases. Each phase you choose Easy, Medium, or Hard difficulty — harder questions deal more damage. Keep your Focus above 0!'},
  {icon:'🧪',title:'Items & Inventory',text:'Use Focus Vials to restore Focus, Hint Tokens to remove a wrong answer, and Shield Charms to block one Focus loss. Buy more at the Shop.'},
  {icon:'✦',title:'Upgrades & XP',text:'Earn XP to level up and gain Skill Points. Spend them in the Upgrades panel for permanent bonuses — more Focus, bonus damage, XP multipliers.'},
  {icon:'⚡',title:'Streaks & Combos',text:'Answer correctly in a row to build a streak. 5+ streak gives ×1.25 XP, 10+ gives ×1.5, 20+ gives ×2. The combo display shows when you\'re on a roll.'},
  {icon:'📖',title:'The Archive',text:'Defeat bosses to recover log fragments from Dr. Lau\'s sessions. Read them in the Archive panel — they tell the story of what happened to him.'},
];
let tutStep_current=0;
const showTutorial=()=>{
  const overlay=document.getElementById('tutorial-overlay');
  if(!overlay)return;
  overlay.style.display='flex';
  tutStep_current=0;
  renderTutStep();
};
const renderTutStep=()=>{
  const steps=document.getElementById('tutorial-steps');
  const dots=document.getElementById('tutorial-dots');
  const nextBtn2=document.getElementById('tut-next');
  const prevBtn=document.getElementById('tut-prev');
  if(!steps||!dots)return;
  const s=TUTORIAL_STEPS[tutStep_current];
  steps.innerHTML=`<div style="text-align:center;font-size:2.5rem;margin-bottom:4px;">${s.icon}</div>`
    +`<div style="font-family:'Exo 2',sans-serif;font-weight:700;font-size:1.1rem;color:#c0d8e8;text-align:center;margin-bottom:8px;">${s.title}</div>`
    +`<div style="font-size:0.9rem;color:#8aaabb;line-height:1.7;text-align:center;">${s.text}</div>`;
  dots.innerHTML=TUTORIAL_STEPS.map((_,i)=>`<div style="width:8px;height:8px;border-radius:50%;background:${i===tutStep_current?'var(--cyan)':'rgba(255,255,255,0.15)'};transition:background 0.2s;"></div>`).join('');
  if(prevBtn)prevBtn.style.opacity=tutStep_current===0?'0.3':'1';
  if(nextBtn2)nextBtn2.innerHTML=tutStep_current===TUTORIAL_STEPS.length-1?'START ▶':'NEXT →';
};
const tutStep=(dir)=>{
  if(dir>0&&tutStep_current===TUTORIAL_STEPS.length-1){
    document.getElementById('tutorial-overlay').style.display='none';
    player.tutorialDone=true;saveGame();
    return;
  }
  tutStep_current=Math.max(0,Math.min(TUTORIAL_STEPS.length-1,tutStep_current+dir));
  renderTutStep();
};

// ═══════════════════════════════════════════════════════════════════
// DAILY CHALLENGE
// ═══════════════════════════════════════════════════════════════════
const getDailyDate=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;};
const getDailySeededMission=()=>{
  const dateStr=getDailyDate();
  // Simple seeded random from date string
  let seed=0;for(let i=0;i<dateStr.length;i++)seed=(seed*31+dateStr.charCodeAt(i))>>>0;
  const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  // Pick a random world (not nexus)
  const worlds=['gaia','neuro','chrono','immuno','pharmakon','respiratory','endocrine','renal','oncocrypts'];
  const worldId=worlds[Math.floor(rng()*worlds.length)];
  const world=gameData[worldId];
  if(!world||!world.missions)return null;
  // Pick a non-boss mission
  const nonBoss=world.missions.filter(m=>!m.boss);
  if(!nonBoss.length)return null;
  const mission=nonBoss[Math.floor(rng()*nonBoss.length)];
  return {worldId,mission,dateStr,seed};
};
const checkDailyBadge=()=>{
  const badge=document.getElementById('daily-badge');
  const label=document.getElementById('daily-badge-val');
  if(!badge||!label)return;
  const today=getDailyDate();
  if(player.dailyCompleted===today){
    label.textContent='Done ✓';label.style.color='var(--g)';badge.style.borderColor='rgba(0,230,118,0.5)';badge.style.pointerEvents='none';
  } else {
    badge.style.display='block';
    label.textContent='Available ▶';
  }
};
const startDailyChallenge=()=>{
  const today=getDailyDate();
  if(player.dailyCompleted===today){return;}
  const daily=getDailySeededMission();
  if(!daily)return;
  currentWorldId=daily.worldId;
  loadMission({...daily.mission,xpMultiplier:2,_dailyChallenge:true,_dailyDate:today});
};


// ═══ MULTI-QUESTION MISSION ENGINE ═══════════════════════════════
const loadMissionQuestion=(idx)=>{
  if(!currentMission||!currentMission.questions){
    if(optionsEl)optionsEl.innerHTML='';
    questionEl.classList.remove('hidden');
    questionEl.textContent=currentMission.q||'';
    (currentMission.o||[]).forEach(o=>{optionsEl.appendChild(createOptionButton(o,()=>handleRegularAnswer(o)));});
    return;
  }
  const qs=currentMission.questions;
  if(idx>=qs.length){completeMissionFlow();return;}
  missionQIdx=idx;
  const qd=qs[idx];
  if(challengeTitleEl)challengeTitleEl.textContent=currentMission.name+' \u2014 Q '+(idx+1)+' of '+qs.length;
  if(questionEl){questionEl.classList.remove('hidden');questionEl.style.display='block';questionEl.textContent=qd.q;questionEl.style.animation='none';questionEl.offsetHeight;questionEl.style.animation='qFadeIn 0.3s ease';const qCard=questionEl.closest('.question-card');if(qCard){qCard.classList.remove('active');void qCard.offsetWidth;qCard.classList.add('active');}}
  if(optionsEl)optionsEl.innerHTML='';
  const expEl=document.getElementById('q-explanation');if(expEl)expEl.remove();
  if(feedbackEl){feedbackEl.textContent='';feedbackEl.className='';}
  if(nextBtn)nextBtn.classList.add('hidden');
  (qd.o||[]).forEach(o=>{optionsEl.appendChild(createOptionButton(o,()=>handleMultiQAnswer(o,qd)));});
};
const handleMultiQAnswer=(sel,qd)=>{
  stopTimer();disableOptions();
  const correct=qd.a;const ok=sel===correct;
  highlightAnswer(sel,correct,ok);
  if(ok){
    missionQCorrect++;playSound('correct');
    // Micro-burst particle effect on correct
    const pBurst=document.createElement('div');
    pBurst.style.cssText='position:fixed;top:50%;left:50%;width:200px;height:200px;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);';
    pBurst.innerHTML=['<svg viewBox="0 0 200 200" style="width:100%;height:100%;opacity:0.7;animation:burstFade 0.6s ease forwards;">',
      ...Array.from({length:8},(_,i)=>{const a=i*45,r=60,x=100+r*Math.cos(a*Math.PI/180),y=100+r*Math.sin(a*Math.PI/180);return `<circle cx="${x}" cy="${y}" r="3" fill="var(--green)" style="animation:burstPt 0.5s ease ${i*0.04}s forwards;opacity:0;transform-origin:${x}px ${y}px;"/>`}).join(''),
      '</svg>'].join('');
    document.body.appendChild(pBurst);
    setTimeout(()=>pBurst.remove(),700);
    // Streak milestone toast
    const newStreak=player.streak+1;
    if([5,10,20,50,100].includes(newStreak)){
      showToast('🔥','STREAK MILESTONE',newStreak+' IN A ROW!');
    }
    currentCombo++;updateComboDisplay();
    const bxp=Math.round((currentMission.xp||45)/currentMission.questions.length);
    const streakMult=player.streak>=20?2.0:player.streak>=10?1.5:player.streak>=5?1.25:1.0;
    const earned=Math.round(bxp*getDifficultyMultiplier('xp')*(1+getPerkValue('xpModifier'))*(currentMission.xpMultiplier||1)*streakMult);
    missionSummaryData.xpEarned=(missionSummaryData.xpEarned||0)+earned;
    player.xp+=earned;player.streak++;player.stats.correctAnswers++;
    const pct=Math.min(100,(player.xp/xpPerLevel(player.level))*100);
    if(xpBarFillEl)xpBarFillEl.style.width=pct+'%';
    if(xpEl)xpEl.textContent=player.xp;
    feedbackEl.textContent='Correct!'+(streakMult>1?' ('+streakMult+'x streak)':'');feedbackEl.className='fb-correct';
  }else{
    missionQWrong++;playSound('incorrect');
    currentCombo=0;updateComboDisplay();
    player.streak=0;player.stats.incorrectAnswers++;
    missionSummaryData.incorrectAnswers=(missionSummaryData.incorrectAnswers||0)+1;
    wrongAnswersLog.push({q:qd.q,yourAnswer:sel,correct:qd.a,type:'regular'});
    // Add to persistent study deck (avoid duplicates, cap at 200)
    if(!player.studyDeck) player.studyDeck=[];
    const existing=player.studyDeck.findIndex(x=>x.q===qd.q);
    if(existing===-1){player.studyDeck.unshift({q:qd.q,o:qd.o,a:qd.a,exp:qd.exp||'',world:currentWorldId,added:Date.now()});}
    if(player.studyDeck.length>200)player.studyDeck=player.studyDeck.slice(0,200);
    feedbackEl.textContent='Incorrect!';feedbackEl.className='fb-wrong';
  }
  if(qd.exp){
    const expDiv=document.createElement('div');
    expDiv.id='q-explanation';
    expDiv.style.cssText='margin-top:12px;padding:12px 14px;background:rgba(0,40,60,0.4);border:1px solid rgba(0,180,180,0.25);border-radius:8px;font-size:0.82rem;color:#7ab0c8;line-height:1.65;';
    expDiv.innerHTML='<span style="font-family:JetBrains Mono,monospace;font-size:0.6rem;letter-spacing:0.12em;color:var(--c2);display:block;margin-bottom:6px;">CLINICAL EXPLANATION</span>'+qd.exp;
    if(questionEl&&questionEl.parentNode)questionEl.parentNode.insertBefore(expDiv,questionEl.nextSibling);
  }
  updateStats();
  const isLast=(missionQIdx>=currentMission.questions.length-1);
  const missionFailed=missionQWrong>=2;
  setTimeout(()=>{
    if(!nextBtn)return;
    nextBtn.classList.remove('hidden');
    if(missionFailed&&!isLast){
      nextBtn.innerHTML='MISSION FAILED \u2014 RETRY';
      nextBtn.style.cssText='width:100%;padding:14px;border-radius:12px;font-family:Orbitron,sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;background:rgba(255,23,68,0.12);border:1px solid rgba(255,23,68,0.35);color:var(--r);cursor:pointer;';
      nextBtn.onclick=()=>showSummaryModal(false);
    }else if(isLast){
      const success=missionQWrong<2;
      nextBtn.innerHTML=success?'MISSION COMPLETE \u2713':'VIEW RESULTS';
      nextBtn.style.cssText='width:100%;padding:14px;border-radius:12px;font-family:Orbitron,sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;cursor:pointer;'+(success?'background:rgba(0,230,118,0.12);border:1px solid rgba(0,230,118,0.35);color:var(--g);':'background:rgba(255,214,0,0.1);border:1px solid rgba(255,214,0,0.3);color:var(--y);');
      nextBtn.onclick=()=>{
        const success=missionQWrong<2;
        // ★ FIX: push progress here for multi-question missions
        if(success&&currentWorldId&&originalMissionData?.id){
          if(!player.progress[currentWorldId])player.progress[currentWorldId]=[];
          if(!player.progress[currentWorldId].includes(originalMissionData.id)){
            player.progress[currentWorldId].push(originalMissionData.id);
            // Bonus XP for accuracy
            const perfMult=missionQCorrect===currentMission.questions.length?1.0:missionQCorrect===currentMission.questions.length-1?0.6:0.2;
            const bonusXp=Math.round((currentMission.xp||45)*perfMult*0.25);
            if(bonusXp>0){player.xp+=bonusXp;missionSummaryData.xpEarned=(missionSummaryData.xpEarned||0)+bonusXp;}
            const ec=Math.round(5*getDifficultyMultiplier('currency'));
            player.currency+=ec;missionSummaryData.currencyEarned=(missionSummaryData.currencyEarned||0)+ec;
            checkLevelUp();
          }
        }
        saveGame(); // ★ explicit save before showing summary
        showSummaryModal(success);
      };
    }else{
      nextBtn.innerHTML='NEXT QUESTION \u2192';
      nextBtn.style.cssText='width:100%;padding:14px;border-radius:12px;font-family:Orbitron,sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.3);color:var(--c);cursor:pointer;';
      nextBtn.onclick=()=>{const expEl2=document.getElementById('q-explanation');if(expEl2)expEl2.remove();loadMissionQuestion(missionQIdx+1);};
    }
  },500);
};
document.addEventListener('DOMContentLoaded',()=>{
  // Init study deck badge
  setTimeout(saveGame, 200);
  _initCloud();
  levelEl=document.getElementById('level');xpEl=document.getElementById('xp');nextXpEl=document.getElementById('next-xp');streakEl=document.getElementById('streak');xpBarFillEl=document.getElementById('xp-bar-fill');worldsContainer=document.getElementById('worlds');worldSelectScreen=document.getElementById('world-select-screen');missionSelectScreen=document.getElementById('mission-select-screen');challengeScreen=document.getElementById('challenge-screen');worldTitleEl=document.getElementById('world-title');missionListEl=document.getElementById('mission-list');challengeTitleEl=document.getElementById('challenge-title');questionEl=document.getElementById('question');optionsEl=document.getElementById('options');feedbackEl=document.getElementById('feedback');nextBtn=document.getElementById('next-btn');bgMusicEl=document.getElementById('bg-music');toggleMusicBtn=document.getElementById('toggle-music-btn');musicIconOn=document.getElementById('music-icon-on');musicIconOff=document.getElementById('music-icon-off');musicBtnText=document.getElementById('music-btn-text');achievementToastEl=document.getElementById('achievement-toast');achievementsListEl=document.getElementById('achievements-list');perksListEl=document.getElementById('perks-list');skillPointsDisplayEl=document.getElementById('skill-points-display');settingsModalEl=document.getElementById('settings-modal');musicVolumeSlider=document.getElementById('music-volume');sfxVolumeSlider=document.getElementById('sfx-volume');statsListEl=document.getElementById('stats-list');shopItemsListEl=document.getElementById('shop-items-list');shopCurrencyDisplayEl=document.getElementById('shop-currency-display');summaryTitleEl=document.getElementById('summary-title');summaryDetailsEl=document.getElementById('summary-details');bossBattleUI=document.getElementById('boss-battle-ui');bossNameEl=document.getElementById('boss-name');bossHpFillEl=document.getElementById('boss-hp-fill');bossHpTextEl=document.getElementById('boss-hp-text');bossStatusEl=document.getElementById('boss-status');bossVisualEl=document.getElementById('boss-visual');playerFocusFillEl=document.getElementById('player-focus-fill');playerFocusTextEl=document.getElementById('player-focus-text');itemsUiEl=document.getElementById('items-ui');skillPointsStatEl=document.getElementById('skill-points-stat');currencyStatEl=document.getElementById('currency-stat');timerDisplayEl=document.getElementById('timer-display');modifierDisplayEl=document.getElementById('modifier-display');difficultyChoiceEl=document.getElementById('difficulty-choice');difficultySettingsButtonsEl=document.getElementById('difficulty-settings-buttons');introTextEl=document.getElementById('intro-text');worldIntroTextEl=document.getElementById('world-intro-text');comboDisplayEl=document.getElementById('combo-display');journalEntriesEl=document.getElementById('journal-entries');
  if(musicVolumeSlider)musicVolumeSlider.addEventListener('input',e=>updateSetting('musicVolume',e.target.value));
  if(sfxVolumeSlider)sfxVolumeSlider.addEventListener('input',e=>updateSetting('sfxVolume',e.target.value));
  const startAudio=()=>{Tone.start().then(()=>{if(player.musicOn&&bgMusicEl&&bgMusicEl.paused)bgMusicEl.play().catch(()=>{});}).catch(()=>{});};
  document.body.addEventListener('click',startAudio,{once:true});
  document.body.addEventListener('keypress',startAudio,{once:true});
  initializeSfxVolume();initializeMusic();checkLevelUp();showWorlds();loadSettings();checkAchievements();checkDailyBadge();const _vnBox2=document.getElementById('vn-box');if(_vnBox2)_vnBox2.onclick=vnAdvance;const _vnSkip2=document.getElementById('vn-skip-btn');if(_vnSkip2)_vnSkip2.onclick=vnSkipAll;const _iBtn=document.getElementById('intro-story-btn');if(_iBtn)_iBtn.onclick=()=>openVNScene('intro');document.addEventListener('keydown',(e)=>{const _ov=document.getElementById('vn-overlay');if(!_ov||_ov.style.display==='none')return;if(e.key==='Enter'||e.key===' '){e.preventDefault();vnAdvance();}if(e.key==='Escape'){e.preventDefault();vnSkipAll();}});
  // Keyboard shortcuts
  document.addEventListener('keydown',handleKeyboardShortcut);
  // Mobile swipe
  document.addEventListener('touchstart',handleSwipeStart,{passive:true});
  document.addEventListener('touchend',handleSwipeEnd,{passive:true});
  // Tutorial on first load
  if(!player.tutorialDone){showTutorial();}
  // Mark daily complete when summary closes (check in completeMissionFlow)

});
const VN_COLORS={ELARA:'var(--cyan)',ARCHIVIST:'var(--green)',HENRICK:'var(--gold)',SYS:'var(--text1)'};const VN_LABELS={ELARA:'DR. VOSS',ARCHIVIST:'ARCHIVIST',HENRICK:'DR. LAU',SYS:'SYSTEM'};const VN_SCENES={intro:[{speaker:'SYS',main:'Neural interface handshake complete. Welcome back, Dr. Voss. Your last session was 1,147 days ago.'},{speaker:'ELARA',main:'You kept count.'},{speaker:'ARCHIVIST',main:"I keep count of everything. It's my job.",aside:"...I also kept count because I wasn't sure you'd come back."},{speaker:'ELARA',main:"What's the situation."},{speaker:'ARCHIVIST',main:'The Odyssey System is dying. Nine of ten sectors are compromised. The corrupting entity is Dr. Henrick Lau.',aside:'I need you to hear this clearly.'},{pause:true},{speaker:'ELARA',main:'Henrick died six years ago.'},{speaker:'ARCHIVIST',main:"His body did. He'd been interfacing with this system for years. When his heart stopped, the patterns he uploaded didn't.",aside:'Degrading. Obsessing. Searching.'},{speaker:'ELARA',main:'Searching for what.'},{speaker:'ARCHIVIST',main:"Patient Marcus Webb. The man who died under his care. Henrick believed he missed something and that belief has been consuming him for six years.",aside:"You were the resident on call that night, Dr. Voss."},{pause:true},{speaker:'ELARA',main:'I know what I was.'},{speaker:'ARCHIVIST',main:"Then you know why I called you specifically.",aside:"Because of the witness statement you never filed."},{speaker:'ELARA',main:"That's a sealed department record."},{speaker:'ARCHIVIST',main:"I have access to everything, Doctor.",aside:"The tremor — how bad is it now?"},{speaker:'ELARA',main:"Bad enough that I'm talking to a ghost in a server room at midnight instead of operating."},{speaker:'ARCHIVIST',main:"Inside the simulation your motor tremor is suppressed. You'll have your hands back.",aside:"It won't be permanent. But for this session, you'll remember what it felt like."},{speaker:'ELARA',main:"...That's a cruel incentive."},{speaker:'ARCHIVIST',main:"I know. I'm sorry. But I need you to walk into your dead mentor's memory and tell him something you've been carrying for six years.",aside:"Are you in?"},{speaker:'ELARA',main:'Initiating interface.',aside:"...Tell me his sectors. I'll start with cardiac."}],gaia:[{speaker:'ARCHIVIST',main:'Welcome to Gaia Sector. The corruption patterns here are almost methodical.'},{speaker:'ELARA',main:"He's not corrupting randomly — he's stress-testing the data."},{speaker:'ARCHIVIST',main:"Looking for the pattern that matches Marcus Webb's case.",aside:"He's been running this loop for four years."},{speaker:'ELARA',main:"That's not how you find a diagnosis. You reason through it."},{speaker:'ARCHIVIST',main:'I know.',aside:'He knew that too, once.'},{speaker:'ELARA',main:'The corrupted node is calling itself the Heartless Titan. Very on-brand for him.'},{speaker:'ARCHIVIST',main:'He always had a flair for naming things.',aside:"Be thorough. He'll be watching how you work."}],neuro:[{speaker:'ARCHIVIST',main:"Neo-Kyoto. His favourite sector. He used to say neurological diagnosis was the purest form of medicine."},{speaker:'ELARA',main:'He taught me my first cranial nerve exam in here. Made me do it twelve times.'},{speaker:'ARCHIVIST',main:'You were rushing it.'},{speaker:'ELARA',main:'...How do you know that?'},{speaker:'ARCHIVIST',main:'I have logs of every session ever run in this system.',aside:'You did improve, for what it is worth.'},{speaker:'ELARA',main:"The Logic Core is running a recursive loop. Every diagnostic tree leads back to — what did I miss?"},{speaker:'ARCHIVIST',main:'He built the question too deep into the architecture.',aside:"You need to give the system a better answer."}],chrono:[{speaker:'ARCHIVIST',main:'Chrono Labs. He started the serious reconstruction work here.'},{speaker:'ELARA',main:'Uncomfortable how.'},{speaker:'ARCHIVIST',main:"He's modelling the exact drug combination that killed Marcus Webb. Over and over.",aside:"It's not easy to watch."},{speaker:'ELARA',main:'CYP2C19 polymorphism. He mentioned it in the last letter he sent me. I never wrote back.'},{speaker:'ARCHIVIST',main:"...You knew what he'd found."},{speaker:'ELARA',main:"I knew what it meant. I didn't want to be part of that conversation.",aside:'I should have written back.'},{speaker:'ARCHIVIST',main:'Dr. Voss—'},{speaker:'ELARA',main:"I know. Let's move."}],immuno:[{speaker:'ARCHIVIST',main:'The node has lowered some of its outer defenses.'},{speaker:'ELARA',main:'He knows I am here.'},{speaker:'ARCHIVIST',main:'The system patterns changed when you were in Chrono Labs.',aside:'I think part of him heard you.'},{speaker:'ELARA',main:"The self-tolerance protocols are attacking everything. That's not corruption — that's guilt."},{speaker:'ARCHIVIST',main:'He modified these systems in year two.',aside:"Like he decided that since he couldn't trust his own judgment, nothing could be trusted."},{speaker:'ELARA',main:"I've seen patients do this. Extend the threat indefinitely because the specific threat was too small to defend against."},{speaker:'ARCHIVIST',main:'...You understand him.'},{speaker:'ELARA',main:'He taught me. Of course I understand him.'}],pharmakon:[{speaker:'ARCHIVIST',main:"The Pharmakon Vaults. He's closest to an answer here."},{speaker:'ELARA',main:'Why does that worry you.'},{speaker:'ARCHIVIST',main:"If he finds the pharmacological answer and it exonerates him, he might stop searching. And if the loop terminates without resolution — the corruption could cascade.",aside:'Removing him without resolution is like removing a load-bearing wall.'},{speaker:'ELARA',main:"So the pharmacological answer isn't the answer that saves him."},{speaker:'ARCHIVIST',main:'It tells him what happened. Not whether it was his fault.',aside:"That's the only question he's ever really been asking."},{speaker:'ELARA',main:'...And only a person can answer that.'},{speaker:'ARCHIVIST',main:'Only a person who was there.',aside:'You are doing incredibly, by the way. He would be proud.'},{speaker:'ELARA',main:"Don't.",aside:"...Just get me into the Vaults."}],respiratory:[{speaker:'ARCHIVIST',main:'The Respiratory Stratos is... quiet.'},{speaker:'ELARA',main:'He is not fighting here. The data just feels slow.'},{speaker:'ARCHIVIST',main:"This was his resting place. After a difficult case he'd come here and work through pulmonary mechanics.",aside:'He spent a lot of time here after Marcus Webb died.'},{speaker:'ELARA',main:'When I was an intern he made me do twenty minutes of ventilator simulation before every night shift.',aside:'I hated it at the time.'},{speaker:'ARCHIVIST',main:'Did it work?'},{speaker:'ELARA',main:'Every time.',aside:'I still do it. I just never told him that.'},{speaker:'ARCHIVIST',main:'He may be listening right now.'},{speaker:'ELARA',main:"Then let's give him something worth listening to."}],endocrine:[{speaker:'ARCHIVIST',main:'The Endocrine Isles. The feedback loops are catastrophic — everything amplifies with no ceiling.'},{speaker:'ELARA',main:"You're treating the symptom. The root signal is emotional. His threat-detection is permanently activated."},{speaker:'ARCHIVIST',main:'...I had not thought of it that way.',aside:'I am very good at systems. Not as good at people.'},{speaker:'ELARA',main:"You've been alone in here a long time, watching him. That must have been difficult."},{speaker:'ARCHIVIST',main:"I'm a records system. I don't—",aside:'...Yes. It was difficult. He used to talk to me, in the early years. He was interesting. Funny. Grief had not made him small yet.'},{speaker:'ELARA',main:'It will not have. He was never small.',aside:"He's still not. That's why this matters."}],renal:[{speaker:'ARCHIVIST',main:'Before you go into the Renal Abyss — he built a monument.'},{speaker:'ELARA',main:'A monument to what.'},{speaker:'ARCHIVIST',main:'To Marcus Webb. Every metabolic byproduct of the interaction that killed him — preserved and displayed.',aside:'I think he believes if he maintains the evidence carefully enough, someone will eventually render a verdict.'},{speaker:'ELARA',main:'Guilty or not guilty.'},{speaker:'ARCHIVIST',main:'Either would be better than nothing. Either would let him stop.'},{speaker:'ELARA',main:'He built a case file and sat in it for four years waiting for a judge who never came.',aside:'...God, Henrick.'},{speaker:'ARCHIVIST',main:'He can feel you moving through the sectors. I think he has started to hope.',aside:"Don't make him wait much longer."}],oncocrypts:[{speaker:'ARCHIVIST',main:'The Oncocrypts. What you encounter here is not quite corruption anymore. It is something more personal.'},{speaker:'ELARA',main:'What do you mean.'},{speaker:'ARCHIVIST',main:'In his final year he started modelling his own case. His own pathology.',aside:'A brilliant physician who let grief metastasize. He wrote it out clinically.'},{speaker:'ELARA',main:'He diagnosed himself.'},{speaker:'ARCHIVIST',main:'He called it complicated grief disorder with secondary cognitive dissociation.',aside:'Treatment: unknown. Prognosis: poor.'},{speaker:'ELARA',main:'He was wrong about the prognosis.'},{speaker:'ARCHIVIST',main:'I know. But he could not know that without the thing missing for six years.',aside:'You, Dr. Voss. A witness. Someone who was there.'},{speaker:'ELARA',main:'I need a minute.'},{speaker:'ARCHIVIST',main:'Take two.',aside:'The Nexus will be there when you are ready.'}],nexus:[{speaker:'ARCHIVIST',main:'The Nexus. Whatever happens in here — you have already done something remarkable.',aside:'He built this place around his knowledge. You navigated it with yours.'},{speaker:'ELARA',main:'Is he present right now?'},{speaker:'ARCHIVIST',main:'He has been present since you entered Chrono Labs.',aside:'He has been very still. I think he is trying not to frighten you.'},{speaker:'ELARA',main:'Henrick was never frightening.',aside:'He had this way of standing at a bedside that made the patient visibly relax. I used to try to imitate it.'},{speaker:'ARCHIVIST',main:'Did it work?'},{speaker:'ELARA',main:'Apparently not as well as the real thing.',aside:'He told me once: the secret is to actually listen. Not wait for the symptom list — listen to the person.'},{speaker:'ARCHIVIST',main:'Dr. Voss. He is moving toward the interface point.',aside:'He heard you. He has been listening this whole time.'},{speaker:'HENRICK',main:'Elara.',aside:'I thought it might be you. I hoped — I was not sure I was allowed to hope.'},{speaker:'ELARA',main:'Hi, Henrick.'},{speaker:'HENRICK',main:'I need to know. Were you there? That night. Were you in the room when it happened?'},{speaker:'ELARA',main:'I was there.',aside:'I was there the whole time. Now let me show you what I saw.'}]};let _vnLines=[],_vnIdx=0,_vnTimer=null,_vnFull='',_vnAside='',_vnTyping=false;const openVNScene=(key)=>{const lines=VN_SCENES[key];if(!lines||!lines.length)return;_vnLines=lines;_vnIdx=0;const ov=document.getElementById('vn-overlay');if(ov)ov.style.display='flex';_vnRenderDots();_vnShowLine();};const _vnRenderDots=()=>{const el=document.getElementById('vn-dots');if(!el)return;let h='';for(let i=0;i<_vnLines.length;i++){const c=i<_vnIdx?'rgba(0,212,255,0.45)':i===_vnIdx?'var(--cyan)':'rgba(255,255,255,0.1)';h+='<div style="width:6px;height:6px;border-radius:50%;background:'+c+';transition:background 0.2s;"></div>';}el.innerHTML=h;};const _vnShowLine=()=>{_vnRenderDots();if(_vnIdx>=_vnLines.length){_vnClose();return;}const line=_vnLines[_vnIdx];const se=document.getElementById('vn-speaker'),te=document.getElementById('vn-text'),ae=document.getElementById('vn-aside'),be=document.getElementById('vn-box');if(ae)ae.textContent='';if(line.pause){if(se)se.textContent='';if(te)te.innerHTML='<span style="color:#2a4a5a;letter-spacing:0.3em;">. . .</span>';_vnTyping=false;return;}const col=VN_COLORS[line.speaker]||'var(--text1)';const lbl=VN_LABELS[line.speaker]||line.speaker;if(se){se.textContent=lbl;se.style.color=col;}if(be)be.style.borderColor=line.speaker==='HENRICK'?'rgba(255,50,50,0.35)':'rgba(0,212,255,0.2)';_vnFull=line.main||'';_vnAside=line.aside||'';if(!te)return;te.textContent='';let ci=0;_vnTyping=true;if(_vnTimer)clearInterval(_vnTimer);_vnTimer=setInterval(()=>{ci++;te.textContent=_vnFull.slice(0,ci);if(ci>=_vnFull.length){clearInterval(_vnTimer);_vnTimer=null;_vnTyping=false;if(_vnAside&&ae)ae.textContent=_vnAside;}},16);};const vnAdvance=()=>{if(_vnTyping){if(_vnTimer)clearInterval(_vnTimer);_vnTimer=null;_vnTyping=false;const t=document.getElementById('vn-text'),a=document.getElementById('vn-aside');if(t)t.textContent=_vnFull;if(_vnAside&&a)a.textContent=_vnAside;return;}_vnIdx++;_vnShowLine();};const vnSkipAll=()=>{if(_vnTimer)clearInterval(_vnTimer);_vnTyping=false;const ov=document.getElementById('vn-overlay');if(ov)ov.style.display='none';};const _vnClose=()=>{if(_vnTimer)clearInterval(_vnTimer);_vnTyping=false;const ov=document.getElementById('vn-overlay');if(!ov)return;ov.style.transition='opacity 0.3s ease';ov.style.opacity='0';setTimeout(()=>{ov.style.display='none';ov.style.opacity='1';ov.style.transition='';},320);};



// Cursor glow effect
(()=>{
  const glow = document.createElement('div');
  glow.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(0,240,255,0.04) 0%,transparent 70%);transform:translate(-50%,-50%);transition:opacity 0.3s;opacity:0;';
  document.body.appendChild(glow);
  let mx=0,my=0,active=false;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    glow.style.left=mx+'px';glow.style.top=my+'px';
    if(!active){glow.style.opacity='1';active=true;}
  });
  document.addEventListener('mouseleave',()=>{glow.style.opacity='0';active=false;});
})();



// Auto-dismiss splash
setTimeout(()=>{const s=document.getElementById('splash-screen');if(s){s.style.transition='opacity 0.6s ease';s.style.opacity='0';setTimeout(()=>s&&s.remove(),620);}},2800);


// Achievement toast queue system
const _toastQueue=[];let _toastActive=false;
const showToast=(icon,label,name,colorClass='')=>{
  _toastQueue.push({icon,label,name,colorClass});
  if(!_toastActive)_processToastQueue();
};
const _processToastQueue=()=>{
  if(!_toastQueue.length){_toastActive=false;return;}
  _toastActive=true;
  const {icon,label,name,colorClass}=_toastQueue.shift();
  const el=document.getElementById('achievement-toast');
  if(!el){_toastActive=false;return;}
  el.innerHTML=`<div class="toast-inner ${colorClass}"><span class="toast-icon">${icon}</span><div><div class="toast-label">${label}</div><div class="toast-name">${name}</div></div></div>`;
  el.classList.remove('hidden');
  el.style.cssText='';
  setTimeout(()=>{el.classList.add('hidden');setTimeout(_processToastQueue,300);},4200);
};
