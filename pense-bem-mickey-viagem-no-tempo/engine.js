// Núcleo puro: independente de React Native. Máximo por programa: 90 pontos.
export const LETTERS = Object.freeze(['A','B','C','D']);
export const MAX_ATTEMPTS = 3;
export const POINTS = Object.freeze({1:3, 2:2, 3:1});

// Formato do visor conforme a referência do professor: "151 → 01:".
export function displayProgramQuestion(programCode,index) {
  if (!/^\d{3}$/.test(String(programCode))) throw new Error('Código do programa inválido.');
  if (!Number.isInteger(index) || index < 0 || index >= 30) throw new Error('Índice da pergunta inválido.');
  return `${programCode} → ${String(index + 1).padStart(2,'0')}:`;
}

export function displayAttempt(game) {
  if (!game || !Array.isArray(game.attempts)) throw new Error('Jogo não iniciado.');
  return game.resolved ? Math.max(1,game.attempts.length) : Math.min(3,game.attempts.length + 1);
}

export function initialGame(program) {
  if (!program || !Array.isArray(program.questions) || program.questions.length !== 30) {
    throw new Error('Cada programa precisa ter exatamente 30 perguntas.');
  }
  return {
    program, index:0, attempts:[], score:0, provisionalScore:0,
    resolved:false, finished:false, history:[], feedback:'',
  };
}

export function gameReducer(state, action) {
  if (action.type === 'START') return initialGame(action.program);
  if (!state || state.finished) return state;

  if (action.type === 'ANSWER') {
    const question = state.program.questions[state.index];
    if (state.resolved || !LETTERS.includes(action.choice) || state.attempts.includes(action.choice)) return state;
    if (!LETTERS.includes(question.answer)) return state;
    const attempts = [...state.attempts, action.choice];
    const correct = action.choice === question.answer;
    const resolved = correct || attempts.length === MAX_ATTEMPTS;
    const points = correct ? POINTS[attempts.length] : 0;
    const isProvisional = question.answerStatus === 'provisional';
    const entry = resolved ? {
      id:question.id,answer:question.answer,attempts,correct,points,
      answerStatus:question.answerStatus,
    } : null;
    return {
      ...state, attempts, resolved,
      score: state.score + points,
      provisionalScore:state.provisionalScore + (isProvisional ? points : 0),
      history:entry ? [...state.history,entry] : state.history,
      feedback:correct ? `Resposta registrada! +${points} ${points===1?'ponto':'pontos'}.`
        : resolved ? 'Três tentativas utilizadas. Nenhum ponto nesta pergunta.'
        : `Não foi essa. Restam ${MAX_ATTEMPTS - attempts.length} tentativas.`,
    };
  }

  if (action.type === 'NEXT' && state.resolved) {
    if (state.index === state.program.questions.length-1) return {...state,finished:true};
    return {...state,index:state.index+1,attempts:[],resolved:false,feedback:''};
  }
  return state;
}

export function scoreSummary(game) {
  if (!game) return null;
  return {
    score:game.score,
    maxScore: game.program.questions.length*3,
    confirmedByOriginal:0, // Nunca declarar gabarito oficial sem a fonte original.
    provisionalPoints:game.provisionalScore,
    correct:game.history.filter(h=>h.correct).length,
    answered:game.history.length,
    reviewed:game.program.questions.filter(q=>q.answerStatus==='provisional').length,
  };
}
