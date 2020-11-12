import storyContent from './conversation'

const story = new inkjs.Story(storyContent);
var youSayFn, playerSayFn, showOptionsFn, endingFn;

/**
 * 开始故事
 */
function startStory(youSay, playerSay, showOptions, ending) {
    youSayFn = youSay;
    playerSayFn = playerSay;
    showOptionsFn = showOptions;
    endingFn = ending;
    oneTurn();
}

// 正常显示
function oneTurn() {
    return new Promise(resolve => {
        if (story.canContinue) {
            // 对方说话
            let paragraphText = story.Continue();
            youSayFn(paragraphText).then(resolve);
        } else {
            // 轮到做选择的时候
            if (story.currentChoices.length > 0) {
                showOptionsFn(story.currentChoices);
            } else {
                typeof endingFn == 'function' && endingFn();
            }
        }
    }).then(oneTurn);
}

// 选择某一选项后
function chooseChoice(index) {
    story.ChooseChoiceIndex(index);
    let msg = story.Continue();
    playerSayFn(msg).then(oneTurn);
}

export default {
    startStory,
    chooseChoice
}