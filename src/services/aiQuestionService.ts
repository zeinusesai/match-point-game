import { TriviaQuestion, Difficulty } from '../types/trivia';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';

const STORAGE_PLAYED_HASHES = 'matchpoint_played_question_hashes';
const MAX_PLAYED_MEMORY = 100;

export interface AiGenerationOptions {
  count?: number;
  selectedDifficulties?: Difficulty[];
  selectedCategories?: string[];
  eraFocus?: 'all' | '2020_2022' | '2023_present';
  difficultyCurve?: 'progressive' | 'custom' | 'mixed';
  offlineOnly?: boolean;
}

class AiQuestionService {
  private playedHashes: string[] = [];
  private prefetchBuffer: TriviaQuestion[] = [];
  private isPrefetching = false;

  constructor() {
    this.loadPlayedHashes();
  }

  private loadPlayedHashes(): void {
    try {
      const stored = localStorage.getItem(STORAGE_PLAYED_HASHES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.playedHashes = parsed.slice(-MAX_PLAYED_MEMORY);
        }
      }
    } catch {
      this.playedHashes = [];
    }
  }

  private savePlayedHashes(): void {
    try {
      localStorage.setItem(STORAGE_PLAYED_HASHES, JSON.stringify(this.playedHashes.slice(-MAX_PLAYED_MEMORY)));
    } catch {}
  }

  /**
   * Generates a normalized signature/hash for deduplication
   */
  public generateHash(q: { question: string; answer?: string; year?: number }): string {
    const raw = `${q.question || ''}_${q.answer || ''}_${q.year || ''}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    return raw.slice(0, 48);
  }

  /**
   * Checks if question was played recently
   */
  public isQuestionPlayed(q: TriviaQuestion): boolean {
    const hash = this.generateHash(q);
    return this.playedHashes.includes(hash);
  }

  /**
   * Records a question as played (memorizing up to 100 recent questions)
   */
  public markQuestionPlayed(q: TriviaQuestion): void {
    const hash = this.generateHash(q);
    if (!this.playedHashes.includes(hash)) {
      this.playedHashes.push(hash);
      if (this.playedHashes.length > MAX_PLAYED_MEMORY) {
        this.playedHashes.shift();
      }
      this.savePlayedHashes();
    }
  }

  /**
   * Returns list of recent topics / players to exclude in prompt
   */
  public getExcludedTopicsSummary(): string[] {
    const recent = this.playedHashes.slice(-15);
    return recent.map(h => h.slice(0, 20));
  }

  /**
   * Clears the played questions memory
   */
  public clearPlayedMemory(): void {
    this.playedHashes = [];
    this.savePlayedHashes();
  }

  public getPlayedCount(): number {
    return this.playedHashes.length;
  }

  /**
   * Instant Zero-Latency Fallback Engine:
   * Selects non-repetitive curated questions from default database (200+ questions)
   */
  public getCuratedFallback(options: AiGenerationOptions, count: number): TriviaQuestion[] {
    const diffs = options.selectedDifficulties || ['Easy', 'Medium', 'Hard', 'Very Hard'];
    const cats = options.selectedCategories || [];
    const era = options.eraFocus || 'all';

    let pool = DEFAULT_QUESTIONS.filter(q => {
      const diffMatch = diffs.length === 0 || diffs.includes(q.difficulty);
      const catMatch = cats.length === 0 || cats.includes(q.category);
      let eraMatch = true;
      if (era === '2020_2022') {
        eraMatch = q.year >= 2020 && q.year <= 2022;
      } else if (era === '2023_present') {
        eraMatch = q.year >= 2023;
      }
      return diffMatch && catMatch && eraMatch;
    });

    if (pool.length === 0) {
      pool = [...DEFAULT_QUESTIONS];
    }

    // Sort to prioritize questions not recently played in deduplication memory
    const unplayed = pool.filter(q => !this.isQuestionPlayed(q));
    const selectionSource = unplayed.length >= count ? unplayed : pool;

    // Shuffle
    const shuffled = [...selectionSource].sort(() => Math.random() - 0.5);

    // Apply difficulty curve if progressive
    if (options.difficultyCurve === 'progressive') {
      const easy = shuffled.filter(q => q.difficulty === 'Easy');
      const med = shuffled.filter(q => q.difficulty === 'Medium');
      const hard = shuffled.filter(q => q.difficulty === 'Hard');
      const veryHard = shuffled.filter(q => q.difficulty === 'Very Hard');

      const sortedByCurve: TriviaQuestion[] = [];
      const total = count;
      const q1 = Math.ceil(total * 0.3);
      const q2 = Math.ceil(total * 0.3);
      const q3 = Math.ceil(total * 0.25);

      sortedByCurve.push(...easy.slice(0, q1));
      sortedByCurve.push(...med.slice(0, q2));
      sortedByCurve.push(...hard.slice(0, q3));
      sortedByCurve.push(...veryHard.slice(0, total - sortedByCurve.length));

      // Fill remaining if needed
      for (const item of shuffled) {
        if (sortedByCurve.length >= total) break;
        if (!sortedByCurve.some(x => x.id === item.id)) {
          sortedByCurve.push(item);
        }
      }
      return sortedByCurve.slice(0, total);
    }

    return shuffled.slice(0, count);
  }

  /**
   * Primary Hybrid Generation Engine:
   * Generates questions via Gemini API with automatic instant fallback
   */
  public async fetchQuestionBatch(options: AiGenerationOptions): Promise<{
    questions: TriviaQuestion[];
    isAiGenerated: boolean;
    source: 'ai_live' | 'curated_database';
  }> {
    const targetCount = options.count || 10;

    // If explicit offline requested or browser is offline, return immediately from database
    if (options.offlineOnly || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      const fallback = this.getCuratedFallback(options, targetCount);
      return {
        questions: fallback,
        isAiGenerated: false,
        source: 'curated_database',
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const response = await fetch('/api/questions/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          count: targetCount,
          selectedDifficulties: options.selectedDifficulties,
          selectedCategories: options.selectedCategories,
          eraFocus: options.eraFocus,
          difficultyCurve: options.difficultyCurve,
          excludedTopics: this.getExcludedTopicsSummary(),
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        const validated: TriviaQuestion[] = data.questions.map((q: any, idx: number) => ({
          id: q.id || `ai_${Date.now()}_${idx}`,
          question: q.question,
          options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['A', 'B', 'C', 'D'],
          answer: q.answer,
          difficulty: q.difficulty || 'Medium',
          category: q.category || 'Modern Football',
          year: typeof q.year === 'number' && q.year >= 2020 ? q.year : 2023,
          context: q.context || 'Verified 2020-present football event.',
          isAiGenerated: true,
        }));

        // If returned fewer than requested, backfill from curated
        if (validated.length < targetCount) {
          const needed = targetCount - validated.length;
          const backfill = this.getCuratedFallback(options, needed);
          return {
            questions: [...validated, ...backfill],
            isAiGenerated: true,
            source: 'ai_live',
          };
        }

        return {
          questions: validated,
          isAiGenerated: true,
          source: 'ai_live',
        };
      } else {
        throw new Error('No valid questions received from AI endpoint');
      }
    } catch (err) {
      console.warn('AI question generation fallback engaged:', err);
      const fallback = this.getCuratedFallback(options, targetCount);
      return {
        questions: fallback,
        isAiGenerated: false,
        source: 'curated_database',
      };
    }
  }

  /**
   * Pre-fetches next AI question buffer in background
   */
  public async prefetchQuestions(options: AiGenerationOptions): Promise<void> {
    if (this.isPrefetching || this.prefetchBuffer.length >= 5) return;
    this.isPrefetching = true;
    try {
      const res = await this.fetchQuestionBatch({ ...options, count: 5 });
      this.prefetchBuffer.push(...res.questions);
    } catch {
      // Ignore background prefetch errors
    } finally {
      this.isPrefetching = false;
    }
  }

  /**
   * Consume a pre-fetched AI question if available
   */
  public popPrefetchedQuestion(): TriviaQuestion | null {
    return this.prefetchBuffer.shift() || null;
  }
}

export const aiQuestionService = new AiQuestionService();
