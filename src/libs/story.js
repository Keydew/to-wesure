import storyContent from './conversation'

const story = new inkjs.Story(storyContent);
var youSayFn, playerSayFn, showOptionsFn;

/**
 * 开始故事
 */
function startStory(youSay, playerSay, showOptions) {
  youSayFn = youSay;
  playerSayFn = playerSay;
  showOptionsFn = showOptions;
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
      showOptionsFn(story.currentChoices);
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
