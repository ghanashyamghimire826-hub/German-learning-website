/**
 * Native Web Speech Synthesis German Audio Utility
 * Provides crisp, natural German pronunciation for words, sentences, and quiz options.
 */

class GermanAudioPlayer {
  private synth: SpeechSynthesis | null = null;
  private germanVoice: SpeechSynthesisVoice | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize high quality de-DE native voices (e.g. Google Deutsch, Anna, Markus, etc.)
    const deVoice =
      voices.find((v) => v.lang.startsWith('de') && (v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Natural'))) ||
      voices.find((v) => v.lang.startsWith('de')) ||
      null;
    this.germanVoice = deVoice;
  }

  public speak(text: string, rate: number = 0.9): void {
    if (this.isMuted || !this.synth || !text.trim()) return;

    try {
      this.synth.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      if (this.germanVoice) {
        utterance.voice = this.germanVoice;
      }
      utterance.rate = rate; // slightly slower for optimal learner comprehension
      utterance.pitch = 1.0;
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis not available or blocked in this environment', e);
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) this.stop();
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const germanAudio = new GermanAudioPlayer();
