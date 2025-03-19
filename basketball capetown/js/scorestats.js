// Initial team names
let teamNames = {
    'Team A': 'Team A',
    'Team B': 'Team B'
};

// Initial players - empty arrays
let players = {
    'Team A': [],
    'Team B': []
};

// Initialize stats for a new player
function initializeStats() {
    return {
        points: 0,
        threePointer: { attempts: 0, made: 0 },
        fieldGoal: { attempts: 0, made: 0 },
        freeThrow: { attempts: 0, made: 0 },
        rebound: 0,
        assist: 0,
        steal: 0,
        block: 0,
        turnover: 0,
        foul: 0
    };
}

// Save team names
function saveTeamNames() {
    const teamANameInput = document.getElementById('teamAName').value.trim();
    const teamBNameInput = document.getElementById('teamBName').value.trim();

    if (teamANameInput && teamBNameInput) {
        // Update team names
        teamNames['Team A'] = teamANameInput;
        teamNames['Team B'] = teamBNameInput;

        // Update display
        document.getElementById('teamADisplayName').textContent = teamANameInput;
        document.getElementById('teamBDisplayName').textContent = teamBNameInput;
        document.getElementById('teamATableHeader').textContent = teamANameInput;
        document.getElementById('teamBTableHeader').textContent = teamBNameInput;
        document.getElementById('printTeamAName').textContent = teamANameInput;
        document.getElementById('printTeamBName').textContent = teamBNameInput;

        // Update dropdown options text
        const teamDropdowns = document.querySelectorAll('#team, #newTeam');
        teamDropdowns.forEach(dropdown => {
            dropdown.options[0].text = teamANameInput;
            dropdown.options[1].text = teamBNameInput;
        });

        // Update the display
        renderTables();

        // Provide feedback
        alert('Team names updated successfully!');
    } else {
        alert('Please enter names for both teams.');
    }
}

// Populate player dropdown
function populatePlayerDropdown() {
    const teamSelect = document.getElementById('team');
    const playerSelect = document.getElementById('player');
    const selectedTeam = teamSelect.value;

    // Clear previous options
    playerSelect.innerHTML = '';

    // Add players from selected team
    players[selectedTeam].forEach(player => {
        const option = document.createElement('option');
        option.value = player.name;
        option.textContent = `#${player.number} - ${player.name}`;
        playerSelect.appendChild(option);
    });

    // If no players, add a placeholder option
    if (players[selectedTeam].length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "No players available";
        option.disabled = true;
        option.selected = true;
        playerSelect.appendChild(option);
    }
}

// Record a statistic for the selected player
function recordStat(statType, made = true) {
    const teamName = document.getElementById('team').value;
    const playerName = document.getElementById('player').value;

    // Check if player is selected
    if (!playerName) {
        alert("Please select a player first.");
        return;
    }

    // Find the player
    const player = players[teamName].find(p => p.name === playerName);
    if (!player) return;

    // Update the appropriate stat
    switch (statType) {
        case 'threePointer':
            player.stats.threePointer.attempts++;
            if (made) {
                player.stats.threePointer.made++;
                player.stats.points += 3;
            }
            break;
        case 'fieldGoal':
            player.stats.fieldGoal.attempts++;
            if (made) {
                player.stats.fieldGoal.made++;
                player.stats.points += 2;
            }
            break;
        case 'freeThrow':
            player.stats.freeThrow.attempts++;
            if (made) {
                player.stats.freeThrow.made++;
                player.stats.points += 1;
            }
            break;
        default:
            player.stats[statType]++;
            break;
    }

    // Update the display
    renderTables();
    updateScoreboard();
}

