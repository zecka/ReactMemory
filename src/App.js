import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './Card'
import GuessCount from './GuessCount'
import HallOfFame, { FAKE_HOF } from './HallOfFame'

const SIDE = 2
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'
const VISUAL_PAUSE_MSECS = 750

class App extends Component {
  // On Définie les valeur par default de l'etat de notre App (au chargement de la page)
  state = {
    cards: this.generateCards(), // Le tableau contenant nos cards
    currentPair: [], // La paire que l'on est entrain de chercher (ne dépassera jamais 2 éléments)
    guesses: 0, // le nombre d'éssai que l'on à déjà fait
    matchedCardIndices: [] // Les paire que l'on à déjà trouvé
  }

  /*
  * Créer les cartes que l'on aura sur notre plateau
  * Le nombre de carte étant défini par la const SIDE
  * p.ex: SIDE = 6 --->  6*6=36   --> on aura 36 cartes dans le tableau
  */
  generateCards() {
    const result = [] // On prépare un tableau qui contiendra nos carte
    const size = SIDE * SIDE // On calcule le nombre de carte qu'on aura au final
    const candidates = shuffle(SYMBOLS) // mélange string symbole et converti en tablea
    while (result.length < size) {
      const card = candidates.pop() // met le dernier element du tableau et le supprime
      result.push(card, card) // Ajoute deux fois l'élément au tableau
    }
    return shuffle(result) // Mélange aléatoirement et retourne le tableau
  }

  /*
  * Retourne le "feedback" d'un carte grace à sont index
  * ici l'index est l'emplacement de la carte dans le tableau "cards" de l'etat principale
  * l'etat peut etre: hidden, visible, justMatched, justMismatched 
  */
  getFeedbackForCard(index) {
    const { currentPair, matchedCardIndices } = this.state
    const indexMatched = matchedCardIndices.includes(index)

    if (currentPair.length < 2) {
      return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
    }

    if (currentPair.includes(index)) {
      return indexMatched ? 'justMatched' : 'justMismatched'
    }

    return indexMatched ? 'visible' : 'hidden'
  }
  // Arrow fx for binding
  handleCardClick = index => {
    const { currentPair } = this.state
    if (currentPair.length === 2) {
      return
    }
    if (currentPair.length === 0) {
      this.setState({ currentPair: [index] })
      return
    }

    this.handleNewPairClosedBy(index)
  }

  handleNewPairClosedBy(index) {
    const { cards, currentPair, guesses, matchedCardIndices } = this.state

    const newPair = [currentPair[0], index]
    const newGuess = guesses + 1
    const matched = cards[newPair[0]] === cards[newPair[1]]

    this.setState({ currentPair: newPair, guesses: newGuess })
    if (matched) {
      this.setState({ matchedCardIndices: [...matchedCardIndices, ...newPair] })
    }

    setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS)
  }

  render() {
    const { cards, guesses, matchedCardIndices } = this.state
    const won = matchedCardIndices.length === cards.length
    return (
      <div className="memory">
        <GuessCount guesses={guesses} />
        {cards.map((card, index) => (
          <Card
            card={card}
            key={index}
            feedback={this.getFeedbackForCard(index)}
            index={index}
            onClick={this.handleCardClick}
          />
        ))}

        {won && <HallOfFame entries={FAKE_HOF} />}
      </div>
    )
  }
}

export default App
