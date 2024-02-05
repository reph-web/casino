//Le code pour Javascript pour le jeu du spin

// il s'agit de la fonction qui renvoi les valeurs aleatoires  et qui est appelee a chaque tour de jeu.

function choixValeur(tableau) {
  let resultat = [];
  for (let i = 0; i < tableau.length; i++) {
    let randomIndex = Math.floor(Math.random() * tableau.length);
    resultat.push(tableau[randomIndex]);
  }
  return resultat;
}




