// Register audio files and player

export type audios = 'alert' | 'notification';

export class AudioService {
  public static readonly catalog: { [key in audios]: string } = {
    alert: '/assets/sounds/alert.mp3',
    notification: '/assets/sounds/notification.mp3'
  };

  /** Play an audio file
   * @returns {boolean} true if audio has been played
   */
  play(audioName: audios): boolean {
    if (!(audioName in AudioService.catalog)) {
      return false;
    }
    const file = AudioService.catalog[audioName];
    new Audio(file).play();
    return true;
  }
}

// Export the service as a singleton
export const audioService = new AudioService();