// Add a new player to a team
function addNewPlayer() {
    const teamName = document.getElementById('newTeam').value;
    const playerName = document.getElementById('newPlayerName').value.trim();
    const playerNumber = document.getElementById('newPlayerNumber').value.trim();

    // Validate player name - only alphabetic characters and spaces
    if (!/^[a-zA-Z\s]+$/.test(playerName)) {
        alert('Player name must contain only alphabetic characters.');
        return;
    }

    // Validate player number - must be between 0-99
    const numberValue = parseInt(playerNumber);
    if (isNaN(numberValue) || numberValue < 0 || numberValue > 99) {
        alert('Jersey number must be a number between 0 and 99.');
        return;
    }

    if (playerName && playerNumber) {
        // Check if player name already exists in the team
        const playerExists = players[teamName].some(p => p.name === playerName);
        if (playerExists) {
            alert('A player with this name already exists in the team.');
            return;
        }

        // Add new player
        players[teamName].push({
            name: playerName,
            number: playerNumber,
            stats: initializeStats()
        });

        // Clear the input fields
        document.getElementById('newPlayerName').value = '';
        document.getElementById('newPlayerNumber').value = '';

        // Update the display
        renderTables();
        populatePlayerDropdown();
    } else {
        alert('Please enter both player name and jersey number.');
    }
}

// Update the scoreboard
function updateScoreboard() {
    // Calculate total team scores
    let teamATotal = 0;
    let teamBTotal = 0;

    players['Team A'].forEach(player => {
        teamATotal += player.stats.points;
    });

    players['Team B'].forEach(player => {
        teamBTotal += player.stats.points;
    });

    // Update the scoreboard display
    document.getElementById('teamAScore').textContent = teamATotal;
    document.getElementById('teamBScore').textContent = teamBTotal;
    document.getElementById('printTeamAScore').textContent = teamATotal;
    document.getElementById('printTeamBScore').textContent = teamBTotal;
}

// Print game results
function printResults() {
    // Hide navbar and footer before printing
    const navbar = document.querySelector('nav');
    const footer = document.querySelector('footer');

    // Store original display values
    const navbarDisplay = navbar.style.display;
    const footerDisplay = footer.style.display;

    // Hide elements for printing
    navbar.style.display = 'none';
    footer.style.display = 'none';

    // Apply print-specific classes
    document.body.classList.add('printing');

    // Slight delay to ensure CSS changes apply
    setTimeout(() => {
        window.print();

        // Restore original display after printing
        navbar.style.display = navbarDisplay;
        footer.style.display = footerDisplay;
        document.body.classList.remove('printing');
    }, 100);
}

// Update the print tables
function updatePrintTables() {
    // Copy Team A table data
    const teamATable = document.getElementById('teamATable');
    const printTeamATable = document.getElementById('printTeamATable');
    printTeamATable.innerHTML = teamATable.innerHTML;

    // Copy Team B table data
    const teamBTable = document.getElementById('teamBTable');
    const printTeamBTable = document.getElementById('printTeamBTable');
    printTeamBTable.innerHTML = teamBTable.innerHTML;
}

// Render the team tables
function renderTables() {
    renderTeamTable('Team A', document.getElementById('teamATable'));
    renderTeamTable('Team B', document.getElementById('teamBTable'));
}

// Render a single team table
function renderTeamTable(teamName, tableElement) {
    tableElement.innerHTML = '';

    if (players[teamName].length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td colspan="12" class="text-center">No players added yet</td>
            `;
        tableElement.appendChild(row);
        return;
    }

    players[teamName].forEach(player => {
        const row = document.createElement('tr');

        // Format for shot attempts: made-attempts
        const threePointDisplay = `${player.stats.threePointer.made}-${player.stats.threePointer.attempts}`;
        const fieldGoalDisplay = `${player.stats.fieldGoal.made}-${player.stats.fieldGoal.attempts}`;
        const freeThrowDisplay = `${player.stats.freeThrow.made}-${player.stats.freeThrow.attempts}`;

        row.innerHTML = `
                <td>${player.number}</td>
                <td>${player.name}</td>
                <td>${player.stats.points}</td>
                <td>${threePointDisplay}</td>
                <td>${fieldGoalDisplay}</td>
                <td>${freeThrowDisplay}</td>
                <td>${player.stats.rebound}</td>
                <td>${player.stats.assist}</td>
                <td>${player.stats.steal}</td>
                <td>${player.stats.block}</td>
                <td>${player.stats.turnover}</td>
                <td>${player.stats.foul}</td>
            `;

        tableElement.appendChild(row);
    });
}

// Initialize the page
window.onload = function () {
    // Set up event listener for team selection
    document.getElementById('team').addEventListener('change', populatePlayerDropdown);

    // Initial population of player dropdown
    populatePlayerDropdown();

    // Render the initial tables
    renderTables();

    // Initialize scoreboard
    updateScoreboard();
};
