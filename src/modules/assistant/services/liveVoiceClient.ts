import { GoogleGenAI, type LiveServerMessage, type Session } from '@google/genai';

function base64FromInt16(int16: Int16Array): string {
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function int16FromBase64(b64: string): Int16Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) {
    bytes[i] = bin.charCodeAt(i);
  }
  return new Int16Array(bytes.buffer);
}

export class LiveVoiceSession {
  private session: Session | null = null;
  private audioCtx: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private nextPlayTime = 0;

  async start(params: {
    ephemeralToken: string;
    model: string;
    onTranscript?: (text: string) => void;
    onClose?: () => void;
    onError?: (msg: string) => void;
  }): Promise<void> {
    const ai = new GoogleGenAI({
      apiKey: params.ephemeralToken,
      httpOptions: { apiVersion: 'v1alpha' },
    });

    this.audioCtx = new AudioContext({ sampleRate: 24000 });
    this.nextPlayTime = this.audioCtx.currentTime;

    this.session = await ai.live.connect({
      model: params.model,
      config: { responseModalities: ['AUDIO' as never] },
      callbacks: {
        onopen: () => {
          void this.startMicrophone();
        },
        onmessage: (msg: LiveServerMessage) => {
          const parts = msg.serverContent?.modelTurn?.parts || [];
          for (const part of parts) {
            if (part.inlineData?.data) {
              this.enqueuePcm24k(part.inlineData.data);
            }
            if (part.text && params.onTranscript) {
              params.onTranscript(part.text);
            }
          }
        },
        onerror: () => {
          params.onError?.('Conexão de voz ao vivo interrompida.');
        },
        onclose: () => {
          this.stop();
          params.onClose?.();
        },
      },
    });
  }

  private async startMicrophone(): Promise<void> {
    this.micStream = await navigator.mediaDevices.getUserMedia({
      audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true },
    });
    const micCtx = new AudioContext({ sampleRate: 16000 });
    const source = micCtx.createMediaStreamSource(this.micStream);
    this.processor = micCtx.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (ev) => {
      if (!this.session) return;
      const input = ev.inputBuffer.getChannelData(0);
      const pcm16 = new Int16Array(input.length);
      for (let i = 0; i < input.length; i += 1) {
        const clamped = Math.max(-1, Math.min(1, input[i]));
        pcm16[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
      }
      this.session.sendRealtimeInput({
        audio: {
          data: base64FromInt16(pcm16),
          mimeType: 'audio/pcm;rate=16000',
        },
      });
    };

    source.connect(this.processor);
    this.processor.connect(micCtx.destination);
  }

  private enqueuePcm24k(base64Pcm: string): void {
    if (!this.audioCtx) return;
    const pcm16 = int16FromBase64(base64Pcm);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i += 1) {
      float32[i] = pcm16[i] / 32768;
    }
    const buffer = this.audioCtx.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioCtx.destination);
    const startAt = Math.max(this.audioCtx.currentTime, this.nextPlayTime);
    source.start(startAt);
    this.nextPlayTime = startAt + buffer.duration;
  }

  stop(): void {
    this.processor?.disconnect();
    this.processor = null;
    this.micStream?.getTracks().forEach((t) => t.stop());
    this.micStream = null;
    this.session?.close();
    this.session = null;
    if (this.audioCtx) {
      void this.audioCtx.close().catch(() => undefined);
      this.audioCtx = null;
    }
  }
}
