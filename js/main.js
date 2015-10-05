/*
 * VARIABILI GLOBALI
 */

var loopTimer; // Conterrà il timer di aggiornamento del gioco
var batX; // La X della racchetta
var batY; // La Y della Racchetta
var isBomb; // Flag che indica se la bomba può essere messa a schermo
var bombX; // X della bomba
var bombY; // Y della bomba
var bombSpeed; // Velocità della bomba
var score; // Punteggio

// Avvio l'init quando la finestra ha caricato
window.onload = initVars();

// "Ascolto" la pressione di tasti, in modo asincrono (incarico window) cosicchè la racchetta si muova solo in seguito alla pressione di un tasto
// Gestione differenziata per Chrome, Firefox, Opera, IE9+...
if( window,addEventListener ) {
	window.addEventListener( 'keydown', userInput, false );
}
// Gestione per IE8
else if( window.attachEvent ) {
	document.attachEvent( 'onkeydown', userInput );
}

// Fisso un'esecuzione di gameLoop() ogni 50ms, quindi 20fps
loopTimer = setInterval( gameLoop, 50 );

/*
 * METODI
 */
 // Funzione che inizializza il gioco
function initVars() {
	
	// Inizializzo alcune variabili globali
	batX = 224;
	batY = 496;
	isBomb = 0;
	bombSpeed = 4;
	score = 0;
	
	// Inserisco in h1 il testo del punteggio
	document.getElementsByTagName( 'h1' )[ 0 ].innerHTML = "Score: 0";
	
}

// Funzione che gestisce l'input da tastiera
function userInput( event ) {
	
	// Se l'utente ha premuto la Freccia DX...
	if( event.keyCode == 39 ) {
		
		// Aumento la X della racchetta
		batX += 8;
		
		// Se la racchetta è maggiore del suo limite, fisso la sua posizione sul suo limite
		if( batX > 448 ) {
			batX = 448;
		}
		
	}
	// Se invece l'utente ha premuto la Freccia SX...
	else if( event.keyCode == 37 ) {
		
		// Diminuisco la X della racchetta
		batX -= 8;
		
		// Se la racchetta è minore del suo limite, fisso la sua posizione sul suo limite
		if( batX < 0 ) {
			batX = 0;
		}
		
	}
	// Se invece l'utente ha premuto la Freccia SU...
	else if( event.keyCode == 38 ) {
		
		// ...se la racchetta è oltre la metà, la porto all'estremità DX, altrimenti a quella SX
		if( batX < 224 ) {
			batX = 448;
		} else {
			batX = 0;
		}
		
	}
	// Se invece l'utente ha premuto la Freccia GIU'...
	else if( event.keyCode == 40 ) {
		
		// ...porto la racchetta al centro del playfield
		batX = 224;
		
	}
	
}

// Funzione che gestisce il loop di gioco: eseguo la logica di gioco e renderizzo
function gameLoop() {
	
	gameLogic();
	render();
	
}

// Funzione che gestisce la logica di gioco
function gameLogic() {
	
	// Se non c'è una bomba a schermo...
	if( !isBomb ) {
		
		// Modifico la flag, do un valore casuale alla X della bomba e setto la Y della bomba a 0
		isBomb = 1;
		bombX = Math.floor( Math.random() * 496 );
		bombY = 0;
		
	}
	// Altrimenti se la bomba è a schermo...
	else {
		
		// Aggiungo il valore di velocità alla Y della bomba
		bombY += bombSpeed;
		
		// Se la bomba è oltre 480px sulla sua Y...
		if( bombY >= 480 ) {
			
			// Determino una delta X tra la X della bomba e la X della racchetta
			var deltaX = bombX - batX;
			
			// Se la delta X è tra -16 (metà bomba) e 64
			if( ( deltaX >= -16 ) && ( deltaX <= 64 ) ) {
				
				// Aumento il punteggio, lo aggiorno a schermo, aumento la velocità e aggiorno la flag
				score += 10;
				document.getElementsByTagName( 'h1' )[ 0 ].innerHTML = "Score: " + score.toString();
				bombSpeed++;
				isBomb = 0;
				
			}
			// Altrimenti la delta X è fuori range, quindi la racchetta è troppo lontana dalla bomba, quindi...
			else {
				
				// Segnalo il game over e re-inizializzo il gioco
				alert( "GAME OVER" );
				initVars();
			
			}
			
		}
	
	}

}

// Funzione che renderizza la situazione di gioco
function render() {
	
	// Setto la left, dal CSS, della racchetta a seconda di dove si trova la X della racchetta
	document.getElementById( 'bat' ).style.left = batX.toString() + "px";
	
	// Se la bomba è a schermo...
	if( isBomb ) {
		
		// Mi setto l'id della bomba
		var bombObj = document.getElementById( 'bomb' );
		
		// Se la bomba è invisibile, la mostro a schermo
		if( bombObj.style.display == "none" ) {
			bombObj.style.display = "block";	
		}
		
		// Assegno al CSS della bomba la sua posizione left in base alla X e la top in base alla Y
		bombObj.style.left = bombX.toString() + "px";
		bombObj.style.top = bombY.toString() + "px";
		
	}
	
}