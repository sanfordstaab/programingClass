# Maze - the game.

## UI Description:

Maze starts with a dropdown listing all the existing game names in alphabetical order.  Games that have no players yet entered are shown in green.
At the top of the dropdown list is the item "Create a New Game".
When the user selects the "Create a New Game" item, the new game form appears and waits for the user to fill in the game options.
The options include:
- Game Name
-- A unique name to identify the game.
- Maze width
-- 10 - 1000
- Maze height
-- 10 - 1000
- Maze depth
-- 1 - 10
- Difficulty
-- 1 - 10
- Max players allowed
.. 1 - 40
- Create Game Submit Button

If the user selects an existing game, the client asks for their name, which must be unique for that game, and starts that player into the existing game.
If the game has disappeared between the time of rendering the game list and player selection, the player is notified via a status area and the game list is updated.

Once a player has joined a game, a sidebar appears that shows all player names in that game and a chat window to send and recieved messages to any player in the game.

## Game architecture

The maze game consists of a client and a server.

### Client

The client:
- renders the maze based on the selected zoom level
- collects new game options
- creates new games
- adds players to existing games

#### Zoom levels
Each zoom level doubles the number of squares shown width and height wise.
The lowest zoom level shows the entire maze with scrollbars used if it will not fit the viewport area.
The highest zoom level shows an area of 10x10 squares.

#### Maze visibility
A player can only see so far down a straight path that is not mapped.  This distance is determined by the dificulty level where easy can see up to half the average of the width and heigh of the maze and harder dificulties see a proportionally shorter distance.  The minimum distance seen down a straight path is 3 squares.

#### Maps
As a plyer traverses the maze, they build up their personal maze map.  Mapped areas,
that is all the squares the player has seen so far, are shown.  Each time the player moves a square, more squares may be added to the map depending on the player's visibility.

#### Flashlights
There can be as many flashlights in the maze as half the player count + 1.  If a player captures a flashlight, their visibility range is doubled down straight halls.

When a game is created, the client generates the maze according to the options given.

The maze wraps around itself so going off the top moves the player to the botomm, goint off the maze to the left moves the player to the right edge and so on.  The same goes for levels.  Going above the top level places the player in the bottom level and going off the bottom level puts the player on the top level.
The maze is generated in such a way that there is only one path between any two squares.  

The generator should generate longer straight paths for lower dificulties and shorter ones for hight difficulties.



### Server
The server holds the entire game state for each game.
The game state consists of:
- The layout of the maze:
-- Each square of the maze indicates where walls are (N, S, E, W)
-- The game parameters set by the create game options form
-- The location of each player
-- The location of any monsters
-- The location of the maze door
-- The location of they key if not in posession of a player
-- The location of each level's stairway up and down
-- The location of any maze maps that were dropped
-- The location of any flashlights
-- The location of any potions
-- Each player's items in hand.

The server supports a REST api with the game name used to identify which maze is being played on.

#### REST APIs

FetchPlayer:
- Parameters
-- Player Name
-- Player location
- Returns
-- Player items
-- Player Map (list of square coordinatess seen, list of players, monsters and item locations seen)

FetchMaze:
- Parameters
-- Maze Level
-- Center coordinate
-- width
-- height
- Returns
-- Current Maze data for the given parameters

FetchGames:
- Parameters - none.
- Returns
-- A list of all existing game names and if each game has been started or not. Games at their player limit are filtered out.

CreateGame:
- Parameters 
-- Game Name
-- Option options (JSON object text)
-- New Maze data

FetchGame:
- Parameters
-- Game Name
- Returns
-- List of all players in the game
-- Game Options (JSON object text)

ChatMsg:
- Parameters
-- game name
-- sending player name
-- recieving player names
-- message text (may be blank)
- Returns
-- Success = 1, failed = 0

ChatCheck:
- Parameters
-- game name
-- reciever player name
- Returns
-- message list consisting of sender name and messages not yet delivered or "" if no unsent messages exist.

## Rules and play

At the start of a game a player is placed in a random square with an empty map and can only see the squares that are near him based on his visibility.

The goal is to get out of the maze.
The first player out is considered the winner and ends the game.
There is only one way out of the maze and that is known as the door.
The first player to land on the door with the key wins.
The key is randomly placed in tha maze and a player may pick up the key or drop it or another player may steal the key.

Players can enter and leave the game at anytime and the maze is destroyed once the last player has left the game or once one player has exited the maze via the door with the key.

At the end of the game, all players are notified who won the game.

### Movement
The arrow keys are used to move a player through the maze.  The player cannot cross a maze wall.  All players move simultaneously and can only move as fast as the server can handle the events.

### Maps
As a player moves, their map is expanded so they are allowed to see any part of the maze that they have seen in the past.  Locations of items or monsters seen are shown on the map but items or monsters that are not within sight will not change on the map till those squares are seen again by the player.

A player's map may be stolen by a monster or another player.
When a player lands on the same square as another player or a monster, the map or flashlight may be transfered between the players.  There is a 10% chance of either item being transfered when players or monsters collide.

### Player map transfers
When a player's map is transfered to another player, the loosing player's map is reduced to his current view.  The recieving player integrates his map with the recieved map so they will then have the union of both maps that can be seen.
There is a 1% chance that a map is dropped by a player.  The maze will show the dropped map at the previous square the player was on.  They can reutrn to that square to pick up the map.  Thus maps over time may be combined, lost, or found dictating the viewable squares for that player.

### Flashlights
Placed randomly around the maze are flashlights.  The number of flashlights available decreases with higher difficulty but there will always be at least one flashlight.  
Players may pick up a flashlight when they find one but can hold only one flashlight.
A flashlight extens the player's visibilty by twize normal range.  Normal visibility is determined by the difficulty level.

### Monsters
Randomly placed within the maze are monsters.  At the easiest difficulty (1) there are no monsters.  Monstors move 1 square at a time randomly through the maze about every interval of time for difficulty's >3.  The difficulty level determines how long this interval is with harder difficultys moving the monsters more often.
On higher difficulty levels (>5) the monsters will persue any player within their visibility range.  Monster visibility range increases with the difficulty level and starts at 3 squares and increases by 20% with each higher difficulty level.

### Player Health
Players start with 100 health.  If their health reaches 0 in a monster fight, they are removed from the game.  Each square a player moves, their health increases by 1 up to the limit of 100.

### Fighting Monsters
When a player lands on the same square as a monster, they do battle with it.
This consists of blows against each opponent on that square.
Each occupant of the square may strike another other players or monsters on the same square.  A strike may inflict 0-5 health points.  Monsters always strike while players may strike or flee.
If a player chooses to flee they are moved in a random direction from the square they were one.
As monsters are killed the maze is permanantly depleated of them.

### Items kept by players
Items held by a player may include:
- their map
- up to one flashlight
- the key
- healing potions
Monsters to not keep any items.

### Potions
There are randomly placed in the maze potions of healing which will add a random number of health points when drunk. The D key causes a player to drink any potion they may have.  Players can only hold one potion at a time.  Healing potiosn are weaker and fewer at higher difficulties.

### Secret doors
Normally a player cannot pass through a wall of the maze but on occasion there are secret doors in the walls.  If a player attempts to cross a wall and it contains a secret door there is a 50% probability they will pass through the wall.  Secret doors are one-way.  Players cannot go back through a secret door they just passed through.


