import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, Trophy } from "lucide-react";

export default function Quiz({ questions = [] }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = useMemo(() => questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0), [questions, answers]);

  if (!questions.length) return <p className="muted">No quiz questions available.</p>;

  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <section className="quiz-section">
      <div className="quiz-topline"><div><span className="eyebrow">KNOWLEDGE CHECK</span><h2>Test what you learned</h2></div><span className="question-count">{questions.length} questions</span></div>
      {submitted && <div className="score-banner"><Trophy size={23} /><div><strong>You scored {score} / {questions.length}</strong><p>{score === questions.length ? "Perfect score — excellent work!" : score >= Math.ceil(questions.length * 0.6) ? "Good work. Review any explanations below to strengthen your understanding." : "Keep practicing. Review the notes and try again."}</p></div></div>}
      {questions.map((question, index) => (
        <div className="question-card" key={`${question.question}-${index}`}>
          <p className="question-title"><span>{String(index + 1).padStart(2, "0")}</span>{question.question}</p>
          <div className="options-list">
            {(question.options || []).map((option, optionIndex) => {
              const chosen = answers[index] === optionIndex;
              const correct = submitted && question.answer === optionIndex;
              const wrong = submitted && chosen && question.answer !== optionIndex;
              return <button type="button" key={option} disabled={submitted} onClick={() => setAnswers((old) => ({ ...old, [index]: optionIndex }))} className={`option-button${chosen ? " chosen" : ""}${correct ? " correct" : ""}${wrong ? " wrong" : ""}`}><span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span>{correct && <CheckCircle2 size={17} />}</button>;
            })}
          </div>
          {submitted && question.explanation && <p className="explanation"><strong>Why:</strong> {question.explanation}</p>}
        </div>
      ))}
      {!submitted ? <button className="primary-button" onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length !== questions.length}>Submit answers <CheckCircle2 size={17} /></button> : <button className="secondary-button" onClick={reset}><RotateCcw size={16} /> Try again</button>}
      {!submitted && <p className="muted tiny-text">Answer every question to submit your quiz.</p>}
    </section>
  );
}
