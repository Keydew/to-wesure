import storyContent from './conversation'

class Story {
    constructor(youSay, playerSay, showOptions, ending) {
        this.youSayFn = youSay;
        this.playerSayFn = playerSay;
        this.showOptionsFn = showOptions;
        this.endingFn = ending;
        this.story = null;
    }

    startStory() {
        this.story = new inkjs.Story(storyContent);
        this.continueStory();
    }

    continueStory() {
        if (this.story.canContinue) {
            // 对方说话
            let paragraphText = this.story.Continue();
            this.youSayFn(paragraphText);
        } else {
            // 轮到做选择的时候
            if (this.story.currentChoices.length > 0) {
                this.showOptionsFn(this.story.currentChoices);
            } else {
                typeof this.endingFn == 'function' && this.endingFn();
            }
        }
    }

    // 选择某一选项后
    chooseChoice(index) {
        this.story.ChooseChoiceIndex(index);
        let msg = this.story.Continue();
        this.playerSayFn(msg);
    }
}

export default Story;