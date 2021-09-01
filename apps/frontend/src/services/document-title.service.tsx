/** Service to update the web page title */
export class DocumentTitleService {

  /** Update the web page title
   * @returns {boolean} true if audio has been played
   */
  update(title: string) {
    document.title = title;
  }
}

// Export the service as a singleton
export const documentTitleService = new DocumentTitleService();
