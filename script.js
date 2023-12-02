'use strict';

// Select DOM element
// DASHBOARD
const computerScoreElm = document.querySelector('.computer-score');
const humanScoreBoxElm = document.querySelector('.human-score');

// GAME CONTAINER
const gameContainer = document.querySelector('.game-container');
const gameInfoBox = document.querySelector('.game-info');
const optionsBox = document.querySelector('.options-container');
const winnerBox = document.querySelector('.winner-container');
const winnerBoxHeadText = document.querySelector('.winner__heading');
const winnerBoxSubHeadText = document.querySelector('.winner__sub-heading');
const btnPlayAgain = document.querySelector('.btn-playagain');

// FOOTER
const rulesBoxElm = document.querySelector('.rules-container');
const btnOpenRules = document.querySelector('.btn-rules');
const btnCloseRules = document.querySelector('.btn-close-rules');
const btnNext = document.querySelector('.btn-next');

function computerOptionProcessor(appData) {
	const options = ['paper', 'rock', 'scissor'];
	// Getting random data option from options array
	appData.computerSelect =
		options[Math.floor(Math.random() * options.length)];

	appData.computerSelectElm = document
		.querySelector(`.option--${appData.computerSelect}`)
		.closest('.circle');
}

const scoreUpdater = (appData) => {
	computerScoreElm.textContent = appData.computerScore;
	humanScoreBoxElm.textContent = appData.humanScore;
};

function domUpdater(appData) {
	// Changing grid columns after game start
	optionsBox.classList.replace('grid--2-col-1-row', 'grid--3-col');

	const displayNext = (appData) => {
		if (appData.winner === 'human') btnNext.style.display = 'block';
	};

	displayNext(appData);

	// Array of child elements of Options container
	const optionsArray = [
		...optionsBox.querySelectorAll('.circle,.bg-triangle'),
	];

	// Helper  functions
	const pickupSameOptions = (item) => {
		const clonedElement = item.cloneNode(true);

		item.classList.add('human-select');

		clonedElement.classList.add('computer-select', 'cloned-element');
		//
		appData.computerSelectElm = clonedElement;

		optionsBox.insertAdjacentElement(
			'beforeend',
			appData.computerSelectElm
		);
	};

	const styleWinElmtAndWinContainer = ({
		computerSelectElm,
		humanSelectElm,
		winner,
	}) => {
		if (winner === 'computer') {
			computerSelectElm.classList.add('winner');
			winnerBox.style.justifySelf = 'flex-end';
			winnerBoxHeadText.textContent = 'pc Win';
			winnerBoxSubHeadText.textContent = 'Against you';
		}
		if (winner === 'human') {
			humanSelectElm.classList.add('winner');
			winnerBox.style.justifySelf = 'flex-start';
			winnerBoxHeadText.textContent = 'You Win';
			winnerBoxSubHeadText.textContent = 'Against PC';
		}

		if (winner === 'draw') {
			winnerBox.style.justifySelf = 'center';
			winnerBoxHeadText.textContent = 'Match draw';
			winnerBoxSubHeadText.textContent = '';
		}
	};

	optionsArray.forEach((item) => {
		const curOption = item.getAttribute('data-type');

		// 1. ) Apply this style If computer and human select same option
		if (
			appData.humanSelect === appData.computerSelect &&
			(curOption === appData.humanSelect ||
				curOption === appData.computerSelect)
		) {
			pickupSameOptions(item);
		}
		// 2. ) Apply this style for human selected option

		if (curOption === appData.humanSelect) {
			item.classList.add('human-select');
			return item;
		}
		// 3. ) Apply this style for computer selected option

		if (curOption === appData.computerSelect) {
			item.classList.add('computer-select');
			return item;
		}

		// 4. ) Apply this style for not selected elements / options
		item.style.display = 'none';
		gameInfoBox.style.opacity = 1;
		winnerBox.style.display = 'block';
	});

	scoreUpdater(appData);
	styleWinElmtAndWinContainer(appData);
}

function whoIsWinner(appData) {
	const choiceObject = {
		rock: {
			rock: 'draw',
			scissor: 'win',
			paper: 'lose',
		},
		paper: {
			paper: 'draw',
			scissor: 'lose',
			rock: 'win',
		},
		scissor: {
			scissor: 'draw',
			rock: 'lose',
			paper: 'win',
		},
	};

	switch (choiceObject[appData.humanSelect][appData.computerSelect]) {
		case 'win':
			console.log('You win');
			appData.winner = 'human';
			appData.humanScore += 1;
			break;
		case 'lose':
			console.log('Computer Win');
			appData.winner = 'computer';
			appData.computerScore += 1;
			break;
		default:
			appData.winner = 'draw';
			break;
	}
}

function setLocalStorageScore(appData) {
	localStorage.setItem(
		'score',
		JSON.stringify({
			computerScore: appData.computerScore,
			humanScore: appData.humanScore,
		})
	);
}

function getLocalStorageScore(appData) {
	// const score = JSON.parse(localStorage.getItem('score'));
	const score = JSON.parse(localStorage.getItem('score'));

	if (!score) return;
	appData.computerScore = score.computerScore;
	appData.humanScore = score.humanScore;
}

function processor(appData) {
	computerOptionProcessor(appData);

	whoIsWinner(appData);

	setLocalStorageScore(appData);

	// Apply style after process completed
	domUpdater(appData);
	console.log(appData);
}

function init() {
	// Application state
	const appData = {
		humanSelect: '',
		computerSelect: '',
		gameStart: false,
		humanSelectElm: '',
		computerScore: 0,
		humanScore: 0,
	};

	getLocalStorageScore(appData);
	scoreUpdater(appData);

	// Handler Functions
	const handleSelectEvent = (e) => {
		// Check if game is start of not
		if (appData.gameStart) return;

		e.preventDefault();
		// Guard clause
		if (e.target.classList.contains('options-container')) return;

		appData.humanSelectElm = e.target.closest('.circle');

		appData.humanSelect = e.target
			.closest('.circle')
			.getAttribute('data-type');

		appData.gameStart = true;
		processor(appData);
	};

	const handlePlayAgain = (e) => {
		// e.stopPropagation();
		// optionsBox.classList.replace('grid--3-col', 'grid--2-col-1-row');
		// console.log(appData);
		// appData.computerSelectElm.classList.remove('computer-select');
		window.location.reload();
	};

	const handleRuleToggleEvent = () => {
		rulesBoxElm.style.display =
			rulesBoxElm.style.display === 'flex' ? 'none' : 'flex';
	};

	// Events
	optionsBox?.addEventListener('click', handleSelectEvent);
	btnOpenRules?.addEventListener('click', handleRuleToggleEvent);
	btnCloseRules?.addEventListener('click', handleRuleToggleEvent);
	btnPlayAgain?.addEventListener('click', handlePlayAgain);
}

init();
