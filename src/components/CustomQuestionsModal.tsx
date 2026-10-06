import React, { useState } from 'react';
import { TriviaQuestion, Difficulty } from '../types/trivia';
import { 
  Database, 
  Search, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  CheckCircle,
  FileQuestion,
  X
} from 'lucide-react';

interface CustomQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: TriviaQuestion[];
  onAddQuestion: (newQ: Omit<TriviaQuestion, 'id'>) => void;
  onDeleteQuestion: (id: number | string) => void;
}

export const CustomQuestionsModal: React.FC<CustomQuestionsModalProps> = ({
  isOpen,
  onClose,
  questions,
  onAddQuestion,
  onDeleteQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<'bank' | 'create'>('bank');
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');

  // New question form state
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [category, setCategory] = useState('Champions League');
  const [year, setYear] = useState(2024);
  const [context, setContext] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText || !optA || !optB || !optC || !optD || !context) {
      alert('Please fill out all fields.');
      return;
    }

    const options = [optA.trim(), optB.trim(), optC.trim(), optD.trim()];
    const answerIndex = correctAnswer === 'A' ? 0 : correctAnswer === 'B' ? 1 : correctAnswer === 'C' ? 2 : 3;
    const answer = options[answerIndex];

    onAddQuestion({
      question: questionText.trim(),
      options,
      answer,
      difficulty,
      category,
      year: Number(year),
      context: context.trim(),
    });

    setQuestionText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setContext('');
    setSuccessMessage('Custom trivia question successfully added to match pool!');
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'questions.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            let addedCount = 0;
            for (const item of parsed) {
              if (item.question && Array.isArray(item.options) && item.answer) {
                onAddQuestion({
                  question: item.question,
                  options: item.options,
                  answer: item.answer,
                  difficulty: item.difficulty || 'Medium',
                  category: item.category || 'Football',
                  year: item.year || 2024,
                  context: item.context || '',
                });
                addedCount++;
              }
            }
            alert(`Imported ${addedCount} questions successfully!`);
          }
        } catch {
          alert('Invalid JSON file format.');
        }
      };
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase()) ||
                          q.answer.toLowerCase().includes(search.toLowerCase()) ||
                          q.category.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = filterDifficulty === 'All' || q.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-xl font-bold text-slate-100 font-display">Question Bank ({questions.length} Items)</h2>
              <p className="text-xs text-slate-400">Strictly 2020-present modern football trivia.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('bank')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                activeTab === 'bank' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Browse ({questions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                activeTab === 'create' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              + Create Question
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {activeTab === 'bank' ? (
            <div className="space-y-4">
              {/* Search & Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search questions, answers, teams..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none font-medium"
                  >
                    <option value="All">All Tiers</option>
                    <option value="Easy">Easy (100 pts)</option>
                    <option value="Medium">Medium (200 pts)</option>
                    <option value="Hard">Hard (300 pts)</option>
                    <option value="Very Hard">Very Hard (500 pts)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export questions.json</span>
                  </button>

                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import JSON</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-2 mt-4">
                <span className="text-xs text-slate-400 font-mono">
                  Showing {filteredQuestions.length} of {questions.length} questions
                </span>

                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {filteredQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-bold">#{q.id}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-300 font-medium">{q.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{q.year}</span>
                          <span aria-hidden="true">·</span>
                          <span className={`font-semibold ${
                            q.difficulty === 'Easy' ? 'text-emerald-400' :
                            q.difficulty === 'Medium' ? 'text-sky-400' :
                            q.difficulty === 'Hard' ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>

                        {q.isCustom && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-amber-400 font-mono">CUSTOM</span>
                            <button
                              type="button"
                              onClick={() => onDeleteQuestion(q.id)}
                              className="text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="text-sm font-semibold text-slate-100 font-display">
                        {q.question}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`p-1.5 rounded px-2 ${
                              opt === q.answer
                                ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-medium'
                                : 'bg-slate-900 text-slate-400'
                            }`}
                          >
                            <span className="font-mono font-bold mr-1.5 text-slate-500">
                              {['A', 'B', 'C', 'D'][i]}:
                            </span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                        <span className="text-slate-300 font-medium">Fact: </span>{q.context}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Create Custom Question Form */
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {successMessage && (
                <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div>
                <label className="block uppercase font-mono font-semibold text-slate-400 mb-1">
                  Question Text (2020-Present only)
                </label>
                <textarea
                  required
                  rows={2}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. Which player scored the opening goal in the 2024 UEFA Super Cup for Real Madrid against Atalanta?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-mono font-semibold text-slate-400 mb-1">
                    Option A
                  </label>
                  <input
                    required
                    type="text"
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    placeholder="e.g. Federico Valverde"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block uppercase font-mono font-semibold text-slate-400 mb-1">
                    Option B
                  </label>
                  <input
                    required
                    type="text"
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    placeholder="e.g. Kylian Mbappe"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block uppercase font-mono font-semibold text-slate-400 mb-1">
                    Option C
                  </label>
                  <input
                    required
                    type="text"
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                    placeholder="e.g. Vinicius Jr"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block uppercase font-mono font-semibold text-slate-400 mb-1">
                    Option D
                  </label>
                  <input
                    required
                    type="text"
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                    placeholder="e.g. Rodrygo"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block uppercase font-mono font-semibold text-slate-400 mb-1">
                    Correct Option
                  </label>
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-emerald-400 font-bold focus:outline-none"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-mono font-semibold text-slate-400 mb-1">
                    Difficulty Tier
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Easy">Easy (100 Base)</option>
                    <option value="Medium">Medium (200 Base)</option>
                    <option value="Hard">Hard (300 Base)</option>
                    <option value="Very Hard">Very Hard (500 Base)</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-mono font-semibold text-slate-400 mb-1">
                    Category
                  </label>
                  <input
                    required
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase font-mono font-semibold text-slate-400 mb-1">
                    Year (2020+)
                  </label>
                  <input
                    required
                    type="number"
                    min="2020"
                    max="2026"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono font-semibold text-slate-400 mb-1">
                  Context Trivia Notes (Solution explanation for the Host)
                </label>
                <textarea
                  required
                  rows={2}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. Valverde scored in the 59th minute off a Vinicius Jr pass before Mbappe scored on his Madrid debut."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm shadow-md transition-all cursor-pointer"
                >
                  Save Question to Database
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
