export class UtilService {

  static normalizeText(text: string): string {
    return text?.trim().toUpperCase()
  }

  static isEmpty(value: any): boolean {
    return value === null || value === undefined || value === ''
  }

}
