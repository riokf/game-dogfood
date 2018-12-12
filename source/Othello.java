import java.util.Scanner;

public class Othello
{
	private static char[][] board = new char[10][10];
	private static int scorePOne, scorePTwo, playerTurn = 0;

	public static void initialize()
	{
		for (int row = 0; row < 10; row++)
		{
			for (int col = 0; col < 10; col++)
			{
				board[row][col] = ' ';
			}
		}

		board[4][4] = 'O';
		board[5][5] = 'O';
		board[4][5] = 'X';
		board[5][4] = 'X';

		scorePOne = 2;
		scorePTwo = 2;
	}

	public static void print()
	{
		for (int row = 0; row < 10; row++)
		{
			for (int col = 0; col < 10; col++)
			{
				System.out.print("[" + board[row][col] + "]");
			}
			System.out.print("\n");
		}

		System.out.println("Player 1: " + scorePOne + "\nPlayer 2: " + scorePTwo);
	}

	public static boolean verify(int row, int col, int playerTurn)
	{
		int nextRow, nextCol;
		char playerSign, enemySign;

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

		// Case 1: Check if board coordinate is within range of 0 to 9 (inclusive to both numbers)
		if (row < 1 || row > 10 || col < 1 || col > 10)	return false;

		// Case 2: Check if board coordinate is not empty
		if (board[row][col] != ' ')	return false;

		// Case 3: Check if surrounding grid spots have valid patterns
		// Check top-left side
		try
		{
			if (board[row - 1][col - 1] == enemySign)
			{
				for (nextRow = row - 2, nextCol = col - 2; nextRow >= 0 && nextCol >= 0; nextRow--, nextCol--)
				{
					if (board[nextRow][nextCol] == playerSign)
					{
						return true;
					}
				}
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}
		
		// Check top side
		try
		{
			if (board[row - 1][col] == enemySign)
			{
				for (nextRow = row - 2; nextRow >= 0; nextRow--)
				{
					if (board[nextRow][col] == playerSign)
					{
						return true;
					}
				}
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}

		// Check top-right side
		try
		{
			if (board[row - 1][col + 1] == enemySign)
			{	
				for (nextRow = row - 2, nextCol = col + 2; nextRow >= 0 && nextCol <= 9; nextRow--, nextCol++)
				{
					if (board[nextRow][nextCol] == playerSign)
					{
						return true;
					}
				}
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}

		// Check left side
		try
		{
			if (board[row][col - 1] == enemySign)
			{	
				for (nextCol = col - 2; nextCol >= 0; nextCol--)
				{
					if (board[row][nextCol] == playerSign)
					{
						return true;
					}
				}
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}

		// Check right side
		try
		{
			if (board[row][col + 1] == enemySign)
			{	
				for (nextCol = col - 2; nextCol <= 9; nextCol++)
				{
					if (board[row][nextCol] == playerSign)
					{
						return true;
					}
				}
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}

		// Check bottom-left side
		try
		{
			if (board[row - 1][col - 1] == enemySign)
			{	
				for (nextRow = row + 2, nextCol = col - 2; nextRow <= 9 && nextCol >= 0; nextRow++, nextCol--)
				{
					if (board[nextRow][nextCol] == playerSign)
					{
						return true;
					}
				}
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}

		// Check bottom side
		try
		{
			if (board[row][col + 1] == enemySign)
			{	
				for (nextCol = col + 2; nextCol <= 9; nextCol++)
				{
					if (board[row][nextCol] == playerSign)
					{
						return true;
					}
				}
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}

		// Check bottom-right side
		try
		{
			if (board[row + 1][col + 1] == enemySign)
			{	
				for (nextRow = row + 2, nextCol = col + 2; nextRow <= 9 && nextCol <= 9; nextRow++, nextCol++)
				{
					if (board[nextRow][nextCol] == playerSign)
					{
						return true;
					}
				}
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}

		return false;
	}

	public static void mark(int row, int col, int playerTurn)
	{
		char playerSign, enemySign;
		int changes = 0, nextRow, nextCol;

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

		board[row][col] = playerSign;

		// Check top-left side
		try
		{
			if (board[row - 1][col - 1] == enemySign)
			{
				for (nextRow = row - 2, nextCol = col - 2; nextRow >= 0 && nextCol >= 0; nextRow--, nextCol--)
				{
					if (board[nextRow][nextCol] == playerSign)
					{
						nextRow++;
						nextCol++;

						while (nextRow != row && nextCol != col)
						{
							board[nextRow][nextCol] = playerSign;
							nextRow++;
							nextCol++;
							changes++;
						}

						break;
					}
				}

				System.out.println(">> 1");
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}
		
		// Check top side
		try
		{
			if (board[row - 1][col] == enemySign)
			{
				for (nextRow = row - 2; nextRow >= 0; nextRow--)
				{
					if (board[nextRow][col] == playerSign)
					{
						nextRow++;
						
						while (nextRow != row)
						{
							board[nextRow][col] = playerSign;
							nextRow++;
							changes++;
						}

						break;
					}
				}

				System.out.println(">> 2");
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}

		// Check top-right side
		try
		{
			if (board[row - 1][col + 1] == enemySign)
			{	
				for (nextRow = row - 2, nextCol = col + 2; nextRow >= 0 && nextCol <= 9; nextRow--, nextCol++)
				{
					if (board[nextRow][nextCol] == playerSign)
					{
						nextRow++;
						nextCol--;
						
						while (nextRow != row && nextCol != col)
						{
							board[nextRow][nextCol] = playerSign;
							nextRow++;
							nextCol--;
							changes++;
						}

						break;
					}
				}

				System.out.println(">> 3");
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}

		// Check left side
		try
		{
			if (board[row][col - 1] == enemySign)
			{	
				for (nextCol = col - 2; nextCol >= 0; nextCol--)
				{
					if (board[row][nextCol] == playerSign)
					{
						nextCol++;
						
						while (nextCol != col)
						{
							board[row][nextCol] = playerSign;
							nextCol++;
							changes++;
						}

						break;
					}
				}

				System.out.println(">> 4");
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}

		// Check right side
		try
		{
			if (board[row][col + 1] == enemySign)
			{	
				for (nextCol = col + 2; nextCol <= 9; nextCol++)
				{
					if (board[row][nextCol] == playerSign)
					{
						nextCol--;
						
						while (nextCol != col)
						{
							board[row][nextCol] = playerSign;
							nextCol--;
							changes++;
						}

						break;
					}
				}

				System.out.println(">> 5");
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}

		// Check bottom-left side
		try
		{
			if (board[row - 1][col - 1] == enemySign)
			{	
				for (nextRow = row + 2, nextCol = col - 2; nextRow <= 9 && nextCol >= 0; nextRow++, nextCol--)
				{
					if (board[nextRow][nextCol] == playerSign)
					{
						nextRow--;
						nextCol++;
						
						while (nextRow != row && nextCol != col)
						{
							board[nextRow][nextCol] = playerSign;
							nextRow--;
							nextCol++;
							changes++;
						}

						break;
					}
				}

				System.out.println(">> 6");
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}

		// Check bottom side
		try
		{
			if (board[row][col + 1] == enemySign)
			{	
				for (nextCol = col + 2; nextCol <= 9; nextCol++)
				{
					if (board[row][nextCol] == playerSign)
					{
						nextCol--;
						
						while (nextCol != col)
						{
							board[row][nextCol] = playerSign;
							nextCol--;
							changes++;
						}

						break;
					}
				}

				System.out.println(">> 7");
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}

		// Check bottom-right side
		try
		{
			if (board[row + 1][col + 1] == enemySign)
			{	
				for (nextRow = row + 2, nextCol = col + 2; nextRow <= 9 && nextCol <= 9; nextRow++, nextCol++)
				{
					if (board[nextRow][nextCol] == playerSign)
					{
						nextRow--;
						nextCol--;
						
						while (nextRow != row && nextCol != col)
						{
							board[nextRow][nextCol] = playerSign;
							nextRow--;
							nextCol--;
							changes++;
						}

						break;
					}
				}

				System.out.println(">> 8");
			}
		}
		catch (ArrayIndexOutOfBoundsException x) {}

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

	public static void main(String[] args)
	{
		int xCoordinate, yCoordinate;

		initialize();
		print();

		Scanner scanner = new Scanner(System.in);

		while (scorePOne + scorePTwo != 100)
		{
			print();

			if (playerTurn == 0)
			{
				System.out.print("Player 1: ");
				xCoordinate = scanner.nextInt();
				yCoordinate = scanner.nextInt();

				if (verify(xCoordinate, yCoordinate, playerTurn))
				{
					mark(xCoordinate, yCoordinate, playerTurn);
					playerTurn = 1;
				}
			}
			else
			{
				System.out.print("Player 2: ");
				xCoordinate = scanner.nextInt();
				yCoordinate = scanner.nextInt();

				if (verify(xCoordinate, yCoordinate, playerTurn))
				{
					mark(xCoordinate, yCoordinate, playerTurn);
					playerTurn = 0;
				}
			}
		}

		if (scorePOne > scorePTwo)
		{
			System.out.println("\nWINNER: Player 1");
		}
		else if (scorePTwo > scorePOne)
		{
			System.out.println("\nWINNER: Player 2");
		}
		else
		{
			System.out.println("\nDRAW!");
		}
	}
}