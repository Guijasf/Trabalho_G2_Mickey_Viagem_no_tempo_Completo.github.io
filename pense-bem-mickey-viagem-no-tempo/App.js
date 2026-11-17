import React,{useReducer,useState,useRef,useEffect,useCallback} from 'react';
import {View,Text,TextInput,StyleSheet,ScrollView,Pressable,Image,Modal,StatusBar,Platform,Animated,Easing,AccessibilityInfo,useWindowDimensions} from 'react-native';
import {PROGRAMS} from './data';
import {initialGame,gameReducer,LETTERS,scoreSummary,displayProgramQuestion,displayAttempt} from './engine';
import {PAGES} from './pages';
import {DEFAULT_THEME,THEMES} from './themes';
import {SECRET_CODES,emptySecret,readSecret} from './secret-codes';
import {normalizeProgramCode,resolveProgramCode} from './program-access';
import {DEFAULT_CODE_GATE_ENABLED,DEFAULT_GAME_MODE,getDestinationDescription} from './visual-config';

const BUTTONS=[
  {key:'A',name:'Vermelho',color:'#ED272A'},
  {key:'B',name:'Amarelo',color:'#F3CF25'},
  {key:'C',name:'Azul',color:'#254BE7'},
  {key:'D',name:'Verde',color:'#178641'},
];
const ALL=PROGRAMS.flatMap(p=>p.questions);
const PROVISIONAL_COUNT=ALL.filter(q=>q.answerStatus==='provisional').length;

function EraArtwork({source,tint,height=220,style,accessibilityLabel='Ilustração da época'}) {
  const [unavailable,setUnavailable]=useState(false);
  useEffect(()=>{setUnavailable(false);},[source?.uri]);
  return <View style={[styles.artFrame,{height,backgroundColor:tint},style]}>
    {!unavailable ? <>
      <Image source={source} blurRadius={18} resizeMode="cover" style={styles.artBlur} onError={()=>setUnavailable(true)}/>
      <View style={styles.artShade}/>
      <Image accessibilityLabel={accessibilityLabel} source={source} resizeMode="contain" style={styles.artFull}/>
    </>:<Text style={styles.artFallback}>✦ VIAGEM NO TEMPO ✦</Text>}
  </View>;
}
function ModeChoice({title,description,icon,active,theme,onPress,testID}) {
  return <Pressable testID={testID} accessibilityRole="button" accessibilityState={{selected:active}}
    onPress={onPress} style={({pressed})=>[styles.modeChoice,{borderColor:active?theme.accent:theme.border,backgroundColor:active?theme.soft:theme.surface,opacity:pressed?.82:1,transform:[{scale:pressed?.985:1}]}]}>
    <View style={[styles.modeIcon,{backgroundColor:active?theme.accent:theme.tag}]}><Text style={[styles.modeIconText,{color:active?'#0E1C22':theme.ink}]}>{icon}</Text></View>
    <Text style={[styles.modeTitle,{color:theme.ink}]}>{title}</Text>
    <Text style={[styles.modeDescription,{color:theme.muted}]}>{description}</Text>
    <View style={[styles.modeRadio,{borderColor:active?theme.accent:theme.muted,backgroundColor:active?theme.accent:'transparent'}]}/>
  </Pressable>;
}
function Action({title,onPress,theme,secondary=false,disabled=false,testID}) {
  return <Pressable testID={testID} accessibilityRole="button" accessibilityState={{disabled}} disabled={disabled} onPress={onPress}
    style={({pressed})=>[styles.action,{backgroundColor:secondary?'transparent':theme.accent,borderColor:theme.accent,opacity:disabled?.45:pressed?.8:1,transform:[{scale:pressed?.975:1}]}]}>
    <Text style={[styles.actionText,{color:secondary?theme.accent:'#FFFFFF'}]}>{title}</Text>
  </Pressable>;
}
function StatusNote({children,theme,warning=false}){
  return <View style={[styles.note,{backgroundColor:warning?'#FFF1D7':theme.soft,borderColor:warning?'#EBC77D':theme.border}]}>
    <Text style={[styles.noteText,{color:warning?'#6E4A11':theme.ink}]}>{children}</Text>
  </View>;
}
function Portal({destination,onDone}){
  const motion=useRef(new Animated.Value(0)).current;
  const onDoneRef=useRef(onDone);
  const completed=useRef(false);
  onDoneRef.current=onDone;
  const {width,height}=useWindowDimensions();
  const finish=useCallback(()=>{
    if(completed.current)return;
    completed.current=true;
    onDoneRef.current?.();
  },[]);
  useEffect(()=>{
    let cancelled=false;
    let animation;
    const start=(reduce)=>{
      if(cancelled||completed.current)return;
      if(reduce){finish();return;}
      animation=Animated.timing(motion,{toValue:1,duration:1350,easing:Easing.inOut(Easing.cubic),useNativeDriver:Platform.OS!=='web'});
      animation.start(({finished})=>{if(finished&&!cancelled)finish();});
    };
    const sub=AccessibilityInfo.addEventListener('reduceMotionChanged',(enabled)=>{if(enabled)finish();});
    AccessibilityInfo.isReduceMotionEnabled().then(start,()=>start(true));
    return ()=>{cancelled=true;animation?.stop();sub?.remove?.();};
  },[finish,motion]);
  const size=Math.min(width*.68,height*.37,280);
  const spin=motion.interpolate({inputRange:[0,1],outputRange:['0deg','420deg']});
  const reverse=motion.interpolate({inputRange:[0,1],outputRange:['0deg','-590deg']});
  const pulse=motion.interpolate({inputRange:[0,.4,.8,1],outputRange:[.75,1,.82,.12]});
  return <View style={styles.portalOverlay}>
    <Text style={styles.portalEyebrow}>PORTAL TEMPORAL ATIVADO</Text>
    <View style={{width:size,height:size,alignItems:'center',justifyContent:'center',marginVertical:35}}>
      <Animated.View style={[styles.portalOuter,{width:size,height:size,borderRadius:size/2,transform:[{rotate:spin},{scale:pulse}]}]}/>
      <Animated.View style={[styles.portalMiddle,{width:size*.8,height:size*.8,borderRadius:size*.4,transform:[{rotate:reverse}]}]}/>
      <Animated.View style={[styles.portalInner,{width:size*.57,height:size*.57,borderRadius:size*.285,transform:[{rotate:spin}]}]}/>
      <View style={[styles.portalCore,{width:size*.36,height:size*.36,borderRadius:size*.18}]}/>
    </View>
    <Text style={styles.portalTitle}>Próxima parada:{'\n'}{destination}</Text>
    <Pressable accessibilityRole="button" style={styles.portalSkip} onPress={finish}><Text style={styles.portalSkipText}>Pular viagem →</Text></Pressable>
  </View>;
}

