import storyContent from './conversation'

const story = new inkjs.Story(storyContent);
var youSayFn, playerSayFn, showOptionsFn, endingFn;

/**
 * 开始故事
 * @param {Function} youSay 左侧说话的回调方法
 * @param {Function} playerSay 右侧说话的回调方法 
 * @param {Function} showOptions 轮到玩家选择时的回调方法
 * @param {Function} ending 故事结束的回调
 */
function startStory(youSay, playerSay, showOptions, ending) {
    youSayFn = youSay;
    playerSayFn = playerSay;
    showOptionsFn = showOptions;
    endingFn = ending;
    continueStory();
}

// 单次调用一次continue对话
function continueStory() {
    if (story.canContinue) {
        // 对方说话
        let paragraphText = story.Continue();
        youSayFn(paragraphText);
    } else {
        // 轮到做选择的时候
        if (story.currentChoices.length > 0) {
            showOptionsFn(story.currentChoices);
        } else {
            typeof endingFn == 'function' && endingFn();
        }
    }
}

// 选择某一选项后
function chooseChoice(index) {
    story.ChooseChoiceIndex(index);
    let msg = story.Continue();
    playerSayFn(msg);
}

export default {
    startStory,
    continueStory,
    chooseChoice
}