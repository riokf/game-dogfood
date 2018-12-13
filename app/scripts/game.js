'use strict';

$(document).ready(main);

function main()
{
	var gridButtons = [].slice.call($("button"));
	var scorePOne, scorePTwo, playerTurn;

	gridButtons.forEach(function (item) {
		item.addEventListener('click', function() {
			buttonClick($(item));
		});
	});

	function buttonClick(button)
	{
		let row = parseInt(button.attr('id')[1], 10);
		let col = parseInt(button.attr('id')[3], 10);

		if (verify(row, col))
		{
			mark(row, col);

			if (playerTurn == 0)
			{
				playerTurn = 1;
			}
			else
			{
				playerTurn = 0;
			}

			socket.emit("updateScoreEvent", scorePOne, scorePTwo);
			socket.emit("playerShiftEvent", playerTurn);
		}
	}

	function initialize()
	{
		socket.emit("connectionEvent");

		toastr.options.preventDuplicates = true;
		toastr.options.extendedTimeOut = 1;

		socket.on('gameStart', function() {
			$("*").show();
		});

		socket.on('gamePause', function() {
			$('.grid').hide();
			$('strong').hide();
			$('.score').hide();
			$("#gameStatus").text("Waiting for Player 2");
		});

		socket.on('gameDelete', function() {
			$('.grid').hide();
			$('strong').hide();
			$('.score').hide();
			$("#gameStatus").text("Opposing player has disconnected");
		});

		socket.on('markEvent', function(msg, char) {
			$(msg).text(char);
		});

		socket.on('playerShiftEvent', function(turn) {
			playerTurn = turn;

			if (turn == 0)
			{
				$("#gameStatus").text("It is Player 1's Turn! [O]");
			}
			else
			{
				$("#gameStatus").text("It is Player 2's Turn! [X]");
			}
		});

		socket.on('updateScoreEvent', function(scoreOne, scoreTwo) {
			scorePOne = scoreOne;
			scorePTwo = scoreTwo;

			console.log("I was here!");

			$('#p1score').text(scorePOne.toString());
			$('#p2score').text(scorePTwo.toString());
		});

		$("#B4-4").text("O");
		$("#B5-5").text("O");
		$("#B4-5").text("X");
		$("#B5-4").text("X");

		scorePOne = 2;
		scorePTwo = 2;

		$('#p1score').text(scorePOne.toString());
		$('#p2score').text(scorePTwo.toString());

		$("#gameStatus").text("It is Player 1's Turn! [O]");

		playerTurn = 0;
	}

	function mark(row, col)
	{
		let playerSign, enemySign, buttonId;
		var changes = 0, nextRow, nextCol;

		if (playerTurn == 0)
		{
			playerSign = 'O';
			enemySign = 'X';
			scorePOne += 1;
		}
		else
		{
			playerSign = 'X';
			enemySign = 'O';
			scorePTwo += 1;
		}

		buttonId = "#B" + (row).toString() + "-" + (col).toString();
		socket.emit('markEvent', buttonId, playerSign);

		// Check top-left side
		buttonId = "#B" + (row - 1).toString() + "-" + (col - 1).toString();
		if ($(buttonId).text() == enemySign)
		{
			for (nextRow = row - 2, nextCol = col - 2; nextRow >= 0 && nextCol >= 0; nextRow--, nextCol--)
			{
				buttonId = "#B" + (nextRow).toString() + "-" + (nextCol).toString();
				if ($(buttonId).text() == playerSign)
				{
					nextRow++;
					nextCol++;

					while (nextRow != row && nextCol != col)
					{

						buttonId = "#B" + (nextRow).toString() + "-" + (nextCol).toString();
						socket.emit('markEvent', buttonId, playerSign);
						nextRow++;
						nextCol++;
						changes++;
					}

					break;
				}
			}
		}

		// Check top side
		buttonId = "#B" + (row - 1).toString() + "-" + (col).toString();
		if ($(buttonId).text() == enemySign)
		{
			for (nextRow = row - 2; nextRow >= 0; nextRow--)
			{
				buttonId = "#B" + (nextRow).toString() + "-" + (col).toString();
				if ($(buttonId).text() == playerSign)
				{
					nextRow++;

					while (nextRow != row)
					{
						buttonId = "#B" + (nextRow).toString() + "-" + (col).toString();
						socket.emit('markEvent', buttonId, playerSign);
						nextRow++;
						changes++;
					}

					break;
				}
			}
		}

		// Check top-right side
		buttonId = "#B" + (row - 1).toString() + "-" + (col + 1).toString();
		if ($(buttonId).text() == enemySign)
		{
			for (nextRow = row - 2, nextCol = col + 2; nextRow >= 0 && nextCol<= 9; nextRow--, nextCol++)
			{
				buttonId = "#B" + (nextRow).toString() + "-" + (nextCol).toString();
				if ($(buttonId).text() == playerSign)
				{
					nextRow++;
					nextCol--;

					while (nextRow != row && nextCol != col)
					{
						buttonId = "#B" + (nextRow).toString() + "-" + (nextCol).toString();
						socket.emit('markEvent', buttonId, playerSign);
						nextRow++;
						nextCol--;
						changes++;
					}

					break;
				}
			}
		}

		// Check left side
		buttonId = "#B" + (row).toString() + "-" + (col - 1).toString();
		if ($(buttonId).text() == enemySign)
		{
			for (nextCol = col - 2; nextCol >= 0; nextCol--)
			{
				buttonId = "#B" + (row).toString() + "-" + (nextCol).toString();
				if ($(buttonId).text() == playerSign)
				{
					nextCol++;

					while (nextCol != col)
					{
						buttonId = "#B" + (row).toString() + "-" + (nextCol).toString();
						socket.emit('markEvent', buttonId, playerSign);
						nextCol++;
						changes++;
					}

					break;
				}
			}
		}

		// Check right side
		buttonId = "#B" + (row).toString() + "-" + (col + 1).toString();
		if ($(buttonId).text() == enemySign)
		{
			for (nextCol = col + 2; nextCol <= 9; nextCol++)
			{
				buttonId = "#B" + (row).toString() + "-" + (nextCol).toString();
				if ($(buttonId).text() == playerSign)
				{
					nextCol--;

					while (nextCol != col)
					{
						buttonId = "#B" + (row).toString() + "-" + (nextCol).toString();
						socket.emit('markEvent', buttonId, playerSign);
						nextCol--;
						changes++;
					}

					break;
				}
			}
		}

		// Check bottom-left side
		buttonId = "#B" + (row + 1).toString() + "-" + (col - 1).toString();
		if ($(buttonId).text() == enemySign)
		{
			for (nextRow = row + 2, nextCol = col - 2; nextRow <= 9 && nextCol>= 0; nextRow++, nextCol--)
			{
				buttonId = "#B" + (nextRow).toString() + "-" + (nextCol).toString();
				if ($(buttonId).text() == playerSign)
				{
					nextRow--;
					nextCol++;

					while (nextRow != row && nextCol != col)
					{
						buttonId = "#B" + (nextRow).toString() + "-" + (nextCol).toString();
						socket.emit('markEvent', buttonId, playerSign);
						nextRow--;
						nextCol++;
						changes++;
					}

					break;
				}
			}
		}

		// Check bottom side
		buttonId = "#B" + (row + 1).toString() + "-" + (col).toString();
		if ($(buttonId).text() == enemySign)
		{
			for (nextRow = row + 2; nextRow <= 9; nextRow++)
			{
				buttonId = "#B" + (nextRow).toString() + "-" + (col).toString();
				if ($(buttonId).text() == playerSign)
				{
					nextRow--;

					while (nextRow != row)
					{
						buttonId = "#B" + (nextRow).toString() + "-" + (col).toString();
						socket.emit('markEvent', buttonId, playerSign);
						nextRow--;
						changes++;
					}

					break;
				}
			}
		}

		// Check bottom-right side
		buttonId = "#B" + (row + 1).toString() + "-" + (col + 1).toString();
		if ($(buttonId).text() == enemySign)
		{
			for (nextRow = row + 2, nextCol = col + 2; nextRow <= 9 && nextCol>= 0; nextRow++, nextCol++)
			{
				buttonId = "#B" + (nextRow).toString() + "-" + (nextCol).toString();
				if ($(buttonId).text() == playerSign)
				{
					nextRow--;
					nextCol--;

					while (nextRow != row && nextCol != col)
					{
						buttonId = "#B" + (nextRow).toString() + "-" + (nextCol).toString();
						socket.emit('markEvent', buttonId, playerSign);
						nextRow--;
						nextCol--;
						changes++;
					}

					break;
				}
			}
		}

		if (playerTurn == 0)
		{
			scorePOne += changes;
			scorePTwo -= changes;	
		}
		else
		{
			scorePOne -= changes;
			scorePTwo += changes;
		}
	}

	function verify(row, col)
	{
		let playerSign, enemySign, buttonId;
		var nextRow, nextCol;

		if (playerTurn == 0)
		{
			playerSign = 'O';
			enemySign = 'X';
		}
		else
		{
			playerSign = 'X';
			enemySign = 'O';
		}

		buttonId = "#B" + (row).toString() + "-" + (col).toString();
		if ($(buttonId).text() != '')
		{
			toastr.error('Slot already filled', 'Invalid Move');
			return false;
		}

		// Check top-left side
		buttonId = "#B" + (row - 1).toString() + "-" + (col - 1).toString();
		if ($(buttonId).text() == enemySign)
		{
			for (nextRow = row - 2, nextCol = col - 2; nextRow >= 0 && nextCol >= 0; nextRow--, nextCol--)
			{
				buttonId = "#B" + (nextRow).toString() + "-" + (nextCol).toString();
				if ($(buttonId).text() == playerSign)
				{
					return true;
				}
			}
		}

		// Check top side
		buttonId = "#B" + (row - 1).toString() + "-" + (col).toString();
		if ($(buttonId).text() == enemySign)
		{
			for (nextRow = row - 2; nextRow >= 0; nextRow--)
			{
				buttonId = "#B" + (nextRow).toString() + "-" + (col).toString();
				if ($(buttonId).text() == playerSign)
				{
					return true;
				}
			}
		}

		// Check top-right side
		buttonId = "#B" + (row - 1).toString() + "-" + (col + 1).toString();
		if ($(buttonId).text() == enemySign)
		{	
			for (nextRow = row - 2, nextCol = col + 2; nextRow >= 0 && nextCol <= 9; nextRow--, nextCol++)
			{
				buttonId = "#B" + (nextRow).toString() + "-" + (nextCol).toString();
				if ($(buttonId).text() == playerSign)
				{
					return true;
				}
			}
		}

		// Check left side
		buttonId = "#B" + (row).toString() + "-" + (col - 1).toString();
		if ($(buttonId).text() == enemySign)
		{	
			for (nextCol = col - 2; nextCol >= 0; nextCol--)
			{
				buttonId = "#B" + (row).toString() + "-" + (nextCol).toString();
				if ($(buttonId).text() == playerSign)
				{
					return true;
				}
			}
		}

		// Check right side
		buttonId = "#B" + (row).toString() + "-" + (col + 1).toString();
		if ($(buttonId).text() == enemySign)
		{	
			for (nextCol = col - 2; nextCol <= 9; nextCol++)
			{
				buttonId = "#B" + (row).toString() + "-" + (nextCol).toString();
				if ($(buttonId).text() == playerSign)
				{
					return true;
				}
			}
		}

		// Check bottom-left side
		buttonId = "#B" + (row + 1).toString() + "-" + (col - 1).toString();
		if ($(buttonId).text() == enemySign)
		{	
			for (nextRow = row + 2, nextCol = col - 2; nextRow <= 9 && nextCol >= 0; nextRow++, nextCol--)
			{
				buttonId = "#B" + (nextRow).toString() + "-" + (nextCol).toString();
				if ($(buttonId).text() == playerSign)
				{
					return true;
				}
			}
		}

		// Check bottom side
		buttonId = "#B" + (row + 1).toString() + "-" + (col).toString();
		if ($(buttonId).text() == enemySign)
		{	
			for (nextRow = row + 2; nextRow <= 9; nextRow++)
			{
				buttonId = "#B" + (nextRow).toString() + "-" + (col).toString();
				if ($(buttonId).text() == playerSign)
				{
					return true;
				}
			}
		}

		// Check bottom-right side
		buttonId = "#B" + (row + 1).toString() + "-" + (col + 1).toString();
		if ($(buttonId).text() == enemySign)
		{	
			for (nextRow = row + 2, nextCol = col + 2; nextRow <= 9 && nextCol <= 9; nextRow++, nextCol++)
			{
				buttonId = "#B" + (nextRow).toString() + "-" + (nextCol).toString();
				if ($(buttonId).text() == playerSign)
				{
					return true;
				}
			}
		}

		toastr.error('There are no surrounding changeable pieces', 'Invalid Move');
		return false;
	}

	socket.on("connectionValidityCheckEvent", function(response) {
		if (response)
		{
			initialize();
		}
		else
		{
			$('.grid').hide();
			$('strong').hide();
			$('.score').hide();
			$("#gameStatus").text("Connection is severed. The game room is full.");
		}
	});
	socket.emit("connectionValidityCheckEvent");
}