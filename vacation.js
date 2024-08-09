const formdetails = document.querySelector('#destination_details_form');

// Sayfa yüklendiğinde, localStorage'dan verileri yükle
document.addEventListener('DOMContentLoaded', loadDestinationsFromLocalStorage);

formdetails.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
    event.preventDefault();

    const destinationName = event.target.elements['name'].value;
    const locationName = event.target.elements['location'].value;
    const photo = event.target.elements['photo'].value;
    const description = event.target.elements['description'].value;

    // Yeni kart oluşturma
    const destCard = createDestinationCard(destinationName, locationName, photo, description);

    const whislistContainer = document.getElementById('destinations_container');
    
    // Kartı önce ekleyin
    whislistContainer.appendChild(destCard);

    // Kart sayısını kontrol edin
    updateTitleBasedOnCards();

    // Verileri localStorage'a kaydet
    saveDestinationToLocalStorage(destinationName, locationName, photo, description);

    // Formu sıfırlama
    formdetails.reset();
}

function createDestinationCard(name, location, photo, description) {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.setAttribute('alt', name);

    const constantPhotoUrl = 'https://www.transcriptmaker.com/wp-content/uploads/2021/04/34677868_s-800x526.jpg';

    if (photo.length === 0) {
        img.setAttribute('src', constantPhotoUrl);
    } else {
        img.setAttribute('src', photo);
    }
    card.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h3');
    cardTitle.innerText = name;
    cardBody.appendChild(cardTitle);

    const cardSubtitle = document.createElement('h4');
    cardSubtitle.innerText = location;
    cardBody.appendChild(cardSubtitle);

    if (description.length !== 0) {
        const cardText = document.createElement('p');
        cardText.className = 'card-text';
        cardText.innerText = description;
        cardBody.appendChild(cardText);
    }

    const cardDeleteBtn = document.createElement('button');
    cardDeleteBtn.innerText = 'İptal et';

    cardDeleteBtn.addEventListener('click', function () {
        card.remove();
        // LocalStorage'dan silme
        removeDestinationFromLocalStorage(name, location);
        
        // Kartlar boşaldığında başlığı güncelle
        updateTitleBasedOnCards();
    });

    cardBody.appendChild(cardDeleteBtn);
    card.appendChild(cardBody);

    return card;
}

function saveDestinationToLocalStorage(name, location, photo, description) {
    const destination = {
        name,
        location,
        photo,
        description
    };

    let destinations = localStorage.getItem('destinations') ? JSON.parse(localStorage.getItem('destinations')) : [];
    destinations.push(destination);
    localStorage.setItem('destinations', JSON.stringify(destinations));
}

function loadDestinationsFromLocalStorage() {
    let destinations = localStorage.getItem('destinations') ? JSON.parse(localStorage.getItem('destinations')) : [];

    if (destinations.length > 0) {
        const whislistContainer = document.getElementById('destinations_container');
        destinations.forEach(destination => {
            const destCard = createDestinationCard(destination.name, destination.location, destination.photo, destination.description);
            whislistContainer.appendChild(destCard);
        });
    }

    // Başlığı güncelle
    updateTitleBasedOnCards();
}

function removeDestinationFromLocalStorage(name, location) {
    let destinations = localStorage.getItem('destinations') ? JSON.parse(localStorage.getItem('destinations')) : [];
    destinations = destinations.filter(destination => destination.name !== name || destination.location !== location);
    localStorage.setItem('destinations', JSON.stringify(destinations));
}

function updateTitleBasedOnCards() {
    const whislistContainer = document.getElementById('destinations_container');
    if (whislistContainer.children.length === 0) {
        document.querySelector('#title').innerHTML = 'Yeni lokasyonlar ekleyin';
    } else {
        document.querySelector('#title').innerHTML = 'Eklenen Lokasyonlar';
    }
}
