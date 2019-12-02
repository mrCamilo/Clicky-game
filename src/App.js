import React, { Component } from 'react';
import Container from './components/Container';
import Row from './components/Row';
import Column from './components/Column';
import Card from './components/Card';
import Jumbotron from './components/Jumbotron';
import Image from './components/Image';
import choices from './choices.json';

class App extends Component {
  state = {
    choices,
    clicked: [],
    highScore: 0
  };

  componentDidMount() {
    this.setState({ choices: this.randomize(this.state.choices) });
  }

  /*

  Here is a JavaScript implementation of the Durstenfeld shuffle, a computer-optimized version of Fisher-Yates:

/*
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}
The Fisher-Yates algorithm works by picking one random element for each original array element, and then excluding it from the next draw. Just like randomly picking from a deck of cards.

This exclusion is done in a clever way (invented by Durstenfeld for use by computers) by swapping the picked element with the current element, and then picking the next random element from the remainder. For optimal efficiency, the loop runs backwards so that the random pick is simplified (it can always start at 0), and it skips the last element because there are no other choices anymore.

The running time of this algorithm is O(n). Note that the shuffle is done in-place. So if you do not want to modify the original array, make a copy of it first with .slice(0).

Updating to ES6 / ECMAScript 2015
The new ES6 allows us to assign two variables at once. This is especially handy when we want to swap the values of two variables, as we can do it in one line of code. Here is a shorter form of the same function, using this feature.

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}
*/

  randomize = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  };

  // resetGame but not the high score

  resetGame = () => {
    const randomizedChoices = this.randomize(this.state.choices);

    this.setState({
      clicked: [],
      choices: randomizedChoices
    });
  };

  // handle click on image function

  handleClickOnImage = id => {
    // this is loss condition
    if (this.state.clicked.includes(id)) {
      alert('you lost');
      this.resetGame();
    } else {
      // if they haven't clicked the image yet...
      // we add the id to clicked array
      // clicked: [0, 4, 2, 9]
      // clicked: [0, 4, 2, 9, 3]
      // first we setState of the clicked array and randomize our choices but after don't we need to check high score and win?
      // What would happen if we did this?
      // this.setState(prevState => ({
      //   clicked: [...prevState.clicked, id],
      //   choices: this.randomize(this.state.choices)
      // }));
      // this.checkHighScore();
      // this.handleWin();
      // this.setState is asynchronous and in this case checking the high score and the win rely on the state above, but it doesn't happen in that order even though we wrote it that way.
      // this.setState takes an optional callack function and we can use that to run those checks AFTER we set the state of clicked and choices.
      this.setState(
        prevState => ({
          clicked: [...prevState.clicked, id],
          choices: this.randomize(this.state.choices)
        }),
        () => {
          this.checkHighScore();
          this.handleWin();
        }
      );
    }
  };

  // check high score

  checkHighScore = () => {
    if (this.state.clicked.length > this.state.highScore) {
      this.setState({ highScore: this.state.clicked.length });
    }
  };

  // handle win function

  handleWin = () => {
    if (this.state.clicked.length === this.state.choices.length) {
      alert('You won!');
      this.resetGame();
    }
  };

  render() {
    // always console.log state in the render it will give you the freshest state. or use React Dev Tools.
    console.log(this.state);
    // don't have to write this.state over and over if we destructure here
    const { clicked, choices, highScore } = this.state;
    return (
      <Container>
        <Jumbotron score={clicked.length} highScore={highScore} dark />
        <Row helper={`justify-content-center`}>
          {choices.map(({ id, name, image }) => {
            return (
              <Column key={id} md={2}>
                <Card header={name} dark>
                  <Image
                    id={id}
                    name={name}
                    image={image}
                    handleClickOnImage={this.handleClickOnImage}
                  />
                </Card>
              </Column>
            );
          })}
        </Row>
      </Container>
    );
  }
}

export default App;
