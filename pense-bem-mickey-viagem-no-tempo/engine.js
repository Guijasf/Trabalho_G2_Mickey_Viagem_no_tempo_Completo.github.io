// Regras puras: nenhuma dependência de interface, relógio ou rede.
export function initialGame(program) {
  return { program, index: 0, attempts: [], score: 0, resolved: false, finished: false, history: [], message: '' };
}
export function gameReducer(state, action) {
  if (action.type === 'START') return initialGame(action.program);
  if (!state || state.finished) return state;
  // Never reopen a scored question from a pending one: that could award points twice.
  if (action.type === 'PREVIOUS' && state.index > 0 && state.program.questions[state.index].answer == null && state.program.questions[state.index - 1].answer == null) {
    return { ...state, index: state.index - 1, attempts: [], resolved: false, message: '' };
  }
  if (action.type === 'NEXT' && state.program.questions[state.index].answer == null) {
    if (state.index === state.program.questions.length - 1) return { ...state, finished: true };
    return { ...state, index: state.index + 1, attempts: [], resolved: false, message: '' };
  }
  if (action.type === 'ANSWER') {
    const choice = action.choice;
    if (state.program.questions[state.index].answer == null || state.resolved || !['A','B','C','D'].includes(choice) || state.attempts.includes(choice)) return state;
    const attempts = [...state.attempts, choice];
    const question = state.program.questions[state.index];
    const correct = choice === question.answer;
    const resolved = correct || attempts.length === 3;
    const points = correct ? 4 - attempts.length : 0;
    const record = { id: question.id, answer: question.answer, attempts, points, correct };
    return { ...state, attempts, resolved, score: state.score + points,
      history: resolved ? [...state.history, record] : state.history,
      message: correct ? `Você acertou! +${points} ${points === 1 ? 'ponto' : 'pontos'}.` : resolved ? 'Tentativas encerradas. Vamos aprender com essa!' : `Ainda não. Você tem ${3-attempts.length} ${attempts.length === 2 ? 'tentativa' : 'tentativas'}.` };
  }
  if (action.type === 'NEXT' && state.resolved) {
    if (state.index === state.program.questions.length - 1) return { ...state, finished: true };
    return { ...state, index: state.index + 1, attempts: [], resolved: false, message: '' };
  }
  return state;
}
