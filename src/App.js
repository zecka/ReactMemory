import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './Card'
import GuessCount from './GuessCount'
import HallOfFame, { FAKE_HOF } from './HallOfFame'

const SIDE = 6
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
  * Retourne le "feedback" d'une carte (en soit son état) grace à sont index
  * ici l'index est l'emplacement de la carte dans le tableau "cards" de l'etat principale
  * les feedback possible sont: hidden, visible, justMatched, justMismatched 
  * Cette fonction est utilisée continuellement pour chaque cartes
  * A ne pas confondre avec l'action qui sera utilisé au moment du clique
  */
  getFeedbackForCard(index) {
    // ICI on récupère currentPair et MatchedCardIndice de l'etat local
    const { currentPair, matchedCardIndices } = this.state
    /*
     * Ici on va vérifier si "index" existe dans le tableau matchedCardIndices
     * Si index existe alors on retourne true
     * on le vérifie déjà ici au cas ou on reclique sur une paire deja trouvé
    */
    const indexMatched = matchedCardIndices.includes(index)

    /**
     * On vérifie si currentPair est plus petit que deux (donc 0 ou 1)
     * si plus petit que 2 on effectuer le code ci dessous et fait un return
     * la suite de la fonction ne s'excutera pas
     */
    if (currentPair.length < 2) {
      return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
    }

    /**
     * Ici on sait que currentPaire.length (le nombre de carte qu'on a révélé)
     * est plus grand que 1 on va donc vérifier si l'index de la deuxième carte qu'on a retourner
     * est contenu dans le tableau currentPair.
     * Si il est contenu dedans cela veux dire que la carte en question vien d'etre retourné
     * Si indexMatched est true c'est qu'elle vien d'etre Matché a ce tour
     * autrement c'est qu'on vien de rater une comparaison 😭
     */

    if (currentPair.includes(index)) {
      return indexMatched ? 'justMatched' : 'justMismatched'
    }

    /**
     * Ici il ne s'agit ne s'agit pas d'une carte que l'on vien de retourner
     * On vérifie donc elle à déjà été matché pour retourner visible ou hidden
     */
    return indexMatched ? 'visible' : 'hidden'
  }

  /**
   * Ici on défini ce qui se passe lors d'un clique sur une carte
   *
   */
  // Arrow fx for binding
  handleCardClick = index => {
    const { currentPair } = this.state // on récupaire le tableau currentPair

    // Ici on regarde si il y a deja deux carte dans le tableau currentPair
    // En théorie ca ne devrai pas arriver a moin que le joueur clique trop vite
    // Dans ce cas on ne fait rien, ignore ce dernier clique
    if (currentPair.length === 2) {
      return
    }
    // Ici on vérifier si le tableau est vide
    // Dans ce cas ca veux dire que c'est la première carte que l'on retourne
    if (currentPair.length === 0) {
      this.setState({ currentPair: [index] }) // Ici on ajoute la première carte a comparé dans le tableau currentPair
      return
    }

    // Ici on sait qu'on sure qu'on a retourné exactement une carte
    // On va donc executer la fonction handleNewPairClosedBy en passant l'index de la carte cliqué en paramètre
    this.handleNewPairClosedBy(index)
  }

  handleNewPairClosedBy(index) {
    // On récupère les valeurs de l'état local
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
        {/* (Pour mettre un commentaire en jsx il faut l'entourer de {} ) 
          * Ici la fonction map va permetre de faire une boucle (Comme un foreach php)
          * pour chaque élément du tableau cards on prend le parametres card
          * On défini l'index de l'élément dans la variable index
          */}

        {cards.map((card, index) => (
          <Card
            card={card} // card est égale p.ex 🐱
            key={index} // Index p.ex: 1
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
