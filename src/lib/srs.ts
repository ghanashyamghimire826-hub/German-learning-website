/**
 * Spaced Repetition System (SRS) Algorithm
 * Enhanced SM-2 implementation for DeutschMeister vocabulary flashcards.
 * Ratings:
 * 1 = 'Again' (Complete failure, reset interval to 1 day)
 * 2 = 'Hard'  (Struggled, interval * 1.2, ease reduced)
 * 3 = 'Good'  (Remembered correctly with normal effort, standard interval increase)
 * 4 = 'Easy'  (Instant recall, interval * ease * 1.3, ease increased)
 */

export type SRSRating = 'again' | 'hard' | 'good' | 'easy';

export interface SRSState {
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  easeFactor: number;
  intervalDays: number;
  srsStage: number; // 0: New, 1: Learning, 2: Review, 3: Mastered, 4: Permanent
}

export function calculateNextSRSReview(
  currentState: SRSState,
  rating: SRSRating
): { nextState: SRSState; nextReviewDate: string; daysAdded: number } {
  let { reviewCount, correctCount, incorrectCount, easeFactor, intervalDays, srsStage } = currentState;

  reviewCount += 1;
  let days = 1;

  if (rating === 'again') {
    incorrectCount += 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
    intervalDays = 1;
    srsStage = Math.max(0, srsStage - 1);
    days = 1;
  } else if (rating === 'hard') {
    correctCount += 1;
    easeFactor = Math.max(1.3, easeFactor - 0.15);
    intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
    days = intervalDays;
  } else if (rating === 'good') {
    correctCount += 1;
    if (intervalDays === 1) {
      intervalDays = 3;
    } else if (intervalDays === 3) {
      intervalDays = 7;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    srsStage = Math.min(4, srsStage + 1);
    days = intervalDays;
  } else if (rating === 'easy') {
    correctCount += 1;
    easeFactor = Math.min(2.8, easeFactor + 0.15);
    if (intervalDays === 1) {
      intervalDays = 4;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor * 1.3);
    }
    srsStage = Math.min(4, srsStage + 2);
    days = intervalDays;
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + days);

  return {
    nextState: {
      reviewCount,
      correctCount,
      incorrectCount,
      easeFactor: Number(easeFactor.toFixed(2)),
      intervalDays,
      srsStage,
    },
    nextReviewDate: nextDate.toISOString(),
    daysAdded: days,
  };
}
