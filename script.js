const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2308-ftb-mt-web-pt';
// Use the APIURL variable for fetch requests
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/2308-ftb-mt-web-pt/players`;

// https://fsa-puppy-bowl.herokuapp.com/api/2308-ftb-mt-web-pt/players
// this can be the base api url

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const rsp = await fetch(API_URL); //rsp = response
        const players = await rsp.json();
        console.log(players.data.players);
        return players.data.players;

    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const rsp = await fetch(`${API_URL}/${playerId}`);
        const player = await rsp.json();
        return player;

    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(API_URL,{
            method: "POST",
            body: JSON.stringify(playerObj),
            headers: {
                "Content-Type" : "application/json; charset=UTF-8"
            },
        })
        // .then((response)=> response.json())
        // .then((json) => console.log(json));
        // return response

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        await fetch(`${API_URL}/${playerId}`,{
            method: "DELETE"
        })

    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        if(!playerList || playerList.length === 0){
            playerContainer.innerHTML = /* html */ 
            `
            <h1>No doggos here! 😭</h1>
            `   ;
            return
        }
    
        playerContainer.innerHTML = "";
        playerList.forEach(player => {
            const playerElement = document.createElement("div");
            playerElement.classList.add("player-card");
            playerElement.innerHTML = /*html*/
            `
            <div class="dog">
            <h1>${player.name} is a ${player.breed}</h1>
            <img src="${player.imageUrl}" alt="${player.name} looks like a ${player.breed}"/>

            <button class="delete-button" data-id=${player.id} >Delete Player!</button>
            <button class="details-button" data-id=${player.id} >See Player Info!</button>
            </div>
            `;
            playerContainer.appendChild(playerElement);
            let deleteButton = playerElement.querySelector(".delete-button");
            deleteButton.addEventListener("click", async (e) => {
                e.preventDefault();
                console.log("This doggo is going to be deleted");
                await removePlayer(player.id);
                        const players = await fetchAllPlayers();
        renderAllPlayers(players);
            })
            let detailButton = playerElement.querySelector(".details-button");
            detailButton.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("I will show more doggo details");
            renderSinglePlayer(player)
        })
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


//render single player function 
const renderSinglePlayer = async (player) =>{
    if(!player || player.length === 0)
    {
        playerContainer.innerHTML = /*html*/
        `
        <h1>There is not a doggo here! 🧐</h1>
        `;
        return
    }
    let singlePlayerHTML = /*html*/
    `
    <div class="single-player-div">
        <div class="single-player-info">
            <img src = "${player.imageUrl}" alt = "${player.name}" />
            <h2>
            This pupper is named ${player.name}.
            </h2>
            <h2>
            This puppy is a ${player.breed}, wow!
            </h2>
            <h2>
            They are currently on the ${player.status}.
            </h2>
            <h2>They play for team ${player.teamId}! <h2>
            <h2>Their player id is: ${player.id}.</h2>
        </div>
        <button class= "back-button">Go back!</button>
    </div>
    `;
    playerContainer.innerHTML = singlePlayerHTML;
    let backButton = playerContainer.querySelector(".back-button");
    backButton.addEventListener("click", async () =>{
        const players = await fetchAllPlayers();
        renderAllPlayers(players)
    });
}


// const renderSinglePlayer = async (playerId) =>{
//     const player = await fetchSinglePlayer(playerId);
//     const playerContainer = document.getElementById('player-container');

//     if (playerContainer) {
//         const playerElement = document.createElement('div');
//         playerElement.innerHTML = `<h2>${player.name}</h2>`;
//         playerContainer.appendChild(playerElement);
//     } else {
//         console.error('Player container not found');
//     }
// }

// renderSinglePlayer('33')

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {let fromHTML = /* html */
    `<form>
    <h1>Add Your favorite pup to the team!</h1>
    <label for="name">Name</label>
    <input type="text" id="name" name="name" />

    <label for="breed">Breed</label>
    <input type="text" id="breed" name="breed" />

    <label for="status">Status</label>
    <input type="text" id="status" name="status" />
<br>

    <label for="image">Picture</label>
    <input type="text" id="image" name="image" />

    <button type="submit">Submit</button> 
    </form>`;
    newPlayerFormContainer.innerHTML = fromHTML;

    let form = newPlayerFormContainer.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        let playerData = {
            name: form.name.value,
            breed: form.breed.value,
            status: form.status.value,
            imageUrl: form.image.value,
        };
        console.log(playerData);

        await addNewPlayer(
            playerData
        );
        
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
        playerData.name.valueOf = '';
        playerData.breed.valueOf = '';
        playerData.status.valueOf = '';
        playerData.image.valueOf = '';
        // playerData.teamId.valueOf = '';
        // playerData.cohortId.valueOf = '';
    });
        
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
}

init();
