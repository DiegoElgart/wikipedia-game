export class GameStatus {
    id: string;
    gameType: string
    status: string
    initialArticle: string
    finalArticle: string
    currentArticle: string
    numberOfClicks: number
    playingTime: string

    constructor(id: string, gameType: string, status: string, initialArticle: string, finalArticle: string, currentArticle: string, numberOfClicks: number, playingTime: string) {
        this.id = id;
        this.gameType = gameType;
        this.status = status;
        this.initialArticle = initialArticle;
        this.finalArticle = finalArticle;
        this.currentArticle = currentArticle;
        this.numberOfClicks = numberOfClicks;
        this.playingTime = playingTime;
    }
}