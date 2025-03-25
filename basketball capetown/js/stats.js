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

function saveTeamNames() {
    const teamANameInput = document.getElementById('teamAName').value.trim();
    const teamBNameInput = document.getElementById('teamBName').value.trim();

    // Additional validation to prevent duplicate team names
    if (teamANameInput === teamBNameInput) {
        alert('Team names must be unique.');
        return;
    }

    if (teamANameInput && teamBNameInput) {
        // Validate team names - only alphabetic characters, spaces, and numbers allowed
        const validNameRegex = /^[a-zA-Z0-9\s]+$/;
        if (!validNameRegex.test(teamANameInput) || !validNameRegex.test(teamBNameInput)) {
            alert('Team names can only contain letters, numbers, and spaces.');
            return;
        }

        // Update team names in the teamNames object
        const oldTeamAName = teamNames['Team A'];
        const oldTeamBName = teamNames['Team B'];
        teamNames['Team A'] = teamANameInput;
        teamNames['Team B'] = teamBNameInput;

        // Update all dropdown elements
        const dropdowns = document.querySelectorAll('select');
        dropdowns.forEach(dropdown => {
            dropdown.querySelectorAll('option').forEach(option => {
                if (option.value === 'Team A') {
                    option.value = 'Team A';
                    option.text = teamANameInput;
                } else if (option.value === 'Team B') {
                    option.value = 'Team B';
                    option.text = teamBNameInput;
                }
            });
        });

        // Update display names
        document.getElementById('teamADisplayName').textContent = teamANameInput;
        document.getElementById('teamBDisplayName').textContent = teamBNameInput;
        document.getElementById('teamATableHeader').textContent = teamANameInput;
        document.getElementById('teamBTableHeader').textContent = teamBNameInput;

        // Update scoreboard
        updateScoreboard();

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
        const playerNameExists = players[teamName].some(p => p.name === playerName);
        if (playerNameExists) {
            alert('A player with this name already exists in the team.');
            return;
        }

        // Check if jersey number already exists in the team
        const jerseyNumberExists = players[teamName].some(p => p.number === playerNumber);
        if (jerseyNumberExists) {
            alert('This jersey number is already in use by another player in the team.');
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
                <td colspan="13" class="text-center">No players added yet</td>
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
                <td class="no-print">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-sm btn-primary" onclick="editPlayer('${teamName}', '${player.name}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="removePlayer('${teamName}', '${player.name}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
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

// Improved player management functions

// Edit player information
function editPlayer(teamName, originalName) {
    // Find the player in the team
    const playerIndex = players[teamName].findIndex(p => p.name === originalName);
    if (playerIndex === -1) return;

    // Get the player object
    const player = players[teamName][playerIndex];

    // Populate the edit modal with current values
    document.getElementById('editPlayerTeam').value = teamName;
    document.getElementById('editPlayerOriginalName').value = originalName;
    document.getElementById('editPlayerName').value = player.name;
    document.getElementById('editPlayerNumber').value = player.number;

    // Show the edit modal
    const editModal = new bootstrap.Modal(document.getElementById('editPlayerModal'));
    editModal.show();
}

// Save edited player information
function saveEditedPlayer() {
    const teamName = document.getElementById('editPlayerTeam').value;
    const originalName = document.getElementById('editPlayerOriginalName').value;
    const newName = document.getElementById('editPlayerName').value.trim();
    const newNumber = document.getElementById('editPlayerNumber').value.trim();

    // Validate player name - only alphabetic characters and spaces
    if (!/^[a-zA-Z\s]+$/.test(newName)) {
        alert('Player name must contain only alphabetic characters.');
        return;
    }

    // Validate player number - must be between 0-99
    const numberValue = parseInt(newNumber);
    if (isNaN(numberValue) || numberValue < 0 || numberValue > 99) {
        alert('Jersey number must be a number between 0 and 99.');
        return;
    }

    // Find the player
    const playerIndex = players[teamName].findIndex(p => p.name === originalName);
    if (playerIndex === -1) return;

    // Check if new name already exists (if different from original)
    if (newName !== originalName && players[teamName].some(p => p.name === newName)) {
        alert('A player with this name already exists in the team.');
        return;
    }

    // Update player information
    players[teamName][playerIndex].name = newName;
    players[teamName][playerIndex].number = newNumber;

    // Close the modal
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editPlayerModal'));
    editModal.hide();

    // Update the display
    renderTables();
    populatePlayerDropdown();

    // Show success message
    alert('Player information updated successfully!');
}

// Remove a player from a team
function removePlayer(teamName, playerName) {
    // Confirm deletion
    if (!confirm(`Are you sure you want to remove ${playerName} from ${teamNames[teamName]}?`)) {
        return;
    }

    // Find player index
    const playerIndex = players[teamName].findIndex(p => p.name === playerName);
    if (playerIndex === -1) return;

    // Remove player
    players[teamName].splice(playerIndex, 1);

    // Update the display
    renderTables();
    populatePlayerDropdown();
    updateScoreboard();
}

// Action log to track stats for undoing
let actionLog = [];

// Modified recordStat function to log actions
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

    // Store action for potential undo
    const action = {
        timestamp: Date.now(),
        teamName: teamName,
        playerName: playerName,
        statType: statType,
        made: made,
        description: `${playerName} (${teamNames[teamName]}): ${getStatDescription(statType, made)}`
    };

    // Add to log
    actionLog.push(action);

    // Limit log size to last 50 actions
    if (actionLog.length > 50) {
        actionLog.shift();
    }

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

    // Update action log display
    updateActionLogDisplay();

    // Update the display
    renderTables();
    updateScoreboard();
}

// Get human-readable description of the stat action
function getStatDescription(statType, made) {
    switch (statType) {
        case 'threePointer':
            return made ? "3PT Made" : "3PT Missed";
        case 'fieldGoal':
            return made ? "2PT Made" : "2PT Missed";
        case 'freeThrow':
            return made ? "FT Made" : "FT Missed";
        case 'assist':
            return "Assist";
        case 'rebound':
            return "Rebound";
        case 'steal':
            return "Steal";
        case 'block':
            return "Block";
        case 'turnover':
            return "Turnover";
        case 'foul':
            return "Foul";
        default:
            return statType;
    }
}

// Update the action log display
function updateActionLogDisplay() {
    const logElement = document.getElementById('actionLogBody');
    logElement.innerHTML = '';

    // Sort actions in reverse chronological order
    const sortedActions = [...actionLog].reverse();

    sortedActions.slice(0, 10).forEach(action => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(action.timestamp).toLocaleTimeString()}</td>
            <td>${action.description}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="undoAction(${action.timestamp})">
                    <i class="bi bi-arrow-counterclockwise"></i> Undo
                </button>
            </td>
        `;
        logElement.appendChild(row);
    });
}

// Undo a recorded action
function undoAction(timestamp) {
    // Find the action in the log
    const actionIndex = actionLog.findIndex(a => a.timestamp === timestamp);
    if (actionIndex === -1) return;

    const action = actionLog[actionIndex];

    // Find the player
    const player = players[action.teamName].find(p => p.name === action.playerName);
    if (!player) return;

    // Undo the stats change
    switch (action.statType) {
        case 'threePointer':
            player.stats.threePointer.attempts--;
            if (action.made) {
                player.stats.threePointer.made--;
                player.stats.points -= 3;
            }
            break;
        case 'fieldGoal':
            player.stats.fieldGoal.attempts--;
            if (action.made) {
                player.stats.fieldGoal.made--;
                player.stats.points -= 2;
            }
            break;
        case 'freeThrow':
            player.stats.freeThrow.attempts--;
            if (action.made) {
                player.stats.freeThrow.made--;
                player.stats.points -= 1;
            }
            break;
        default:
            player.stats[action.statType]--;
            break;
    }

    // Remove from action log
    actionLog.splice(actionIndex, 1);

    // Update displays
    updateActionLogDisplay();
    renderTables();
    updateScoreboard();

    // Confirm to user
    alert(`Undone: ${action.description}`);
}

// Sort a table by column
function sortTable(teamName, columnIndex) {
    // Get the data and sort direction
    const tableElement = document.getElementById(`${teamName.replace(' ', '')}Table`);
    const sortDirection = tableElement.getAttribute('data-sort-direction') === 'asc' ? 'desc' : 'asc';

    // Store current sort direction
    tableElement.setAttribute('data-sort-direction', sortDirection);

    // Sort the players array
    players[teamName].sort((a, b) => {
        let valueA, valueB;

        // Determine which property to sort by
        switch (columnIndex) {
            case 0: // Jersey number
                valueA = parseInt(a.number);
                valueB = parseInt(b.number);
                break;
            case 1: // Name
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
                break;
            case 2: // Points
                valueA = a.stats.points;
                valueB = b.stats.points;
                break;
            case 6: // Rebounds
                valueA = a.stats.rebound;
                valueB = b.stats.rebound;
                break;
            case 7: // Assists
                valueA = a.stats.assist;
                valueB = b.stats.assist;
                break;
            default:
                valueA = 0;
                valueB = 0;
        }

        // Compare based on direction
        if (sortDirection === 'asc') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });

    // Redraw the table
    renderTeamTable(teamName, tableElement);
}

//Download 
function downloadGameReport() {
    // Check if required libraries are loaded
    if (typeof window.jspdf === 'undefined') {
        alert('jsPDF library is not loaded');
        return;
    }

    const { jsPDF } = window.jspdf;

    // Validate input data
    if (!teamNames || !players || 
        !teamNames['Team A'] || !teamNames['Team B'] || 
        !players['Team A'] || !players['Team B']) {
        alert('Team data is incomplete');
        return;
    }

    // Create a new PDF document
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Function to add logo
    function addLogo(doc) {
        // Base64 logo string (already replaced by you)
        const logoBase64 = 'your_base64_logo_string'; 
        
        try {
            doc.addImage(
                logoBase64, 
                'PNG', // or 'JPEG' depending on your logo type
                10,    // x position
                5,     // y position
                30,    // width
                15     // height
            );
        } catch (error) {
            console.error('Error adding logo:', error);
        }
    }

    // Add logo
    addLogo(doc);

    // Add title to the document
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${teamNames['Team A']} vs ${teamNames['Team B']} Game Report`, 50, 10);

    // Add game summary section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const teamATotal = players['Team A'].reduce((sum, player) => sum + (player.stats?.points || 0), 0);
    const teamBTotal = players['Team B'].reduce((sum, player) => sum + (player.stats?.points || 0), 0);
    
    doc.text(`Final Score: ${teamNames['Team A']} ${teamATotal} - ${teamBTotal} ${teamNames['Team B']}`, 10, 20);

    // Helper function to safely get nested player stat
    const getStat = (player, statPath, defaultValue = '-') => {
        const getNestedStat = (obj, path) => {
            return path.split('.').reduce((acc, part) => 
                acc && acc[part] !== undefined ? acc[part] : undefined, obj);
        };

        const stat = getNestedStat(player.stats, statPath);
        return stat !== undefined ? stat : defaultValue;
    };

    // Team A Players Table
    doc.autoTable({
        startY: 30,
        head: [['#', 'Player', 'Pts', '3PT', '2PT', 'FT', 'Reb', 'Ast', 'Stl', 'Blk', 'TO', 'Foul']],
        body: players['Team A'].map(player => [
            player.number || '',
            player.name || 'Unknown',
            getStat(player, 'points', 0),
            `${getStat(player, 'threePointer.made', 0)}-${getStat(player, 'threePointer.attempts', 0)}`,
            `${getStat(player, 'fieldGoal.made', 0)}-${getStat(player, 'fieldGoal.attempts', 0)}`,
            `${getStat(player, 'freeThrow.made', 0)}-${getStat(player, 'freeThrow.attempts', 0)}`,
            getStat(player, 'rebound', 0),
            getStat(player, 'assist', 0),
            getStat(player, 'steal', 0),
            getStat(player, 'block', 0),
            getStat(player, 'turnover', 0),
            getStat(player, 'foul', 0)
        ]),
        theme: 'grid',
        styles: { 
            fontSize: 9,
            cellPadding: 2,
            valign: 'middle',
            halign: 'center'
        },
        headStyles: { 
            fillColor: [41, 128, 185],
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold'
        },
        columnStyles: { 
            0: { cellWidth: 15 },
            1: { cellWidth: 30 }
        },
        margin: { top: 30 }
    });

    // Team B Players Table
    doc.autoTable({
        startY: doc.previousAutoTable.finalY + 10,
        head: [['#', 'Player', 'Pts', '3PT', '2PT', 'FT', 'Reb', 'Ast', 'Stl', 'Blk', 'TO', 'Foul']],
        body: players['Team B'].map(player => [
            player.number || '',
            player.name || 'Unknown',
            getStat(player, 'points', 0),
            `${getStat(player, 'threePointer.made', 0)}-${getStat(player, 'threePointer.attempts', 0)}`,
            `${getStat(player, 'fieldGoal.made', 0)}-${getStat(player, 'fieldGoal.attempts', 0)}`,
            `${getStat(player, 'freeThrow.made', 0)}-${getStat(player, 'freeThrow.attempts', 0)}`,
            getStat(player, 'rebound', 0),
            getStat(player, 'assist', 0),
            getStat(player, 'steal', 0),
            getStat(player, 'block', 0),
            getStat(player, 'turnover', 0),
            getStat(player, 'foul', 0)
        ]),
        theme: 'grid',
        styles: { 
            fontSize: 9,
            cellPadding: 2,
            valign: 'middle',
            halign: 'center'
        },
        headStyles: { 
            fillColor: [41, 128, 185],
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold'
        },
        columnStyles: { 
            0: { cellWidth: 15 },
            1: { cellWidth: 30 }
        }
    });

    // Add copyright notice with dynamically generated date
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    doc.setFontSize(10);
    const copyrightText = `© 2025 Basketball Cape Town. All Rights Reserved. Generated on ${formattedDate}.`;
    doc.text(copyrightText, 10, doc.previousAutoTable.finalY + 25);

    // Save the PDF
    doc.save(`${teamNames['Team A']}_vs_${teamNames['Team B']}_Game_Report.pdf`);
}

// Modify the download button to call this function
document.querySelector('.btn-dark').addEventListener('click', downloadGameReport);