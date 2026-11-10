import React, { useReducer, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Modal, StatusBar, useWindowDimensions, Platform } from 'react-native';
import { PROGRAMS } from './data';
import { PAGES } from './pages';
import { gameReducer } from './engine';
import { THEMES, DEFAULT_THEME } from './themes';
import { readSecret, emptySecret, SECRET_CODES } from './secret-codes';

const OPTIONS = [
  { key: 'A', name: 'Vermelho', color: '#B6382D' },
  { key: 'B', name: 'Amarelo', color: '#8C650E' },
  { key: 'C', name: 'Azul', color: '#286B9B' },
  { key: 'D', name: 'Verde', color: '#29734E' },
];
const totalPending = PROGRAMS.flatMap(p => p.questions).filter(q => q.answer == null).length;

function Button({ children, onPress, theme, outline, disabled, label }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: !!disabled }} onPress={onPress} disabled={disabled} style={({ pressed }) => [s.button, { backgroundColor: outline ? 'transparent' : theme.accent, borderColor: theme.accent }, (pressed || disabled) && { opacity: .5 }]}><Text style={[s.buttonText, { color: outline ? theme.accent : '#FFF' }]}>{children}</Text></Pressable>;
}

export default function App() {
  const [game, dispatch] = useReducer(gameReducer, null);
  const [screen, setScreen] = useState('home');
  const [mode, setMode] = useState('book');
  const [themeCode, setThemeCode] = useState(null);
  const [help, setHelp] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [announcement, setAnnouncement] = useState('');
  const scroll = useRef(null);
  const secret = useRef(emptySecret());
  const { width } = useWindowDimensions();
  const theme = THEMES[themeCode] || DEFAULT_THEME;
  const question = game?.program.questions[game.index];
  const pending = question?.answer == null;
  const maxScore = game ? game.program.questions.filter(q => q.answer != null).length * 3 : 90;
  const programPending = game ? game.program.questions.filter(q => q.answer == null).length : 0;
  const modeName = (THEMES[themeCode || game?.program.code] || DEFAULT_THEME).mode;
  const ink = { color: theme.ink };
  const muted = { color: theme.muted };
  const top = () => scroll.current?.scrollTo({ y: 0, animated: false });
  const activateTheme = code => { setThemeCode(code); setAnnouncement(code ? `Época desbloqueada: ${THEMES[code].name}` : 'Visual original restaurado'); };
  const start = program => { dispatch({ type: 'START', program }); setScreen('play'); top(); };
  const next = () => { dispatch({ type: 'NEXT' }); top(); };
  const toggleMode = () => { setMode(m => m === 'book' ? 'quiz' : 'book'); setAnnouncement('Modo alterado. Seu progresso foi mantido.'); };
  const openPage = () => { setZoomScale(1); setZoom(true); };

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handle = event => {
      const result = readSecret(secret.current, { key: event.key, repeat: event.repeat, ctrlKey: event.ctrlKey, altKey: event.altKey, metaKey: event.metaKey, editable: !!event.target?.closest?.('input, textarea, [contenteditable="true"]') }, Date.now());
      secret.current = result.state;
      if (result.matched) activateTheme(result.themeCode);
    };
    globalThis.addEventListener('keydown', handle);
    return () => globalThis.removeEventListener('keydown', handle);
  }, []);
  useEffect(() => { if (game?.finished) setScreen('result'); }, [game?.finished]);

  const page = <Pressable accessibilityRole="button" accessibilityLabel="Ampliar página do livro" onPress={openPage} style={[s.page, { borderColor: theme.line }]}><Image source={PAGES[question?.page]} accessibilityLabel={`Página ${question?.printedPage} do livro, questão ${question?.id}`} resizeMode="contain" style={{ width: '100%', aspectRatio: 1 / 1.3 }} /><Text style={[s.small, { color: theme.accent, textAlign: 'center', padding: 10 }]}>TOQUE PARA AMPLIAR ↗</Text></Pressable>;

  return <View style={[s.root, { backgroundColor: theme.background }]}>
    <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
    <ScrollView ref={scroll} contentContainerStyle={[s.container, width > 800 && { paddingHorizontal: 36 }]}>
      <View style={[s.header, { borderColor: theme.line }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Restaurar visual original" onPress={() => activateTheme(null)} onLongPress={() => activateTheme(null)}><Text style={[s.brand, ink]}>PENSE BEM<Text style={{ color: theme.accent }}>.</Text></Text><Text style={[s.small, muted]}>UM LIVRO. CINCO DESTINOS.</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Abrir ajuda e escolher época" onPress={() => setHelp(true)} style={[s.help, { borderColor: theme.line }]}><Text style={[s.small, ink]}>ÉPOCAS & AJUDA ↗</Text></Pressable>
      </View>
      <Text accessibilityLiveRegion="polite" style={[s.announcement, muted]}>{announcement || 'Sua próxima descoberta começa aqui.'}</Text>
      {screen === 'home' ? <>
        <View style={[s.hero, { backgroundColor: theme.soft }]}>
          <Image source={theme.image} resizeMode="contain" accessibilityLabel={`Ilustração de aventura: ${theme.name}`} style={s.heroImage} />
          <View style={s.heroCopy}><Text style={[s.eyebrow, { color: theme.accent }]}>EXPEDIÇÃO  •  {themeCode ? theme.name.toUpperCase() : 'DISNEY: VIAGEM NO TEMPO'}</Text><Text accessibilityRole="header" style={[s.title, ink]}>O passado está{ '\n' }cheio de perguntas.</Text><Text style={[s.lead, muted]}>Abra o livro ou entre no quiz. Viaje por cinco mundos, uma descoberta de cada vez.</Text></View>
        </View>
        <View style={s.modeBar}><View style={{ flex: 1, minWidth: 180 }}><Text style={[s.label, ink]}>Sua forma de explorar</Text><Text style={[s.small, muted]}>{mode === 'book' ? `Modo ${modeName} · livro` : 'Modo quiz · perguntas na tela'}</Text></View><Button theme={theme} outline onPress={toggleMode} label="Trocar modo de jogo">{mode === 'book' ? 'Modo quiz →' : `← Modo ${modeName}`}</Button></View>
        {game && !game.finished && <Button theme={theme} onPress={() => { setScreen('play'); top(); }}>Continuar programa {game.program.code} · questão {game.index + 1}</Button>}
        <View style={s.section}><Text accessibilityRole="header" style={[s.subtitle, ink]}>Escolha seu destino</Text><Text style={[s.small, muted]}>5 PROGRAMAS · 150 QUESTÕES</Text></View>
        <View style={s.grid}>{PROGRAMS.map((program, index) => <Pressable key={program.code} accessibilityRole="button" accessibilityLabel={`Abrir programa ${program.code}: ${program.title}`} onPress={() => start(program)} onLongPress={() => activateTheme(program.code)} style={({ pressed }) => [s.program, { width: width >= 700 ? '48.5%' : '100%', borderColor: theme.line, opacity: pressed ? .75 : 1 }]}>
          <Image source={THEMES[program.code].image} resizeMode="contain" style={s.programImage} accessibilityLabel={THEMES[program.code].name} />
          <View style={s.programBody}><Text style={[s.eyebrow, { color: theme.accent }]}>DESTINO 0{index + 1}  /  {program.code}</Text><Text style={[s.programTitle, ink]}>{program.title}</Text><View style={s.row}><Text style={[s.small, muted]}>30 questões · começar viagem</Text><Text style={{ fontSize: 24, color: theme.accent }}>↗</Text></View></View>
        </Pressable>)}</View>
        <View style={[s.notice, { backgroundColor: theme.soft }]}><Text style={[s.label, ink]}>Edição em revisão</Text><Text style={[s.body, muted]}>As perguntas foram adaptadas das páginas do livro. {150 - totalPending} respostas foram interpretadas; {totalPending} aguardam confirmação. Este ainda não é o gabarito oficial.</Text></View>
        <Text style={[s.footer, muted]}>Material acadêmico baseado em Pense Bem — Disney: Viagem no Tempo. O livro contém formulações e informações de sua época. Imagens de ambientação fornecidas pelo usuário; não são fontes históricas. Sem vínculo oficial com Disney ou Tectoy.</Text>
      </> : game && <>
        <View style={s.row}><Button theme={theme} outline onPress={() => { setScreen('home'); top(); }}>‹ Destinos</Button><Text style={[s.small, muted]}>PROGRAMA {game.program.code}</Text></View>
        <View style={[s.eraStrip, { backgroundColor: theme.soft }]}><Image source={themeCode ? theme.image : THEMES[game.program.code].image} resizeMode="contain" style={s.stripImage} /><View style={s.stripCopy}><Text style={[s.eyebrow, { color: theme.accent }]}>{themeCode ? theme.name.toUpperCase() : 'SUA EXPEDIÇÃO'}</Text><Text style={[s.subtitle, ink]}>{game.program.title}</Text></View></View>
        {screen === 'play' ? <>
          <View style={s.modeBar}><Text style={[s.label, ink]}>{mode === 'book' ? `Modo ${modeName} · livro` : 'Modo quiz'}</Text><Button theme={theme} outline onPress={toggleMode} label="Trocar modo de jogo">{mode === 'book' ? 'Modo quiz →' : `← Modo ${modeName}`}</Button></View>
          <View style={s.row}><Text style={[s.small, muted]}>QUESTÃO {game.index + 1} DE {game.program.questions.length}</Text><Text testID="score" style={[s.label, ink]}>{game.score} / {maxScore} pontos</Text></View>
          <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: game.program.questions.length, now: game.index + 1 }} style={[s.track, { backgroundColor: theme.line }]}><View style={{ height: 5, backgroundColor: theme.accent, width: `${(game.index + 1) / game.program.questions.length * 100}%` }} /></View>
          <View style={[s.quizCard, { borderColor: theme.line }]}>
            <Text style={[s.eyebrow, { color: theme.accent }]}>{question.topic.toUpperCase()} · Nº {question.id}</Text>
            {mode === 'quiz' ? <><Text accessibilityRole="header" style={[s.question, ink]}>{question.prompt}</Text>{question.context && <View style={[s.context, { backgroundColor: theme.soft }]}><Text style={[s.body, ink]}>{question.context}</Text></View>}{question.visual && page}<Pressable accessibilityRole="button" accessibilityLabel="Consultar página original" onPress={openPage}><Text style={[s.sourceLink, { color: theme.accent }]}>Consultar página {question.printedPage} do livro ↗</Text></Pressable></> : <><Text accessibilityRole="header" style={[s.question, ink]}>Encontre a questão {question.id}</Text>{page}</>}
            {pending && <View style={[s.notice, { backgroundColor: theme.soft }]}><Text style={[s.label, ink]}>Resposta em revisão</Text><Text style={[s.body, muted]}>Esta questão não conta pontos. Você pode consultar o livro e seguir para a próxima.</Text></View>}
            <View style={s.answers}>{OPTIONS.map((option, i) => {
              const used = game.attempts.includes(option.key);
              const right = game.resolved && question.answer === option.key;
              const wrong = used && !right;
              return <Pressable key={option.key} accessibilityRole="button" accessibilityLabel={`${option.key}: ${mode === 'quiz' ? question.options[i] : option.name}`} accessibilityState={{ disabled: pending || game.resolved || used }} disabled={pending || game.resolved || used} onPress={() => dispatch({ type: 'ANSWER', choice: option.key })} style={({ pressed }) => [s.answer, { borderColor: right ? '#26734D' : wrong ? '#B6382D' : theme.line, backgroundColor: right ? '#E7F3E9' : wrong ? '#FCEEEA' : '#FFF', opacity: pending ? .6 : pressed ? .7 : 1 }]}>
                <View style={[s.badge, { backgroundColor: option.color }]}><Text style={s.badgeText}>{option.key}</Text></View><Text style={[s.optionText, ink]}>{mode === 'quiz' ? question.options[i] : option.name}</Text><Text style={{ color: right ? '#26734D' : '#B6382D', fontSize: 20 }}>{right ? '✓' : wrong ? '×' : ''}</Text>
              </Pressable>;
            })}</View>
            {!pending && <Text style={[s.small, muted]}>{game.resolved ? 'Questão concluída' : `${3 - game.attempts.length} tentativas restantes · até ${3 - game.attempts.length} pontos`}</Text>}
            {!!game.message && <View style={[s.feedback, { backgroundColor: theme.soft }]}><Text accessibilityLiveRegion="polite" style={[s.body, ink]}>{game.message}{game.resolved ? ` Resposta interpretada: ${question.answer} — ${question.options[OPTIONS.findIndex(o => o.key === question.answer)]}.` : ''}</Text></View>}
            <View style={s.navigation}>{pending && game.index > 0 && game.program.questions[game.index - 1].answer == null && <Button theme={theme} outline onPress={() => { dispatch({ type: 'PREVIOUS' }); top(); }}>← Anterior</Button>}{(pending || game.resolved) && <Button theme={theme} onPress={next}>{game.index === game.program.questions.length - 1 ? 'Ver resultado →' : pending ? 'Continuar sem pontuar →' : 'Próxima questão →'}</Button>}</View>
          </View>
          <Text style={[s.footer, muted]}>Trocar o modo ou a época mantém seus pontos e tentativas. Respostas interpretadas, sujeitas à conferência com o gabarito do livro.</Text>
        </> : <View style={[s.quizCard, { borderColor: theme.line }]}>
          <Text style={[s.eyebrow, { color: theme.accent }]}>EXPEDIÇÃO CONCLUÍDA</Text><Text accessibilityRole="header" style={[s.title, ink]}>Mais uma época{ '\n' }descoberta.</Text>
          <Text style={[s.score, ink]}>{game.score}<Text style={[s.lead, muted]}> / {maxScore} pontos</Text></Text><Text style={[s.lead, muted]}>{game.history.filter(h => h.correct).length} acertos em {game.history.length} questões corrigidas.</Text>
          {programPending > 0 && <Text style={[s.body, muted]}>{programPending} questões sem correção foram excluídas do total possível. O programa completo vale 90 pontos após a revisão.</Text>}
          <Text style={[s.small, muted]}>RESULTADO PROVISÓRIO · GABARITO INTERPRETADO</Text>
          <View style={s.navigation}><Button theme={theme} onPress={() => start(game.program)}>Recomeçar programa</Button><Button theme={theme} outline onPress={() => { setScreen('home'); top(); }}>Escolher outro destino</Button></View>
          <Text style={[s.subtitle, ink, { marginTop: 24 }]}>Seu diário de respostas</Text>{game.program.questions.map(q => { const entry = game.history.find(h => h.id === q.id); return <View key={q.id} style={[s.review, { borderColor: theme.line }]}><Text style={[s.label, ink]}>Questão {q.id} · {entry ? `+${entry.points} pontos` : 'Em revisão'}</Text><Text style={[s.body, muted]}>{q.prompt}</Text>{entry && <Text style={[s.small, muted]}>Tentativas: {entry.attempts.join(', ')} · Resposta: {entry.answer} — {q.options[OPTIONS.findIndex(o => o.key === entry.answer)]}</Text>}</View>; })}
        </View>}
      </>}
    </ScrollView>
    <Modal visible={help} animationType="fade" transparent onRequestClose={() => setHelp(false)}><View style={s.overlay}><ScrollView contentContainerStyle={s.modalScroll}><View style={[s.dialog, { backgroundColor: theme.background }]}><Text accessibilityRole="header" style={[s.subtitle, ink]}>Escolha sua época</Text><Text style={[s.body, muted]}>No computador, pressione Shift e digite um código. No celular, escolha abaixo ou segure um destino. Os temas mudam a ambientação, sem alterar a partida.</Text>{Object.entries(SECRET_CODES).map(([code, value]) => <Button key={code} theme={theme} outline onPress={() => { activateTheme(value); setHelp(false); }}>{value ? THEMES[value].name : 'Visual original'} · {code}</Button>)}<Text style={[s.body, muted, { marginTop: 18 }]}>No quiz, leia a pergunta e toque na alternativa. No modo livro, encontre o número na página original. Acertos valem 3, 2 ou 1 ponto conforme a tentativa. Três erros encerram a questão.</Text><Button theme={theme} onPress={() => setHelp(false)}>Fechar ajuda</Button></View></ScrollView></View></Modal>
    <Modal visible={zoom} animationType="slide" onRequestClose={() => setZoom(false)}><View style={[s.root, { backgroundColor: theme.background, paddingTop: 36 }]}><View style={[s.row, { padding: 16, flexWrap: 'wrap' }]}><Text style={[s.label, ink]}>Página {question?.printedPage} · questão {question?.id}</Text><Button theme={theme} onPress={() => setZoom(false)}>Fechar página</Button></View><View style={[s.row, { paddingHorizontal: 16 }]}><Button theme={theme} outline disabled={zoomScale === 1} onPress={() => setZoomScale(v => Math.max(1, v - .5))} label="Diminuir ampliação">−</Button><Text style={ink}>{zoomScale * 100}%</Text><Button theme={theme} outline disabled={zoomScale === 3} onPress={() => setZoomScale(v => Math.min(3, v + .5))} label="Aumentar ampliação">+</Button></View><ScrollView><ScrollView horizontal>{question && <Image source={PAGES[question.page]} resizeMode="contain" style={{ width: width * zoomScale, height: width * zoomScale * 1.3 }} />}</ScrollView></ScrollView></View></Modal>
  </View>;
}
const s = StyleSheet.create({
  root: { flex: 1 }, container: { width: '100%', maxWidth: 1060, alignSelf: 'center', paddingHorizontal: 18, paddingTop: 36, paddingBottom: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', borderBottomWidth: 1, paddingBottom: 16 },
  brand: { fontSize: 25, fontWeight: '900', letterSpacing: -1 }, small: { fontSize: 11, lineHeight: 18, letterSpacing: .4 }, help: { borderWidth: 1, borderRadius: 30, padding: 12 }, announcement: { fontSize: 12, lineHeight: 18, marginVertical: 14 },
  hero: { borderRadius: 20, overflow: 'hidden' }, heroImage: { width: '100%', height: 300 }, heroCopy: { padding: 25 }, eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.6, marginBottom: 10 }, title: { fontSize: 36, lineHeight: 42, fontWeight: '800', letterSpacing: -1, marginBottom: 14 }, lead: { fontSize: 16, lineHeight: 25 },
  modeBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginVertical: 22 }, label: { fontSize: 14, fontWeight: '700', lineHeight: 22 }, button: { borderWidth: 1, borderRadius: 12, minHeight: 46, paddingVertical: 12, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', marginVertical: 4 }, buttonText: { fontSize: 13, fontWeight: '700', textAlign: 'center' }, section: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14, marginBottom: 18 }, subtitle: { fontSize: 23, lineHeight: 29, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 18 }, program: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', backgroundColor: '#FFFEFA' }, programImage: { width: '100%', height: 210 }, programBody: { padding: 20 }, programTitle: { fontSize: 22, fontWeight: '700', marginBottom: 12 }, row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }, notice: { padding: 18, borderRadius: 12, marginVertical: 18 }, body: { fontSize: 14, lineHeight: 23 }, footer: { fontSize: 11, lineHeight: 19, marginTop: 20 },
  eraStrip: { borderRadius: 15, overflow: 'hidden', marginTop: 18 }, stripImage: { width: '100%', height: 240 }, stripCopy: { padding: 18 }, track: { height: 5, borderRadius: 4, overflow: 'hidden', marginTop: 12, marginBottom: 22 }, quizCard: { backgroundColor: '#FFFEFA', borderRadius: 20, borderWidth: 1, padding: 22 }, question: { fontSize: 25, lineHeight: 34, fontWeight: '700', marginBottom: 18 }, context: { padding: 16, borderRadius: 10, marginBottom: 16 }, sourceLink: { fontSize: 12, fontWeight: '600', paddingVertical: 12 }, page: { borderWidth: 1, borderRadius: 10, overflow: 'hidden', backgroundColor: '#FFF' }, answers: { gap: 10, marginVertical: 18 }, answer: { minHeight: 62, borderRadius: 12, borderWidth: 1.5, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }, badge: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }, badgeText: { color: '#FFF', fontSize: 14, fontWeight: '800' }, optionText: { flex: 1, fontSize: 15, lineHeight: 23, fontWeight: '500' }, feedback: { padding: 16, borderRadius: 10, marginTop: 16 }, navigation: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 12, marginTop: 18 }, score: { fontSize: 64, fontWeight: '800', marginVertical: 14 }, review: { paddingVertical: 18, borderBottomWidth: 1, gap: 6 },
  overlay: { flex: 1, backgroundColor: '#112820BB' }, modalScroll: { flexGrow: 1, justifyContent: 'center', padding: 20 }, dialog: { width: '100%', maxWidth: 560, alignSelf: 'center', borderRadius: 22, padding: 24, gap: 8 },
});
