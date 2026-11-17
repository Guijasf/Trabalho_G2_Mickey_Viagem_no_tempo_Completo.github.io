import React,{useReducer,useState,useRef,useEffect,useCallback} from 'react';
import {View,Text,StyleSheet,ScrollView,Pressable,Image,Modal,StatusBar,Platform,Animated,Easing,AccessibilityInfo,useWindowDimensions} from 'react-native';
import {PROGRAMS} from './data';
import {initialGame,gameReducer,LETTERS,scoreSummary,displayProgramQuestion,displayAttempt} from './engine';
import {PAGES} from './pages';
import {DEFAULT_THEME,THEMES} from './themes';
import {SECRET_CODES,emptySecret,readSecret} from './secret-codes';

const BUTTONS=[
  {key:'A',name:'Vermelho',color:'#ED272A'},
  {key:'B',name:'Amarelo',color:'#F3CF25'},
  {key:'C',name:'Azul',color:'#254BE7'},
  {key:'D',name:'Verde',color:'#178641'},
];
const ALL=PROGRAMS.flatMap(p=>p.questions);
const PROVISIONAL_COUNT=ALL.filter(q=>q.answerStatus==='provisional').length;

function Action({title,onPress,theme,secondary=false,disabled=false,testID}) {
  return <Pressable testID={testID} accessibilityRole="button" accessibilityState={{disabled}} disabled={disabled} onPress={onPress}
    style={({pressed})=>[styles.action,{backgroundColor:secondary?'transparent':theme.accent,borderColor:theme.accent,opacity:disabled?.45:pressed?.72:1}]}>
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
      animation=Animated.timing(motion,{toValue:1,duration:1800,easing:Easing.inOut(Easing.cubic),useNativeDriver:Platform.OS!=='web'});
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
function PenseBemConsole({game,question,mode,onAnswer,onNext,onRestart,onOpenPage}){
  const attemptNumber=displayAttempt(game);
  const display=displayProgramQuestion(game.program.code,game.index);
  return <View style={styles.penseConsole} testID="pense-console">
    <View style={styles.penseHeading}>
      <Text style={styles.penseLogo}>TECTOY</Text>
      <Text style={styles.penseModel}>PENSE BEM · VIAGEM NO TEMPO</Text>
    </View>
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
      <Text style={styles.penseSectionLabel}>{mode==='book'?'CONSULTE O LIVRO':'PERGUNTA DO QUIZ'}</Text>
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
        style={({pressed})=>[styles.penseKey,{backgroundColor:opt.color,opacity:(used&&!isCorrect) ? 0.48 : pressed ? 0.72 : 1},isCorrect&&styles.penseKeyCorrect]}>
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
  const [mode,setMode]=useState('book');
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
  const theme=THEMES[themeCode]||DEFAULT_THEME;
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
    <StatusBar barStyle="dark-content" backgroundColor={theme.background}/>
    <ScrollView ref={scroll} contentContainerStyle={[styles.container,{maxWidth:970,paddingHorizontal:width>720?35:17}]}>
      <View style={[styles.header,{borderBottomColor:theme.border}]}>
        <Pressable onPress={()=>setEra(null)} accessibilityLabel="Retornar à ambientação padrão">
          <Text style={[styles.brand,ink]}>PENSE BEM<Text style={{color:theme.accent}}> · </Text>DISNEY</Text>
          <Text style={[styles.tiny,muted]}>VIAGEM NO TEMPO · AV2 MOBILE</Text>
        </Pressable>
        <Action title="Épocas e ajuda" onPress={()=>setShowHelp(true)} theme={theme} secondary/>
      </View>
      {announcement?<Text accessibilityLiveRegion="polite" style={[styles.small,muted,{marginTop:10}]}>{announcement}</Text>:null}

      {screen==='home' ? <>
        <View style={[styles.hero,{backgroundColor:theme.soft}]}>
          <Image source={theme.image} resizeMode="contain" style={styles.heroArt} accessibilityLabel="Arte do Mickey em viagem no tempo"/>
          <View style={styles.heroCopy}>
            <Text style={[styles.eyebrow,{color:theme.accent}]}>PENSE BEM · UMA AVENTURA INTERATIVA</Text>
            <Text style={[styles.title,ink]}>Cinco épocas.{ '\n' }150 desafios.</Text>
            <Text style={[styles.body,muted]}>Use as páginas do livro como no brinquedo original, ou escolha o quiz moderno. Em cada questão, você tem três tentativas.</Text>
          </View>
        </View>
        <StatusNote theme={theme} warning>{`Revisão obrigatória: ${PROVISIONAL_COUNT} respostas são hipóteses, não gabarito oficial. Todas as 150 questões são jogáveis; a pontuação continua provisória até a conferência.`}</StatusNote>
        <View style={styles.sectionTop}>
          <Text style={[styles.sectionTitle,ink]}>Escolha seu modo</Text>
          <Action title={mode==='book'?'Ir para o modo quiz':'Ir para o modo livro'} secondary theme={theme} onPress={swapMode}/>
        </View>
        <Text style={[styles.small,muted]}>{mode==='book'?`Modo ${bookModeName} · páginas originais`:'Modo quiz · enunciados e alternativas na tela'}</Text>
        {game&&!game.finished&&<Action title={`Continuar programa ${game.program.code} · pergunta ${game.index+1}`} onPress={()=>{setScreen('play');scrollTop();}} theme={theme}/>}
        <View style={styles.sectionTop}><Text style={[styles.sectionTitle,ink]}>Escolha seu destino</Text><Text style={[styles.small,muted]}>5 programas · 30 questões cada</Text></View>
        <View style={styles.cards}>{PROGRAMS.map((p,i)=><Pressable key={p.code} accessibilityRole="button" accessibilityLabel={`Iniciar programa ${p.code}`} onPress={()=>begin(p)}
          style={({pressed})=>[styles.card,{borderColor:theme.border,width:width>=730?'48%':'100%',opacity:pressed?.72:1}]}>
          <Image source={THEMES[p.code].image} resizeMode="contain" style={styles.cardArt}/>
          <View style={styles.cardCopy}>
            <Text style={[styles.eyebrow,{color:theme.accent}]}>DESTINO 0{i+1} · CÓDIGO {p.code}</Text>
            <Text style={[styles.cardTitle,ink]}>{p.title}</Text>
            <Text style={[styles.small,muted]}>30 perguntas · até 90 pontos →</Text>
          </View>
        </Pressable>)}</View>
        <Text style={[styles.footer,muted]}>Projeto acadêmico baseado em Pense Bem — Disney: Viagem no Tempo (Tectoy / Nova Cultural, 1991). Sem vínculo oficial com os titulares das marcas. Questões adaptadas para estudo.</Text>
      </> : game ? <>
        <View style={[styles.sectionTop,{marginTop:20}]}>
          <Action title="‹ Destinos" theme={theme} secondary onPress={()=>{setScreen('home');scrollTop();}}/>
          <Text style={[styles.eyebrow,{color:theme.accent}]}>PROGRAMA {game.program.code}</Text>
        </View>
        <View style={[styles.miniBanner,{backgroundColor:theme.soft}]}>
          <Image source={THEMES[game.program.code].image} resizeMode="contain" style={styles.bannerArt}/>
          <View style={{flex:1,padding:12}}><Text style={[styles.sectionTitle,ink]}>{game.program.title}</Text><Text style={[styles.small,muted]}>{(THEMES[game.program.code]).name}</Text></View>
        </View>
        {screen==='play' ? <>
          <View style={[styles.sectionTop,{marginBottom:4}]}>
            <Text style={[styles.eyebrow,{color:theme.accent}]}>{mode==='book'?`MODO ${bookModeName.toUpperCase()}`:'MODO QUIZ'}</Text>
            <Action title={mode==='book'?'Trocar para Quiz':'Trocar para Livro'} secondary theme={theme} onPress={swapMode}/>
          </View>
          <View style={[styles.progress,{backgroundColor:theme.border}]}>
            <View style={{height:'100%',backgroundColor:theme.accent,width:`${(game.index+1)/30*100}%`}}/>
          </View>
          <PenseBemConsole game={game} question={question} mode={mode}
            onAnswer={choice=>dispatch({type:'ANSWER',choice})}
            onNext={next} onRestart={()=>{dispatch({type:'START',program:game.program});scrollTop();}} onOpenPage={openPage}/>
          <Text style={[styles.footer,muted,{textAlign:'center'}]}>As teclas seguem as cores do Pense Bem. Os pontos dependem de um gabarito ainda em revisão.</Text>
        </> : <View style={[styles.questionCard,{borderColor:theme.border}]}>
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
    </ScrollView>
    <Modal visible={showHelp} animationType="fade" transparent onRequestClose={()=>setShowHelp(false)}>
      <View style={styles.modalBackdrop}><ScrollView contentContainerStyle={styles.modalScroll}>
        <View style={[styles.dialog,{backgroundColor:theme.surface}]}>
          <Text style={[styles.sectionTitle,ink]}>Manual do viajante</Text>
          <Text style={[styles.body,muted]}>Cada programa tem 30 perguntas. Você tem três tentativas por pergunta: acertar na primeira vale 3 pontos, na segunda vale 2, na terceira vale 1; errar as três vale 0.</Text>
          <Text style={[styles.body,muted]}>Trocar de época e de modo mantém a questão e os pontos. Ao escolher outro destino, começa uma nova partida.</Text>
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
  root:{flex:1},container:{width:'100%',alignSelf:'center',paddingTop:20,paddingBottom:55},
  header:{borderBottomWidth:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8,paddingBottom:12},
  brand:{fontSize:21,fontWeight:'900'},tiny:{fontSize:10,letterSpacing:1.1,marginTop:2},
  action:{borderWidth:1,borderRadius:11,minHeight:43,paddingVertical:10,paddingHorizontal:15,alignItems:'center',justifyContent:'center',marginVertical:5},
  actionText:{fontSize:13,fontWeight:'800',textAlign:'center'},
  hero:{borderRadius:20,overflow:'hidden',marginTop:21},heroArt:{width:'100%',height:270},heroCopy:{padding:24},
  eyebrow:{fontSize:11,fontWeight:'900',letterSpacing:1.2,marginBottom:9},title:{fontSize:34,lineHeight:42,fontWeight:'900',marginBottom:8},
  body:{fontSize:15,lineHeight:23},small:{fontSize:12,lineHeight:19},note:{borderWidth:1,padding:13,borderRadius:11,marginVertical:10},noteText:{fontSize:12,lineHeight:19},
  sectionTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap',marginTop:17,marginBottom:13},
  sectionTitle:{fontSize:20,lineHeight:26,fontWeight:'800'},cards:{flexDirection:'row',flexWrap:'wrap',gap:15,justifyContent:'space-between'},
  card:{borderWidth:1,borderRadius:16,overflow:'hidden',backgroundColor:'#FFFFFF'},cardArt:{width:'100%',height:190},cardCopy:{padding:19},cardTitle:{fontSize:20,fontWeight:'800',marginBottom:8},
  footer:{fontSize:10,lineHeight:17,marginTop:24},miniBanner:{flexDirection:'row',alignItems:'center',borderRadius:14,overflow:'hidden',marginTop:2},bannerArt:{width:130,height:115},
  progress:{height:7,borderRadius:4,overflow:'hidden',marginBottom:9},questionCard:{backgroundColor:'#FFFFFF',borderWidth:1,borderRadius:18,padding:20,marginVertical:10},
  question:{fontSize:23,lineHeight:31,fontWeight:'800',marginBottom:15},link:{fontSize:13,fontWeight:'800',marginVertical:12},
  pageFrame:{borderWidth:1,borderRadius:10,overflow:'hidden',marginVertical:8},pageImage:{width:'100%',height:460},pageHint:{fontSize:12,fontWeight:'700',textAlign:'center',padding:9},
  answerList:{gap:10,marginVertical:13},answer:{minHeight:60,borderWidth:1.5,borderRadius:12,flexDirection:'row',alignItems:'center',gap:12,padding:11},
  colorBadge:{width:40,height:40,borderRadius:8,alignItems:'center',justifyContent:'center'},badgeText:{fontSize:20,fontWeight:'900'},
  answerLabel:{fontSize:15,lineHeight:22,flex:1},resultMark:{fontSize:22,fontWeight:'900'},
  bigScore:{fontSize:64,fontWeight:'900',marginVertical:17},toolbar:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:9,padding:9},
  historyItem:{borderBottomWidth:1,paddingVertical:11,gap:3},modalBackdrop:{flex:1,backgroundColor:'#061D1BCC'},modalScroll:{flexGrow:1,justifyContent:'center',padding:18},
  dialog:{width:'100%',maxWidth:580,alignSelf:'center',borderRadius:19,padding:21,gap:9},zoomRoot:{flex:1,paddingTop:Platform.OS==='ios'?44:20},
  // Console clássico do Pense Bem: cores fixas, independente da época/tema.
  penseConsole:{width:'100%',maxWidth:430,alignSelf:'center',backgroundColor:'#EFEFBD',borderWidth:2,borderColor:'#8D8C65',borderRadius:5,padding:15,marginTop:13,marginBottom:12,
    shadowColor:'#000000',shadowOpacity:.15,shadowRadius:12,elevation:3},
  penseHeading:{alignItems:'center',marginBottom:13},
  penseLogo:{fontSize:34,fontWeight:'900',letterSpacing:-1.8,color:'#F4B309',textShadowColor:'#D94B10',textShadowRadius:1,textShadowOffset:{width:1,height:2}},
  penseModel:{fontSize:9,fontWeight:'800',letterSpacing:1.1,color:'#59562C'},
  penseDisplay:{backgroundColor:'#070707',borderWidth:2,borderColor:'#252525',minHeight:79,alignItems:'center',justifyContent:'center',paddingHorizontal:8,marginBottom:10},
  penseDigits:{fontFamily:Platform.select({ios:'Courier New',android:'monospace',default:'monospace'}),fontSize:31,fontWeight:'800',letterSpacing:1.2,color:'#FF2424',textAlign:'center'},
  penseAttemptDisplay:{backgroundColor:'#070707',minHeight:40,alignItems:'center',justifyContent:'center',padding:7,marginBottom:6},
  penseAttemptText:{fontFamily:Platform.select({ios:'Courier New',android:'monospace',default:'monospace'}),fontSize:17,color:'#FFFFFF',textAlign:'center'},
  penseCounters:{flexDirection:'row',justifyContent:'space-between',marginBottom:10},
  penseCounterText:{fontSize:11,color:'#353526',fontWeight:'800',letterSpacing:.3},
  penseReading:{backgroundColor:'#FFFBEB',borderWidth:1,borderColor:'#C3C09C',padding:13,marginBottom:11},
  penseSectionLabel:{fontSize:10,color:'#746C36',fontWeight:'900',letterSpacing:1,marginBottom:9},
  pensePrompt:{fontSize:16,lineHeight:24,fontWeight:'700',color:'#282822',marginBottom:9},
  penseContext:{fontSize:12,lineHeight:20,color:'#534F40',marginBottom:9},
  penseOption:{fontSize:13,lineHeight:19,color:'#2C2A22',marginVertical:4},
  penseBookButton:{alignItems:'center',padding:2},
  penseBookImage:{width:'100%',height:205},
  penseBookLink:{fontSize:12,fontWeight:'800',color:'#5B4516',textAlign:'center',paddingVertical:6},
  penseSourceLink:{marginTop:7,alignSelf:'flex-start'},
  penseWarning:{fontSize:11,lineHeight:17,backgroundColor:'#FFF0D9',color:'#70521A',padding:8,marginTop:10},
  penseKeyPrompt:{fontSize:11,fontWeight:'900',letterSpacing:1.1,textAlign:'center',color:'#3E402A',marginBottom:7},
  penseKeypad:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:4,columnGap:2,marginBottom:10},
  penseKey:{width:'49.4%',height:91,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'#272727',position:'relative'},
  penseKeyCorrect:{borderColor:'#FFFFFF',borderWidth:4},
  penseKeyLetter:{fontSize:35,fontWeight:'700'},
  penseKeyMarker:{position:'absolute',right:12,top:5,fontSize:19,fontWeight:'900'},
  penseFeedback:{backgroundColor:'#101010',paddingVertical:11,paddingHorizontal:12,marginBottom:9,minHeight:46,justifyContent:'center'},
  penseFeedbackText:{color:'#FFFFFF',fontSize:12,lineHeight:18,textAlign:'center'},
  penseNext:{backgroundColor:'#284E37',borderWidth:1,borderColor:'#102D1C',padding:12,alignItems:'center',marginBottom:8},
  penseNextText:{color:'#FFFFFF',fontSize:14,fontWeight:'800'},
  penseRestart:{backgroundColor:'#C9C9C9',borderWidth:1,borderColor:'#777777',padding:10,alignItems:'center'},
  penseRestartText:{fontSize:13,color:'#181818',fontWeight:'600'},
  portalOverlay:{position:'absolute',left:0,right:0,top:0,bottom:0,zIndex:1000,backgroundColor:'#061F20FA',alignItems:'center',justifyContent:'center',padding:25},
  portalEyebrow:{fontSize:13,letterSpacing:3,color:'#83EEC7',fontWeight:'900',textAlign:'center'},
  portalOuter:{position:'absolute',borderWidth:13,borderColor:'#2CE89B',borderStyle:'dashed',shadowColor:'#69FFC8',shadowOpacity:.55,shadowRadius:30},
  portalMiddle:{position:'absolute',borderWidth:18,borderColor:'#A5F5B9',borderStyle:'dotted'},
  portalInner:{position:'absolute',borderWidth:16,borderColor:'#0B946A',borderStyle:'dashed'},portalCore:{backgroundColor:'#A2FFD7',shadowColor:'#60FFAF',shadowOpacity:1,shadowRadius:35},
  portalTitle:{fontSize:25,lineHeight:34,color:'#FFFFFF',fontWeight:'900',textAlign:'center'},portalSkip:{marginTop:40,padding:16},portalSkipText:{color:'#A3FFE0',fontWeight:'900',fontSize:16},
});
