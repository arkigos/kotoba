export interface PronunciationInput {
  entryId: string;
  reading: string;
  text: string;
  variant?: string;
}
export function pronunciationIdentity(input: PronunciationInput): string;
export function pronunciationKey(input: PronunciationInput, cryptoProvider?: Crypto): Promise<string>;
