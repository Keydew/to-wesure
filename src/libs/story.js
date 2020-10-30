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

function oneTurn() {
    return new Promise(resolve => {
        if (story.canContinue) {
            // Get ink to generate the next paragraph
            let paragraphText = story.Continue();
            let tags = story.currentTags;

            if (tags.indexOf('player') > -1) {
                playerSayFn(paragraphText).then(resolve);
            } else {
                youSayFn(paragraphText).then(resolve);
            }
        } else {
            if (story.currentChoices.length > 0) {
                showOptionsFn(story.currentChoices);
            } else {
                typeof endingFn == 'function' && endingFn();
            }
        }
    }).then(oneTurn);
}

function chooseChoice(index) {
    story.ChooseChoiceIndex(index);
    oneTurn();
}

export default {
    startStory,
    chooseChoice
}