// Reprodução funcional do teclado Pense Bem da referência da AV2:
// display com código do programa + número da pergunta, tentativas e teclas A/B/C/D.
// A leitura do livro/quiz fica acima das teclas para funcionar também no celular.
function PenseBemConsole({game,question,mode,theme,onAnswer,onNext,onRestart,onOpenPage}){
  const attemptNumber=displayAttempt(game);
  const display=displayProgramQuestion(game.program.code,game.index);
  return <View style={[styles.penseConsole,{borderColor:theme.border,shadowColor:theme.accent}]} testID="pense-console">
    <View style={styles.penseHeading}>
      <Text style={styles.penseLogo}>TECTOY</Text>
      <Text style={styles.penseModel}>PENSE BEM · VIAGEM NO TEMPO</Text>
    </View>
    <View style={styles.consoleProgress}><View style={[styles.consoleProgressFill,{width:`${Math.round((game.index+1)/30*100)}%`,backgroundColor:theme.accent}]}/></View>
    <View style={styles.penseDisplay}>
      <Text testID="program-display" accessibilityLabel={`Programa ${game.program.code}, pergunta ${game.index+1} de 30`} style={styles.penseDigits}>{display}</Text>
    </View>
    <View style={styles.penseAttemptDisplay}>
      <Text testID="attempt-display" accessibilityLiveRegion="polite" style={styles.penseAttemptText}>{`Tentativa ${attemptNumber} de 3`}</Text>
    </View>
    <View style={styles.penseCounters}>
      <Text style={styles.penseCounterText}>QUESTÃO {game.index+1}/30</Text>
      <Text testID="score" style={styles.penseCounterText}>PONTOS {game.score}/90</Text>
    </View>

    <View style={styles.penseReading}>
      <Text style={styles.penseSectionLabel}>{mode==='book'?'◉  LIVRO ORIGINAL':'✦  QUIZ MODERNO'}</Text>
      {mode==='book' ? <>
        <Text style={styles.pensePrompt}>Encontre a questão {question.id} na página {question.printedPage} e responda com as teclas coloridas.</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Ampliar página ${question.printedPage} do livro`} onPress={onOpenPage} style={styles.penseBookButton}>
          <Image source={PAGES[question.page]} accessibilityLabel={`Página ${question.printedPage} do livro`} resizeMode="contain" style={styles.penseBookImage}/>
          <Text style={styles.penseBookLink}>Toque para ampliar a página ↗</Text>
        </Pressable>
      </> : <>
        <Text style={styles.pensePrompt}>{question.prompt}</Text>
        {question.context ? <Text style={styles.penseContext}>{question.context}</Text> : null}
        {question.options.map((option,i)=><Text key={`${question.id}-${i}`} style={styles.penseOption}>{LETTERS[i]}. {option}</Text>)}
        <Pressable accessibilityRole="button" onPress={onOpenPage} style={styles.penseSourceLink}>
          <Text style={styles.penseBookLink}>Consultar página original {question.printedPage} ↗</Text>
        </Pressable>
      </>}
      {question.answerStatus==='provisional'?<Text style={styles.penseWarning}>Gabarito provisório: resposta ainda não verificada no original.</Text>:null}
      {question.imageMissing?<Text style={styles.penseWarning}>A figura desta questão está incompleta na digitalização do livro.</Text>:null}
    </View>
    <Text style={styles.penseKeyPrompt}>ESCOLHA UMA TECLA</Text>
    <View style={styles.penseKeypad}>{BUTTONS.map((opt,i)=>{
      const used=game.attempts.includes(opt.key);
      const isCorrect=game.resolved&&question.answer===opt.key;
      const disabled=game.resolved||used;
      return <Pressable key={opt.key} testID={`answer-${opt.key}`} accessibilityRole="button"
        accessibilityLabel={`Alternativa ${opt.key}: ${mode==='book'?opt.name:question.options[i]}`}
        accessibilityState={{disabled,selected:isCorrect}} disabled={disabled}
        onPress={()=>onAnswer(opt.key)}
        style={({pressed})=>[styles.penseKey,{backgroundColor:opt.color,opacity:(used&&!isCorrect) ? 0.48 : pressed ? 0.82 : 1,transform:[{scale:pressed?.955:1}]},isCorrect&&styles.penseKeyCorrect]}>
        <Text style={[styles.penseKeyLetter,{color:opt.key==='B'?'#161616':'#FFFFFF'}]}>{opt.key}</Text>
        <Text style={[styles.penseKeyMarker,{color:opt.key==='B'?'#161616':'#FFFFFF'}]}>{isCorrect?'✓':used?'×':''}</Text>
      </Pressable>;
    })}</View>
    <View style={styles.penseFeedback}>
      <Text style={styles.penseFeedbackText} accessibilityLiveRegion="polite">{game.feedback||'Escolha A, B, C ou D. Cada erro consome uma tentativa.'}</Text>
    </View>
    {game.resolved?<Pressable testID="next" accessibilityRole="button" onPress={onNext} style={styles.penseNext}>
      <Text style={styles.penseNextText}>{game.index===29?'Ver resultado →':'Próxima pergunta →'}</Text>
    </Pressable>:null}
    <Pressable testID="restart" accessibilityRole="button" accessibilityLabel={`Reiniciar o programa ${game.program.code}`} onPress={onRestart} style={styles.penseRestart}>
      <Text style={styles.penseRestartText}>Reiniciar Jogo</Text>
    </Pressable>
  </View>;
}

export default function App(){
  const [game,dispatch]=useReducer(gameReducer,null);
  const [screen,setScreen]=useState('home');
  const [mode,setMode]=useState(DEFAULT_GAME_MODE);
  const [codeGateEnabled,setCodeGateEnabled]=useState(DEFAULT_CODE_GATE_ENABLED);
  const [codeInput,setCodeInput]=useState('');
  const [codeError,setCodeError]=useState('');
  const codeInputRef=useRef(null);
  const [themeCode,setThemeCode]=useState(null);
  const [showHelp,setShowHelp]=useState(false);
  const [showZoom,setShowZoom]=useState(false);
  const [zoomScale,setZoomScale]=useState(1);
  const [trip,setTrip]=useState(null);
  const [announcement,setAnnouncement]=useState('');
  const tripAction=useRef(null);
  const scroll=useRef(null);
  const secret=useRef(emptySecret());
  const {width}=useWindowDimensions();
  const enterOpacity=useRef(new Animated.Value(1)).current;
  const theme=THEMES[themeCode]||DEFAULT_THEME;
  useEffect(()=>{
    enterOpacity.setValue(.25);
    const transition=Animated.timing(enterOpacity,{toValue:1,duration:320,easing:Easing.out(Easing.quad),useNativeDriver:Platform.OS!=='web'});
    transition.start();
    return ()=>transition.stop();
  },[screen,themeCode,enterOpacity]);
  const question=game?.program.questions[game.index];
  const stats=game?scoreSummary(game):null;
  const bookModeName=(THEMES[themeCode||game?.program?.code]||DEFAULT_THEME).mode;
  const ink={color:theme.ink};
  const muted={color:theme.muted};
  const scrollTop=()=>scroll.current?.scrollTo({y:0,animated:false});

  const completeTrip=useCallback(()=>{
    const fn=tripAction.current;
    tripAction.current=null;
    setTrip(null);
    fn?.();
  },[]);
  const travel=(title,fn)=>{
    if(tripAction.current)return;
    tripAction.current=fn;
    setShowZoom(false);setShowHelp(false);setTrip(title);
  };
  const begin=(program)=>travel(THEMES[program.code].name,()=>{
    dispatch({type:'START',program});setScreen('play');setThemeCode(program.code);scrollTop();
  });
  const changeCodeGate=()=>{
    setCodeGateEnabled(v=>!v);
    setCodeInput('');
    setCodeError('');
    setAnnouncement('');
  };
  const requestCode=()=>{
    setCodeError('Digite o código de três números para abrir este destino.');
    codeInputRef.current?.focus();
  };
  const openByCode=()=>{
    // Somente um código válido do livro libera o início de um programa.
    const {program,error}=resolveProgramCode(PROGRAMS,codeInput);
    if(error){setCodeError(error);return;}
    setCodeError('');
    setCodeInput('');
    if(game&&!game.finished&&game.program.code===program.code){
      travel(THEMES[program.code].name,()=>{
        setScreen('play');setThemeCode(program.code);scrollTop();
      });
    } else {
      begin(program);
    }
  };
  const setEra=(code)=>travel((THEMES[code]||DEFAULT_THEME).name,()=>{
    setThemeCode(code);setAnnouncement(code?`Ambientação: ${THEMES[code].name}`:'Visual original restaurado');scrollTop();
  });
  const next=()=>{dispatch({type:'NEXT'});scrollTop();};
  const swapMode=()=>{setMode(m=>m==='book'?'quiz':'book');setAnnouncement('Modo alterado sem perder os pontos.');};
  const openPage=()=>{setZoomScale(1);setShowZoom(true);};

  useEffect(()=>{
    if(Platform.OS!=='web')return;
    const listener=(event)=>{
      const result=readSecret(secret.current,{key:event.key,repeat:event.repeat,ctrlKey:event.ctrlKey,altKey:event.altKey,metaKey:event.metaKey,editable:!!event.target?.closest?.('input,textarea,[contenteditable="true"]')},Date.now());
      secret.current=result.state;
      if(result.matched){
        // Teclas de atalho não alteram o jogo; apenas trocam os cenários.
        if(!tripAction.current){tripAction.current=()=>{setThemeCode(result.themeCode);setAnnouncement('Época secreta ativada.');};setTrip((THEMES[result.themeCode]||DEFAULT_THEME).name);}
      }
    };
    globalThis.addEventListener('keydown',listener);
    return ()=>globalThis.removeEventListener('keydown',listener);
  },[]);
  useEffect(()=>{if(game?.finished){setScreen('result');scrollTop();}},[game?.finished]);

  return <View style={[styles.root,{backgroundColor:theme.background}]}>
    <StatusBar barStyle="light-content" backgroundColor={theme.statusBar||theme.background}/>
    <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.container,{maxWidth:930,paddingHorizontal:width>720?35:16}]}>
      <Animated.View style={{opacity:enterOpacity}}>
      <View style={[styles.header,{borderBottomColor:theme.border}]}>
        <Pressable onPress={()=>setEra(null)} accessibilityLabel="Retornar à ambientação padrão">
          <Text style={[styles.brand,ink]}>PENSE<Text style={{color:theme.accent}}> BEM</Text><Text style={{color:theme.muted}}> · </Text>MICKEY</Text>
          <Text style={[styles.tiny,muted]}>VIAGEM NO TEMPO · AV2 MOBILE</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={()=>setShowHelp(true)} style={({pressed})=>[styles.helpPill,{borderColor:theme.border,backgroundColor:theme.surface,opacity:pressed?.7:1}]}>
          <Text style={[styles.helpPillText,ink]}>✧  Épocas</Text>
        </Pressable>
      </View>
      {announcement?<Text accessibilityLiveRegion="polite" style={[styles.small,muted,{marginTop:10}]}>{announcement}</Text>:null}

      {screen==='home' ? <>
        <View style={[styles.hero,{backgroundColor:theme.hero,borderColor:theme.border}]}>
          <EraArtwork source={theme.image} tint={theme.hero} height={width>=720?328:258} accessibilityLabel="Mickey e amigos viajando no tempo"/>
          <View style={styles.heroCopy}>
            <View style={[styles.heroChip,{backgroundColor:theme.tag}]}><Text style={[styles.heroChipText,{color:theme.highlight}]}>✦ AVENTURA NO TEMPO</Text></View>
            <Text style={[styles.title,ink]}>O passado ganha{ '\n' }vida na sua mão.</Text>
            <Text style={[styles.body,muted]}>5 épocas, 150 desafios e a essência do Pense Bem. Escolha como explorar, embarque no portal e teste seu conhecimento.</Text>
            <View style={styles.heroMetrics}>
              <Text style={[styles.heroMetric,{color:theme.highlight}]}>05 <Text style={styles.heroMetricLabel}>PROGRAMAS</Text></Text>
              <Text style={[styles.heroMetric,{color:theme.highlight}]}>150 <Text style={styles.heroMetricLabel}>PERGUNTAS</Text></Text>
              <Text style={[styles.heroMetric,{color:theme.highlight}]}>03 <Text style={styles.heroMetricLabel}>TENTATIVAS</Text></Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionTop}>
          <View><Text style={[styles.sectionTitle,ink]}>Como quer jogar?</Text><Text style={[styles.small,muted]}>O clássico vem primeiro. O moderno é opcional.</Text></View>
        </View>
        <View style={styles.modeRow}>
          <ModeChoice title="Pense Bem clássico" description="Consulte o livro e use as teclas coloridas" icon="▦" active={mode==='book'} theme={theme} onPress={()=>setMode('book')} testID="mode-classic"/>
          <ModeChoice title="Quiz moderno" description="Leia perguntas e alternativas na própria tela" icon="✦" active={mode==='quiz'} theme={theme} onPress={()=>setMode('quiz')} testID="mode-quiz"/>
        </View>

        <View style={[styles.gatePanel,{borderColor:theme.accent,backgroundColor:theme.surface}]}>
          <View style={styles.gateHeader}>
            <View style={{flex:1}}>
              <Text style={[styles.gateEyebrow,{color:theme.accent}]}>✦ PORTÃO DO TEMPO</Text>
              <Text style={styles.gateTitle}>Acesso por código</Text>
              <Text style={[styles.gateSubtitle,{color:theme.muted}]}>{codeGateEnabled?'ATIVADO · necessário para iniciar o quiz':'DESATIVADO · escolha livre de destinos'}</Text>
            </View>
            <Pressable testID="toggle-code-gate" accessibilityRole="switch" accessibilityLabel="Exigir código para iniciar programa"
              accessibilityState={{checked:codeGateEnabled}} onPress={changeCodeGate}
              style={[styles.gateToggle,codeGateEnabled&&styles.gateToggleOn]}>
              <View style={[styles.gateToggleDot,codeGateEnabled&&styles.gateToggleDotOn]}/>
              <Text style={styles.gateToggleLabel}>{codeGateEnabled?'LIGADO':'LIVRE'}</Text>
            </Pressable>
          </View>
          {codeGateEnabled ? <View style={styles.gateEntry}>
            <Text style={[styles.gateHint,{color:theme.ink}]}>Descubra o código do programa e libere sua próxima viagem. Uma homenagem ao Pense Bem original.</Text>
            <Text style={[styles.gateInputLabel,{color:theme.accent}]}>CÓDIGO DO PROGRAMA</Text>
            <View style={styles.gateEntryRow}>
              <TextInput ref={codeInputRef} testID="program-code-input" accessibilityLabel="Digite código de três dígitos"
                value={codeInput} onChangeText={value=>{setCodeInput(normalizeProgramCode(value));setCodeError('');}}
                onSubmitEditing={openByCode} placeholder="•••" placeholderTextColor="#9B9B87"
                keyboardType="number-pad" maxLength={3} returnKeyType="go" autoCorrect={false}
                style={[styles.gateInput,{borderColor:theme.accent}]}/>
              <Pressable testID="submit-program-code" accessibilityRole="button" onPress={openByCode} style={[styles.gateOpenButton,{backgroundColor:theme.accent}]}>
                <Text style={styles.gateOpenText}>Desbloquear →</Text>
              </Pressable>
            </View>
            {codeError ? <Text testID="program-code-error" accessibilityLiveRegion="polite" style={styles.gateError}>{codeError}</Text> : null}
            <Text style={[styles.gateFine,{color:theme.muted}]}>Acesso clássico ativado por padrão. Para explorar livremente, desligue a chave acima.</Text>
          </View> : <Text style={[styles.gateFine,{color:theme.muted}]}>Modo livre habilitado: os destinos abaixo abrem sem digitar o código. Você pode religar a qualquer momento.</Text>}
        </View>

        {game&&!game.finished&&!codeGateEnabled&&<Action title={`Continuar programa ${game.program.code} · pergunta ${game.index+1}`} onPress={()=>{setScreen('play');scrollTop();}} theme={theme}/>}
        <View style={styles.sectionTop}><View><Text style={[styles.sectionTitle,ink]}>Destinos no tempo</Text><Text style={[styles.small,muted]}>Cinco mundos para descobrir</Text></View><Text style={[styles.small,{color:theme.accent}]}>{codeGateEnabled?'◈ Bloqueados':'◉ Livres'}</Text></View>
        <View style={styles.cards}>{PROGRAMS.map((p,i)=>{
          const era=THEMES[p.code];
          const wide=width>=730;
          return <Pressable key={p.code} testID={`destination-${p.code}`} accessibilityRole="button"
            accessibilityLabel={codeGateEnabled?`Destino ${p.title} bloqueado. Digite código para entrar.`:`Iniciar programa ${p.code}`}
            onPress={()=>codeGateEnabled?requestCode():begin(p)}
            style={({pressed})=>[styles.card,{backgroundColor:era.surface,borderColor:era.border,width:wide?'48.7%':'100%',flexDirection:wide?'column':'row',opacity:pressed?.82:1,transform:[{scale:pressed?.987:1}]}]}>
            <EraArtwork source={era.image} tint={era.hero} height={wide?164:135} style={wide?styles.cardArtWide:styles.cardArtNarrow} accessibilityLabel={`Ilustração de ${era.name}`}/>
            <View style={[styles.cardCopy,{flex:1}]}>
              <Text style={[styles.eyebrow,{color:era.accent}]}>{`DESTINO 0${i+1}`} · {codeGateEnabled?'CÓDIGO OCULTO':`CÓDIGO ${p.code}`}</Text>
              <Text style={[styles.cardTitle,{color:era.ink}]}>{p.title}</Text>
              <Text style={[styles.small,{color:era.muted}]}>{getDestinationDescription(codeGateEnabled,p.code,p.questions.length)}</Text>
              <View style={[styles.cardArrow,{borderColor:era.accent}]}><Text style={{color:era.accent,fontWeight:'900',fontSize:17}}>{codeGateEnabled?'⌑':'→'}</Text></View>
            </View>
          </Pressable>;
        })}</View>
        <StatusNote theme={theme} warning>{`Conteúdo em revisão: ${PROVISIONAL_COUNT} respostas são hipóteses; as demais também precisam ser conferidas no livro original. Pontuações e gabarito não são oficiais.`}</StatusNote>
        <Text style={[styles.footer,muted]}>Projeto acadêmico baseado em Pense Bem — Disney: Viagem no Tempo (Tectoy / Nova Cultural, 1991). Sem vínculo oficial com as marcas. Conteúdo adaptado para estudo.</Text>
      </> : game ? <>
        <View style={[styles.sectionTop,{marginTop:20}]}>
          <Action title="‹ Destinos" theme={theme} secondary onPress={()=>{setScreen('home');scrollTop();}}/>
          <Text style={[styles.eyebrow,{color:theme.accent}]}>PROGRAMA {game.program.code}</Text>
        </View>
        <View style={[styles.miniBanner,{backgroundColor:theme.surface,borderColor:theme.border}]}>
          <EraArtwork source={THEMES[game.program.code].image} tint={theme.hero} height={112} style={styles.bannerArt} accessibilityLabel={THEMES[game.program.code].name}/>
          <View style={{flex:1,padding:16}}>
            <Text style={[styles.eyebrow,{color:theme.accent}]}>EXPLORANDO · {game.program.code}</Text>
            <Text style={[styles.sectionTitle,ink]}>{game.program.title}</Text>
            <Text style={[styles.small,muted]}>{THEMES[game.program.code].name}</Text>
          </View>
        </View>
        {screen==='play' ? <>
          <View style={[styles.sectionTop,{marginBottom:4}]}>
            <Text style={[styles.eyebrow,{color:theme.accent}]}>{mode==='book'?`MODO ${bookModeName.toUpperCase()}`:'MODO QUIZ'}</Text>
            <Action title={mode==='book'?'Trocar para Quiz':'Trocar para Livro'} secondary theme={theme} onPress={swapMode}/>
          </View>
          <View style={[styles.progress,{backgroundColor:theme.border}]}>
            <View style={{height:'100%',backgroundColor:theme.accent,width:`${(game.index+1)/30*100}%`}}/>
          </View>
          <PenseBemConsole game={game} question={question} mode={mode} theme={theme}
            onAnswer={choice=>dispatch({type:'ANSWER',choice})}
            onNext={next} onRestart={()=>{dispatch({type:'START',program:game.program});scrollTop();}} onOpenPage={openPage}/>
          <Text style={[styles.footer,muted,{textAlign:'center'}]}>As teclas seguem as cores do Pense Bem. Os pontos dependem de um gabarito ainda em revisão.</Text>
        </> : <View style={[styles.questionCard,{borderColor:theme.border,backgroundColor:theme.surface}]}>
          <Text style={[styles.eyebrow,{color:theme.accent}]}>PROGRAMA CONCLUÍDO</Text>
          <Text style={[styles.title,ink]}>Viagem finalizada!</Text>
          <Text style={[styles.bigScore,ink]}>{stats.score}<Text style={[styles.body,muted]}> / 90 pontos</Text></Text>
          <Text style={[styles.body,ink]}>{stats.correct} acertos em 30 questões · {stats.provisionalPoints} pontos dependem de respostas provisórias.</Text>
          <StatusNote warning theme={theme}>Este resultado ainda não é homologado: as 150 respostas do projeto são adaptações editoriais, e {stats.reviewed} questões deste programa usam hipóteses adicionais.</StatusNote>
          <View style={styles.toolbar}><Action title="Reiniciar programa" theme={theme} onPress={()=>begin(game.program)}/><Action title="Outros destinos" theme={theme} secondary onPress={()=>{setScreen('home');scrollTop();}}/></View>
          <Text style={[styles.sectionTitle,ink,{marginTop:26}]}>Seu histórico</Text>
          {game.history.map((h,i)=><View key={h.id} style={[styles.historyItem,{borderColor:theme.border}]}>
            <Text style={[styles.small,ink]}>Questão {h.id} · {h.correct?'Acertou':'Não acertou'} · +{h.points} ponto(s)</Text>
            <Text style={[styles.small,muted]}>Respostas: {h.attempts.join(' → ')} · Gabarito cadastrado: {h.answer} {h.answerStatus==='provisional'?'(hipótese)':''}</Text>
          </View>)}
        </View>}
      </> : null}
      </Animated.View>
    </ScrollView>
    <Modal visible={showHelp} animationType="fade" transparent onRequestClose={()=>setShowHelp(false)}>
      <View style={styles.modalBackdrop}><ScrollView contentContainerStyle={styles.modalScroll}>
        <View style={[styles.dialog,{backgroundColor:theme.surface}]}>
          <Text style={[styles.sectionTitle,ink]}>Manual do viajante</Text>
          <Text style={[styles.body,muted]}>Cada programa tem 30 perguntas. Você tem três tentativas por pergunta: acertar na primeira vale 3 pontos, na segunda vale 2, na terceira vale 1; errar as três vale 0.</Text>
          <Text style={[styles.body,muted]}>Trocar de época e de modo mantém a questão e os pontos. Ao escolher outro destino, começa uma nova partida.</Text>
          <Text style={[styles.body,muted]}>Acesso por código já começa ligado, como no brinquedo clássico: digite os três dígitos do programa. Você pode desligar a chave para explorar os destinos sem digitar. Os códigos de acesso não são os atalhos secretos de época.</Text>
          <Text style={[styles.sectionTitle,ink,{marginTop:18}]}>Códigos secretos</Text>
          <Text style={[styles.small,muted]}>Na web, pressione Shift e digite um código. No celular, use os botões abaixo:</Text>
          {Object.entries(SECRET_CODES).map(([secretCode,programCode])=><Action key={secretCode} theme={theme} secondary title={`${secretCode} · ${(THEMES[programCode]||DEFAULT_THEME).name}`} onPress={()=>setEra(programCode)}/>)}
          <StatusNote warning theme={theme}>Gabarito de referência, ainda não oficial. Verifique especialmente as questões 30, 32, 36, 37, 40, 49, 54, 62, 64, 73, 83, 99, 120, 121–123, 125 e 126.</StatusNote>
          <Action title="Fechar" theme={theme} onPress={()=>setShowHelp(false)}/>
        </View>
      </ScrollView></View>
    </Modal>
    <Modal visible={showZoom} animationType="slide" onRequestClose={()=>setShowZoom(false)}>
      <View style={[styles.zoomRoot,{backgroundColor:theme.background}]}>
        <View style={styles.toolbar}><Text style={[styles.small,ink]}>Página {question?.printedPage} · questão {question?.id}</Text><Action title="Fechar" onPress={()=>setShowZoom(false)} theme={theme}/></View>
        <View style={styles.toolbar}><Action title="− Zoom" onPress={()=>setZoomScale(v=>Math.max(1,v-.5))} disabled={zoomScale<=1} secondary theme={theme}/><Text style={ink}>{Math.round(zoomScale*100)}%</Text><Action title="+ Zoom" onPress={()=>setZoomScale(v=>Math.min(3,v+.5))} disabled={zoomScale>=3} secondary theme={theme}/></View>
        <ScrollView><ScrollView horizontal>{question&&<Image source={PAGES[question.page]} resizeMode="contain" style={{width:width*zoomScale,height:width*1.32*zoomScale}}/>}</ScrollView></ScrollView>
      </View>
    </Modal>
    {trip&&<Portal destination={trip} onDone={completeTrip}/>}
  </View>;
}

const styles=StyleSheet.create({
  root:{flex:1},
  container:{width:'100%',alignSelf:'center',paddingTop:Platform.OS==='ios'?20:16,paddingBottom:88},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,paddingVertical:10,marginBottom:6},
  brand:{fontSize:21,fontWeight:'900',letterSpacing:-.6},
  tiny:{fontSize:9,fontWeight:'800',letterSpacing:1.3,marginTop:4},
  helpPill:{minHeight:42,paddingHorizontal:16,borderWidth:1,borderRadius:30,justifyContent:'center',alignItems:'center'},
  helpPillText:{fontSize:12,fontWeight:'800'},
  action:{borderWidth:1.5,borderRadius:15,minHeight:48,paddingVertical:11,paddingHorizontal:15,alignItems:'center',justifyContent:'center',marginVertical:4},
  actionText:{fontSize:13,fontWeight:'800',textAlign:'center'},
  artFrame:{overflow:'hidden',position:'relative',alignItems:'center',justifyContent:'center'},
  artBlur:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%',opacity:.76},
  artShade:{...StyleSheet.absoluteFillObject,backgroundColor:'#081A24A6'},
  artFull:{width:'100%',height:'100%'},
  artFallback:{color:'#FFFFFF',fontSize:13,fontWeight:'800',letterSpacing:1},
  hero:{borderRadius:26,overflow:'hidden',marginTop:18,borderWidth:1.5},
  heroCopy:{paddingHorizontal:22,paddingTop:21,paddingBottom:24},
  heroChip:{paddingHorizontal:12,paddingVertical:7,alignSelf:'flex-start',borderRadius:40,marginBottom:13},
  heroChipText:{fontSize:10,fontWeight:'900',letterSpacing:1.3},
  title:{fontSize:32,lineHeight:38,fontWeight:'900',letterSpacing:-1.1,marginBottom:12},
  body:{fontSize:14,lineHeight:22},
  small:{fontSize:12,lineHeight:19},
  eyebrow:{fontSize:10,fontWeight:'900',letterSpacing:1.2,marginBottom:7},
  heroMetrics:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',marginTop:20,paddingTop:16,borderTopWidth:1,borderTopColor:'#FFFFFF2F',gap:9},
  heroMetric:{fontSize:19,fontWeight:'900',letterSpacing:-.5},
  heroMetricLabel:{fontSize:8,fontWeight:'800',letterSpacing:.3},
  sectionTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10,marginTop:25,marginBottom:15},
  sectionTitle:{fontSize:21,lineHeight:28,fontWeight:'900',letterSpacing:-.5},
  modeRow:{flexDirection:'row',justifyContent:'space-between',gap:10,marginBottom:8},
  modeChoice:{width:'48.5%',minHeight:172,borderRadius:18,borderWidth:1.5,padding:13,position:'relative'},
  modeIcon:{height:38,width:38,borderRadius:12,justifyContent:'center',alignItems:'center',marginBottom:12},
  modeIconText:{fontSize:23,fontWeight:'900'},
  modeTitle:{fontSize:14,lineHeight:19,fontWeight:'900',marginBottom:6,marginRight:5},
  modeDescription:{fontSize:11,lineHeight:16,paddingRight:6},
  modeRadio:{width:11,height:11,borderWidth:2,borderRadius:8,position:'absolute',top:16,right:14},
  note:{borderWidth:1,padding:15,borderRadius:15,marginVertical:16},
  noteText:{fontSize:12,lineHeight:19,fontWeight:'500'},
  gatePanel:{borderWidth:1.5,borderRadius:24,padding:17,marginTop:22,marginBottom:10,overflow:'hidden'},
  gateHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10},
  gateEyebrow:{fontSize:10,fontWeight:'900',letterSpacing:1.7,marginBottom:7},
  gateTitle:{color:'#FFFFFF',fontSize:21,lineHeight:27,fontWeight:'900'},
  gateSubtitle:{fontSize:11,lineHeight:17,marginTop:7},
  gateToggle:{backgroundColor:'#45535B',borderRadius:40,borderWidth:1,borderColor:'#81909A',paddingVertical:8,paddingHorizontal:10,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7,minWidth:98,minHeight:46},
  gateToggleOn:{backgroundColor:'#177C5B',borderColor:'#6AF2B6'},
  gateToggleDot:{backgroundColor:'#CED3DB',width:14,height:14,borderRadius:7},
  gateToggleDotOn:{backgroundColor:'#FCF2AF'},
  gateToggleLabel:{color:'#FFFFFF',fontSize:11,fontWeight:'900',letterSpacing:.3},
  gateEntry:{borderTopWidth:1,borderTopColor:'#FFFFFF2F',marginTop:16,paddingTop:16},
  gateHint:{fontSize:13,lineHeight:21,marginBottom:16},
  gateInputLabel:{fontSize:10,fontWeight:'900',letterSpacing:1.4,marginBottom:9},
  gateEntryRow:{flexDirection:'row',alignItems:'center',gap:9},
  gateInput:{backgroundColor:'#06171F',color:'#FFEFBA',fontFamily:Platform.select({ios:'Courier New',android:'monospace',default:'monospace'}),fontSize:26,fontWeight:'900',letterSpacing:4,textAlign:'center',borderWidth:2,borderRadius:13,width:112,minHeight:58,paddingVertical:11,paddingHorizontal:5},
  gateOpenButton:{borderRadius:13,minHeight:58,paddingVertical:14,paddingHorizontal:10,alignItems:'center',justifyContent:'center',flex:1},
  gateOpenText:{color:'#12232B',fontSize:14,fontWeight:'900'},
  gateError:{color:'#FFCAA8',fontSize:12,fontWeight:'700',lineHeight:19,marginTop:11},
  gateFine:{fontSize:11,lineHeight:18,marginTop:13},
  cards:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:12,columnGap:10},
  card:{borderWidth:1,borderRadius:19,overflow:'hidden',minHeight:135},
  cardArtWide:{width:'100%'},
  cardArtNarrow:{width:124,flexShrink:0},
  cardCopy:{padding:13,justifyContent:'center',minWidth:0},
  cardTitle:{fontSize:17,lineHeight:22,fontWeight:'900',letterSpacing:-.3,marginBottom:7},
  cardArrow:{width:30,height:27,alignItems:'center',justifyContent:'center',borderWidth:1,borderRadius:9,alignSelf:'flex-start',marginTop:9},
  footer:{fontSize:10,lineHeight:17,marginTop:20,marginBottom:14},
  miniBanner:{flexDirection:'row',alignItems:'center',borderWidth:1,borderRadius:20,overflow:'hidden',marginVertical:7},
  bannerArt:{width:128,flexShrink:0},
  progress:{height:5,borderRadius:5,overflow:'hidden',marginBottom:8},
  questionCard:{borderWidth:1,borderRadius:24,padding:19,marginVertical:13},
  bigScore:{fontSize:58,fontWeight:'900',marginVertical:18},
  toolbar:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8,paddingVertical:10},
  historyItem:{borderBottomWidth:1,paddingVertical:12,gap:4},
  modalBackdrop:{flex:1,backgroundColor:'#030D14E8'},
  modalScroll:{flexGrow:1,justifyContent:'center',padding:16},
  dialog:{width:'100%',maxWidth:550,alignSelf:'center',borderRadius:23,padding:21,gap:9},
  zoomRoot:{flex:1,paddingTop:Platform.OS==='ios'?48:20},
  // A experiência retrô mantém a carcaça amarelada e as quatro teclas do brinquedo.
  penseConsole:{width:'100%',maxWidth:470,alignSelf:'center',backgroundColor:'#F1EDC4',borderWidth:2,borderRadius:25,padding:14,marginTop:13,marginBottom:12,shadowColor:'#000000',shadowOpacity:.3,shadowRadius:16,shadowOffset:{width:0,height:8},elevation:5},
  penseHeading:{alignItems:'center',marginBottom:13},
  penseLogo:{fontSize:31,fontWeight:'900',letterSpacing:-1.4,color:'#F5AD00',textShadowColor:'#AD3A0D',textShadowRadius:1,textShadowOffset:{width:1,height:2}},
  penseModel:{fontSize:9,fontWeight:'900',letterSpacing:1.3,color:'#5F5931'},
  consoleProgress:{height:4,borderRadius:6,overflow:'hidden',backgroundColor:'#B5B08F',marginBottom:10},
  consoleProgressFill:{height:'100%',borderRadius:6},
  penseDisplay:{backgroundColor:'#080D10',borderWidth:2,borderColor:'#272D32',borderRadius:12,minHeight:82,alignItems:'center',justifyContent:'center',paddingHorizontal:8,marginBottom:9},
  penseDigits:{fontFamily:Platform.select({ios:'Courier New',android:'monospace',default:'monospace'}),fontSize:32,fontWeight:'900',letterSpacing:.8,color:'#FF443E',textAlign:'center',textShadowColor:'#FF333966',textShadowRadius:12},
  penseAttemptDisplay:{backgroundColor:'#0B1013',borderRadius:8,minHeight:39,alignItems:'center',justifyContent:'center',padding:7,marginBottom:9},
  penseAttemptText:{fontFamily:Platform.select({ios:'Courier New',android:'monospace',default:'monospace'}),fontSize:16,color:'#FFFFFF',textAlign:'center'},
  penseCounters:{flexDirection:'row',justifyContent:'space-between',marginBottom:10},
  penseCounterText:{fontSize:10,color:'#3C3826',fontWeight:'900',letterSpacing:.4},
  penseReading:{backgroundColor:'#FFFCF0',borderWidth:1,borderColor:'#CECAA5',borderRadius:14,padding:14,marginBottom:13},
  penseSectionLabel:{fontSize:10,color:'#796B30',fontWeight:'900',letterSpacing:1.1,marginBottom:9},
  pensePrompt:{fontSize:16,lineHeight:24,fontWeight:'800',color:'#262820',marginBottom:9},
  penseContext:{fontSize:12,lineHeight:19,color:'#534F42',marginBottom:9},
  penseOption:{fontSize:13,lineHeight:20,color:'#303126',marginVertical:5},
  penseBookButton:{alignItems:'center',padding:2},
  penseBookImage:{width:'100%',height:370},
  penseBookLink:{fontSize:12,fontWeight:'900',color:'#6B5118',textAlign:'center',paddingVertical:8},
  penseSourceLink:{marginTop:7,alignSelf:'flex-start'},
  penseWarning:{fontSize:11,lineHeight:17,backgroundColor:'#FFF0D9',color:'#70521A',padding:10,marginTop:11,borderRadius:9},
  penseKeyPrompt:{fontSize:10,fontWeight:'900',letterSpacing:1.2,textAlign:'center',color:'#3B3D27',marginBottom:9},
  penseKeypad:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:7,columnGap:5,marginBottom:11},
  penseKey:{width:'48.8%',height:88,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'#212626',borderRadius:13,position:'relative',shadowColor:'#000000',shadowOpacity:.24,shadowRadius:4,shadowOffset:{width:0,height:3},elevation:2},
  penseKeyCorrect:{borderColor:'#FFFFFF',borderWidth:4},
  penseKeyLetter:{fontSize:34,fontWeight:'900'},
  penseKeyMarker:{position:'absolute',right:12,top:6,fontSize:19,fontWeight:'900'},
  penseFeedback:{backgroundColor:'#0F1A1B',borderRadius:10,paddingVertical:13,paddingHorizontal:13,marginBottom:12,minHeight:51,justifyContent:'center'},
  penseFeedbackText:{color:'#FFFFFF',fontSize:12,lineHeight:19,textAlign:'center'},
  penseNext:{backgroundColor:'#1E7257',borderRadius:12,padding:14,alignItems:'center',marginBottom:10,minHeight:48,justifyContent:'center'},
  penseNextText:{color:'#FFFFFF',fontSize:14,fontWeight:'900'},
  penseRestart:{backgroundColor:'#C8C8BF',borderWidth:1,borderColor:'#77776F',borderRadius:11,padding:12,alignItems:'center'},
  penseRestartText:{fontSize:12,color:'#22241F',fontWeight:'800'},
  portalOverlay:{position:'absolute',left:0,right:0,top:0,bottom:0,zIndex:1000,backgroundColor:'#061F20FA',alignItems:'center',justifyContent:'center',padding:25},
  portalEyebrow:{fontSize:13,letterSpacing:3,color:'#83EEC7',fontWeight:'900',textAlign:'center'},
  portalOuter:{position:'absolute',borderWidth:13,borderColor:'#2CE89B',borderStyle:'dashed',shadowColor:'#69FFC8',shadowOpacity:.55,shadowRadius:30},
  portalMiddle:{position:'absolute',borderWidth:18,borderColor:'#A5F5B9',borderStyle:'dotted'},
  portalInner:{position:'absolute',borderWidth:16,borderColor:'#0B946A',borderStyle:'dashed'},
  portalCore:{backgroundColor:'#A2FFD7',shadowColor:'#60FFAF',shadowOpacity:1,shadowRadius:35},
  portalTitle:{fontSize:25,lineHeight:34,color:'#FFFFFF',fontWeight:'900',textAlign:'center'},
  portalSkip:{marginTop:40,padding:16},
  portalSkipText:{color:'#A3FFE0',fontWeight:'900',fontSize:16},
});
