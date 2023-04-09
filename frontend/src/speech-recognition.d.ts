declare module 'global' {
	interface Window {
		SpeechRecognition: SpeechRecognition;
		webkitSpeechRecognition: SpeechRecognition;
	}

	interface SpeechRecognitionEvent extends Event {
		results: SpeechRecognitionResultList;
	}

	interface SpeechRecognitionResultList {
		length: number;
		item(index: number): SpeechRecognitionResult;
		[index: number]: SpeechRecognitionResult;
	}

	interface SpeechRecognitionResult {
		length: number;
		item(index: number): SpeechRecognitionAlternative;
		[index: number]: SpeechRecognitionAlternative;
		isFinal: boolean;
	}

	interface SpeechRecognitionAlternative {
		transcript: string;
		confidence: number;
	}

	class SpeechRecognition extends EventTarget {
		start(): void;
		stop(): void;
		abort(): void;
		lang: string;
		continuous: boolean;
		interimResults: boolean;
		maxAlternatives: number;
		onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
		onend: ((this: SpeechRecognition, ev: Event) => any) | null;
		onerror: ((this: SpeechRecognition, ev: ErrorEvent) => any) | null;
		onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
	}
}
